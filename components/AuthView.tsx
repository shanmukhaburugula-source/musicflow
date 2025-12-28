
import React, { useState, useRef } from 'react';
import { auth, storage } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  sendEmailVerification,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Mail, Lock, User, Camera, Sparkles, AlertCircle, ArrowRight, MailCheck, Eye, EyeOff } from 'lucide-react';

const AuthView: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message || 'Identity synchronization failed');
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
          await sendEmailVerification(user);
          await signOut(auth);
          return;
        }
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await sendEmailVerification(user);

        let photoURL = '';
        if (photoFile) {
          const storageRef = ref(storage, `profiles/${user.uid}`);
          await uploadBytes(storageRef, photoFile);
          photoURL = await getDownloadURL(storageRef);
        }
        
        await updateProfile(user, {
          displayName: displayName || 'Voyager',
          photoURL: photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName || 'User')}`
        });

        setVerifiedEmailAddress(user.email || email);
        setIsVerificationSent(true);
        await signOut(auth);
      }
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setSuggestion("Frequency already claimed. Transition to Sign In?");
        setError(null);
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError("Invalid credentials. Please verify your access point.");
      } else {
        setError(err.message || 'Access Denied.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (isVerificationSent) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#050505] font-['Plus_Jakarta_Sans']">
        <div className="w-full max-w-[480px] z-10 animate-in fade-in zoom-in-95 duration-500">
          <div className="bg-[#0A0A0B] border border-white/10 rounded-[4rem] p-12 md:p-16 shadow-[0_40px_120px_rgba(0,0,0,0.8)] relative text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-[#E879F9]/10 rounded-[2.5rem] flex items-center justify-center mb-10 border border-[#E879F9]/20 shadow-[0_0_60px_rgba(232,121,249,0.1)]">
              <MailCheck className="text-[#E879F9]" size={48} />
            </div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tight mb-4">Signal Sent</h2>
            <p className="text-zinc-500 text-base font-medium leading-relaxed mb-12">
              Verify your uplink at <span className="text-white font-bold">{verifiedEmailAddress}</span> to enter the Flow.
            </p>
            <button
              onClick={handleBackToLogin}
              className="w-full bg-white text-black py-5 rounded-2xl text-[12px] font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-[#E879F9] hover:text-white transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              Uplink Portal <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-[#050505] relative overflow-hidden font-['Plus_Jakarta_Sans']">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#E879F9]/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#22D3EE]/5 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="w-full max-w-[500px] z-10 animate-in fade-in zoom-in-95 duration-1000">
        
        {/* App Branding */}
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="scene !mb-10 scale-90 md:scale-100">
            <div className="cube">
              <div className="cube__face cube__face--front"><Sparkles size={54} className="text-[#E879F9]" /></div>
              <div className="cube__face cube__face--back"><Camera size={54} className="text-[#22D3EE]" /></div>
              <div className="cube__face cube__face--right"><Lock size={54} className="text-[#E879F9]" /></div>
              <div className="cube__face cube__face--left"><Mail size={54} className="text-[#22D3EE]" /></div>
              <div className="cube__face cube__face--top"><User size={54} className="text-white" /></div>
              <div className="cube__face cube__face--bottom"><ArrowRight size={54} className="text-white" /></div>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none mb-3">
            Music<span className="text-[#E879F9]">Flow</span>
          </h1>
          <p className="text-zinc-600 font-bold text-[10px] uppercase tracking-[0.6em]">Universal Discovery Engine</p>
        </div>

        <div className="bg-[#0A0A0B]/80 backdrop-blur-3xl border border-white/10 rounded-[4.5rem] p-10 md:p-14 shadow-[0_60px_150px_rgba(0,0,0,1)] relative overflow-hidden">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {!isLogin && (
              <div className="flex flex-col items-center mb-10">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-28 h-28 rounded-[3rem] bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer overflow-hidden group hover:border-[#E879F9] transition-all relative shadow-inner"
                >
                  {photoPreview ? (
                    <img src={photoPreview} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                       <Camera size={32} className="text-zinc-700 group-hover:text-[#E879F9] transition-colors" />
                       <span className="text-[8px] font-black text-zinc-800 uppercase tracking-widest">Upload Profile</span>
                    </div>
                  )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </div>
            )}

            {!isLogin && (
              <div className="relative group">
                <User className="absolute left-7 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-[#E879F9] transition-colors" size={20} />
                <input
                  type="text"
                  required={!isLogin}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Stage Name"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-16 pr-8 py-5 text-white placeholder-zinc-700 focus:outline-none focus:border-[#E879F9]/40 focus:bg-white/[0.05] transition-all text-sm font-bold tracking-wide shadow-sm"
                />
              </div>
            )}

            <div className="relative group">
              <Mail className="absolute left-7 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-[#E879F9] transition-colors" size={20} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Access Point (Email)"
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-16 pr-8 py-5 text-white placeholder-zinc-700 focus:outline-none focus:border-[#E879F9]/40 focus:bg-white/[0.05] transition-all text-sm font-bold tracking-wide shadow-sm"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-7 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-[#E879F9] transition-colors" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Keyphrase"
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-16 pr-16 py-5 text-white placeholder-zinc-700 focus:outline-none focus:border-[#E879F9]/40 focus:bg-white/[0.05] transition-all text-sm font-bold tracking-wide shadow-sm"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-7 top-1/2 -translate-y-1/2 text-zinc-700 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[11px] font-black uppercase tracking-tight animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={18} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {suggestion && (
              <div className="p-5 bg-[#E879F9]/10 border border-[#E879F9]/20 rounded-[2rem] text-center animate-in fade-in slide-in-from-top-1">
                <p className="text-[#E879F9] text-[11px] font-black uppercase tracking-widest mb-4">{suggestion}</p>
                <button 
                  type="button" 
                  onClick={() => { setIsLogin(true); setSuggestion(null); setError(null); }}
                  className="text-white text-[10px] font-black underline uppercase tracking-[0.3em] hover:text-[#E879F9] transition-colors"
                >
                  Switch Identity
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black h-20 rounded-[2rem] text-[14px] font-black uppercase tracking-[0.4em] shadow-[0_25px_60px_rgba(255,255,255,0.1)] hover:bg-[#E879F9] hover:text-white hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-6 group overflow-hidden"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? 'Initiate Flow' : 'Establish Link'}</span>
                  <ArrowRight size={22} className="group-hover:translate-x-3 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Sync Divider */}
          <div className="flex items-center gap-8 my-12">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-[10px] font-black text-zinc-800 uppercase tracking-[0.8em]">OR</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          {/* User Requested Custom Google Button */}
          <button 
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center bg-[#4285F4] rounded-[2px] overflow-hidden shadow-2xl active:scale-[0.98] transition-all hover:shadow-[0_15px_45px_rgba(66,133,244,0.4)] group border border-[#4285F4]"
          >
            <div className="p-4 bg-white flex items-center justify-center min-w-[54px] min-h-[54px]">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
                className="w-[20px] h-[20px]" 
                alt="Google Icon" 
              />
            </div>
            <div className="flex-1 text-center font-bold text-[14px] tracking-wide text-white py-4 pr-4 font-sans uppercase">
              {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
            </div>
          </button>

          {/* Transition Navigation */}
          <div className="mt-14 pt-10 border-t border-white/5 text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setError(null); setSuggestion(null); }}
              className="group transition-all"
            >
              <span className="text-[11px] font-black uppercase tracking-[0.5em] block mb-3 text-zinc-700 opacity-60">
                {isLogin ? "No Core Identity?" : "Already Synchronized?"}
              </span>
              <span className="text-[13px] font-black uppercase tracking-[0.2em] text-[#E879F9] group-hover:underline underline-offset-[12px] group-hover:text-white transition-all">
                {isLogin ? "Generate Signature" : "Access Dimension Portal"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
