// =======================
// SCRIPT.JS - PROFESSIONAL AUTH + DASHBOARD
// =======================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

(() => {
  'use strict';

  // =======================
  // FIREBASE CONFIG
  // =======================
  const firebaseConfig = {
    apiKey: "AIzaSyAOzxUm_HzR7RIyoJO6f87caa586NIQbLI",
    authDomain: "ripples-solutions.firebaseapp.com",
    projectId: "ripples-solutions",
    storageBucket: "ripples-solutions.firebasestorage.app",
    messagingSenderId: "567719165864",
    appId: "1:567719165864:web:6eebfab4d263ec352ae79d"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  // =======================
  // GOOGLE PROVIDER
  // =======================
  const googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: "select_account" });

  // =======================
  // DOM ELEMENTS
  // =======================
  const authModal = document.getElementById('auth-modal');
  const authTabs = document.querySelectorAll('.auth-tab');
  const authPanels = document.querySelectorAll('.auth-panel');
  const authButtons = document.querySelector('.header-actions-auth');
  const navLoginBtn = document.querySelector('[data-auth="login"]');
  const navSignupBtn = document.querySelector('[data-auth="signup"]');
  const profileDropdown = document.getElementById('profile-dropdown');
  const userPhoto = document.getElementById('user-photo');
  const userPhotoMenu = document.getElementById('user-photo-menu');
  const userName = document.getElementById('user-name');
  const userNameMenu = document.getElementById('user-name-menu');
  const userEmail = document.getElementById('user-email');
  const formLogin = document.getElementById('form-login');
  const formSignup = document.getElementById('form-signup');
  const formReset = document.getElementById('form-reset');

  // =======================
  // MODAL & PANEL FUNCTIONS
  // =======================
  function openAuthModal(mode = 'login') {
    if (!authModal) return;
    authModal.hidden = false;
    document.body.style.overflow = 'hidden';
    setAuthPanel(mode);
  }

  function closeAuthModal() {
    if (!authModal) return;
    authModal.hidden = true;
    document.body.style.overflow = '';
  }

  function setAuthPanel(panelId) {
    authPanels.forEach(panel => panel.classList.toggle('active', panel.id === 'auth-panel-' + panelId));
    authTabs.forEach(tab => {
      const tabId = tab.getAttribute('data-tab');
      tab.classList.toggle('active', tabId === panelId && (panelId === 'login' || panelId === 'signup'));
    });
  }

  // =======================
  // AUTH STATE OBSERVER
  // =======================
  onAuthStateChanged(auth, user => {
    if (user) {
      if (authButtons) authButtons.style.display = 'none';
      if (profileDropdown) profileDropdown.style.display = 'flex';
      const photoUrl = user.photoURL || 'assets/default-avatar.svg';
      const displayName = user.displayName || user.email?.split('@')[0] || 'User';
      [userPhoto, userPhotoMenu].forEach(el => { if (el) el.src = photoUrl; });
      [userName, userNameMenu].forEach(el => { if (el) el.textContent = displayName; });
      if (userEmail) userEmail.textContent = user.email || '';
      closeAuthModal();
    } else {
      if (authButtons) authButtons.style.display = 'flex';
      if (profileDropdown) profileDropdown.style.display = 'none';
    }
  });

  window.getCurrentUser = () => auth.currentUser;
  window.openAuthModal = openAuthModal;
  window.isRipplesAdmin = () => {
    const u = auth.currentUser;
    if (!u || !u.email) return false;
    const e = u.email.toLowerCase();
    return e === 'krishnan@ripplessolutions.com' || e === 'stephen@ripplessolutions.com';
  };

  // =======================
  // AUTH ACTIONS
  // =======================
  async function handleGoogleLogin() {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Google login failed:', err);
    }
  }

  function getAuthErrorMessage(code) {
    const map = {
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/invalid-email': 'Please enter a valid email.',
      'auth/email-already-in-use': 'This email is already registered.',
      'auth/weak-password': 'Password must be at least 6 characters.',
      'auth/invalid-credential': 'Invalid email or password. Please try again.',
      'auth/too-many-requests': 'Too many attempts. Try again later.'
    };
    return map[code] || 'Something went wrong. Please try again.';
  }

  function showAuthError(form, msg) {
    let el = form.querySelector('.auth-error-msg');
    if (!el) {
      el = document.createElement('p');
      el.className = 'auth-error-msg';
      form.insertBefore(el, form.firstChild);
    }
    el.textContent = msg;
    el.hidden = false;
  }

  function clearAuthError(form) {
    const el = form?.querySelector('.auth-error-msg');
    if (el) el.hidden = true;
  }

  async function handleEmailLogin(email, password) {
    const form = document.getElementById('form-login');
    clearAuthError(form);
    if (!email || !password) {
      showAuthError(form, 'Please enter email and password.');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      closeAuthModal();
    } catch (err) {
      showAuthError(form, getAuthErrorMessage(err.code) || err.message);
    }
  }

  async function handleEmailSignup(name, email, password) {
    const form = document.getElementById('form-signup');
    clearAuthError(form);
    if (!email || !password) {
      showAuthError(form, 'Please fill all required fields.');
      return;
    }
    if (password.length < 6) {
      showAuthError(form, 'Password must be at least 6 characters.');
      return;
    }
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password);
      if (name) await updateProfile(user, { displayName: name.trim() });
      closeAuthModal();
    } catch (err) {
      showAuthError(form, getAuthErrorMessage(err.code) || err.message);
    }
  }

  async function handlePasswordReset(email) {
    const form = document.getElementById('form-reset');
    clearAuthError(form);
    if (!email) return;
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setAuthPanel('login');
    } catch (err) {
      showAuthError(form, getAuthErrorMessage(err.code) || err.message);
    }
  }

  async function handleLogout() {
    try {
      await signOut(auth);
      if (profileDropdown) profileDropdown.classList.remove('open');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }

  // =======================
  // EVENT LISTENERS
  // =======================

  navLoginBtn?.addEventListener('click', () => openAuthModal('login'));
  navSignupBtn?.addEventListener('click', () => openAuthModal('signup'));

  authModal?.addEventListener('click', e => {
    if (e.target === authModal || e.target.closest('[data-close="auth"]')) closeAuthModal();
  });

  authTabs.forEach(tab => tab.addEventListener('click', e => {
    const panelId = tab.getAttribute('data-tab');
    if (panelId) setAuthPanel(panelId);
  }));

  document.querySelectorAll('.auth-btn-social').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.provider === 'google') handleGoogleLogin();
    });
  });

  formLogin?.addEventListener('submit', e => {
    e.preventDefault();
    handleEmailLogin(formLogin.email.value, formLogin.password.value);
  });

  formSignup?.addEventListener('submit', e => {
    e.preventDefault();
    handleEmailSignup(formSignup.name?.value, formSignup.email.value, formSignup.password.value);
  });

  formReset?.addEventListener('submit', e => {
    e.preventDefault();
    handlePasswordReset(formReset.email.value);
  });

  window.logout = handleLogout;

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && authModal && !authModal.hidden) closeAuthModal();
  });

})();
