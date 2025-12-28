
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth } from './firebase';
import Header from './components/Header';
import PlayerBar from './components/PlayerBar';
import HomeView from './components/HomeView';
import ExploreView from './components/ExploreView';
import PlaylistView from './components/PlaylistView';
import ArtistsView from './components/ArtistsView';
import CreateEventView from './components/CreateEventView';
import EventModal from './components/EventModal';
import AuthView from './components/AuthView';
import ProfileView from './components/ProfileView';
import { ViewType, Playlist, Track } from './types';
import { MOCK_PLAYLISTS, MOCK_TRACKS } from './constants';
import { fetchAllEvents, createNewEvent, updateEvent, deleteEventFromDb } from './supabase';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.HOME);
  const [allTracks, setAllTracks] = useState<Track[]>(MOCK_TRACKS);
  const [queue, setQueue] = useState<Track[]>([]);
  const [bookedEventIds, setBookedEventIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [activeEvent, setActiveEvent] = useState<Track | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && firebaseUser.emailVerified) {
        setUser(firebaseUser);
        loadEvents();
      } else {
        setUser(null);
        setLoading(false);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const dbData = await fetchAllEvents();
      const dbTracks: Track[] = dbData.map((item: any) => ({
        id: `user-event-${item.id}`,
        artist: item.Organizer || item.organizer || 'Host',
        title: item.Title || item.title || 'Untitled Discovery',
        album: 'Live Experience',
        cover: item.Image || item.image || 'https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&q=80&w=1200',
        duration: '2:30:00',
        genre: item.Category || item.category || 'Live',
        dateTime: item.Date || item.date || '',
        location: item.Location || item.location || 'Global Hub',
        fullDescription: item.Description || item.description || 'Exclusive sonic flow experience.',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        organizer: {
          name: item.Organizer || item.organizer || 'Host',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(item.Organizer || item.organizer || 'user')}`,
          bio: 'Sonic Organizer'
        }
      }));
      setAllTracks([...dbTracks, ...MOCK_TRACKS]);
    } catch (err: any) {
      setError(err.message || 'Sync error');
      setAllTracks(MOCK_TRACKS);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackSelect = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const addToQueue = (track: Track) => {
    setQueue(prev => [...prev, track]);
  };

  const removeFromQueue = (index: number) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (queue.length > 0) {
      const nextTrack = queue[0];
      setQueue(prev => prev.slice(1));
      handleTrackSelect(nextTrack);
    } else {
      const idx = allTracks.findIndex(t => t.id === currentTrack?.id);
      if (idx !== -1 && idx < allTracks.length - 1) handleTrackSelect(allTracks[idx + 1]);
    }
  };

  const handlePrev = () => {
    const idx = allTracks.findIndex(t => t.id === currentTrack?.id);
    if (idx !== -1 && idx > 0) handleTrackSelect(allTracks[idx - 1]);
  };

  const handleSignOut = async () => {
    await signOut(auth);
    window.location.reload();
  };

  const handleCreateOrUpdateEvent = async (track: Track) => {
    const payload = { 
      Title: track.title, 
      Date: track.dateTime, 
      Location: track.location, 
      Organizer: track.artist, 
      Description: track.fullDescription, 
      Category: track.genre, 
      Image: track.cover 
    };
    
    setLoading(true);
    try {
      if (editingTrack) {
        await updateEvent(editingTrack.id.replace('user-event-', ''), payload);
        setEditingTrack(null);
      } else {
        await createNewEvent(payload);
      }
      await loadEvents();
      setCurrentView(ViewType.HOME);
      setIsEventModalOpen(false);
    } catch (err: any) {
      alert('Creation failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    setLoading(true);
    try {
      await deleteEventFromDb(id.replace('user-event-', ''));
      await loadEvents();
      setIsEventModalOpen(false);
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading && currentView === ViewType.HOME && allTracks.length === MOCK_TRACKS.length) {
      return (
        <div className="flex flex-col items-center justify-center h-[40vh] text-zinc-500 gap-4">
          <div className="w-10 h-10 border-2 border-[#E879F9] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em]">Linking Dimension</p>
        </div>
      );
    }

    switch (currentView) {
      case ViewType.HOME:
        return <HomeView tracks={allTracks} onPlaylistSelect={(p) => { setSelectedPlaylist(p); setCurrentView(ViewType.PLAYLIST_DETAIL); }} onTrackSelect={handleTrackSelect} onAddToQueue={addToQueue} onViewDetails={(t) => { setActiveEvent(t); setIsEventModalOpen(true); }} />;
      case ViewType.EXPLORE:
        return <ExploreView onTrackSelect={handleTrackSelect} onAddToQueue={addToQueue} />;
      case ViewType.PLAYLISTS:
        return <ArtistsView />;
      case ViewType.CREATE_EVENT:
        return <CreateEventView tracks={allTracks} editingTrack={editingTrack} onCreateEvent={handleCreateOrUpdateEvent} onDeleteEvent={handleDeleteEvent} onCancelEdit={() => { setEditingTrack(null); setCurrentView(ViewType.HOME); }} />;
      case ViewType.PROFILE:
        return <ProfileView createdEvents={allTracks.filter(t => t.id.startsWith('user-event-'))} bookedEvents={allTracks.filter(t => bookedEventIds.includes(t.id))} onSignOut={handleSignOut} />;
      case ViewType.PLAYLIST_DETAIL:
        return selectedPlaylist ? <PlaylistView playlist={selectedPlaylist} onTrackSelect={handleTrackSelect} onAddToQueue={addToQueue} currentTrackId={currentTrack?.id} /> : null;
      default:
        return <HomeView tracks={allTracks} onPlaylistSelect={() => {}} onTrackSelect={handleTrackSelect} onAddToQueue={addToQueue} onViewDetails={() => {}} />;
    }
  };

  if (authLoading) return null;
  if (!user) return <AuthView />;

  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] flex flex-col font-['Plus_Jakarta_Sans']">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 py-8 pb-40">
        {renderContent()}
      </main>
      <EventModal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} event={activeEvent} onDelete={handleDeleteEvent} onEdit={(t) => { setEditingTrack(t); setIsEventModalOpen(false); setCurrentView(ViewType.CREATE_EVENT); }} />
      <PlayerBar 
        currentTrack={currentTrack} 
        isPlaying={isPlaying} 
        queue={queue}
        onRemoveFromQueue={removeFromQueue}
        onPlayPause={() => setIsPlaying(!isPlaying)} 
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
};

export default App;
