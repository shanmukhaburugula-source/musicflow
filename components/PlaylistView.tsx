
import React from 'react';
import { Playlist, Track } from '../types';
import { Play, Shuffle, Heart, MoreHorizontal, Clock, Plus, ListMusic } from 'lucide-react';

interface PlaylistViewProps {
  playlist: Playlist;
  onTrackSelect: (track: Track) => void;
  onAddToQueue: (track: Track) => void;
  currentTrackId?: string;
}

const PlaylistView: React.FC<PlaylistViewProps> = ({ playlist, onTrackSelect, onAddToQueue, currentTrackId }) => {
  return (
    <div className="pb-16 animate-in fade-in slide-in-from-right-4 duration-500 max-w-5xl mx-auto">
      {/* Refined Banner */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-10 mb-10 text-center md:text-left">
        <div className="w-64 h-64 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl">
           <img src={playlist.cover} alt={playlist.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 space-y-4">
          <span className="text-[#E879F9] font-black text-[10px] uppercase tracking-[0.3em] bg-[#E879F9]/10 px-3 py-1 rounded-full border border-[#E879F9]/20">Official Selection</span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight uppercase">
            {playlist.name}
          </h1>
          <p className="text-zinc-400 text-lg font-medium max-w-2xl italic">{playlist.description}</p>
          <div className="flex items-center justify-center md:justify-start gap-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">
            <span className="text-white">MuseFlow Studio</span>
            <span className="text-zinc-800">•</span>
            <span>{playlist.tracks.length} tracks</span>
          </div>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="flex items-center gap-4 mb-10">
        <button className="flex items-center gap-3 px-10 py-3.5 bg-[#E879F9] text-white rounded-xl font-black shadow-lg hover:scale-[1.02] transition-all uppercase text-xs tracking-widest">
           <Play size={18} fill="white" />
           Stream Now
        </button>
        <button className="flex items-center gap-2 px-6 py-3.5 bg-white/5 border border-white/10 text-white rounded-xl font-black hover:bg-white/10 transition-all uppercase text-xs tracking-widest">
           <Shuffle size={18} />
           Shuffle
        </button>
        <button className="p-3.5 bg-white/5 border border-white/10 rounded-xl text-zinc-500 hover:text-red-500 hover:bg-white/10 transition-all">
           <Heart size={20} />
        </button>
        <button className="p-3.5 bg-white/5 border border-white/10 rounded-xl text-zinc-500 hover:bg-white/10 transition-all ml-auto">
           <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Tracks List */}
      <div className="bg-[#0A0A0B]/60 backdrop-blur-3xl rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="grid grid-cols-[3rem_1fr_1fr_8rem] px-8 py-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest border-b border-white/5 bg-white/[0.02]">
          <div className="text-center">#</div>
          <div>Track Name</div>
          <div className="hidden md:block">Dimension</div>
          <div className="flex justify-end pr-4"><Clock size={14} /></div>
        </div>
        
        <div className="divide-y divide-white/5">
          {playlist.tracks.map((track, idx) => {
            const isActive = track.id === currentTrackId;
            return (
              <div 
                key={track.id}
                className={`grid grid-cols-[3rem_1fr_1fr_8rem] items-center px-8 py-5 transition-all group ${
                  isActive ? 'bg-[#E879F9]/5' : 'hover:bg-white/5'
                }`}
              >
                <div 
                  onClick={() => onTrackSelect(track)}
                  className={`text-center font-black text-xs cursor-pointer ${isActive ? 'text-[#E879F9]' : 'text-zinc-700'}`}
                >
                   {isActive ? (
                     <div className="flex items-center justify-center gap-0.5">
                       <span className="w-1 h-3 bg-[#E879F9] animate-pulse"></span>
                       <span className="w-1 h-2 bg-[#E879F9] animate-pulse" style={{ animationDelay: '0.1s' }}></span>
                       <span className="w-1 h-3 bg-[#E879F9] animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                     </div>
                   ) : idx + 1}
                </div>
                
                <div 
                  onClick={() => onTrackSelect(track)}
                  className="flex items-center gap-4 min-w-0 cursor-pointer"
                >
                  <img src={track.cover} className="w-12 h-12 rounded-xl object-cover shadow-lg" alt={track.title} />
                  <div className="min-w-0">
                    <h4 className={`font-bold text-sm truncate ${isActive ? 'text-[#E879F9]' : 'text-white'}`}>{track.title}</h4>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest truncate">{track.artist}</p>
                  </div>
                </div>

                <div className="hidden md:block text-[10px] font-black text-zinc-500 uppercase tracking-widest truncate">{track.album}</div>

                <div className="flex items-center justify-end gap-4">
                  <button 
                    onClick={() => onAddToQueue(track)}
                    className="p-2 text-zinc-600 hover:text-[#E879F9] transition-colors opacity-0 group-hover:opacity-100"
                    title="Add to Queue"
                  >
                    <ListMusic size={18} />
                  </button>
                  <span className="text-xs font-bold text-zinc-600 tabular-nums">
                    {track.duration}
                  </span>
                  <button className="text-zinc-700 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlaylistView;
