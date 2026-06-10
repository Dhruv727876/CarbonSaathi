import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAnalytics, logEvent } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'mock-key',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'mock-domain',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'mock-id',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'mock-bucket',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || 'mock-sender',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || 'mock-appid',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || 'mock-measureid'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
enableIndexedDbPersistence(db).catch((err) => { if (process.env.NODE_ENV !== "production") console.warn("Firebase persistence error:", err.code); });
export const analytics = getAnalytics(app);

export { doc, setDoc, getDoc };


/**
 * Handles silent anonymous authentication on boot and returns the user's uid.
 * @returns Promise<string> Resolves to user uid.
 */
export const initializeUserSession = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      if (user) {
        resolve(user.uid);
      } else {
        try {
          const credential = await signInAnonymously(auth);
          if (credential.user) {
            resolve(credential.user.uid);
          } else {
            reject(new Error('Failed to retrieve user from credentials'));
          }
        } catch (error) {
          reject(error);
        }
      }
    });
  });
};

export const logCarbonEvent = (eventName: string, params?: Record<string, unknown>): void => {
  if (analytics) logEvent(analytics, eventName, params);
};

export { logEvent };
