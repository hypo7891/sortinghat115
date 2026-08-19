// Adversarial rules check against the running emulator. Not part of the app
// build — a one-off manual verification script.
process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';

import { initializeApp, deleteApp } from 'firebase/app';
import {
  getAuth,
  connectAuthEmulator,
  signInWithCustomToken,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  connectFirestoreEmulator,
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
} from 'firebase/firestore';
import { initializeApp as adminInitializeApp } from 'firebase-admin/app';
import { getAuth as adminGetAuth } from 'firebase-admin/auth';

const CLASS_ID = 'Odk07dgYK3qsKr4iwr7A'; // seeded class owned by seed-teacher-1

const app = initializeApp({ projectId: 'demo-sortinghat', apiKey: 'demo' });
const auth = getAuth(app);
const db = getFirestore(app);
connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
connectFirestoreEmulator(db, '127.0.0.1', 8080);

let pass = 0;
let fail = 0;
function report(name, ok, detail) {
  console.log(`${ok ? 'PASS' : 'FAIL'} — ${name}${detail ? `: ${detail}` : ''}`);
  ok ? pass++ : fail++;
}

// 1. Malformed submission (missing fields) should be rejected, unauthenticated.
try {
  await addDoc(collection(db, 'classes', CLASS_ID, 'submissions'), {
    studentDisplayName: 'hacker',
    houseAnswers: { a: 'A' }, // wrong size
  });
  report('malformed submission rejected', false, 'write unexpectedly succeeded');
} catch (e) {
  report('malformed submission rejected', e.code === 'permission-denied', e.code);
}

// 2. Valid-shaped submission with wrong-size mbtiAnswers should be rejected.
try {
  const houseAnswers = Object.fromEntries(
    Array.from({ length: 12 }, (_, i) => [`house-${i + 1}`, 'A']),
  );
  const mbtiAnswers = Object.fromEntries(
    Array.from({ length: 5 }, (_, i) => [`mbti-${i + 1}`, 'A']), // wrong size (needs 23)
  );
  await addDoc(collection(db, 'classes', CLASS_ID, 'submissions'), {
    studentDisplayName: 'hacker2',
    startedAt: new Date(),
    completedAt: new Date(),
    houseAnswers,
    mbtiAnswers,
    houseScores: { courage: 12, wisdom: 0, patience: 0, composure: 0 },
    primaryHouse: 'courage',
    secondaryHouse: 'wisdom',
    houseTie: false,
    mbtiType: 'ESTJ',
    mbtiAxisScores: {},
    mbtiAxisStrength: {},
  });
  report('wrong-size mbtiAnswers rejected', false, 'write unexpectedly succeeded');
} catch (e) {
  report('wrong-size mbtiAnswers rejected', e.code === 'permission-denied', e.code);
}

// 3. Unauthenticated read of another teacher's class submissions should be rejected.
try {
  await getDocs(collection(db, 'classes', CLASS_ID, 'submissions'));
  report('unauthenticated read rejected', false, 'read unexpectedly succeeded');
} catch (e) {
  report('unauthenticated read rejected', e.code === 'permission-denied', e.code);
}

// 4. A different teacher (not the class owner) should not be able to read.
const adminApp = adminInitializeApp({ projectId: 'demo-sortinghat' }, 'admin-for-token');
const adminAuth = adminGetAuth(adminApp);
const otherToken = await adminAuth.createCustomToken('seed-teacher-OTHER');
await signInWithCustomToken(auth, otherToken);
try {
  await getDocs(collection(db, 'classes', CLASS_ID, 'submissions'));
  report('other teacher read rejected', false, 'read unexpectedly succeeded');
} catch (e) {
  report('other teacher read rejected', e.code === 'permission-denied', e.code);
}

// 5. The owning teacher CAN read (sanity check the rules aren't just blocking everything).
await signOut(auth);
const ownerToken = await adminAuth.createCustomToken('seed-teacher-1');
await signInWithCustomToken(auth, ownerToken);
try {
  const snap = await getDocs(collection(db, 'classes', CLASS_ID, 'submissions'));
  report('owning teacher read allowed', snap.size >= 1, `size=${snap.size}`);
} catch (e) {
  report('owning teacher read allowed', false, e.code);
}

// 6. A valid submission from an unauthenticated "student" should succeed.
try {
  const houseAnswers = Object.fromEntries(
    Array.from({ length: 12 }, (_, i) => [`house-${i + 1}`, 'A']),
  );
  const mbtiAnswers = Object.fromEntries(
    Array.from({ length: 23 }, (_, i) => [`mbti-${i + 1}`, 'A']),
  );
  await signOut(auth);
  await addDoc(collection(db, 'classes', CLASS_ID, 'submissions'), {
    studentDisplayName: 'valid-student',
    startedAt: new Date(),
    completedAt: new Date(),
    houseAnswers,
    mbtiAnswers,
    houseScores: { courage: 12, wisdom: 0, patience: 0, composure: 0 },
    primaryHouse: 'courage',
    secondaryHouse: 'wisdom',
    houseTie: false,
    mbtiType: 'ESTJ',
    mbtiAxisScores: {},
    mbtiAxisStrength: {},
  });
  report('valid unauthenticated submission accepted', true);
} catch (e) {
  report('valid unauthenticated submission accepted', false, e.code);
}

console.log(`\n${pass} passed, ${fail} failed`);
await deleteApp(app);
process.exit(fail > 0 ? 1 : 0);
