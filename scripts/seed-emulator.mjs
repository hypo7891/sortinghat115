// One-time manual-testing helper: seeds a teacher + class into the running
// Firebase emulator suite via firebase-admin (bypasses Firestore rules) and
// prints a custom auth token so the browser can sign in without a real
// Google popup. Not part of the app build.
process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';

import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

initializeApp({ projectId: 'demo-sortinghat' });
const db = getFirestore();
const auth = getAuth();

const TEACHER_UID = 'seed-teacher-1';
const CLASS_NAME = '七年三班（測試）';
const JOIN_CODE = 'TEST01';

await db.doc(`teachers/${TEACHER_UID}`).set({
  displayName: '測試老師',
  email: 'teacher@example.com',
  createdAt: FieldValue.serverTimestamp(),
});

const classRef = db.collection('classes').doc();
await classRef.set({
  teacherUid: TEACHER_UID,
  className: CLASS_NAME,
  joinCode: JOIN_CODE,
  createdAt: FieldValue.serverTimestamp(),
});
await db.doc(`joinCodes/${JOIN_CODE}`).set({
  classId: classRef.id,
  teacherUid: TEACHER_UID,
});

const customToken = await auth.createCustomToken(TEACHER_UID);

console.log(JSON.stringify({ classId: classRef.id, joinCode: JOIN_CODE, customToken }, null, 2));
