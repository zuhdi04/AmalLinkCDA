import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  setDoc,
  arrayUnion,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import type { Program, ProgramQuestion, RegistrationInput } from '../types/program';

function normalizeEmail(value: string): string {
  return String(value || '').trim().toLowerCase();
}

export function formatBudget(amount?: number | null): string | null {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) return null;
  const value = Number(amount);
  return `RM ${value.toLocaleString('en-MY', { maximumFractionDigits: 2 })}`;
}

export function formatEventDate(dateStr?: string): string | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function mapProjectDoc(id: string, data: Record<string, unknown>): Program {
  return {
    id,
    title: (data.title as string) || '',
    venueName: (data.venueName as string) || '',
    venueAddress: (data.venueAddress as string) || '',
    eventDate: (data.eventDate as string) || '',
    status: (data.status as string) || 'Draft',
    targetBudget: typeof data.targetBudget === 'number' ? data.targetBudget : null,
    notes: (data.notes as string) || '',
    createdAt: (data.createdAt as string) || '',
    updatedAt: (data.updatedAt as string) || '',
  };
}

export async function fetchActivePrograms(): Promise<Program[]> {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase configuration is missing in .env.');
  }

  const projectsRef = collection(db, 'projects');

  // Attempt 1: Query by status == 'Open' (matches strict rules: resource.data.status == 'Open')
  try {
    const qOpen = query(projectsRef, where('status', '==', 'Open'));
    const snapshot = await getDocs(qOpen);
    if (!snapshot.empty) {
      return snapshot.docs
        .map((d) => mapProjectDoc(d.id, d.data()))
        .sort((a, b) => {
          if (a.eventDate && b.eventDate) return a.eventDate.localeCompare(b.eventDate);
          return (b.createdAt || '').localeCompare(a.createdAt || '');
        });
    }
  } catch {
    // Continue to next attempt
  }

  // Attempt 2: Query by status == 'Active' (matches status in ['Active'])
  try {
    const qActive = query(projectsRef, where('status', '==', 'Active'));
    const snapshot = await getDocs(qActive);
    if (!snapshot.empty) {
      return snapshot.docs
        .map((d) => mapProjectDoc(d.id, d.data()))
        .sort((a, b) => {
          if (a.eventDate && b.eventDate) return a.eventDate.localeCompare(b.eventDate);
          return (b.createdAt || '').localeCompare(a.createdAt || '');
        });
    }
  } catch {
    // Continue to next attempt
  }

  // Attempt 3: Fetch all projects if allowed by rule (allow read: if true)
  try {
    const allSnapshot = await getDocs(projectsRef);
    return allSnapshot.docs
      .map((d) => mapProjectDoc(d.id, d.data()))
      .filter((p) => {
        const s = (p.status || '').toLowerCase();
        return s === 'open' || s === 'active';
      })
      .sort((a, b) => {
        if (a.eventDate && b.eventDate) return a.eventDate.localeCompare(b.eventDate);
        return (b.createdAt || '').localeCompare(a.createdAt || '');
      });
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    if (error.code === 'permission-denied') {
      // If we got here and the first queries didn't return documents,
      // it means status == 'Open' returned 0 documents, and general read was denied.
      // So returning empty array [] is appropriate if the Open query succeeded with 0 docs!
      return [];
    }
    throw new Error(error.message || 'Could not load programs from Firestore.');
  }
}

export async function fetchProgramById(id: string): Promise<Program | null> {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase configuration is incomplete.');
  }

  const snapshot = await getDoc(doc(db, 'projects', id));
  if (!snapshot.exists()) return null;

  return mapProjectDoc(snapshot.id, snapshot.data());
}

export async function fetchProgramQuestions(projectId: string): Promise<ProgramQuestion[]> {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase configuration is incomplete.');
  }

  const questionsQuery = query(
    collection(db, 'questions'),
    where('projectId', '==', projectId)
  );

  const snapshot = await getDocs(questionsQuery);
  const questions: ProgramQuestion[] = snapshot.docs.map((item) => {
    const data = item.data();
    return {
      id: item.id,
      projectId: data.projectId,
      label: data.label || '',
      type: data.type || 'text',
      required: Boolean(data.required),
      options: data.options || '',
      order: Number(data.order) || 0,
    };
  });

  return questions.sort((a, b) => a.order - b.order);
}

export async function submitRegistration(input: RegistrationInput): Promise<{ ok: boolean; registrationId: string }> {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase configuration is incomplete.');
  }

  const name = input.volunteerName.trim();
  const email = normalizeEmail(input.volunteerEmail);
  const phone = input.phone.trim();

  if (!name) throw new Error('Please enter your full name.');
  if (!email || !email.includes('@')) throw new Error('Please enter a valid email address.');
  if (!phone) throw new Error('Please enter your phone number.');

  const registeredAt = new Date().toISOString();

  const registrationDoc = {
    projectId: input.projectId,
    volunteerName: name,
    volunteerEmail: email,
    phone,
    answers: input.answers || {},
    registeredAt,
  };

  const docRef = await addDoc(collection(db, 'registrations'), registrationDoc);

  // Sync volunteer document without blocking registration if permissions differ
  try {
    const volunteerRef = doc(db, 'volunteers', email);
    await setDoc(
      volunteerRef,
      {
        email,
        name,
        phone,
        lastRegisteredAt: registeredAt,
        projectIds: arrayUnion(input.projectId),
      },
      { merge: true }
    );
  } catch {
    // Non-fatal: volunteer directory sync can be recomputed by admin PWA
  }

  return { ok: true, registrationId: docRef.id };
}
