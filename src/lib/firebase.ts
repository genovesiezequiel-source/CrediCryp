import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged, 
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  onSnapshot, 
  serverTimestamp, 
  getDocFromServer,
  runTransaction
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Error Handler helper
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
  AUTH = 'auth'
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const message = error instanceof Error ? error.message : String(error);
  const errInfo: FirestoreErrorInfo = {
    error: message,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  const jsonError = JSON.stringify(errInfo);
  console.error('Firestore Error: ', jsonError);
  throw new Error(jsonError);
}

// User Profile Service
export interface UserProfile {
  nombre: string;
  apellido: string;
  dni: string; // This is the document number
  documentType?: string; // DNI or PASSPORT
  email: string;
  whatsapp?: string;
  pais?: string;
  codPostal?: string;
  role: 'user' | 'admin';
  limitValue?: number; // Randomly assigned limit (750-1500)
  createdAt: any;
  updatedAt: any;
}

/**
 * Checks if a DNI or WhatsApp is already registered.
 * Uses specific collections for unique indexing.
 */
export async function checkUniqueness(field: 'dni' | 'whatsapp', value: string): Promise<boolean> {
  const normalizedValue = value.trim().toLowerCase();
  const docRef = doc(db, `registry_${field}`, normalizedValue);
  const snap = await getDoc(docRef);
  return !snap.exists();
}

export async function saveUserProfile(uid: string, profile: Omit<UserProfile, 'createdAt' | 'updatedAt'>) {
    try {
        await runTransaction(db, async (transaction) => {
            const userDoc = doc(db, 'users', uid);
            const dniDoc = doc(db, 'registry_dni', profile.dni.trim().toLowerCase());
            const whatsappDoc = profile.whatsapp ? doc(db, 'registry_whatsapp', profile.whatsapp.trim().toLowerCase()) : null;

            // Check if DNI taken
            const dniSnap = await transaction.get(dniDoc);
            if (dniSnap.exists()) {
              const existingData = dniSnap.data();
              if (existingData.uid !== uid) throw new Error('DNI_EXISTS');
            }

            // Check if Whatsapp taken
            if (whatsappDoc) {
                const waSnap = await transaction.get(whatsappDoc);
                if (waSnap.exists()) {
                  const existingData = waSnap.data();
                  if (existingData.uid !== uid) throw new Error('WHATSAPP_EXISTS');
                }
            }

            // Write all
            const profileData = {
                ...profile,
                email: profile.email.trim(),
                updatedAt: serverTimestamp(),
            };
            
            const userSnap = await transaction.get(userDoc);
            if (!userSnap.exists()) {
                transaction.set(userDoc, {
                    ...profileData,
                    createdAt: serverTimestamp(),
                });
            } else {
                // If it exists, we don't overwrite createdAt
                transaction.update(userDoc, profileData);
            }
            
            transaction.set(dniDoc, { uid });
            if (whatsappDoc) transaction.set(whatsappDoc, { uid });
        });
    } catch (error) {
        if (error instanceof Error && (error.message === 'DNI_EXISTS' || error.message === 'WHATSAPP_EXISTS')) {
            throw error;
        }
        handleFirestoreError(error, OperationType.WRITE, `users/${uid}`);
    }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
    const userDoc = doc(db, 'users', uid);
    try {
        const snapshot = await getDoc(userDoc);
        return snapshot.exists() ? (snapshot.data() as UserProfile) : null;
    } catch (error) {
        handleFirestoreError(error, OperationType.GET, `users/${uid}`);
        return null;
    }
}

export { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  signInWithPopup,
  onAuthStateChanged,
  type FirebaseUser,
  ref,
  uploadBytes,
  getDownloadURL
};
