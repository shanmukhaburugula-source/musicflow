
import React, { useState } from 'react';
import { Track } from '../types';
import { MOCK_TRACKS } from '../constants';
import { Play, TrendingUp, Radio, Mic2, Star, Disc, Music, Headphones, Zap, Heart, Search, ListMusic } from 'lucide-react';

interface ExploreViewProps {
  onTrackSelect: (track: Track) => void;
  onAddToQueue: (track: Track) => void;
}

const ExploreView: React.FC<ExploreViewProps> = ({ onTrackSelect, onAddToQueue }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  const genres = [
    { name: 'Pop', icon: Music },
    { name: 'Hip Hop', icon: Mic2 },
    { name: 'R&B', icon: Heart },
    { name: 'Electronic', icon: Radio },
    { name: 'Indie', icon: TrendingUp },
    { name: 'Soul', icon: Headphones },
    { name: 'Jazz', icon: Star },
    { name: 'Rock', icon: Zap },
    { name: 'Country', icon: Disc },
    { name: 'Synthpop', icon: Radio },
  ];

  const filteredTracks = MOCK_TRACKS.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          track.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || track.genre?.toLowerCase().includes(selectedGenre.toLowerCase());
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="space-y-20 pb-10 animate-in fade-in duration-700">
      {/* Search Header */}
      <section className="relative flex flex-col items-center">
        <div className="w-full max-w-2xl relative">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
           <input 
             type="text" 
             placeholder="Search songs, artists, dimensions..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full bg-[#0A0A0B] border border-white/5 rounded-full py-5 pl-16 pr-8 text-white focus:outline-none focus:border-[#E879F9]/50 transition-all shadow-2xl"
           />
        </div>
      </section>

      <section className="relative h-[450px] rounded-[3.5rem] overflow-hidden group shadow-2xl">
        <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=2000" className="absolute inset-0 w-full h-full object-cover brightness-[0.3] transition-transform duration-[4s] group-hover:scale-105" alt="Explore" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent p-12 md:p-16 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-3 h-3 rounded-full bg-[#E879F9] animate-ping"></span>
            <span className="text-white font-black text-xs uppercase tracking-[0.4em]">Live Database Sync</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[1] max-w-3xl tracking-tighter uppercase">
            Sonic <br/><span className="text-[#E879F9]">Discoveries</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-xl mb-12 leading-relaxed italic">
            " Tap into the largest collection of independent hits and global superstars. Tap into the future of music Flow. "
          </p>
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-3 px-10 py-4 bg-[#E879F9] text-white rounded-full font-black hover:scale-105 transition-all shadow-[0_0_40px_rgba(232,121,249,0.4)] uppercase text-xs tracking-widest">
              <Play size={18} fill="white" />
              Stream All
            </button>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-black mb-10 tracking-tight text-white uppercase flex items-center gap-4">
          Browse Categories
          <div className="h-px flex-1 bg-white/5" />
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <div 
            onClick={() => setSelectedGenre('All')}
            className={`p-8 rounded-[2.5rem] border flex flex-col items-center justify-center gap-6 cursor-pointer transition-all hover:-translate-y-2 group ${selectedGenre === 'All' ? 'bg-white text-black border-white' : 'bg-zinc-900/40 border-white/5 text-white hover:border-[#E879F9]/40'}`}
          >
            <div className={`p-4 rounded-2xl border border-white/5 transition-colors ${selectedGenre === 'All' ? 'bg-zinc-100' : 'bg-[#18181B] group-hover:bg-[#E879F9]'}`}>
              <Disc size={28} className={selectedGenre === 'All' ? 'text-black' : 'group-hover:text-white'} />
            </div>
            <span className="font-black text-[10px] tracking-widest uppercase">All Hits</span>
          </div>
          {genres.map((genre) => (
            <div 
              key={genre.name} 
              onClick={() => setSelectedGenre(genre.name)}
              className={`p-8 rounded-[2.5rem] border flex flex-col items-center justify-center gap-6 cursor-pointer transition-all hover:-translate-y-2 group ${selectedGenre === genre.name ? 'bg-white text-black border-white' : 'bg-zinc-900/40 border-white/5 text-white hover:border-[#E879F9]/40'}`}
            >
              <div className={`p-4 rounded-2xl border border-white/5 transition-colors ${selectedGenre === genre.name ? 'bg-zinc-100' : 'bg-[#18181B] group-hover:bg-[#E879F9]'}`}>
                <genre.icon size={28} className={selectedGenre === genre.name ? 'text-black' : 'group-hover:text-white'} />
              </div>
              <span className="font-black text-[10px] tracking-widest uppercase">{genre.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-black tracking-tight text-white uppercase flex items-center gap-4 flex-1">
            Global Hits Database
            <div className="h-px flex-1 bg-white/5" />
          </h2>
        </div>
        
        <div className="bg-[#0A0A0B]/60 backdrop-blur-3xl rounded-[3rem] p-4 md:p-10 border border-white/5 shadow-2xl">
          {filteredTracks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              {filteredTracks.map((track, index) => (
                <div 
                  key={track.id}
                  className="flex items-center gap-6 p-4 rounded-2xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/10"
                >
                  <div 
                    className="relative w-16 h-16 rounded-xl overflow-hidden shadow-lg flex-shrink-0 cursor-pointer"
                    onClick={() => onTrackSelect(track)}
                  >
                    <img src={track.cover} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={track.title} />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Play size={16} fill="white" className="text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 
                      className="font-bold text-base truncate text-white group-hover:text-[#E879F9] cursor-pointer transition-colors mb-1"
                      onClick={() => onTrackSelect(track)}
                    >
                      {track.title}
                    </h4>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{track.artist}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => onAddToQueue(track)}
                      className="p-2.5 text-zinc-600 hover:text-[#E879F9] bg-white/5 hover:bg-[#E879F9]/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      title="Add to Queue"
                    >
                      <ListMusic size={16} />
                    </button>
                    <span className="text-xs font-black text-zinc-600 tabular-nums">{track.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center flex flex-col items-center">
               <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 text-zinc-800">
                  <Disc size={32} />
               </div>
               <p className="text-zinc-500 font-black text-[10px] uppercase tracking-[0.4em]">Zero matches in current dimension</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ExploreView;
