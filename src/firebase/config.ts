// Import the functions you need from the SDKs you need
import { Google } from '@mui/icons-material';
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  setPersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const app2 = initializeApp(firebaseConfig, 'Secondary');

const db = getFirestore(app);

const storage = getStorage(app);

const auth = getAuth(app);
const auth2 = getAuth(app2);

const provider = new GoogleAuthProvider();

// Create user
export const createUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth2,
      email,
      password
    );
    return userCredential;
  } catch (error: any) {
    console.log(`Error code: ${error.code}`);
    console.log(`Error message: ${error.message}`);
  }
};

export { auth, auth2, db, provider, storage };
