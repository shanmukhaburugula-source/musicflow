
import React, { useState, useEffect, useMemo } from 'react';
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
import { MOCK_PLAYLISTS, STATIC_UI_EVENTS } from './constants';
import { fetchPublicEvents, fetchArtistEvents, createNewEvent, updateEvent, deleteEventFromDb, syncArtistProfile } from './supabase';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.HOME);
  const [publicTracks, setPublicTracks] = useState<Track[]>([]);
  const [artistTracks, setArtistTracks] = useState<Track[]>([]);
  const [queue, setQueue] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  
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
        await syncArtistProfile(firebaseUser);
        await loadEvents(firebaseUser.uid);
      } else {
        setUser(null);
        await loadEvents();
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const mapFirestoreToTrack = (item: any): Track => {
    let datePart = '';
    if (item.date && typeof item.date.toDate === 'function') {
      datePart = item.date.toDate().toISOString().split('T')[0];
    } else if (item.date instanceof Date) {
      datePart = item.date.toISOString().split('T')[0];
    } else {
      datePart = String(item.date || '');
    }

    const dateTimeStr = datePart ? `${datePart}T${item.time || '20:00'}` : '2025-01-01T20:00';

    return {
      id: item.id,
      artist: item.artistName || 'Artist',
      title: item.eventName || 'Untitled Discovery',
      album: item.songOrTourName || 'Live Experience',
      cover: item.image || 'https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&q=80&w=1200',
      duration: '2:30:00',
      genre: item.genre || 'Live',
      dateTime: dateTimeStr,
      time: item.time || '20:00',
      location: item.location || 'Global Hub',
      fullDescription: item.description || 'Exclusive sonic flow experience.',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      ticketPrice: item.ticketPrice || 'Free',
      artistId: item.artistId || '',
      isPublic: item.isPublic ?? true,
      source: 'firestore',
      organizer: {
        name: item.artistName || 'Host',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(item.artistId || 'user')}`,
        bio: 'Sonic Organizer'
      }
    };
  };

  const loadEvents = async (uid?: string) => {
    setLoading(true);
    try {
      const publicDbData = await fetchPublicEvents();
      const publicFirestoreEvents = publicDbData.map(mapFirestoreToTrack);
      setPublicTracks([...STATIC_UI_EVENTS, ...publicFirestoreEvents]);

      if (uid) {
        const artistDbData = await fetchArtistEvents(uid);
        setArtistTracks(artistDbData.map(mapFirestoreToTrack));
      }
    } catch (err) {
      console.error("Load events failed:", err);
      setPublicTracks(STATIC_UI_EVENTS);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackSelect = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handlePlayerClose = () => {
    setCurrentTrack(null);
    setIsPlaying(false);
  };

  const renderContent = () => {
    if (loading && currentView === ViewType.HOME && publicTracks.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-[40vh] text-zinc-500 gap-4">
          <div className="w-10 h-10 border-2 border-[#E879F9] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em]">Linking Dimension</p>
        </div>
      );
    }

    switch (currentView) {
      case ViewType.HOME:
        return <HomeView tracks={publicTracks} onPlaylistSelect={(p) => { setSelectedPlaylist(p); setCurrentView(ViewType.PLAYLIST_DETAIL); }} onTrackSelect={handleTrackSelect} onAddToQueue={(t) => setQueue(q => [...q, t])} onViewDetails={(t) => { setActiveEvent(t); setIsEventModalOpen(true); }} />;
      case ViewType.EXPLORE:
        return <ExploreView publicEvents={publicTracks} onTrackSelect={handleTrackSelect} onAddToQueue={(t) => setQueue(q => [...q, t])} />;
      case ViewType.CREATE_EVENT:
        return <CreateEventView tracks={artistTracks} editingTrack={editingTrack} onCreateEvent={async (t) => {
            const payload = { 
              eventName: t.title, description: t.fullDescription, date: t.dateTime?.split('T')[0] || '',
              time: t.time || '20:00', location: t.location, isPublic: t.isPublic,
              artistId: user?.uid, artistName: user?.displayName || 'Artist',
              artistEmail: user?.email || '', songOrTourName: t.album || 'Single',
              genre: t.genre || 'Electronic', image: t.cover 
            };
            setLoading(true);
            try {
              if (editingTrack) { await updateEvent(editingTrack.id, payload); setEditingTrack(null); }
              else { await createNewEvent(payload); }
              await loadEvents(user?.uid);
              setCurrentView(ViewType.HOME);
            } catch (err) { alert('Sync failed'); } finally { setLoading(false); }
        }} onDeleteEvent={async (id) => { if(confirm('Delete?')) { await deleteEventFromDb(id); loadEvents(user?.uid); } }} onCancelEdit={() => { setEditingTrack(null); setCurrentView(ViewType.HOME); }} />;
      case ViewType.PROFILE:
        return <ProfileView createdEvents={artistTracks} bookedEvents={[]} onSignOut={async () => { await signOut(auth); setUser(null); setCurrentView(ViewType.HOME); }} />;
      case ViewType.PLAYLIST_DETAIL:
        return selectedPlaylist ? <PlaylistView playlist={selectedPlaylist} onTrackSelect={handleTrackSelect} onAddToQueue={(t) => setQueue(q => [...q, t])} currentTrackId={currentTrack?.id} /> : null;
      default:
        return <HomeView tracks={publicTracks} onPlaylistSelect={() => {}} onTrackSelect={handleTrackSelect} onAddToQueue={() => {}} onViewDetails={() => {}} />;
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
      <EventModal 
        isOpen={isEventModalOpen} 
        onClose={() => setIsEventModalOpen(false)} 
        event={activeEvent} 
        onDelete={async (id) => { if(confirm('Delete event?')) { await deleteEventFromDb(id); loadEvents(user?.uid); setIsEventModalOpen(false); }}} 
        onEdit={(t) => { setEditingTrack(t); setIsEventModalOpen(false); setCurrentView(ViewType.CREATE_EVENT); }} 
      />
      <PlayerBar 
        currentTrack={currentTrack} 
        isPlaying={isPlaying} 
        queue={queue}
        onRemoveFromQueue={(idx) => setQueue(prev => prev.filter((_, i) => i !== idx))}
        onPlayPause={() => setIsPlaying(!isPlaying)} 
        onClose={handlePlayerClose}
      />
    </div>
  );
};

export default App;
