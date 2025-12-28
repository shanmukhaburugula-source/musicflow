
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAW_pzdvpqVifV7ZJ_U-Oiw3gGjKU3-GKg",
  authDomain: "musixflow-a4297.firebaseapp.com",
  projectId: "musixflow-a4297",
  storageBucket: "musixflow-a4297.firebasestorage.app",
  messagingSenderId: "761608202004",
  appId: "1:761608202004:web:bdcf7591eaa446a9ffc401",
  measurementId: "G-FR6TFXCVFS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
