
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
  onClose?: () => void;
}

const PlayerBar: React.FC<PlayerBarProps> = ({ currentTrack, isPlaying, queue, onRemoveFromQueue, onPlayPause, onNext, onPrev, onClose }) => {
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [showVolume, setShowVolume] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false); // Default to expanded when a track is chosen
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  
  // Audio Visualizer State
  const [visualizerData, setVisualizerData] = useState<number[]>(new Array(16).fill(0));
  
  // Dragging State - Centered on bottom for visibility
  const [position, setPosition] = useState({ x: window.innerWidth / 2 - 160, y: window.innerHeight - 280 });
  const [isDragging, setIsDragging] = useState(false);
  
  const dragStartRef = useRef({ x: 0, y: 0 });
  const initialPosRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);
  const dragThreshold = 5;
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!audioRef.current || !isPlaying) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const initAudioContext = () => {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyserRef.current = audioCtxRef.current.createAnalyser();
        analyserRef.current.fftSize = 64;
        
        if (audioRef.current && !sourceRef.current) {
          sourceRef.current = audioCtxRef.current.createMediaElementSource(audioRef.current);
          sourceRef.current.connect(analyserRef.current);
          analyserRef.current.connect(audioCtxRef.current.destination);
        }
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const bufferLength = analyserRef.current!.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const update = () => {
        if (!analyserRef.current || !isPlaying) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        const sliced = Array.from(dataArray.slice(0, 16)).map(v => v / 255);
        setVisualizerData(sliced);
        animationFrameRef.current = requestAnimationFrame(update);
      };
      update();
    };

    initAudioContext();
    return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => ({
        x: Math.max(20, Math.min(prev.x, window.innerWidth - (isMinimized ? 80 : 340))),
        y: Math.max(20, Math.min(prev.y, window.innerHeight - (isMinimized ? 80 : 250)))
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMinimized]);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      if (isPlaying) { audioRef.current.play().catch(e => console.log('Autoplay', e)); }
      else { audioRef.current.pause(); }
    }
  }, [isPlaying, currentTrack]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) return;
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    initialPosRef.current = { x: position.x, y: position.y };
    if (containerRef.current) containerRef.current.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    if (!hasMovedRef.current && (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold)) hasMovedRef.current = true;
    if (hasMovedRef.current) {
      const targetX = initialPosRef.current.x + dx;
      const targetY = initialPosRef.current.y + dy;
      const playerWidth = isMinimized ? 64 : 320;
      const playerHeight = isMinimized ? 64 : 200;
      setPosition({
        x: Math.max(10, Math.min(targetX, window.innerWidth - playerWidth - 10)),
        y: Math.max(10, Math.min(targetY, window.innerHeight - playerHeight - 10))
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    if (containerRef.current) containerRef.current.releasePointerCapture(e.pointerId);
    if (!hasMovedRef.current) setIsMinimized(!isMinimized);
  };

  if (!currentTrack) return null;

  return (
    <div 
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)`, touchAction: 'none', position: 'fixed', left: 0, top: 0, zIndex: 9999 }}
      className={`flex flex-col items-end gap-3 select-none transition-shadow duration-300 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
    >
      <audio ref={audioRef} src={currentTrack.audioUrl} onTimeUpdate={() => audioRef.current && setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100)} onEnded={onNext} crossOrigin="anonymous" />

      {!isMinimized && isQueueOpen && (
        <div className="w-72 md:w-80 bg-[#0A0A0B]/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-5 shadow-2xl animate-in fade-in slide-in-from-bottom-4 max-h-[320px] overflow-hidden flex flex-col mb-1">
          <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
            <h3 className="text-white font-black text-[9px] uppercase tracking-[0.3em] flex items-center gap-2"><ListMusic size={14} className="text-[#E879F9]" /> Pipeline</h3>
            <button onClick={(e) => { e.stopPropagation(); setIsQueueOpen(false); }} className="text-zinc-500 hover:text-white transition-colors"><X size={14} /></button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide">
            {queue.map((track, idx) => (
              <div key={`${track.id}-${idx}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 group">
                <img src={track.cover} className="w-10 h-10 rounded-lg object-cover" alt="" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-[11px] font-bold truncate">{track.title}</h4>
                  <p className="text-zinc-500 text-[8px] font-black uppercase tracking-widest truncate">{track.artist}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); onRemoveFromQueue(idx); }} className="p-2 text-zinc-700 hover:text-red-500"><Trash2 size={12} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={`bg-[#0A0A0B]/95 backdrop-blur-3xl border border-white/10 rounded-[2.2rem] shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col transition-all duration-500 ease-out ${isMinimized ? 'w-16 h-16 p-0' : 'w-72 md:w-80 p-5'} ${isDragging ? 'scale-105' : 'scale-100'}`}>
        {isMinimized ? (
          <div className="w-full h-full relative pointer-events-none">
            <img src={currentTrack.cover} className="w-full h-full object-cover rounded-[2rem]" alt="" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40"><Play size={20} className="text-white ml-1" /></div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <img src={currentTrack.cover} className="w-11 h-11 rounded-xl object-cover shadow-lg border border-white/10 flex-shrink-0" alt="" />
                <div className="min-w-0">
                   <p className="text-[8px] font-black text-[#E879F9] uppercase tracking-[0.3em] mb-0.5">Frequency</p>
                   <h4 className="text-white text-[13px] font-bold truncate leading-tight">{currentTrack.title}</h4>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={(e) => { e.stopPropagation(); setIsQueueOpen(!isQueueOpen); }} className={`p-2 transition-all rounded-lg ${isQueueOpen ? 'text-[#E879F9] bg-[#E879F9]/10' : 'text-zinc-500 hover:text-white'}`}><ListMusic size={16} /></button>
                <button onClick={(e) => { e.stopPropagation(); onClose?.(); }} className="p-1.5 text-zinc-500 hover:text-white transition-colors"><X size={16} /></button>
              </div>
            </div>

            <div className="flex-1 flex items-end justify-between h-8 mb-4 px-2 gap-1 overflow-hidden">
               {visualizerData.map((val, i) => (
                 <div key={i} className="flex-1 rounded-full transition-all duration-75" style={{ height: `${val * 100}%`, minHeight: '2px', backgroundColor: `rgba(232, 121, 249, ${0.2 + val * 0.8})` }} />
               ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center gap-6 py-2">
                <button onClick={(e) => { e.stopPropagation(); onPrev?.(); }} className="text-zinc-500 hover:text-white"><SkipBack size={18} fill="currentColor" /></button>
                <button onClick={(e) => { e.stopPropagation(); onPlayPause(); }} className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 shadow-xl">{isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-1" />}</button>
                <button onClick={(e) => { e.stopPropagation(); onNext?.(); }} className="text-zinc-500 hover:text-white"><SkipForward size={18} fill="currentColor" /></button>
              </div>
              <input type="range" min="0" max="100" step="0.1" value={progress} onChange={(e) => { if (audioRef.current) audioRef.current.currentTime = (parseFloat(e.target.value) / 100) * audioRef.current.duration; }} onPointerDown={(e) => e.stopPropagation()} className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#E879F9]" />
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <Heart size={16} className="text-zinc-600 hover:text-red-500 cursor-pointer" />
                <div className="flex items-center gap-2">
                  <Volume2 size={16} className="text-zinc-600" />
                  <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} onPointerDown={(e) => e.stopPropagation()} className="w-16 h-1 bg-white/10 rounded-full appearance-none accent-white" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerBar;
