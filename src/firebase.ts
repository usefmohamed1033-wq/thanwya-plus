import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  onSnapshot,
  query,
  where
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { UserProfile, TrackType } from './types';

// Initialize Firebase App safely (singleton)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * Sign in or Register with Google Popup
 */
export async function signInWithGoogle(track?: TrackType): Promise<UserProfile> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Check if profile exists in Firestore
  const userDocRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userDocRef);

  let profile: UserProfile;

  if (snapshot.exists()) {
    profile = snapshot.data() as UserProfile;
    // Update last login
    await updateDoc(userDocRef, {
      lastLoginAt: new Date().toISOString()
    });
  } else {
    // Create new profile
    profile = {
      id: user.uid,
      name: user.displayName || user.email?.split('@')[0] || 'طالب ثانوي',
      email: user.email || '',
      avatarUrl: user.photoURL || undefined,
      provider: 'google',
      role: 'student',
      isAdmin: false,
      track: track || 'sci_math',
      targetScore: '410',
      targetCollege: 'كلية الهندسة',
      verified: true,
      verifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    await setDoc(userDocRef, profile);
  }

  return profile;
}

/**
 * Register with Email & Password
 */
export async function registerWithEmail(
  email: string,
  pass: string,
  name: string,
  track: TrackType,
  targetScore: string = '410'
): Promise<UserProfile> {
  const userCred = await createUserWithEmailAndPassword(auth, email, pass);
  const user = userCred.user;

  if (name) {
    await updateProfile(user, { displayName: name });
  }

  const profile: UserProfile = {
    id: user.uid,
    name: name || email.split('@')[0],
    email: user.email || email,
    provider: 'email',
    role: 'student',
    isAdmin: false,
    track: track || 'sci_math',
    targetScore: targetScore || '410',
    targetCollege: track === 'sci_math' ? 'كلية الهندسة' : track === 'sci_science' ? 'كلية الطب البشري' : 'كلية الإعلام',
    verified: true,
    verifiedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  const userDocRef = doc(db, 'users', user.uid);
  await setDoc(userDocRef, profile);

  return profile;
}

/**
 * Sign In with Email & Password
 */
export async function loginWithEmail(email: string, pass: string): Promise<UserProfile> {
  const userCred = await signInWithEmailAndPassword(auth, email, pass);
  const user = userCred.user;

  const userDocRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userDocRef);

  if (snapshot.exists()) {
    return snapshot.data() as UserProfile;
  }

  // Fallback if record was not created before
  const profile: UserProfile = {
    id: user.uid,
    name: user.displayName || email.split('@')[0],
    email: user.email || email,
    provider: 'email',
    role: 'student',
    isAdmin: false,
    track: 'sci_math',
    targetScore: '410',
    verified: true,
    verifiedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  await setDoc(userDocRef, profile);
  return profile;
}

/**
 * Sign Out
 */
export async function logOutUser(): Promise<void> {
  await fbSignOut(auth);
}

/**
 * Save / Sync user profile in Firestore
 */
export async function syncUserProfile(profile: UserProfile): Promise<void> {
  if (!profile.id) return;
  const userDocRef = doc(db, 'users', profile.id);
  await setDoc(userDocRef, profile, { merge: true });
}

/**
 * Listen to Auth State
 */
export function onUserAuthStateChanged(callback: (user: UserProfile | null) => void) {
  return onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
    if (!fbUser) {
      callback(null);
      return;
    }

    try {
      const userDocRef = doc(db, 'users', fbUser.uid);
      const snapshot = await getDoc(userDocRef);
      if (snapshot.exists()) {
        callback(snapshot.data() as UserProfile);
      } else {
        const fallbackProfile: UserProfile = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'طالب ثانوي',
          email: fbUser.email || '',
          avatarUrl: fbUser.photoURL || undefined,
          provider: 'email',
          role: 'student',
          isAdmin: false,
          track: 'sci_math',
          targetScore: '410',
          verified: true,
          verifiedAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        };
        await setDoc(userDocRef, fallbackProfile);
        callback(fallbackProfile);
      }
    } catch (err) {
      console.warn('Failed to fetch user doc from firestore', err);
      // Construct fallback from firebase user
      callback({
        id: fbUser.uid,
        name: fbUser.displayName || fbUser.email?.split('@')[0] || 'طالب ثانوي',
        email: fbUser.email || '',
        avatarUrl: fbUser.photoURL || undefined,
        provider: 'email',
        role: 'student',
        isAdmin: false,
        track: 'sci_math',
        targetScore: '410',
        verified: true,
        verifiedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });
    }
  });
}
