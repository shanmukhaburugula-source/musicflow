
import React, { useState, useRef } from 'react';
import { auth, storage } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { syncArtistProfile } from '../supabase';
import { 
  Mail, Lock, User, Camera, Sparkles, AlertCircle, 
  ArrowRight, MailCheck, Eye, EyeOff, ShieldCheck, 
  ChevronLeft, Apple, Music, Disc, Radio, Mic2 
} from 'lucide-react';

type AuthViewMode = 'landing' | 'login' | 'signup' | 'forgot-password' | 'verification-sent' | 'reset-sent';

const AuthView: React.FC = () => {
  const [mode, setMode] = useState<AuthViewMode>('landing');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await syncArtistProfile(result.user);
    } catch (err: any) {
      setError(err.message || 'Identity synchronization failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email to receive a reset link.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setVerifiedEmailAddress(email);
      setMode('reset-sent');
    } catch (err: any) {
      setError(err.message || 'Reset link generation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        if (!user.emailVerified) {
          setVerifiedEmailAddress(user.email || email);
          setMode('verification-sent');
          await sendEmailVerification(user);
          await signOut(auth);
          return;
        }
        await syncArtistProfile(user);
      } else if (mode === 'signup') {
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

        await syncArtistProfile(user);
        setVerifiedEmailAddress(user.email || email);
        setMode('verification-sent');
        await signOut(auth);
      }
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError("This frequency is taken. Try signing in.");
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError("Invalid credentials. Please verify your access point.");
      } else {
        setError(err.message || 'Access Denied.');
      }
    } finally {
      setLoading(false);
    }
  };

  const LeftVisuals = () => (
    <div className="hidden lg:flex lg:col-span-3 bg-gradient-to-br from-[#E879F9] via-[#8B5CF6] to-[#22D3EE] items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-black/10 rounded-full blur-[120px] animate-bounce duration-[8s]" />
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative w-[400px] h-[400px] perspective-[1000px]">
          <div className="w-full h-full rounded-full bg-[#111] border-[12px] border-zinc-900 shadow-2xl animate-[spin_10s_linear_infinite] flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 border-[30px] border-zinc-800/20 rounded-full" />
             <div className="absolute inset-4 border-[20px] border-zinc-800/10 rounded-full" />
             <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-inner">
                <Music size={48} className="text-[#8B5CF6]" />
             </div>
          </div>
          <div className="absolute -top-10 -right-10 animate-bounce duration-[4s]">
            <Disc size={64} className="text-white/20" />
          </div>
          <div className="absolute top-1/2 -left-20 -translate-y-1/2 animate-pulse">
            <Radio size={54} className="text-white/30" />
          </div>
          <div className="absolute -bottom-10 right-1/4 animate-bounce duration-[5s]">
            <Mic2 size={48} className="text-white/20" />
          </div>
        </div>
        <div className="mt-16 text-center text-white px-12">
          <h2 className="text-5xl font-black uppercase tracking-tighter mb-4">Enter the Flow</h2>
          <p className="text-white/70 text-lg font-medium max-w-lg">
            Where your rhythm finds its digital soul. Experience the evolution of music discovery.
          </p>
        </div>
      </div>
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent" />
    </div>
  );

  const renderLanding = () => (
    <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-700">
      <div className="mb-10 lg:hidden">
        <div className="w-16 h-16 bg-[#E879F9] rounded-2xl flex items-center justify-center shadow-lg shadow-fuchsia-200">
          <Music size={32} className="text-white" />
        </div>
      </div>
      <h1 className="text-5xl font-black text-[#1F2937] tracking-tighter mb-4 text-center uppercase">
        Sonic Sync
      </h1>
      <p className="text-zinc-500 text-center text-sm font-semibold mb-12 max-w-[280px] leading-relaxed">
        Unlock your MusicFlow dimension and sync your rhythm across the globe.
      </p>
      <div className="w-full space-y-4">
        <button 
          onClick={handleGoogleSignIn}
          className="w-full h-14 bg-white border border-zinc-200 rounded-full flex items-center px-6 shadow-sm hover:bg-zinc-50 active:scale-[0.98] transition-all group"
        >
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
            className="w-5 h-5 mr-auto" 
            alt="Google" 
          />
          <span className="text-zinc-700 font-bold text-[15px] mr-auto -ml-5 uppercase tracking-wide">Join with Google</span>
        </button>
        <button className="w-full h-14 bg-white border border-zinc-200 rounded-full flex items-center px-6 shadow-sm hover:bg-zinc-50 active:scale-[0.98] transition-all group">
          <Apple size={20} className="text-black mr-auto" fill="currentColor" />
          <span className="text-zinc-700 font-bold text-[15px] mr-auto -ml-5 uppercase tracking-wide">Join with Apple</span>
        </button>
        <button 
          onClick={() => setMode('login')}
          className="w-full h-14 bg-[#E879F9] text-white rounded-full flex items-center px-6 shadow-md shadow-fuchsia-200 hover:bg-[#D946EF] active:scale-[0.98] transition-all group"
        >
          <Mail size={20} className="mr-auto group-hover:scale-110 transition-transform" />
          <span className="font-black text-[15px] mr-auto -ml-5 uppercase tracking-widest">Email Access</span>
        </button>
      </div>
      <div className="mt-12 text-center">
        <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">
          No Sonic Core? {' '}
          <button 
            onClick={() => setMode('signup')}
            className="text-[#E879F9] hover:underline underline-offset-4"
          >
            Register Frequency
          </button>
        </p>
      </div>
    </div>
  );

  const renderForm = () => (
    <div className="w-full animate-in slide-in-from-right-4 fade-in duration-500">
      <div className="flex items-center mb-10">
        <button 
          onClick={() => setMode('landing')}
          className="p-3 -ml-3 text-zinc-400 hover:text-[#E879F9] transition-colors"
        >
          <ChevronLeft size={28} />
        </button>
        <div className="flex-1 text-right">
          <h2 className="text-3xl font-black text-[#1F2937] tracking-tighter uppercase leading-none">
            {mode === 'login' ? 'Portal Login' : mode === 'signup' ? 'New Frequency' : 'Reset Signal'}
          </h2>
          <p className="text-[#E879F9] text-[9px] font-black uppercase tracking-[0.5em] mt-2">
            Identity Verification
          </p>
        </div>
      </div>
      <form onSubmit={mode === 'forgot-password' ? handleForgotPassword : handleSubmit} className="space-y-6">
        {mode === 'signup' && (
          <div className="flex flex-col items-center mb-8">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-28 h-28 rounded-[2.5rem] bg-zinc-50 border-2 border-dashed border-zinc-200 flex items-center justify-center cursor-pointer overflow-hidden group hover:border-[#E879F9] transition-all shadow-inner"
            >
              {photoPreview ? (
                <img src={photoPreview} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <div className="flex flex-col items-center gap-2">
                   <Camera size={28} className="text-zinc-400 group-hover:text-[#E879F9] transition-colors" />
                   <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Stage Photo</span>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>
        )}
        {mode === 'signup' && (
          <div className="relative group">
            <User className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-[#E879F9] transition-colors" size={20} />
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Stage Name"
              className="w-full h-16 bg-zinc-50 border border-zinc-200 rounded-[1.5rem] pl-16 pr-8 text-[#1F2937] placeholder-zinc-400 focus:outline-none focus:border-[#E879F9] focus:ring-4 focus:ring-fuchsia-500/5 transition-all text-sm font-bold tracking-wide"
            />
          </div>
        )}
        <div className="relative group">
          <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-[#E879F9] transition-colors" size={20} />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Access Email"
            className="w-full h-16 bg-zinc-50 border border-zinc-200 rounded-[1.5rem] pl-16 pr-8 text-[#1F2937] placeholder-zinc-400 focus:outline-none focus:border-[#E879F9] focus:ring-4 focus:ring-fuchsia-500/5 transition-all text-sm font-bold tracking-wide"
          />
        </div>
        {mode !== 'forgot-password' && (
          <div className="space-y-3">
            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-[#E879F9] transition-colors" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Access Keyphrase"
                className="w-full h-16 bg-zinc-50 border border-zinc-200 rounded-[1.5rem] pl-16 pr-16 text-[#1F2937] placeholder-zinc-400 focus:outline-none focus:border-[#E879F9] focus:ring-4 focus:ring-fuchsia-500/5 transition-all text-sm font-bold tracking-wide"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#E879F9] transition-colors p-2"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {mode === 'login' && (
              <div className="flex justify-end pr-2">
                <button 
                  type="button"
                  onClick={() => setMode('forgot-password')}
                  className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-[#E879F9] transition-colors"
                >
                  Lost Keyphrase?
                </button>
              </div>
            )}
          </div>
        )}
        {error && (
          <div className="flex items-center gap-3 p-5 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[11px] font-black uppercase tracking-tight animate-in fade-in slide-in-from-top-1">
            <AlertCircle size={18} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-16 bg-[#1F2937] text-white rounded-[1.5rem] text-[12px] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-[#E879F9] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-6 group"
        >
          {loading ? (
            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>{mode === 'login' ? 'Initiate Sync' : mode === 'signup' ? 'Broadcast' : 'Request Signal'}</span>
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </>
          )}
        </button>
      </form>
      <div className="mt-12 pt-8 border-t border-zinc-100 text-center">
        <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em]">
          {mode === 'login' ? "Need a New Frequency?" : "Already Synchronized?"} {' '}
          <button 
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); }}
            className="text-[#E879F9] font-black hover:underline underline-offset-8"
          >
            {mode === 'login' ? "Register" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );

  const renderMessage = () => (
    <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-700 text-center">
      <div className="w-24 h-24 bg-fuchsia-50 rounded-[2.5rem] flex items-center justify-center mb-10 border border-fuchsia-100 shadow-inner">
        {mode === 'verification-sent' ? <MailCheck className="text-[#E879F9]" size={48} /> : <ShieldCheck className="text-[#E879F9]" size={48} />}
      </div>
      <h2 className="text-4xl font-black text-[#1F2937] tracking-tighter mb-4 uppercase">
        {mode === 'verification-sent' ? 'Signal Active' : 'Signal Sent'}
      </h2>
      <p className="text-zinc-500 text-base font-medium leading-relaxed mb-12 max-w-[280px]">
        {mode === 'verification-sent' 
          ? `We've dispatched a frequency link to ${verifiedEmailAddress}. Activate your flow now.`
          : `A reset frequency has been sent to ${verifiedEmailAddress}. Check your signal input.`
        }
      </p>
      <button
        onClick={() => setMode('login')}
        className="w-full h-16 bg-[#E879F9] text-white rounded-[1.5rem] text-[12px] font-black uppercase tracking-[0.4em] shadow-lg shadow-fuchsia-200 hover:bg-[#D946EF] transition-all flex items-center justify-center gap-3"
      >
        Portal Access <ArrowRight size={20} />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen w-full flex bg-white font-['Plus_Jakarta_Sans']">
      <div className="grid grid-cols-1 lg:grid-cols-5 w-full">
        <LeftVisuals />
        <div className="col-span-1 lg:col-span-2 flex items-center justify-center p-8 md:p-16 bg-white relative">
          <div className="absolute top-0 left-0 w-32 h-32 bg-[#E879F9]/5 rounded-full blur-[60px]" />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-[#22D3EE]/5 rounded-full blur-[80px]" />
          <div className="w-full max-w-[420px] z-10">
            {mode === 'landing' && renderLanding()}
            {(mode === 'login' || mode === 'signup' || mode === 'forgot-password') && renderForm()}
            {(mode === 'verification-sent' || mode === 'reset-sent') && renderMessage()}
            <div className="mt-16 text-center opacity-30 flex items-center justify-center gap-6">
               <span className="text-[9px] font-black uppercase tracking-[0.5em] text-zinc-900">MusicFlow Studio</span>
               <div className="w-1 h-1 bg-zinc-400 rounded-full" />
               <span className="text-[9px] font-black uppercase tracking-[0.5em] text-zinc-900">v2.5 Identity</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
