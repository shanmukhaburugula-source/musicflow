
import React, { useState, useEffect } from 'react';
import { ViewType } from '../types';
import { Star, Menu, X, LogOut, ChevronDown, User, Music } from 'lucide-react';
import { auth } from '../firebase';
import { signOut, User as FirebaseUser } from 'firebase/auth';
import { MOCK_ARTISTS } from '../constants';

interface HeaderProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleNavClick = (viewId: ViewType) => {
    onViewChange(viewId);
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const handleSignOut = () => signOut(auth);

  // Combine artist names for a scrolling display of present artists
  const artistString = MOCK_ARTISTS.map(a => a.name).join(' • ');

  return (
    <>
      {/* Marquee Navigation displaying Artists */}
      <div className="bg-[#E879F9] text-[#050505] py-2 px-6 overflow-hidden border-b border-black/10 relative">
        <div className="marquee-track">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-12">
              <div className="flex items-center gap-4">
                <Star size={12} fill="currentColor" />
                <span className="text-[11px] font-black uppercase tracking-[0.4em]">{artistString}</span>
              </div>
              <div className="flex items-center gap-4">
                <Music size={12} fill="currentColor" />
                <span className="text-[11px] font-black uppercase tracking-[0.4em]">Live Performances • Trending Artists • Exclusive Drops</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-[60] bg-[#050505]/80 backdrop-blur-2xl border-b border-white/5 px-6 md:px-12 h-20 flex items-center justify-between">
        <div onClick={() => handleNavClick(ViewType.HOME)} className="cursor-pointer group">
          <span className="text-2xl font-black text-white uppercase tracking-tighter">
            Music<span className="text-[#E879F9]">Flow</span>
          </span>
        </div>

        <nav className="hidden md:flex flex-1 justify-center gap-10">
          {[
            { id: ViewType.HOME, label: 'Discover' },
            { id: ViewType.EXPLORE, label: 'Explore' },
            { id: ViewType.CREATE_EVENT, label: 'Create' }
          ].map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`text-[10px] font-black uppercase tracking-widest transition-all relative ${currentView === link.id ? 'text-[#E879F9]' : 'text-zinc-500 hover:text-white'}`}
            >
              {link.label}
              {currentView === link.id && <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#E879F9]" />}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-6">
          {user && (
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1 pr-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all group"
              >
                <img 
                  src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                  className="w-8 h-8 rounded-full border border-white/10 object-cover" 
                  alt="" 
                />
                <span className="text-[10px] font-black text-white uppercase truncate max-w-[100px]">{user.displayName || 'Voyager'}</span>
                <ChevronDown size={14} className={`text-zinc-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-3 w-48 bg-[#0A0A0B] border border-white/10 rounded-2xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2">
                  <button 
                    onClick={() => handleNavClick(ViewType.PROFILE)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest"
                  >
                    <User size={16} /> My Portal
                  </button>
                  <div className="h-px bg-white/5 my-1" />
                  <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest"
                  >
                    <LogOut size={16} /> Disconnect
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button className="md:hidden p-2 text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[55] bg-[#050505] pt-24 px-8 animate-in slide-in-from-top">
          <div className="flex flex-col gap-8">
            {[
              { id: ViewType.HOME, label: 'Discover' },
              { id: ViewType.EXPLORE, label: 'Explore' },
              { id: ViewType.CREATE_EVENT, label: 'Create' },
              { id: ViewType.PROFILE, label: 'My Portal' }
            ].map((v) => (
              <button key={v.id} onClick={() => handleNavClick(v.id)} className={`text-4xl font-black uppercase tracking-tighter text-left ${currentView === v.id ? 'text-[#E879F9]' : 'text-zinc-500'}`}>
                {v.label}
              </button>
            ))}
            <button onClick={handleSignOut} className="text-2xl font-black text-red-500 text-left uppercase mt-4">Disconnect</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
