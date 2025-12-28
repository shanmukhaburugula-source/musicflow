
import { db } from './firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';

/**
 * Note: This file is named 'supabase.ts' to match existing imports in App.tsx, 
 * but it uses Firebase Firestore as the backend service.
 */

export const fetchAllEvents = async () => {
  try {
    const q = query(collection(db, 'events'), orderBy('Date', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching events from Firestore:", error);
    return [];
  }
};

export const createNewEvent = async (event: any) => {
  try {
    return await addDoc(collection(db, 'events'), event);
  } catch (error) {
    console.error("Error creating event in Firestore:", error);
    throw error;
  }
};

export const updateEvent = async (id: string, event: any) => {
  try {
    const eventRef = doc(db, 'events', id);
    return await updateDoc(eventRef, event);
  } catch (error) {
    console.error("Error updating event in Firestore:", error);
    throw error;
  }
};

export const deleteEventFromDb = async (id: string) => {
  try {
    const eventRef = doc(db, 'events', id);
    return await deleteDoc(eventRef);
  } catch (error) {
    console.error("Error deleting event from Firestore:", error);
    throw error;
  }
};
