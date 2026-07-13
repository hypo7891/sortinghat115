import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, signInWithCustomToken } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';

// Values come from Vite env vars (see .env.example). For local development
// against the Firebase emulator suite, placeholder values are fine — the
// emulator doesn't validate them.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? 'demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? 'demo-sortinghat',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? 'demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '000000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '0:000000000000:web:0000000000000000000000',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATORS !== 'false') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  // Dev-only hook so manual/scripted emulator testing can drive sign-in
  // (e.g. signInWithCustomToken) without a real Google popup. Stripped from
  // production builds since import.meta.env.DEV is statically false there.
  (
    window as unknown as {
      __auth: typeof auth;
      __signInWithCustomToken: typeof signInWithCustomToken;
    }
  ).__auth = auth;
  (
    window as unknown as { __signInWithCustomToken: typeof signInWithCustomToken }
  ).__signInWithCustomToken = signInWithCustomToken;
}
