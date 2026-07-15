import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
} from 'firebase/firestore';
import { db } from './config';
import type { HouseId } from '../data/houseTypes';
import type { HouseAnswers } from '../lib/scoring/houseScoring';
import type { MbtiAnswers } from '../lib/scoring/mbtiScoring';
import type { MbtiAxis, MbtiPole } from '../data/mbtiQuestions';

export interface ClassDoc {
  id: string;
  teacherUid: string;
  className: string;
  joinCode: string;
  createdAt: Timestamp | null;
}

export interface SubmissionDoc {
  id: string;
  studentDisplayName: string;
  startedAt: Timestamp | null;
  completedAt: Timestamp | null;
  houseAnswers: HouseAnswers;
  mbtiAnswers: MbtiAnswers;
  houseScores: Record<HouseId, number>;
  primaryHouse: HouseId;
  secondaryHouse: HouseId;
  houseTie: boolean;
  mbtiType: string;
  mbtiAxisScores: Record<MbtiAxis, Record<MbtiPole, number>>;
  mbtiAxisStrength: Record<MbtiAxis, number>;
  gameScore: number;
  gameDominantElement: string;
}

function randomJoinCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

export async function createClass(
  teacherUid: string,
  className: string,
): Promise<{ classId: string; joinCode: string }> {
  const joinCode = randomJoinCode();
  const classRef = doc(collection(db, 'classes'));

  await setDoc(classRef, {
    teacherUid,
    className,
    joinCode,
    createdAt: serverTimestamp(),
  });
  await setDoc(doc(db, 'joinCodes', joinCode), {
    classId: classRef.id,
    teacherUid,
  });

  return { classId: classRef.id, joinCode };
}

export async function resolveJoinCode(
  code: string,
): Promise<{ classId: string } | null> {
  const snap = await getDoc(doc(db, 'joinCodes', code.trim().toUpperCase()));
  if (!snap.exists()) return null;
  return { classId: snap.data().classId as string };
}

export async function submitQuizResult(
  classId: string,
  payload: Omit<SubmissionDoc, 'id' | 'startedAt' | 'completedAt'> & {
    startedAt: number;
  },
) {
  await addDoc(collection(db, 'classes', classId, 'submissions'), {
    ...payload,
    startedAt: Timestamp.fromMillis(payload.startedAt),
    completedAt: serverTimestamp(),
  });
}

export function subscribeTeacherClasses(
  teacherUid: string,
  callback: (classes: ClassDoc[]) => void,
) {
  const q = query(collection(db, 'classes'), where('teacherUid', '==', teacherUid));
  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ClassDoc, 'id'>) })),
    );
  });
}

export function subscribeClassDoc(
  classId: string,
  callback: (klass: ClassDoc | null) => void,
) {
  return onSnapshot(doc(db, 'classes', classId), (snap) => {
    callback(snap.exists() ? { id: snap.id, ...(snap.data() as Omit<ClassDoc, 'id'>) } : null);
  });
}

export function subscribeClassSubmissions(
  classId: string,
  callback: (submissions: SubmissionDoc[]) => void,
) {
  const q = query(
    collection(db, 'classes', classId, 'submissions'),
    orderBy('completedAt', 'desc'),
  );
  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<SubmissionDoc, 'id'>) })),
    );
  });
}
