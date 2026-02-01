import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAOzxUm_HzR7RIyoJO6f87caa586NIQbLI",
  authDomain: "ripples-solutions.firebaseapp.com",
  projectId: "ripples-solutions",
  appId: "1:567719165864:web:6eebfab4d263ec352ae79d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// Auth actions
export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
export const loginWithEmail = (e, p) => signInWithEmailAndPassword(auth, e, p);
export const signupWithEmail = (e, p) => createUserWithEmailAndPassword(auth, e, p);
export const resetPassword = (e) => sendPasswordResetEmail(auth, e);
export const logout = () => signOut(auth);
export const observeAuth = (cb) => onAuthStateChanged(auth, cb);
