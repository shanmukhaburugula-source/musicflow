
import { db } from './firebase';
import { 
  collection, 
  getDocs, 
  getDoc,
  setDoc,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  where,
  serverTimestamp,
  Timestamp,
  writeBatch,
  limit
} from 'firebase/firestore';
import { ArtistProfile, Track } from './types';

export const syncArtistProfile = async (user: any) => {
  if (!user) return;
  try {
    const artistRef = doc(db, 'artists', user.uid);
    const artistSnap = await getDoc(artistRef);
    if (!artistSnap.exists()) {
      const newArtist = {
        uid: user.uid,
        name: user.displayName || 'Unnamed Artist',
        email: user.email || '',
        profilePhoto: user.photoURL || '',
        createdAt: serverTimestamp()
      };
      await setDoc(artistRef, newArtist);
    }
  } catch (error) {
    console.error("Error syncing artist profile:", error);
  }
};

export const getArtistProfile = async (uid: string): Promise<ArtistProfile | null> => {
  try {
    const artistRef = doc(db, 'artists', uid);
    const artistSnap = await getDoc(artistRef);
    return artistSnap.exists() ? (artistSnap.data() as ArtistProfile) : null;
  } catch (error) {
    console.error("Error getting artist profile:", error);
    return null;
  }
};

const toTimestamp = (dateStr: string) => {
  if (!dateStr) return serverTimestamp();
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? serverTimestamp() : Timestamp.fromDate(date);
};

/**
 * Fetch Public Events for Discover Feed
 * Removed orderBy to avoid index requirement
 */
export const fetchPublicEvents = async () => {
  try {
    const q = query(
      collection(db, 'events'), 
      where('isPublic', '==', true)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  } catch (error) {
    console.error("Public fetch failed:", error);
    return [];
  }
};

/**
 * Fetch Events for specific Artist Dashboard
 */
export const fetchArtistEvents = async (uid: string) => {
  try {
    const q = query(
      collection(db, 'events'), 
      where('artistId', '==', uid)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  } catch (error) {
    console.error("Artist fetch failed:", error);
    return [];
  }
};

export const createNewEvent = async (event: any) => {
  try {
    const payload = {
      eventName: event.eventName,
      artistName: event.artistName,
      artistEmail: event.artistEmail,
      artistId: event.artistId,
      songOrTourName: event.songOrTourName,
      date: toTimestamp(event.date),
      time: event.time || '20:00',
      location: event.location,
      description: event.description,
      genre: event.genre,
      image: event.image || '',
      isPublic: event.isPublic ?? true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    return await addDoc(collection(db, 'events'), payload);
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

export const updateEvent = async (id: string, event: any) => {
  try {
    const eventRef = doc(db, 'events', id);
    const payload = {
      ...event,
      date: event.date ? toTimestamp(event.date) : undefined,
      updatedAt: serverTimestamp()
    };
    return await updateDoc(eventRef, payload);
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

export const deleteEventFromDb = async (id: string) => {
  try {
    const eventRef = doc(db, 'events', id);
    return await deleteDoc(eventRef);
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

export const seedInitialData = async (user: any, mockTracks: Track[]) => {
  if (!user) return;
  try {
    const existing = await getDocs(query(collection(db, 'events'), limit(1)));
    if (!existing.empty) return;
    const batch = writeBatch(db);
    mockTracks.forEach((track) => {
      const ref = doc(collection(db, 'events'));
      batch.set(ref, {
        eventName: track.title,
        artistName: track.artist,
        artistEmail: user.email || 'system@musicflow.com',
        artistId: user.uid,
        songOrTourName: track.album || 'Live Experience',
        date: toTimestamp(track.dateTime?.split('T')[0] || ''),
        time: track.dateTime?.split('T')[1] || '20:00',
        location: track.location || 'Global Hub',
        description: track.fullDescription || 'Exclusive sonic flow experience.',
        genre: track.genre || 'Electronic',
        image: track.cover,
        isPublic: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    });
    await batch.commit();
  } catch (error) {
    console.error("Error seeding dimension:", error);
  }
};
