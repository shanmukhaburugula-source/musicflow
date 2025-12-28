
import React, { useState } from 'react';
import { MOCK_PLAYLISTS } from '../constants';
import { Playlist, Track } from '../types';
import { Play, Calendar, MapPin, ArrowRight, Music, Zap, Disc, Mic, Volume2, Globe, ListMusic } from 'lucide-react';

interface HomeViewProps {
  tracks: Track[];
  onPlaylistSelect: (playlist: Playlist) => void;
  onTrackSelect: (track: Track) => void;
  onAddToQueue: (track: Track) => void;
  onViewDetails: (track: Track) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ tracks, onPlaylistSelect, onTrackSelect, onAddToQueue, onViewDetails }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Pop', 'R&B', 'Hip Hop', 'Rock', 'Electronic', 'Indie'];

  const filteredTracks = activeCategory === 'All' 
    ? tracks 
    : tracks.filter(track => track.genre?.toLowerCase().includes(activeCategory.toLowerCase()));

  const getGenreIcon = (genre: string = '') => {
    const g = genre.toLowerCase();
    if (g.includes('pop')) return <Music size={16} />;
    if (g.includes('rock')) return <Zap size={16} />;
    if (g.includes('r&b') || g.includes('soul')) return <Volume2 size={16} />;
    if (g.includes('hip hop')) return <Mic size={16} />;
    return <Disc size={16} />;
  };

  return (
    <div className="space-y-16 md:space-y-24 animate-in fade-in duration-1000 relative z-10">
      
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center py-10 md:py-20 px-4 max-w-6xl mx-auto overflow-hidden">
        
        {/* Central 3D Cube Only */}
        <div className="scene">
          <div className="cube">
            <div className="cube__face cube__face--front"><Music size={64} className="text-[#E879F9]" /></div>
            <div className="cube__face cube__face--back"><Zap size={64} className="text-[#22D3EE]" /></div>
            <div className="cube__face cube__face--right"><Disc size={64} className="text-[#E879F9]" /></div>
            <div className="cube__face cube__face--left"><Mic size={64} className="text-[#22D3EE]" /></div>
            <div className="cube__face cube__face--top"><Volume2 size={64} className="text-amber-400" /></div>
            <div className="cube__face cube__face--bottom"><Globe size={64} className="text-amber-400" /></div>
          </div>
        </div>

        <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter mb-8 md:mb-12 leading-[0.85] text-white">
          MuseFlow <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E879F9] to-[#22D3EE]">Dimension</span>
        </h1>
        <p className="text-zinc-400 text-base md:text-2xl mb-8 md:mb-12 font-medium leading-relaxed max-w-2xl px-4">
          Stadium energy meets digital serenity. Experience music through a lens of pure aesthetic wonder.
        </p>
        
        <div className="relative group">
           <div className="absolute inset-0 bg-gradient-to-r from-[#E879F9] to-[#22D3EE] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
           <button className="relative glow-button bg-[#E879F9] text-white px-10 md:px-14 py-4 md:py-5 rounded-full text-base md:text-lg font-black shadow-[0_20px_60px_rgba(232,121,249,0.3)] hover:scale-105 transition-all active:scale-95">
             Begin Discovery
           </button>
        </div>
      </section>

      {/* Main Grid Section (Universal Tools/Tours) */}
      <section className="space-y-12 md:space-y-16">
        <div className="flex flex-col items-center text-center space-y-3 md:space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white uppercase">Universal Tools</h2>
          <p className="text-zinc-500 font-medium text-base md:text-xl">Curated hits and live world-class performances.</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 px-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 md:px-10 py-2.5 md:py-3.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                activeCategory === cat 
                ? 'bg-white text-black shadow-2xl scale-105' 
                : 'bg-zinc-900/40 border border-white/5 text-zinc-500 hover:text-white hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 max-w-[1400px] mx-auto px-4">
          {filteredTracks.map((track) => (
            <div 
              key={track.id}
              className="group bg-[#0A0A0B] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden border border-white/5 flex flex-col h-full shadow-2xl transition-all duration-500 hover:border-[#E879F9]/30 hover:-translate-y-2"
            >
              <div 
                className="relative aspect-[4/5] overflow-hidden cursor-pointer"
                onClick={() => onViewDetails(track)}
              >
                <img src={track.cover} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" alt={track.artist} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent opacity-60" />
                
                <div className="absolute top-4 md:top-6 left-4 md:left-6 z-10 flex items-center gap-2 md:gap-3">
                  <div className="bg-black/60 backdrop-blur-2xl text-[#E879F9] p-2 rounded-2xl border border-white/10 shadow-2xl">
                    {getGenreIcon(track.genre)}
                  </div>
                  <span className="bg-white/10 backdrop-blur-xl text-white px-3 md:px-5 py-1.5 md:py-2 rounded-2xl text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] border border-white/10">
                    {track.genre || 'Live'}
                  </span>
                </div>

                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between gap-3">
                   <button 
                     onClick={(e) => { e.stopPropagation(); onTrackSelect(track); }}
                     className="flex-1 h-12 bg-[#E879F9] text-white flex items-center justify-center gap-2 rounded-2xl shadow-xl transform translate-y-20 group-hover:translate-y-0 transition-all duration-500 hover:scale-[1.03] active:scale-95"
                   >
                     <Play size={18} fill="currentColor" className="ml-0.5" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Live Flow</span>
                   </button>
                   <button 
                     onClick={(e) => { e.stopPropagation(); onAddToQueue(track); }}
                     className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/10 text-white flex items-center justify-center rounded-2xl shadow-xl transform translate-y-20 group-hover:translate-y-0 transition-all duration-500 hover:bg-white/20 active:scale-90"
                     title="Add to Queue"
                   >
                     <ListMusic size={18} />
                   </button>
                </div>
              </div>
              
              <div className="p-8 md:p-10 space-y-6 md:space-y-8 flex-1 flex flex-col">
                <div className="flex-1 cursor-pointer" onClick={() => onViewDetails(track)}>
                  <div className="flex flex-col gap-1 md:gap-2 mb-2 md:mb-4">
                    <span className="text-[#E879F9] font-black text-[8px] md:text-[10px] uppercase tracking-[0.5em]">Live Headline</span>
                    <h3 className="text-2xl md:text-3xl font-black group-hover:text-[#E879F9] transition-colors leading-tight text-white uppercase tracking-tighter">{track.artist}</h3>
                    <p className="text-zinc-500 font-bold text-sm md:text-lg">{track.title}</p>
                  </div>
                  
                  {track.dateTime && (
                    <div className="space-y-2 md:space-y-3 mt-4 md:mt-6">
                      <div className="flex items-center gap-2 md:gap-3 text-zinc-400 font-semibold text-xs md:text-sm">
                        <Calendar size={16} className="text-[#22D3EE]" />
                        <span>{typeof track.dateTime === 'string' ? track.dateTime.replace('T', ' ') : 'Scheduled'}</span>
                      </div>
                      <div className="flex items-center gap-2 md:gap-3 text-zinc-400 font-semibold text-xs md:text-sm">
                        <MapPin size={16} className="text-[#22D3EE]" />
                        <span>{track.location || 'Global Hub'}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <p className="text-zinc-500 text-sm md:text-base font-medium leading-relaxed line-clamp-2 italic">
                  "{track.fullDescription || 'Join the flow in this exclusive experience.'}"
                </p>

                <button 
                  onClick={() => onViewDetails(track)}
                  className="w-full bg-white/5 border border-white/10 text-white py-4 md:py-5 rounded-[1.5rem] md:rounded-[2rem] font-black text-[10px] md:text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-2 md:gap-3 hover:bg-white hover:text-black transition-all"
                >
                   Details & Passes
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Artist Profiles */}
      <section className="pb-20 md:pb-40 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-12 md:mb-20 text-white text-center uppercase">Aesthetic Spotlight</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {MOCK_PLAYLISTS.slice(0, 2).map((playlist) => (
            <div 
              key={playlist.id}
              onClick={() => onPlaylistSelect(playlist)}
              className="bg-[#0A0A0B] rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 flex flex-col md:flex-row gap-6 md:gap-10 border border-white/5 hover:border-[#E879F9]/20 transition-all group cursor-pointer shadow-2xl"
            >
              <div className="w-full md:w-56 h-48 md:h-56 rounded-2xl md:rounded-[2.5rem] overflow-hidden flex-shrink-0 shadow-2xl group-hover:scale-[1.03] transition-transform duration-700">
                <img src={playlist.cover} className="w-full h-full object-cover" alt={playlist.name} />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <span className="text-[#E879F9] text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] mb-2 md:mb-3">Artist Profile</span>
                <h3 className="text-2xl md:text-3xl font-black mb-2 md:mb-3 text-white uppercase tracking-tighter">{playlist.name}</h3>
                <p className="text-zinc-400 text-xs md:text-sm font-medium mb-6 md:mb-8 leading-relaxed line-clamp-2 italic">{playlist.description}</p>
                <div className="flex items-center gap-2 md:gap-3 text-[#E879F9] font-black text-[10px] md:text-xs group-hover:translate-x-2 transition-transform uppercase tracking-[0.3em]">
                  Explore Universe <ArrowRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeView;
