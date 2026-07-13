import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from './config';

const provider = new GoogleAuthProvider();

export async function signInTeacher(): Promise<User> {
  const result = await signInWithPopup(auth, provider);
  await setDoc(
    doc(db, 'teachers', result.user.uid),
    {
      displayName: result.user.displayName ?? '',
      email: result.user.email ?? '',
      createdAt: serverTimestamp(),
    },
    { merge: true },
  );
  return result.user;
}

export function signOutTeacher() {
  return signOut(auth);
}

export function subscribeAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
