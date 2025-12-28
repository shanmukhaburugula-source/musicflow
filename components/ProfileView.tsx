
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { getArtistProfile } from '../supabase';
import { LogOut, Calendar, MapPin, Sparkles, User, Ticket, PlusCircle, ArrowRight, Star, Mail } from 'lucide-react';
import { Track, ArtistProfile as ArtistType } from '../types';

interface ProfileViewProps {
  createdEvents: Track[];
  bookedEvents: Track[];
  onSignOut: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ createdEvents, bookedEvents, onSignOut }) => {
  const user = auth.currentUser;
  const [activeTab, setActiveTab] = useState<'booked' | 'created'>('created');
  const [artistDetails, setArtistDetails] = useState<ArtistType | null>(null);

  useEffect(() => {
    if (user) {
      getArtistProfile(user.uid).then(setArtistDetails);
    }
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-700 font-['Plus_Jakarta_Sans'] relative z-10">
      {/* Redesigned Header Card */}
      <div className="bg-[#0A0A0B]/80 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 md:p-12 mb-10 flex flex-col md:flex-row items-center gap-8 relative shadow-2xl">
        <div className="relative">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] overflow-hidden border border-white/10 p-1 bg-zinc-900">
            <img 
              src={artistDetails?.profilePhoto || user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} 
              className="w-full h-full object-cover rounded-[1.8rem]" 
              alt="Profile" 
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-[#E879F9] text-white p-2 rounded-xl shadow-xl border-4 border-[#0A0A0B]">
             <Star size={14} fill="white" />
          </div>
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <p className="text-[#E879F9] font-black text-[10px] uppercase tracking-[0.4em] mb-2">Authenticated Artist</p>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-2">
            {artistDetails?.name || user?.displayName || 'Sonic Voyager'}
          </h2>
          <div className="flex items-center justify-center md:justify-start gap-2 text-zinc-500">
            <Mail size={14} className="text-zinc-600" />
            <span className="text-[12px] font-bold tracking-widest uppercase">{artistDetails?.email || user?.email}</span>
          </div>
        </div>

        <button 
          onClick={onSignOut}
          className="md:absolute md:top-12 md:right-12 flex items-center gap-3 px-6 py-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded-2xl text-zinc-400 hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.2em]"
        >
          <LogOut size={16} /> Disconnect
        </button>
      </div>

      {/* Tab Selectors with counts matching screenshot style */}
      <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          onClick={() => setActiveTab('created')}
          className={`flex items-center gap-3 px-8 py-4 rounded-full text-[11px] font-black uppercase tracking-widest transition-all border whitespace-nowrap ${
            activeTab === 'created' 
            ? 'bg-white text-black border-white shadow-xl scale-105' 
            : 'bg-white/[0.03] text-zinc-500 border-white/5 hover:border-white/20'
          }`}
        >
          <PlusCircle size={18} className={activeTab === 'created' ? 'text-black' : 'text-zinc-600'} /> 
          My Forecasts ({createdEvents.length})
        </button>
        <button 
          onClick={() => setActiveTab('booked')}
          className={`flex items-center gap-3 px-8 py-4 rounded-full text-[11px] font-black uppercase tracking-widest transition-all border whitespace-nowrap ${
            activeTab === 'booked' 
            ? 'bg-white text-black border-white shadow-xl scale-105' 
            : 'bg-white/[0.03] text-zinc-500 border-white/5 hover:border-white/20'
          }`}
        >
          <Ticket size={18} className={activeTab === 'booked' ? 'text-black' : 'text-zinc-600'} /> 
          Saved Passes ({bookedEvents.length})
        </button>
      </div>

      {/* Events Grid matching screenshot layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(activeTab === 'booked' ? bookedEvents : createdEvents).map(track => (
          <div key={track.id} className="bg-[#0A0A0B]/60 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-6 flex gap-6 group hover:border-[#E879F9]/30 transition-all">
            <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-zinc-900 shadow-xl">
              <img src={track.cover} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h4 className="text-white font-black text-2xl truncate mb-1 uppercase tracking-tighter">{track.title}</h4>
              <p className="text-[#E879F9] text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                {track.genre || 'Live Experience'}
              </p>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                  <Calendar size={12} className="text-[#22D3EE]" /> 
                  {typeof track.dateTime === 'string' ? track.dateTime.split('T')[0] : 'Scheduled'}
                </div>
                <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                  <MapPin size={12} className="text-[#22D3EE]" /> 
                  {track.location || 'Global Hub'}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <button className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center text-zinc-500 hover:text-[#E879F9] hover:bg-white/[0.08] transition-all">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        ))}

        {(activeTab === 'booked' ? bookedEvents : createdEvents).length === 0 && (
          <div className="col-span-full py-24 text-center border border-dashed border-white/10 rounded-[3rem] bg-white/[0.01]">
            <Sparkles size={32} className="mx-auto text-zinc-800 mb-6" />
            <p className="text-zinc-600 font-black text-[10px] uppercase tracking-[0.5em]">No dimensions linked yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
