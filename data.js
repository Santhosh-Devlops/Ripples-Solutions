/**
 * Load Services and Products. Products: JSON + admin (localStorage).
 * Product cards are clickable flash cards - click to view details.
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'ripples_admin_products';
  const productClasses = ['product-lenovo', 'product-desktop', 'product-workstation', 'product-sophos'];
  let jsonProducts = [];

  const detailModal = document.getElementById('product-detail-modal');
  const detailContent = document.getElementById('product-detail-content');

  function getAdminProducts() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function getAllProducts() {
    return jsonProducts.concat(getAdminProducts());
  }

  function openProductDetail(product) {
    if (!detailModal || !detailContent) return;
    var title = product.title || 'Product';
    var desc = product.description || '';
    var html = '<div class="product-detail-inner">';
    if (product.imageData) {
      html += '<img class="product-detail-img" src="' + product.imageData + '" alt="' + title + '" />';
    } else if (product.fileName) {
      html += '<div class="product-detail-file"><strong>📎 Attached file:</strong> ' + product.fileName + '</div>';
    }
    html += '<h3 class="product-detail-title">' + title + '</h3>';
    if (desc) html += '<p class="product-detail-desc">' + desc + '</p>';
    if (product.specs && Object.keys(product.specs).length) {
      html += '<div class="product-detail-specs"><h4>Specifications &amp; Details</h4><ul>';
      Object.keys(product.specs).forEach(function (k) {
        html += '<li><strong>' + k + ':</strong> ' + product.specs[k] + '</li>';
      });
      html += '</ul></div>';
    } else if (product.specs && Array.isArray(product.specs)) {
      html += '<div class="product-detail-specs"><h4>Configurable Options</h4><ul>';
      product.specs.forEach(function (s) {
        html += '<li>' + (s.label || s.id) + '</li>';
      });
      html += '</ul></div>';
    }
    html += '<a href="#contact" class="product-detail-purchase" id="product-detail-purchase-btn">Contact to Purchase</a>';
    html += '</div>';
    detailContent.innerHTML = html;
    var purchaseBtn = detailContent.querySelector('#product-detail-purchase-btn');
    if (purchaseBtn) {
      purchaseBtn.addEventListener('click', function (e) {
        closeProductDetail();
      });
    }
    detailModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeProductDetail() {
    if (detailModal) {
      detailModal.setAttribute('hidden', '');
      document.body.style.overflow = '';
    }
  }

  detailModal?.addEventListener('click', function (e) {
    if (e.target === detailModal || e.target.closest('[data-close="product-detail"]')) closeProductDetail();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && detailModal && !detailModal.hidden) closeProductDetail();
  });

  function loadServices() {
    const grid = document.getElementById('services-grid');
    if (!grid) return;
    fetch('data/services.json')
      .then(function (r) { return r.json(); })
      .then(function (items) {
        grid.innerHTML = items.map(function (s) {
          return '<article class="service-card">' +
            '<div class="service-icon">' + (s.icon || '📌') + '</div>' +
            '<h3>' + (s.title || '') + '</h3>' +
            '<p>' + (s.description || '') + '</p>' +
            '</article>';
        }).join('');
      })
      .catch(function () {
        grid.innerHTML = '<p class="data-error">Unable to load services.</p>';
      });
  }

  function renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    const products = getAllProducts();
    if (products.length === 0) {
      grid.innerHTML = '<p class="data-error">No products available.</p>';
      return;
    }
    grid.innerHTML = products.map(function (p, i) {
      const cls = productClasses[i % productClasses.length] || 'product-lenovo';
      const img = p.imageData ? '<img class="product-card-img" src="' + p.imageData + '" alt="" />' : '';
      return '<article class="product-card product-flash-card" data-product-index="' + i + '">' +
        '<div class="product-placeholder ' + cls + '">' + img + '</div>' +
        '<h3>' + (p.title || '') + '</h3>' +
        '<p>' + (p.description || '') + '</p>' +
        '<span class="product-click-hint">Click to view details</span>' +
        '</article>';
    }).join('');
    grid.querySelectorAll('.product-flash-card').forEach(function (card) {
      card.addEventListener('click', function () {
        const idx = parseInt(card.getAttribute('data-product-index'), 10);
        const products = getAllProducts();
        if (products[idx]) openProductDetail(products[idx]);
      });
    });
  }

  window.refreshProducts = renderProducts;

  function loadProducts() {
    fetch('data/products.json')
      .then(function (r) { return r.json(); })
      .then(function (items) {
        renderProducts();
      })
      .catch(function () {
        jsonProducts = [];
        renderProducts();
      });
  }

  loadServices();
  loadProducts();
})();
