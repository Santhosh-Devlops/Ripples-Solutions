/**
 * Admin Add Products - visible only for contact@ripplessolutions.com
 * Products saved to localStorage, merged with JSON for display
 */
(function () {
  'use strict';

  const ADMIN_EMAIL = 'contact@ripplessolutions.com';
  const STORAGE_KEY = 'ripples_admin_products';

  const addProductsBtn = document.getElementById('add-products-btn');
  const adminModal = document.getElementById('admin-modal');
  const adminForm = document.getElementById('admin-product-form');

  function isAdmin() {
    if (typeof window.isRipplesAdmin !== 'function') return false;
    return window.isRipplesAdmin();
  }

  function checkAdminVisibility() {
    if (addProductsBtn) addProductsBtn.style.display = isAdmin() ? '' : 'none';
  }

  function getAdminProducts() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveAdminProducts(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    if (typeof window.refreshProducts === 'function') window.refreshProducts();
    showToast('Product added successfully. It is now visible to all visitors.');
  }

  function showToast(msg) {
    var toast = document.getElementById('admin-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'admin-toast';
      toast.className = 'auth-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.hidden = false;
    clearTimeout(toast._tid);
    toast._tid = setTimeout(function () { toast.hidden = true; }, 4000);
  }

  function openAdminModal() {
    if (!adminModal || !isAdmin()) return;
    adminModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    if (adminForm) adminForm.reset();
  }

  function closeAdminModal() {
    if (!adminModal) return;
    adminModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  adminModal?.addEventListener('click', function (e) {
    if (e.target === adminModal || e.target.closest('[data-close="admin"]')) closeAdminModal();
  });

  adminModal?.querySelector('.modal-dialog')?.addEventListener('click', function (e) { e.stopPropagation(); });

  addProductsBtn?.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (isAdmin()) openAdminModal();
  });

  adminForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    var title = adminForm.title?.value?.trim();
    var desc = adminForm.description?.value?.trim();
    var specsText = adminForm.specs?.value?.trim();
    var fileInput = adminForm.file;

    if (!title || !desc) return;

    var specs = {};
    if (specsText) {
      specsText.split('\n').forEach(function (line) {
        var idx = line.indexOf(':');
        if (idx > 0) {
          var k = line.slice(0, idx).trim();
          var v = line.slice(idx + 1).trim();
          if (k) specs[k] = v;
        }
      });
    }

    var product = {
      id: 'admin-' + Date.now(),
      title: title,
      description: desc,
      specs: specs,
      imageData: null,
      isAdmin: true
    };

    var file = fileInput?.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        var fr = new FileReader();
        fr.onload = function () {
          product.imageData = fr.result;
          product.fileName = file.name;
          var list = getAdminProducts();
          list.push(product);
          saveAdminProducts(list);
          adminForm.reset();
          closeAdminModal();
        };
        fr.readAsDataURL(file);
      } else {
        product.fileName = file.name;
        product.fileType = file.type;
        var list = getAdminProducts();
        list.push(product);
        saveAdminProducts(list);
        adminForm.reset();
        closeAdminModal();
      }
    } else {
      var list = getAdminProducts();
      list.push(product);
      saveAdminProducts(list);
      adminForm.reset();
      closeAdminModal();
    }
  });

  setInterval(checkAdminVisibility, 500);
  checkAdminVisibility();
})();
