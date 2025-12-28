
import React, { useEffect, useState } from 'react';
import { X, Calendar, MapPin, Heart, CheckCircle2, Trash2, Edit3 } from 'lucide-react';
import { Track } from '../types';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Track | null;
  onDelete?: (eventId: string) => void;
  onEdit?: (event: Track) => void;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, event, onDelete, onEdit }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen && !isVisible) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!event) return null;

  const isUserEvent = event.id.startsWith('user-event-');

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 transition-all duration-300 ease-out ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-xl" />

      <div 
        className={`relative w-full max-w-5xl max-h-[90vh] bg-[#0F0F12] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl transition-all duration-300 transform ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'
        }`}
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 z-20 p-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl transition-all"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col md:flex-row h-full overflow-y-auto md:overflow-hidden">
          
          <div className="md:w-5/12 relative min-h-[400px] md:min-h-0">
            <img 
              src={event.cover} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="md:w-7/12 p-8 md:p-14 md:overflow-y-auto custom-scrollbar flex flex-col bg-zinc-900/20">
            <div className="mb-10">
              <span className="inline-block bg-[#E879F9]/10 text-[#E879F9] border border-[#E879F9]/20 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest mb-6">
                {event.genre || 'Live Event'}
              </span>
              <h2 id="modal-title" className="text-5xl md:text-6xl font-bold text-white leading-tight mb-8">
                {event.title}
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-[#E879F9]">
                    <Calendar size={22} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Schedule</span>
                    <span className="text-base text-white font-medium">
                      {event.dateTime?.replace('T', ' ') || 'TBA'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-[#E879F9]">
                    <MapPin size={22} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Venue</span>
                    <span className="text-base text-white font-medium">{event.location || 'Announced Soon'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">The Experience</h3>
              <p className="text-zinc-400 text-lg leading-relaxed font-medium">
                {event.fullDescription || 'An extraordinary musical journey awaits. Be part of a unique performance that blends high-fidelity sound with captivating storytelling.'}
              </p>
            </div>

            {event.organizer && (
              <div className="mb-12 p-6 bg-white/5 border border-white/5 rounded-3xl flex items-center gap-5">
                <img src={event.organizer.avatar} alt={event.organizer.name} className="w-16 h-16 rounded-2xl object-cover" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-bold">{event.organizer.name}</h4>
                    <CheckCircle2 size={16} className="text-[#10B981]" />
                  </div>
                  <p className="text-zinc-500 text-sm mt-1">{event.organizer.bio}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-auto pt-8 flex items-center gap-4 border-t border-white/10">
              {isUserEvent ? (
                <>
                  <button 
                    onClick={() => onEdit?.(event)}
                    className="flex-1 bg-white/5 border border-white/10 text-white py-5 rounded-2xl font-bold text-base hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                  >
                    <Edit3 size={18} /> Edit Experience
                  </button>
                  <button 
                    onClick={() => onDelete?.(event.id)}
                    className="flex-1 bg-red-500/10 border border-red-500/20 text-red-500 py-5 rounded-2xl font-bold text-base hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 size={18} /> Delete
                  </button>
                </>
              ) : (
                <>
                  <button className="flex-1 bg-white/5 border border-white/10 text-white py-5 rounded-2xl font-bold text-base hover:bg-white/10 transition-all">
                    Share Event
                  </button>
                  <button className="p-5 bg-white/5 border border-white/10 text-[#E879F9] rounded-2xl hover:bg-[#E879F9]/10 transition-all">
                    <Heart size={24} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
