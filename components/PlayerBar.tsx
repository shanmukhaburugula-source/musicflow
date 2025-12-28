
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Info, X, ListMusic, Trash2, GripVertical } from 'lucide-react';
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
  
  // Dragging State
  const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const initialPos = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Initialize position on mount and handle resize
  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => ({
        x: Math.min(prev.x, window.innerWidth - 60),
        y: Math.min(prev.y, window.innerHeight - 60)
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Autoplay blocked', e));
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
    // Only drag if clicking the container or the drag handle, not buttons
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) return;
    
    setIsDragging(true);
    hasMoved.current = false;
    dragStart.current = { x: e.clientX, y: e.clientY };
    initialPos.current = { x: position.x, y: position.y };
    
    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;

    // Detection threshold to distinguish drag from click
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      hasMoved.current = true;
    }

    if (hasMoved.current) {
      const newX = initialPos.current.x + dx;
      const newY = initialPos.current.y + dy;

      // Screen constraints
      const padding = 20;
      const clampedX = Math.max(padding, Math.min(newX, window.innerWidth - (isMinimized ? 80 : 340)));
      const clampedY = Math.max(padding, Math.min(newY, window.innerHeight - (isMinimized ? 80 : 250)));

      setPosition({ x: clampedX, y: clampedY });
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleToggleState = () => {
    if (!hasMoved.current) {
      setIsMinimized(!isMinimized);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && isFinite(audioRef.current.duration) && audioRef.current.duration > 0) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current && isFinite(audioRef.current.duration) && audioRef.current.duration > 0) {
      const seekTime = (parseFloat(e.target.value) / 100) * audioRef.current.duration;
      if (isFinite(seekTime)) {
        audioRef.current.currentTime = seekTime;
        setProgress(parseFloat(e.target.value));
      }
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
        left: 0,
        top: 0,
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        touchAction: 'none'
      }}
      className={`fixed z-[100] flex flex-col items-end gap-3 transition-transform duration-75 ease-out select-none cursor-grab active:cursor-grabbing`}
    >
      {/* Audio Element */}
      <audio 
        ref={audioRef} 
        src={currentTrack.audioUrl} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={onNext}
      />

      {/* Queue Drawer Panel */}
      {!isMinimized && isQueueOpen && (
        <div className="w-72 md:w-80 bg-[#0A0A0B]/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl animate-in slide-in-from-bottom-5 duration-300 max-h-[300px] md:max-h-[400px] overflow-hidden flex flex-col mb-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-black text-[10px] uppercase tracking-[0.4em]">Next In Dimension</h3>
            <button onClick={(e) => { e.stopPropagation(); setIsQueueOpen(false); }} className="text-zinc-500 hover:text-white transition-colors p-1">
              <X size={14} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-hide">
            {queue.length > 0 ? queue.map((track, idx) => (
              <div key={`${track.id}-${idx}`} className="flex items-center gap-3 group">
                <img src={track.cover} className="w-10 h-10 rounded-lg object-cover" alt="" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-xs font-bold truncate">{track.title}</h4>
                  <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest truncate">{track.artist}</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onRemoveFromQueue(idx); }}
                  className="p-2 text-zinc-600 hover:text-red-500 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )) : (
              <div className="py-12 text-center">
                <p className="text-zinc-700 text-[9px] font-black uppercase tracking-[0.4em]">Queue is vacant</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Player UI */}
      <div 
        className={`bg-[#0A0A0B]/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col transition-all duration-500 ${isMinimized ? 'w-16 h-16 p-0' : 'w-72 md:w-80 p-5'} ${isDragging ? 'scale-105 shadow-fuchsia-500/20' : 'scale-100'}`}
      >
        
        {isMinimized ? (
          <button 
            onClick={handleToggleState}
            className="w-full h-full flex items-center justify-center group relative overflow-hidden rounded-[2.5rem]"
          >
            <img src={currentTrack.cover} className="w-full h-full object-cover group-hover:brightness-50 transition-all" alt="" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               {isPlaying ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white ml-1" />}
            </div>
            {isPlaying && (
              <div className="absolute bottom-1 right-1 w-3 h-3 bg-[#E879F9] rounded-full animate-pulse border-2 border-[#0A0A0B]" />
            )}
          </button>
        ) : (
          <>
            {/* Header / Info */}
            <div className="flex items-center justify-between mb-5 pointer-events-none">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg border border-white/10">
                  <img src={currentTrack.cover} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="min-w-0">
                   <p className="text-[10px] font-black text-[#E879F9] uppercase tracking-widest mb-0.5">Flowing</p>
                   <h4 className="text-white text-sm font-bold truncate leading-none">{currentTrack.title}</h4>
                </div>
              </div>
              <div className="flex items-center gap-1 pointer-events-auto">
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

            {/* Controls */}
            <div className="flex flex-col gap-5 pointer-events-auto">
              <div className="flex items-center justify-center gap-6">
                <button 
                  onClick={(e) => { e.stopPropagation(); onPrev?.(); }}
                  className="text-zinc-500 hover:text-white transition-all transform active:scale-90"
                >
                  <SkipBack size={20} fill="currentColor" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onPlayPause(); }}
                  className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 hover:bg-[#E879F9] hover:text-white transition-all shadow-xl"
                >
                  {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onNext?.(); }}
                  className="text-zinc-500 hover:text-white transition-all transform active:scale-90"
                >
                  <SkipForward size={20} fill="currentColor" />
                </button>
              </div>

              {/* Progress */}
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
                   <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest tabular-nums">
                     {audioRef.current && isFinite(audioRef.current.currentTime) ? Math.floor(audioRef.current.currentTime / 60) + ':' + Math.floor(audioRef.current.currentTime % 60).toString().padStart(2, '0') : '0:00'}
                   </span>
                   <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest tabular-nums">{currentTrack.duration}</span>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <div className="flex items-center gap-4">
                   <button onClick={(e) => e.stopPropagation()} className="text-zinc-500 hover:text-red-500 transition-colors">
                     <Heart size={18} />
                   </button>
                   <button onClick={(e) => e.stopPropagation()} className="text-zinc-500 hover:text-[#E879F9] transition-colors">
                     <Info size={18} />
                   </button>
                </div>
                
                <div className="flex items-center gap-2 relative">
                  <button 
                    onMouseEnter={() => setShowVolume(true)}
                    onClick={(e) => { e.stopPropagation(); setShowVolume(!showVolume); }}
                    className="text-zinc-500 hover:text-white transition-colors"
                  >
                    <Volume2 size={18} />
                  </button>
                  <div 
                    className={`transition-all duration-300 overflow-hidden flex items-center ${showVolume ? 'w-20 opacity-100' : 'w-0 opacity-0'}`}
                    onMouseLeave={() => setShowVolume(false)}
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

            {/* Drag Handle Indicator */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 opacity-20 flex gap-0.5">
               <div className="w-1 h-1 bg-white rounded-full" />
               <div className="w-1 h-1 bg-white rounded-full" />
               <div className="w-1 h-1 bg-white rounded-full" />
            </div>

            <div className="absolute bottom-1 right-4 flex items-center gap-1 opacity-20">
               <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
               <span className="text-[7px] font-black uppercase text-zinc-500 tracking-tighter">Verified Link</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PlayerBar;
