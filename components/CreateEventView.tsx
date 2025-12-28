
import React, { useState, useRef, useEffect } from 'react';
import { auth } from '../firebase';
import { Track } from '../types';
import { Upload, MapPin, Calendar as CalendarIcon, Type, Star, Trash2, Plus, Save, Clock, Disc, Globe, Lock } from 'lucide-react';

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
  const user = auth.currentUser;
  
  const [formData, setFormData] = useState({
    title: '',
    album: '',
    date: '',
    time: '',
    location: '',
    genre: '',
    cover: '',
    fullDescription: '',
    isPublic: true
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (editingTrack) {
      setFormData({
        title: editingTrack.title,
        album: editingTrack.album || '',
        date: editingTrack.dateTime?.split('T')[0] || '',
        time: editingTrack.time || '',
        location: editingTrack.location || '',
        genre: editingTrack.genre || '',
        cover: editingTrack.cover,
        fullDescription: editingTrack.fullDescription || '',
        isPublic: editingTrack.isPublic ?? true
      });
      setPreviewImage(editingTrack.cover);
      setActiveTab('create');
    }
  }, [editingTrack]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !user) return;

    const eventToSave: Track = {
      id: editingTrack ? editingTrack.id : `user-event-${Date.now()}`,
      artist: user.displayName || 'Artist',
      title: formData.title,
      album: formData.album || 'Live Performance',
      cover: formData.cover || 'https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&q=80&w=1200',
      duration: '2:30:00',
      genre: formData.genre,
      dateTime: `${formData.date}T${formData.time}`,
      time: formData.time,
      location: formData.location,
      fullDescription: formData.fullDescription,
      isPublic: formData.isPublic,
      source: 'firestore'
    };

    onCreateEvent(eventToSave);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  return (
    <div className="max-w-4xl mx-auto py-12 animate-in fade-in duration-700">
      <div className="text-center mb-10">
        <h2 className="text-5xl font-black text-white mb-8 uppercase tracking-tighter">
          {editingTrack ? 'Edit Broadcast' : 'Launch Dimension'}
        </h2>
        
        <div className="flex items-center justify-center p-1 bg-white/5 border border-white/10 rounded-xl w-fit mx-auto mb-8">
          <button onClick={() => setActiveTab('create')} className={`px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${activeTab === 'create' ? 'bg-[#E879F9] text-white' : 'text-zinc-500'}`}>New</button>
          <button onClick={() => setActiveTab('manage')} className={`px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${activeTab === 'manage' ? 'bg-[#E879F9] text-white' : 'text-zinc-500'}`}>Manage</button>
        </div>
      </div>

      {activeTab === 'create' ? (
        <form onSubmit={handleSubmit} className="bg-[#0A0A0B]/80 backdrop-blur-xl border border-white/5 rounded-[3rem] p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#E879F9]">Event Name</label>
                <input type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="e.g. Midnight Flow" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-[#E879F9] outline-none" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#E879F9]">Tour / Album Name</label>
                <input type="text" name="album" required value={formData.album} onChange={handleChange} placeholder="e.g. SOS Tour" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-[#E879F9] outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#E879F9]">Date</label>
                  <input type="date" name="date" required value={formData.date} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white [color-scheme:dark]" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#E879F9]">Time</label>
                  <input type="time" name="time" required value={formData.time} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white [color-scheme:dark]" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#E879F9]">Visibility Settings</label>
                <label className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-3">
                    {formData.isPublic ? <Globe size={18} className="text-[#22D3EE]" /> : <Lock size={18} className="text-zinc-500" />}
                    <span className="text-[11px] font-bold text-white uppercase tracking-wider">Publish to Public Dimension</span>
                  </div>
                  <input type="checkbox" name="isPublic" checked={formData.isPublic} onChange={handleChange} className="w-5 h-5 accent-[#E879F9]" />
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#E879F9]">Location</label>
                <input type="text" name="location" required value={formData.location} onChange={handleChange} placeholder="Venue or City" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-[#E879F9] outline-none" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#E879F9]">Description</label>
                <textarea name="fullDescription" rows={3} required value={formData.fullDescription} onChange={handleChange} placeholder="Experience details..." className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-[#E879F9] outline-none resize-none" />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            {editingTrack && <button type="button" onClick={onCancelEdit} className="flex-1 py-5 border border-white/10 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest">Cancel</button>}
            <button type="submit" className="flex-[2] py-5 bg-[#E879F9] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] shadow-xl transition-all">
              {editingTrack ? 'Save Broadcast' : 'Launch Broadcast'}
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tracks.length > 0 ? tracks.map(event => (
            <div key={event.id} className="bg-[#0A0A0B] border border-white/5 rounded-[2rem] p-5 flex items-center gap-5 group hover:border-[#E879F9]/30 transition-all">
              <img src={event.cover} className="w-20 h-20 rounded-2xl object-cover" alt="" />
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-bold text-lg truncate uppercase tracking-tighter">{event.title}</h4>
                <div className="flex items-center gap-2 mt-2">
                   {event.isPublic ? <Globe size={12} className="text-[#22D3EE]" /> : <Lock size={12} className="text-zinc-600" />}
                   <span className="text-zinc-500 text-[9px] font-black uppercase tracking-widest">{event.isPublic ? 'Public' : 'Private'}</span>
                </div>
              </div>
              <button onClick={() => onDeleteEvent(event.id)} className="p-4 bg-red-500/10 text-red-500 rounded-2xl opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={20} /></button>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center text-zinc-600 font-black uppercase tracking-widest bg-white/[0.01] rounded-[3rem] border border-dashed border-white/5">No dimensions launched</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateEventView;
