
import React, { useState } from 'react';
import { auth } from '../firebase';
// Added Star to the imports from lucide-react
import { LogOut, Calendar, MapPin, Sparkles, User, Ticket, PlusCircle, ArrowRight, Star } from 'lucide-react';
import { Track } from '../types';

interface ProfileViewProps {
  createdEvents: Track[];
  bookedEvents: Track[];
  onSignOut: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ createdEvents, bookedEvents, onSignOut }) => {
  const user = auth.currentUser;
  const [activeTab, setActiveTab] = useState<'booked' | 'created'>('booked');

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-700 font-['Plus_Jakarta_Sans'] relative z-10">
      {/* Sleek User Profile Header */}
      <div className="bg-[#0A0A0B]/60 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 mb-12 flex flex-col sm:flex-row items-center gap-10 shadow-2xl">
        <div className="relative">
          <div className="w-28 h-28 rounded-[2.5rem] overflow-hidden border border-white/10 p-1.5 bg-gradient-to-br from-[#E879F9]/20 to-transparent">
            <img 
              src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} 
              className="w-full h-full object-cover rounded-[2rem]" 
              alt="Profile" 
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-[#E879F9] text-white p-2 rounded-2xl shadow-xl">
             <Star size={14} fill="white" />
          </div>
        </div>
        
        <div className="flex-1 text-center sm:text-left">
          <div className="space-y-1">
            <p className="text-[#E879F9] font-black text-[10px] uppercase tracking-[0.5em] mb-2">Sonic Identity Established</p>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter truncate">
              {user?.displayName || 'Sonic Voyager'}
            </h2>
          </div>
        </div>

        <button 
          onClick={onSignOut}
          className="group flex items-center gap-3 px-8 py-4 text-zinc-500 hover:text-white bg-white/5 hover:bg-red-500/10 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest border border-white/5 hover:border-red-500/20 shadow-xl"
        >
          <LogOut size={16} /> Disconnect
        </button>
      </div>

      {/* Simplified Modern Tabs */}
      <div className="flex items-center gap-3 mb-10 p-2 bg-white/5 border border-white/5 rounded-[2rem] w-fit backdrop-blur-md mx-auto sm:mx-0">
        <button 
          onClick={() => setActiveTab('booked')}
          className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'booked' ? 'bg-white text-black shadow-2xl scale-105' : 'text-zinc-500 hover:text-white'}`}
        >
          <Ticket size={16} /> Passes ({bookedEvents.length})
        </button>
        <button 
          onClick={() => setActiveTab('created')}
          className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'created' ? 'bg-white text-black shadow-2xl scale-105' : 'text-zinc-500 hover:text-white'}`}
        >
          <PlusCircle size={16} /> My Events ({createdEvents.length})
        </button>
      </div>

      {/* Activity Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {(activeTab === 'booked' ? bookedEvents : createdEvents).map(track => (
          <div key={track.id} className="bg-[#0A0A0B] border border-white/5 rounded-[2.5rem] p-6 flex gap-6 group hover:border-[#E879F9]/20 transition-all shadow-xl">
            <div className="w-24 h-24 rounded-3xl overflow-hidden flex-shrink-0">
              <img src={track.cover} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h4 className="text-white font-black text-xl truncate mb-1">{track.title}</h4>
              <p className="text-[#E879F9] text-[10px] font-black uppercase tracking-widest mb-4 truncate">{track.artist}</p>
              
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-zinc-500 text-[9px] font-bold uppercase tracking-wider">
                  <Calendar size={12} className="text-[#22D3EE]" /> 
                  {track.dateTime?.split('T')[0] || 'Scheduled'}
                </div>
                <div className="flex items-center gap-2 text-zinc-500 text-[9px] font-bold uppercase tracking-wider">
                  <MapPin size={12} className="text-[#22D3EE]" /> 
                  {track.location?.split(',')[0] || 'Live Hub'}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <button className="p-3 rounded-full bg-white/5 text-zinc-500 hover:text-white transition-all">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        ))}

        {(activeTab === 'booked' ? bookedEvents : createdEvents).length === 0 && (
          <div className="col-span-full py-32 text-center border border-dashed border-white/10 rounded-[4rem] bg-white/[0.01] backdrop-blur-sm">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles size={32} className="text-zinc-700 opacity-50" />
            </div>
            <p className="text-zinc-600 font-black text-[10px] uppercase tracking-[0.4em]">Dimension data is currently empty</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
