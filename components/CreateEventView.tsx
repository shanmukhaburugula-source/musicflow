
import React, { useState, useRef, useEffect } from 'react';
import { Track } from '../types';
import { Sparkles, Upload, Music, MapPin, Calendar as CalendarIcon, Type, Star, Trash2, LayoutGrid, Plus, X, Save, Clock } from 'lucide-react';

interface CreateEventViewProps {
  tracks: Track[];
  editingTrack: Track | null;
  onCreateEvent: (event: Track) => void;
  onDeleteEvent: (eventId: string) => void;
  onCancelEdit: () => void;
}

const CreateEventView: React.FC<CreateEventViewProps> = ({ tracks, editingTrack, onCreateEvent, onDeleteEvent, onCancelEdit }) => {
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    artist: '',
    title: '',
    dateTime: '',
    location: '',
    genre: '',
    cover: '',
    fullDescription: ''
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (editingTrack) {
      setFormData({
        artist: editingTrack.artist,
        title: editingTrack.title,
        dateTime: editingTrack.dateTime || '',
        location: editingTrack.location || '',
        genre: editingTrack.genre || '',
        cover: editingTrack.cover,
        fullDescription: editingTrack.fullDescription || ''
      });
      setPreviewImage(editingTrack.cover);
      setActiveTab('create');
    }
  }, [editingTrack]);

  const resizeImage = (base64Str: string, maxWidth = 600, maxHeight = 600): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const optimizedImage = await resizeImage(base64String);
        setFormData(prev => ({ ...prev, cover: optimizedImage }));
        setPreviewImage(optimizedImage);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, cover: '' }));
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.artist || !formData.title) return;

    const eventToSave: Track = {
      id: editingTrack ? editingTrack.id : `user-event-${Date.now()}`,
      artist: formData.artist,
      title: formData.title,
      album: 'Live Performance',
      cover: formData.cover || 'https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&q=80&w=1200',
      duration: '2:30:00',
      genre: formData.genre,
      dateTime: formData.dateTime,
      location: formData.location,
      fullDescription: formData.fullDescription,
      organizer: {
        name: 'You (Host)',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
        bio: 'Event Host'
      }
    };

    onCreateEvent(eventToSave);
    setFormData({ artist: '', title: '', dateTime: '', location: '', genre: '', cover: '', fullDescription: '' });
    setPreviewImage(null);
    if (!editingTrack) setActiveTab('manage');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const userEvents = tracks.filter(t => t.id.startsWith('user-event-'));

  return (
    <div className="max-w-4xl mx-auto py-6 md:py-12 animate-in fade-in zoom-in-95 duration-700 relative z-10">
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6 uppercase">
          {editingTrack ? 'Edit Event' : 'Create Event'}
        </h2>
        
        {!editingTrack && (
          <div className="flex items-center justify-center p-1 bg-white/5 border border-white/10 rounded-xl w-fit mx-auto backdrop-blur-md mb-8">
            <button 
              onClick={() => setActiveTab('create')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'create' ? 'bg-[#E879F9] text-white' : 'text-zinc-500 hover:text-white'}`}
            >
              New
            </button>
            <button 
              onClick={() => setActiveTab('manage')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'manage' ? 'bg-[#E879F9] text-white' : 'text-zinc-500 hover:text-white'}`}
            >
              Manage
            </button>
          </div>
        )}
      </div>

      {activeTab === 'create' ? (
        <form onSubmit={handleSubmit} className="bg-[#0A0A0B]/80 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#E879F9]">
                  <Music size={12} /> Artist
                </label>
                <input
                  type="text"
                  name="artist"
                  required
                  value={formData.artist}
                  onChange={handleChange}
                  placeholder="Artist Name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-zinc-700 focus:outline-none focus:border-[#E879F9] transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#E879F9]">
                  <Type size={12} /> Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Event Title"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-zinc-700 focus:outline-none focus:border-[#E879F9] transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#E879F9]">
                  <CalendarIcon size={12} /> When
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    name="dateTime"
                    value={formData.dateTime}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-[#E879F9] transition-all [color-scheme:dark] text-sm appearance-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#E879F9]">
                  <MapPin size={12} /> Where
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Venue Location"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-zinc-700 focus:outline-none focus:border-[#E879F9] transition-all text-sm"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#E879F9]">
                  <Upload size={12} /> Upload Image
                </label>
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative group h-[140px] bg-white/5 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all hover:border-[#E879F9]/50 ${previewImage ? 'border-solid border-[#E879F9]' : ''}`}
                >
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                  
                  {previewImage ? (
                    <>
                      <img src={previewImage} className="w-full h-full object-cover" alt="Preview" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-[9px] font-black uppercase tracking-widest">Change</span>
                      </div>
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeImage(); }}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-lg text-white hover:bg-red-500 transition-all"
                      >
                        <X size={12} />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-zinc-600 group-hover:text-[#E879F9] transition-colors">
                      <Upload size={20} />
                      <p className="font-bold text-[10px] uppercase tracking-widest">Select Artwork</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#E879F9]">
                  <Star size={12} /> Genre
                </label>
                <input
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  placeholder="e.g. Pop"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-zinc-700 focus:outline-none focus:border-[#E879F9] transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#E879F9]">
                  Description
                </label>
                <textarea
                  name="fullDescription"
                  rows={2}
                  value={formData.fullDescription}
                  onChange={handleChange}
                  placeholder="Short event summary"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-zinc-700 focus:outline-none focus:border-[#E879F9] transition-all text-sm resize-none"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            {editingTrack && (
                <button
                    type="button"
                    onClick={onCancelEdit}
                    className="flex-1 border border-white/10 text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all"
                >
                    Cancel
                </button>
            )}
            <button
                type="submit"
                className="flex-[2] bg-[#E879F9] text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
                {editingTrack ? <><Save size={16} /> Save</> : <><Plus size={16} /> Create</>}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {userEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userEvents.map(event => (
                <div key={event.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 group hover:border-[#E879F9]/30 transition-all">
                  <img src={event.cover} className="w-16 h-16 rounded-xl object-cover" alt="" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold text-sm truncate">{event.title}</h4>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase truncate">{event.artist}</p>
                    <p className="text-[#E879F9] text-[9px] font-black uppercase mt-1">
                      {event.dateTime?.replace('T', ' ') || 'TBD'}
                    </p>
                  </div>
                  <button 
                    onClick={() => onDeleteEvent(event.id)}
                    className="p-3 rounded-lg bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#0A0A0B]/80 border border-white/5 rounded-[2.5rem] p-16 text-center flex flex-col items-center justify-center space-y-4">
              <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">No events found</p>
              <button 
                onClick={() => setActiveTab('create')}
                className="px-6 py-2 bg-white/5 text-white text-[10px] font-black uppercase rounded-lg border border-white/10 hover:bg-[#E879F9]"
              >
                Create One
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateEventView;
