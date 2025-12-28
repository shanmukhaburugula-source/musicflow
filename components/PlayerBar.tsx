
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Info, X, ListMusic, Trash2 } from 'lucide-react';
import { Track } from '../types';

interface PlayerBarProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[];
  onRemoveFromQueue: (index: number) => void;
  onPlayPause: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

const PlayerBar: React.FC<PlayerBarProps> = ({ currentTrack, isPlaying, queue, onRemoveFromQueue, onPlayPause, onNext, onPrev }) => {
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [showVolume, setShowVolume] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  
  // Dragging State - Defaulting to bottom right
  const [position, setPosition] = useState({ x: window.innerWidth - 100, y: window.innerHeight - 100 });
  const [isDragging, setIsDragging] = useState(false);
  
  const dragStartRef = useRef({ x: 0, y: 0 });
  const initialPosRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);
  const dragThreshold = 5; // Pixels to move before considering it a drag vs a click
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Sync position on mount and handle viewport resizing
  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => ({
        x: Math.max(20, Math.min(prev.x, window.innerWidth - (isMinimized ? 80 : 340))),
        y: Math.max(20, Math.min(prev.y, window.innerHeight - (isMinimized ? 80 : 250)))
      }));
    };
    
    // Initial centering if needed or just keep the default
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMinimized]);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Autoplay policy caught', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Ignore if clicking interactive elements inside the player
    if ((e.target as HTMLElement).closest('button') || 
        (e.target as HTMLElement).closest('input') || 
        (e.target as HTMLElement).closest('a')) {
      return;
    }
    
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    initialPosRef.current = { x: position.x, y: position.y };
    
    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    if (!hasMovedRef.current && (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold)) {
      hasMovedRef.current = true;
    }

    if (hasMovedRef.current) {
      const targetX = initialPosRef.current.x + dx;
      const targetY = initialPosRef.current.y + dy;

      // Calculate dynamic bounds based on current state
      const playerWidth = isMinimized ? 64 : (window.innerWidth < 640 ? 280 : 320);
      const playerHeight = isMinimized ? 64 : 200; // rough estimation for clamp

      const padding = 10;
      const clampedX = Math.max(padding, Math.min(targetX, window.innerWidth - playerWidth - padding));
      const clampedY = Math.max(padding, Math.min(targetY, window.innerHeight - playerHeight - padding));

      setPosition({ x: clampedX, y: clampedY });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    
    setIsDragging(false);
    if (containerRef.current) {
      containerRef.current.releasePointerCapture(e.pointerId);
    }
    
    // If it wasn't a significant drag, toggle the state
    if (!hasMovedRef.current) {
      setIsMinimized(!isMinimized);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && isFinite(audioRef.current.duration)) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current && isFinite(audioRef.current.duration)) {
      const val = parseFloat(e.target.value);
      audioRef.current.currentTime = (val / 100) * audioRef.current.duration;
      setProgress(val);
    }
  };

  if (!currentTrack) return null;

  return (
    <div 
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ 
        position: 'fixed',
        left: 0,
        top: 0,
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        touchAction: 'none',
        zIndex: 9999
      }}
      className={`flex flex-col items-end gap-3 select-none transition-shadow duration-300 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
    >
      <audio 
        ref={audioRef} 
        src={currentTrack.audioUrl} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={onNext}
      />

      {/* Queue Drawer Panel (Attached to Player) */}
      {!isMinimized && isQueueOpen && (
        <div className="w-72 md:w-80 bg-[#0A0A0B]/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-5 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 max-h-[320px] overflow-hidden flex flex-col mb-1">
          <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
            <h3 className="text-white font-black text-[9px] uppercase tracking-[0.3em] flex items-center gap-2">
              <ListMusic size={14} className="text-[#E879F9]" /> Pipeline
            </h3>
            <button onClick={(e) => { e.stopPropagation(); setIsQueueOpen(false); }} className="text-zinc-500 hover:text-white transition-colors">
              <X size={14} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide">
            {queue.length > 0 ? queue.map((track, idx) => (
              <div key={`${track.id}-${idx}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group">
                <img src={track.cover} className="w-10 h-10 rounded-lg object-cover" alt="" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-[11px] font-bold truncate">{track.title}</h4>
                  <p className="text-zinc-500 text-[8px] font-black uppercase tracking-widest truncate">{track.artist}</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onRemoveFromQueue(idx); }}
                  className="p-2 text-zinc-700 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            )) : (
              <div className="py-10 text-center">
                <p className="text-zinc-700 text-[9px] font-black uppercase tracking-[0.4em]">Pipeline Empty</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Draggable Player Card */}
      <div 
        className={`bg-[#0A0A0B]/95 backdrop-blur-3xl border border-white/10 rounded-[2.2rem] shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col transition-all duration-500 ease-out ${
          isMinimized ? 'w-16 h-16 p-0 rotate-0' : 'w-72 md:w-80 p-5'
        } ${isDragging ? 'scale-105 shadow-[#E879F9]/20' : 'scale-100'}`}
      >
        {isMinimized ? (
          <div className="w-full h-full relative group pointer-events-none">
            <img src={currentTrack.cover} className="w-full h-full object-cover rounded-[2rem] transition-transform group-hover:scale-110" alt="" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
               {isPlaying ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white ml-1" />}
            </div>
            {isPlaying && (
              <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#E879F9] rounded-full animate-pulse border-2 border-black" />
            )}
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl overflow-hidden shadow-lg border border-white/10 flex-shrink-0">
                  <img src={currentTrack.cover} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="min-w-0">
                   <p className="text-[8px] font-black text-[#E879F9] uppercase tracking-[0.3em] mb-0.5">Frequency</p>
                   <h4 className="text-white text-[13px] font-bold truncate leading-tight">{currentTrack.title}</h4>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsQueueOpen(!isQueueOpen); }}
                  className={`p-2 transition-all rounded-lg ${isQueueOpen ? 'text-[#E879F9] bg-[#E879F9]/10' : 'text-zinc-500 hover:text-white'}`}
                >
                  <ListMusic size={16} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsMinimized(true); setIsQueueOpen(false); }}
                  className="p-1.5 text-zinc-500 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Main Controls */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-6 py-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); onPrev?.(); }}
                  className="text-zinc-500 hover:text-white transition-all active:scale-90"
                >
                  <SkipBack size={18} fill="currentColor" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onPlayPause(); }}
                  className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 hover:bg-[#E879F9] hover:text-white transition-all shadow-xl"
                >
                  {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-1" />}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onNext?.(); }}
                  className="text-zinc-500 hover:text-white transition-all active:scale-90"
                >
                  <SkipForward size={18} fill="currentColor" />
                </button>
              </div>

              {/* Seek Bar */}
              <div className="px-1">
                <input 
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={progress}
                  onChange={handleSeek}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#E879F9] hover:accent-[#22D3EE] transition-all"
                />
                <div className="flex justify-between mt-2">
                   <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">
                     {audioRef.current ? `${Math.floor(audioRef.current.currentTime / 60)}:${Math.floor(audioRef.current.currentTime % 60).toString().padStart(2, '0')}` : '0:00'}
                   </span>
                   <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">{currentTrack.duration}</span>
                </div>
              </div>

              {/* Utility Row */}
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex items-center gap-4">
                   <button onClick={(e) => e.stopPropagation()} className="text-zinc-600 hover:text-red-500 transition-colors">
                     <Heart size={16} />
                   </button>
                   <button onClick={(e) => e.stopPropagation()} className="text-zinc-600 hover:text-[#22D3EE] transition-colors">
                     <Info size={16} />
                   </button>
                </div>
                
                <div className="flex items-center gap-2 relative">
                  <button 
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => { e.stopPropagation(); setShowVolume(!showVolume); }}
                    className={`text-zinc-600 hover:text-white transition-colors ${showVolume ? 'text-white' : ''}`}
                  >
                    <Volume2 size={16} />
                  </button>
                  <div 
                    className={`transition-all duration-300 overflow-hidden flex items-center ${showVolume ? 'w-20 opacity-100 ml-1' : 'w-0 opacity-0'}`}
                  >
                    <input 
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={(e) => { e.stopPropagation(); setVolume(parseFloat(e.target.value)); }}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="w-full h-1 bg-white/10 rounded-full appearance-none accent-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Drag Handle UI (Decoration) */}
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 opacity-20 flex gap-1 pointer-events-none">
               <div className="w-0.5 h-0.5 bg-white rounded-full" />
               <div className="w-0.5 h-0.5 bg-white rounded-full" />
               <div className="w-0.5 h-0.5 bg-white rounded-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerBar;
