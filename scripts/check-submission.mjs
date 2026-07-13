process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
initializeApp({ projectId: 'demo-sortinghat' });
const db = getFirestore();
const snap = await db.collectionGroup('submissions').get();
snap.forEach((d) => console.log(JSON.stringify({ id: d.id, path: d.ref.path, ...d.data() }, null, 2)));
console.log('count:', snap.size);
