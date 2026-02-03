/**
 * Admin Add / Remove Products
 * Visible only for admins
 * Products saved to localStorage and visible to all users
 */
(function () {
  'use strict';

  const ADMIN_EMAILS = [
    'stephen@ripplessolutions.com',
    'krishnan@ripplessolutions.com'
  ];

  const STORAGE_KEY = 'ripples_admin_products';

  const addProductsBtn = document.getElementById('add-products-btn');
  const removeProductsBtn = document.getElementById('remove-products-btn');

  const adminModal = document.getElementById('admin-modal');
  const adminForm = document.getElementById('admin-product-form');

  const removeModal = document.getElementById('remove-product-modal');
  const removeForm = document.getElementById('remove-product-form');
  const removeSelect = document.getElementById('remove-product-select');

  /* ---------- ADMIN CHECK ---------- */
  function isAdmin() {
    if (typeof window.isRipplesAdmin === 'function') {
      return window.isRipplesAdmin();
    }

    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    return user && ADMIN_EMAILS.includes(user.email);
  }

  function checkAdminVisibility() {
    const visible = isAdmin();
    if (addProductsBtn) addProductsBtn.style.display = visible ? '' : 'none';
    if (removeProductsBtn) removeProductsBtn.style.display = visible ? '' : 'none';
  }

  /* ---------- STORAGE ---------- */
  function getAdminProducts() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveAdminProducts(list, toastMsg) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    if (typeof window.refreshProducts === 'function') {
      window.refreshProducts();
    }
    if (toastMsg) showToast(toastMsg);
  }

  /* ---------- TOAST ---------- */
  function showToast(msg) {
    let toast = document.getElementById('admin-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'admin-toast';
      toast.className = 'auth-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.hidden = false;
    clearTimeout(toast._tid);
    toast._tid = setTimeout(() => (toast.hidden = true), 4000);
  }

  /* ---------- ADD PRODUCT MODAL ---------- */
  function openAdminModal() {
    if (!isAdmin() || !adminModal) return;
    adminModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    adminForm?.reset();
  }

  function closeAdminModal() {
    adminModal?.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  addProductsBtn?.addEventListener('click', e => {
    e.preventDefault();
    openAdminModal();
  });

  adminModal?.addEventListener('click', e => {
    if (e.target.closest('[data-close="admin"]')) closeAdminModal();
  });

  adminForm?.addEventListener('submit', e => {
    e.preventDefault();

    const title = adminForm.title.value.trim();
    const desc = adminForm.description.value.trim();
    const specsText = adminForm.specs.value.trim();
    const file = adminForm.file.files[0];

    if (!title || !desc) return;

    const specs = {};
    if (specsText) {
      specsText.split('\n').forEach(line => {
        const idx = line.indexOf(':');
        if (idx > 0) {
          specs[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
        }
      });
    }

    const product = {
      id: 'admin-' + Date.now(),
      title,
      description: desc,
      specs,
      imageData: null,
      fileName: null,
      isAdmin: true
    };

    const saveProduct = () => {
      const list = getAdminProducts();
      list.push(product);
      saveAdminProducts(list, 'Product added successfully. Visible to all users.');
      adminForm.reset();
      closeAdminModal();
    };

    if (file && file.type.startsWith('image/')) {
      const fr = new FileReader();
      fr.onload = () => {
        product.imageData = fr.result;
        product.fileName = file.name;
        saveProduct();
      };
      fr.readAsDataURL(file);
    } else {
      if (file) product.fileName = file.name;
      saveProduct();
    }
  });

  /* ---------- REMOVE PRODUCT ---------- */
  function populateRemoveProductDropdown() {
    if (!removeSelect) return;

    removeSelect.innerHTML = '';
    const products = getAdminProducts();

    if (products.length === 0) {
      const opt = document.createElement('option');
      opt.textContent = 'No products available';
      opt.disabled = true;
      opt.selected = true;
      removeSelect.appendChild(opt);
      return;
    }

    const def = document.createElement('option');
    def.textContent = '-- Select Product --';
    def.value = '';
    def.disabled = true;
    def.selected = true;
    removeSelect.appendChild(def);

    products.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.title;
      removeSelect.appendChild(opt);
    });
  }

  removeProductsBtn?.addEventListener('click', () => {
    if (!isAdmin()) return;
    populateRemoveProductDropdown();
    removeModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  });

  removeModal?.addEventListener('click', e => {
    if (e.target.closest('[data-close="remove"]')) {
      removeModal.setAttribute('hidden', '');
      document.body.style.overflow = '';
    }
  });

  removeForm?.addEventListener('submit', e => {
    e.preventDefault();

    const id = removeSelect.value;
    if (!id) return;

    const products = getAdminProducts().filter(p => p.id !== id);
    saveAdminProducts(products, 'Product removed successfully.');

    removeModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  });

  /* ---------- INIT ---------- */
  checkAdminVisibility();
  setInterval(checkAdminVisibility, 500);
})();
