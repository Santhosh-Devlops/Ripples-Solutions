(function () {
  'use strict';

  const authModal = document.getElementById('auth-modal');
  const authTabs = document.querySelectorAll('.auth-tab');
  const authPanels = document.querySelectorAll('.auth-panel');
  const authBack = document.querySelector('.auth-back[data-show="login"]');
  const loginBtn = document.querySelector('[data-auth="login"]');
  const signupBtn = document.querySelector('[data-auth="signup"]');
  const navToggle = document.querySelector('.nav-toggle');
  const header = document.querySelector('.header');

  function openAuthModal(mode) {
    if (!authModal) return;
    authModal.hidden = false;
    document.body.style.overflow = 'hidden';
    setAuthPanel(mode === 'signup' ? 'signup' : 'login');
  }

  function closeAuthModal() {
    if (!authModal) return;
    authModal.hidden = true;
    document.body.style.overflow = '';
  }

  function setAuthPanel(panelId) {
    authPanels.forEach(function (panel) {
      panel.classList.toggle('active', panel.id === 'auth-panel-' + panelId);
    });
    authTabs.forEach(function (tab) {
      const tabId = tab.getAttribute('data-tab');
      tab.classList.toggle('active', tabId === panelId && (panelId === 'login' || panelId === 'signup'));
    });
  }

  function handleTabClick(e) {
    const tab = e.target.closest('.auth-tab');
    if (!tab) return;
    const panelId = tab.getAttribute('data-tab');
    if (panelId) setAuthPanel(panelId);
  }

  function handleShowPanel(e) {
    const btn = e.target.closest('[data-show]');
    if (!btn) return;
    const panelId = btn.getAttribute('data-show');
    if (panelId) setAuthPanel(panelId);
  }

  function handleCloseModal(e) {
    if (e.target.closest('[data-close="auth"]') || e.target === authModal) closeAuthModal();
  }

  if (loginBtn) loginBtn.addEventListener('click', function () { openAuthModal('login'); });
  if (signupBtn) signupBtn.addEventListener('click', function () { openAuthModal('signup'); });

  if (authModal) {
    authModal.addEventListener('click', handleCloseModal);
    authModal.querySelector('.modal-dialog')?.addEventListener('click', function (e) { e.stopPropagation(); });
  }

  authModal?.addEventListener('click', handleTabClick);
  authModal?.addEventListener('click', handleShowPanel);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && authModal && !authModal.hidden) closeAuthModal();
  });

  if (navToggle && header) {
    navToggle.addEventListener('click', function () {
      header.classList.toggle('open');
    });
  }

  document.querySelectorAll('.header .nav a').forEach(function (link) {
    link.addEventListener('click', function () {
      header.classList.remove('open');
      var hash = link.getAttribute('href');
      if (hash && hash.startsWith('#contact')) {
        var contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.classList.add('highlight');
          setTimeout(function () { contactSection.classList.remove('highlight'); }, 1500);
        }
      }
    });
  });

  function checkHash() {
    var hash = window.location.hash;
    if (hash === '#contact') {
      var contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.classList.add('highlight');
        setTimeout(function () { contactSection.classList.remove('highlight'); }, 1500);
      }
    }
  }

  window.addEventListener('hashchange', checkHash);
  if (window.location.hash === '#contact') checkHash();

  // Contact form handled by contact.js (login check, EmailJS)

  var profileTrigger = document.getElementById('profile-trigger');
  var profileDropdown = document.getElementById('profile-dropdown');
  if (profileTrigger && profileDropdown) {
    profileTrigger.addEventListener('click', function (e) {
      e.stopPropagation();
      profileDropdown.classList.toggle('open');
      profileTrigger.setAttribute('aria-expanded', profileDropdown.classList.contains('open'));
    });
    document.addEventListener('click', function () {
      profileDropdown.classList.remove('open');
      profileTrigger.setAttribute('aria-expanded', 'false');
    });
    profileDropdown.querySelector('.profile-menu')?.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  }
})();
