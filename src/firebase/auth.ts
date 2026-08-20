import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { ALLOWED_TEACHER_EMAILS } from '../lib/admin';

const provider = new GoogleAuthProvider();

export class UnauthorizedTeacherError extends Error {
  constructor() {
    super('UNAUTHORIZED_EMAIL');
  }
}

export async function signInTeacher(): Promise<User> {
  const result = await signInWithPopup(auth, provider);
  if (!result.user.email || !ALLOWED_TEACHER_EMAILS.includes(result.user.email)) {
    await signOut(auth);
    throw new UnauthorizedTeacherError();
  }
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
