
import React from 'react';
import { MOCK_ARTISTS } from '../constants';
import { ExternalLink, Star } from 'lucide-react';

const ArtistsView: React.FC = () => {
  return (
    <div className="space-y-24 animate-in fade-in duration-700 pb-32 relative z-10">
      <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto pt-10">
        <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white">Sonic Icons</h2>
        <p className="text-zinc-400 font-medium text-xl leading-relaxed max-w-2xl">
          Meet the visionary artists shaping the future of sound and performance. Pure creativity, unfiltered.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 px-4">
        {MOCK_ARTISTS.map((artist) => (
          <div 
            key={artist.name}
            className="group relative h-[600px] rounded-[3.5rem] overflow-hidden border border-white/5 shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-[#E879F9]/30 bg-[#0A0A0B]"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img 
                src={artist.image} 
                className="w-full h-full object-cover brightness-[0.5] group-hover:scale-110 transition-transform duration-[2s]" 
                alt={artist.name} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 p-12 flex flex-col justify-end">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-[#E879F9]">
                   <Star size={16} fill="currentColor" />
                </span>
                <span className="text-[#E879F9] font-black text-[10px] uppercase tracking-[0.4em]">Legendary Profile</span>
              </div>
              
              <h3 className="text-5xl font-black text-white leading-tight mb-6">
                {artist.name}
              </h3>
              
              <p className="text-zinc-300 text-base font-medium leading-relaxed mb-10 line-clamp-4 italic">
                {artist.bio}
              </p>
              
              <div className="pt-8 border-t border-white/10">
                <a 
                  href={artist.profileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white font-extrabold text-xs uppercase tracking-[0.3em] hover:text-[#E879F9] transition-all"
                >
                  Enter Experience <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistsView;
