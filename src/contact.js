/**
 * Contact form: login check, product dropdown, dynamic specs, EmailJS to Ripples
 * Config is loaded from emailjs-config.js - edit that file with your EmailJS keys
 */
(function () {
  'use strict';

  var EMAILJS_CONFIG = (typeof window !== 'undefined' && window.EMAILJS_CONFIG)
    ? window.EMAILJS_CONFIG
    : {
        serviceId: 'YOUR_SERVICE_ID',
        templateId: 'YOUR_TEMPLATE_ID',
        publicKey: 'YOUR_PUBLIC_KEY'
      };

  const form = document.getElementById('contact-form');
  const productSelect = document.getElementById('contact-product');
  const specsContainer = document.getElementById('contact-specs');
  const loginHint = document.getElementById('contact-login-hint');
  const formFields = document.getElementById('contact-form-fields');
  const submitBtn = document.getElementById('contact-submit');

  let productsData = [];

  // ------------------- LOGIN CHECK -------------------
  function isLoggedIn() {
    return typeof window.getCurrentUser === 'function' && window.getCurrentUser();
  }

  function showLoginPrompt() {
    if (loginHint) loginHint.hidden = false;
    if (formFields) formFields.style.opacity = '0.5';
    if (formFields) formFields.style.pointerEvents = 'none';
    if (submitBtn) submitBtn.disabled = true;
  }

  function hideLoginPrompt() {
    if (loginHint) loginHint.hidden = true;
    if (formFields) formFields.style.opacity = '1';
    if (formFields) formFields.style.pointerEvents = '';
    if (submitBtn) submitBtn.disabled = false;
  }

  function updateFormState() {
    if (isLoggedIn()) {
      hideLoginPrompt();
    } else {
      showLoginPrompt();
    }
  }

  // ------------------- PRODUCTS -------------------
  function getAdminProducts() {
    try {
      var raw = localStorage.getItem('ripples_admin_products');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function loadProducts() {
    var adminProducts = getAdminProducts();
    productsData = adminProducts;

    if (!productSelect) return;

    productSelect.innerHTML = '<option value="">— Select product —</option>';

    if (adminProducts.length === 0) {
      const opt = document.createElement('option');
      opt.disabled = true;
      opt.textContent = 'No products available';
      productSelect.appendChild(opt);
      return;
    }

    adminProducts.forEach(function (p) {
      var opt = document.createElement('option');
      opt.value = p.id || p.title;
      opt.textContent = p.title;
      productSelect.appendChild(opt);
    });
  }

  function renderSpecs(productId) {
    if (!specsContainer) return;
    specsContainer.innerHTML = '';
    const product = productsData.find(function (p) { return (p.id || p.title) === productId; });
    if (!product || !product.specs) return;
    product.specs.forEach(function (spec) {
      const div = document.createElement('div');
      div.className = 'contact-spec-field';
      const label = document.createElement('label');
      label.htmlFor = 'spec-' + spec.id;
      label.textContent = spec.label;
      const input = document.createElement('input');
      input.type = spec.type || 'text';
      input.id = 'spec-' + spec.id;
      input.name = 'spec_' + spec.id;
      input.placeholder = spec.placeholder || '';
      if (spec.type === 'number') input.min = 1;
      div.appendChild(label);
      div.appendChild(input);
      specsContainer.appendChild(div);
    });
  }

  // ------------------- FORM DATA -------------------
  function getRecipientEmail(brand) {
  if (!brand) {
    return 'contact@ripplessolutions.com';
  }

  const b = brand.toLowerCase().replace(/\s+/g, '').replace('-', '');

    // krishnan
    if (
      b === 'dlink' ||
      b === 'sophos'
    ) {
      return 'krishya2005_bit27@mepcoeng.ac.in';
    }

    // stephen
    if (b === 'lenovo') {
      return 'sandypro2006@gmail.com';
    }

    // default
    return 'contact@ripplessolutions.com';
  }


  function collectFormData() {
    const brand = document.getElementById('contact-brand')?.value || '';
    const data = {
      brand: brand,
      product: productSelect?.options[productSelect.selectedIndex]?.text || productSelect?.value,
      name: document.getElementById('contact-name')?.value || '',
      email: document.getElementById('contact-email')?.value || '',
      phone: document.getElementById('contact-phone')?.value || '',
      company: document.getElementById('contact-company')?.value || '',
      message: document.getElementById('contact-message')?.value || ''
    };
    const specInputs = specsContainer?.querySelectorAll('input');
    if (specInputs) {
      specInputs.forEach(function (input) {
        const key = input.name.replace('spec_', '');
        data['spec_' + key] = input.value;
      });
    }
    const user = window.getCurrentUser ? window.getCurrentUser() : null;
    if (user) {
      data.clientEmail = user.email || '';
      data.clientName = user.displayName || user.email || '';
    }
    return data;
  }

  // ------------------- EMAIL BODY -------------------
function formatEmailBody(data) {
    const lines = [];

    lines.push('New inquiry from Ripples Solutions website');
    lines.push('----------------------------------------');
    lines.push('');
    lines.push('Client Information');
    lines.push(`Name           : ${data.name || '-'}`);
    lines.push(`Email          : ${data.email || '-'}`);
    lines.push(`Phone          : ${data.phone || '-'}`);
    lines.push(`Company        : ${data.company || '-'}`);
    lines.push(`Logged-in user : ${data.clientEmail || '-'}`);
    lines.push('');
    lines.push('Brand Information');
    lines.push(`Brand          : ${data.brand || '-'}`);
    lines.push('');
    lines.push('Product Information');
    lines.push(`Product        : ${data.product || '-'}`);
    lines.push('');

    // Specifications (text-only)
    const specs = Object.keys(data).filter(
      k => k.startsWith('spec_') && data[k]
    );

    if (specs.length > 0) {
      lines.push('Specifications');
      specs.forEach(k => {
        lines.push(`- ${k.replace('spec_', '')}: ${data[k]}`);
      });
      lines.push('');
    }

    lines.push('Message');
    lines.push(data.message || '-');
    lines.push('');
    lines.push('----------------------------------------');
    lines.push('Sent from Ripples Solutions website');

    return lines.join('\n');
  }




  function isEmailJSConfigured() {
    return EMAILJS_CONFIG.publicKey &&
           EMAILJS_CONFIG.serviceId &&
           EMAILJS_CONFIG.templateId;
  }

  // ------------------- SEND EMAIL -------------------
  function sendEmail(data) {
    if (typeof emailjs === 'undefined') {
      showToast('Email service not loaded. Check your connection.', true);
      return Promise.reject(new Error('EmailJS SDK not loaded'));
    }

    if (!isEmailJSConfigured()) {
      showToast(
        'Configure EmailJS: Edit emailjs-config.js with your Service ID, Template ID, and Public Key from emailjs.com',
        true
      );
      return Promise.reject(new Error('EmailJS not configured'));
    }

    // ✅ DECLARE RECEIVER EMAIL BASED ON BRAND
    const receiverEmail = getRecipientEmail(data.brand);

    try {
      emailjs.init(EMAILJS_CONFIG.publicKey);
    } catch (err) {
      showToast('Failed to initialize email service.', true);
      return Promise.reject(err);
    }

    // ✅ TEMPLATE PARAMETERS
    const params = {
      to_email: receiverEmail,          // <-- dynamic receiver
      from_name: data.name || 'Website Visitor',
      from_email: data.email || '',     // reply-to
      subject: `Ripples Inquiry: ${data.product || ''} - ${data.name || ''}`,
      message: formatEmailBody(data)    // plain text only
    };

    return emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      params
    );
  }



  // ------------------- TOAST NOTIFICATION -------------------
  function showToast(msg, isError) {
    var toast = document.getElementById('contact-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'contact-toast';
      toast.className = 'auth-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.className = 'auth-toast' + (isError ? ' auth-toast-error' : '');
    toast.hidden = false;
    clearTimeout(toast._tid);
    toast._tid = setTimeout(function () { toast.hidden = true; }, 4000);
  }

  // ------------------- HANDLE FORM SUBMIT -------------------
  function handleSubmit(e) {
    e.preventDefault();
    if (!isLoggedIn()) {
      if (window.openAuthModal) window.openAuthModal('login');
      showToast('Please log in to submit an inquiry.', true);
      return;
    }

    var data = collectFormData();
    if (!data.brand || !data.product || !data.name || !data.email || !data.message) {
      showToast('Please fill all required fields including Brand.', true);
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    sendEmail(data)
      .then(function () {
        showToast('Inquiry sent to Ripples Solutions.');
        form.reset();
        specsContainer.innerHTML = '';
      })
      .catch(function (err) {
        var msg = (err && (err.text || err.message)) || 'Failed to send.';
        if (err && err.status) msg = 'Email error ' + err.status + ': ' + msg;
        showToast(msg, true);
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send to Ripples Solutions';
        }
      });
  }

  // ------------------- EVENT LISTENERS -------------------
  if (productSelect) {
    productSelect.addEventListener('change', function () {
      renderSpecs(productSelect.value);
    });
  }

  if (form) {
    form.addEventListener('submit', handleSubmit);
  }

  loadProducts();
  updateFormState();
  setInterval(updateFormState, 1000);

})();
