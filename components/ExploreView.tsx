
import React, { useState, useMemo } from 'react';
import { Track } from '../types';
import { GLOBAL_SONG_DATABASE } from '../constants';
import { Play, TrendingUp, Radio, Mic2, Star, Disc, Music, Headphones, Zap, Heart, Search, ListMusic } from 'lucide-react';

interface ExploreViewProps {
  publicEvents: Track[];
  onTrackSelect: (track: Track) => void;
  onAddToQueue: (track: Track) => void;
}

const ExploreView: React.FC<ExploreViewProps> = ({ publicEvents, onTrackSelect, onAddToQueue }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  // Identify artists who are currently conducting an event
  const performingArtists = useMemo(() => {
    return new Set(publicEvents.map(event => event.artist));
  }, [publicEvents]);

  const genres = [
    { name: 'Pop', icon: Music },
    { name: 'Hip Hop', icon: Mic2 },
    { name: 'R&B', icon: Heart },
    { name: 'Electronic', icon: Radio },
    { name: 'Rock', icon: Zap },
    { name: 'K-Pop', icon: Star },
    { name: 'Bollywood', icon: Headphones },
  ];

  // Logic: Show songs of artists who are going to conduct an event throughout the world
  const eventRelatedTracks = useMemo(() => {
    return GLOBAL_SONG_DATABASE.filter(track => performingArtists.has(track.artist));
  }, [performingArtists]);

  const filteredTracks = useMemo(() => {
    return eventRelatedTracks.filter(track => {
      const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            track.artist.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = selectedGenre === 'All' || track.genre?.toLowerCase().includes(selectedGenre.toLowerCase());
      return matchesSearch && matchesGenre;
    });
  }, [eventRelatedTracks, searchQuery, selectedGenre]);

  return (
    <div className="space-y-20 pb-10 animate-in fade-in duration-700 relative z-10">
      {/* Search Header */}
      <section className="relative flex flex-col items-center">
        <div className="w-full max-w-2xl relative">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
           <input 
             type="text" 
             placeholder="Search songs from event artists..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full bg-[#0A0A0B] border border-white/5 rounded-full py-5 pl-16 pr-8 text-white focus:outline-none focus:border-[#E879F9]/50 transition-all shadow-2xl"
           />
        </div>
      </section>

      <section className="relative h-[400px] rounded-[3.5rem] overflow-hidden group shadow-2xl border border-white/5">
        <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=2000" className="absolute inset-0 w-full h-full object-cover brightness-[0.3] transition-transform duration-[4s] group-hover:scale-105" alt="Explore" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent p-12 md:p-16 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-3 h-3 rounded-full bg-[#E879F9] animate-ping"></span>
            <span className="text-white font-black text-xs uppercase tracking-[0.4em]">Global Event Database Sync</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[1] max-w-3xl tracking-tighter uppercase">
            Sonic <br/><span className="text-[#E879F9]">Pipeline</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-xl mb-12 leading-relaxed italic">
            " Exclusive tracks from the artists performing worldwide today. "
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-black mb-10 tracking-tight text-white uppercase flex items-center gap-4">
          World Artist Genres
          <div className="h-px flex-1 bg-white/5" />
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div 
            onClick={() => setSelectedGenre('All')}
            className={`p-6 rounded-[2rem] border flex flex-col items-center justify-center gap-4 cursor-pointer transition-all hover:-translate-y-1 group ${selectedGenre === 'All' ? 'bg-[#E879F9] text-white border-[#E879F9]' : 'bg-zinc-900/40 border-white/5 text-zinc-500 hover:text-white'}`}
          >
            <Disc size={20} />
            <span className="font-black text-[9px] tracking-widest uppercase">All Hits</span>
          </div>
          {genres.map((genre) => (
            <div 
              key={genre.name} 
              onClick={() => setSelectedGenre(genre.name)}
              className={`p-6 rounded-[2rem] border flex flex-col items-center justify-center gap-4 cursor-pointer transition-all hover:-translate-y-1 group ${selectedGenre === genre.name ? 'bg-[#E879F9] text-white border-[#E879F9]' : 'bg-zinc-900/40 border-white/5 text-zinc-500 hover:text-white'}`}
            >
              <genre.icon size={20} />
              <span className="font-black text-[9px] tracking-widest uppercase">{genre.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-black tracking-tight text-white uppercase flex items-center gap-4 flex-1">
            Global Artist Discography
            <div className="h-px flex-1 bg-white/5" />
          </h2>
        </div>
        
        <div className="bg-[#0A0A0B]/60 backdrop-blur-3xl rounded-[3rem] p-4 md:p-10 border border-white/5 shadow-2xl">
          {filteredTracks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              {filteredTracks.map((track) => (
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
               <p className="text-zinc-500 font-black text-[10px] uppercase tracking-[0.4em]">Zero event artists found matching query</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ExploreView;
