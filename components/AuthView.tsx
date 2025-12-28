
import React, { useState, useRef } from 'react';
import { auth, storage } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  sendEmailVerification,
  signOut
} from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Mail, Lock, User, Camera, Sparkles, AlertCircle, ArrowRight, MailCheck, RefreshCw } from 'lucide-react';

const AuthView: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [verifiedEmailAddress, setVerifiedEmailAddress] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleResendEmail = async () => {
    // Note: We might need to sign in temporarily or use the last credentials 
    // but typically email verification can be triggered if the user object is present.
    // However, since we sign out, we inform the user to try logging in again to trigger it.
    alert("Please log in again to receive a fresh verification link.");
    handleBackToLogin();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuggestion(null);

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        if (!user.emailVerified) {
          setVerifiedEmailAddress(user.email || email);
          setIsVerificationSent(true);
          // Send verification again if they try to log in but aren't verified
          await sendEmailVerification(user);
          await signOut(auth);
          return;
        }
      } else {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;

          // 1. Send verification email immediately
          await sendEmailVerification(user);

          // 2. Handle Profile updates
          let photoURL = '';
          if (photoFile) {
            try {
              const storageRef = ref(storage, `profiles/${user.uid}`);
              await uploadBytes(storageRef, photoFile);
              photoURL = await getDownloadURL(storageRef);
            } catch (sErr) {
              console.error("Storage error:", sErr);
            }
          }
          await updateProfile(user, {
            displayName: displayName || 'Voyager',
            photoURL: photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName || 'User')}`
          });

          setVerifiedEmailAddress(user.email || email);
          setIsVerificationSent(true);

          // 3. CRITICAL: Do not sign them in automatically.
          await signOut(auth);

        } catch (err: any) {
          if (err.code === 'auth/email-already-in-use') {
            setSuggestion("This identity is already linked. Switch to sign in.");
            setError(null);
            return;
          }
          throw err;
        }
      }
    } catch (err: any) {
      // Specific error message requirement: "Password or Email Incorrect"
      const invalidCodes = ['auth/wrong-password', 'auth/user-not-found', 'auth/invalid-credential', 'auth/invalid-email'];
      if (invalidCodes.includes(err.code)) {
        setError('Password or Email Incorrect');
      } else {
        setError(err.message || 'Access denied. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setIsVerificationSent(false);
    setIsLogin(true);
    setError(null);
    setSuggestion(null);
  };

  if (isVerificationSent) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#050505] font-['Plus_Jakarta_Sans']">
        <div className="w-full max-w-[420px] z-10 animate-in fade-in zoom-in-95 duration-500">
          <div className="bg-[#0A0A0B] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-[#E879F9]/10 rounded-[2.2rem] flex items-center justify-center mb-8 border border-[#E879F9]/20 shadow-[0_0_50px_rgba(232,121,249,0.15)]">
              <MailCheck className="text-[#E879F9]" size={40} />
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4">Verify Identity</h2>
            <p className="text-zinc-400 text-sm font-medium leading-relaxed mb-10">
              We have sent you a verification email to <span className="text-white font-bold">{verifiedEmailAddress}</span>. Verify it and log in.
            </p>
            
            <div className="w-full space-y-4">
              <button
                onClick={handleBackToLogin}
                className="w-full bg-white text-black py-4.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-[#E879F9] hover:text-white transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                Login <ArrowRight size={16} />
              </button>
              
              <button
                onClick={handleResendEmail}
                className="w-full py-3 text-zinc-600 hover:text-zinc-400 text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
              >
                Need another link? <RefreshCw size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#050505] relative overflow-hidden font-['Plus_Jakarta_Sans']">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#E879F9]/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-[380px] z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 mb-5">
            <Sparkles className="text-[#E879F9]" size={24} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">
            Music<span className="text-[#E879F9]">Flow</span>
          </h1>
          <p className="text-zinc-500 font-bold text-[9px] uppercase tracking-[0.4em] mt-2">Sonic Access Gateway</p>
        </div>

        <div className="bg-[#0A0A0B] border border-white/5 rounded-[3rem] p-10 shadow-2xl relative">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="flex flex-col items-center mb-6">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-16 h-16 rounded-[1.5rem] bg-white/5 border border-dashed border-white/10 flex items-center justify-center cursor-pointer overflow-hidden group hover:border-[#E879F9] transition-all"
                >
                  {photoPreview ? (
                    <img src={photoPreview} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <Camera size={20} className="text-zinc-600 group-hover:text-[#E879F9]" />
                  )}
                </div>
                <p className="text-[8px] font-black uppercase tracking-widest text-zinc-600 mt-2">Identity Capture</p>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </div>
            )}

            {!isLogin && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                <input
                  type="text"
                  required={!isLogin}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Stage Name"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-zinc-700 focus:outline-none focus:border-[#E879F9] transition-all text-xs font-medium"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Access Point (Email)"
                className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-zinc-700 focus:outline-none focus:border-[#E879F9] transition-all text-xs font-medium"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Keyphrase"
                className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-zinc-700 focus:outline-none focus:border-[#E879F9] transition-all text-xs font-medium"
              />
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[11px] font-bold animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={14} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {suggestion && (
              <div className="p-4 bg-[#E879F9]/10 border border-[#E879F9]/20 rounded-2xl animate-in fade-in slide-in-from-top-1">
                <p className="text-[#E879F9] text-[11px] font-bold text-center mb-4 leading-tight">{suggestion}</p>
                <button 
                  type="button" 
                  onClick={() => { setIsLogin(true); setSuggestion(null); setError(null); }}
                  className="w-full py-2.5 bg-[#E879F9] text-white rounded-xl text-[10px] uppercase font-black tracking-widest shadow-md"
                >
                  Switch to Portal
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-4.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-[#E879F9] hover:text-white transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
            >
              {loading ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> : (
                <>{isLogin ? 'Initiate' : 'Establish'} <ArrowRight size={14} /></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setError(null); setSuggestion(null); }}
              className="text-zinc-500 hover:text-white text-[9px] font-black uppercase tracking-[0.2em] transition-colors"
            >
              {isLogin ? "Generate Core ID" : "Identity Sync (Sign In)"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
