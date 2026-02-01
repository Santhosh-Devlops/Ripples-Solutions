/**
 * EmailJS Configuration for Ripples Solutions Contact Form
 * =========================================================
 * 
 * Steps to use:
 * 1. Sign up at https://www.emailjs.com/ (free tier: 200 emails/month)
 * 2. Add Email Service:
 *    - Dashboard > Email Services > Add New
 *    - Connect Gmail, Outlook, or another provider
 *    - Copy the SERVICE ID
 *
 * 3. Create Email Template:
 *    - Dashboard > Email Templates > Create New
 *    - Template ID: copy this (e.g., "template_maystq5")
 *    - Set placeholders in template:
 *       To Email: {{to_email}}
 *       From Name: {{from_name}}
 *       Reply-To: {{from_email}}
 *       Subject: {{subject}}
 *       Content: {{message}}
 *
 * 4. Get Public Key:
 *    - Dashboard > Account > API Keys
 *    - Copy your Public Key
 *
 * 5. Add your website domain to allowlist:
 *    - Dashboard > Email Services > Your Service > Settings
 *    - Add domain (e.g., ripplessolutions.com or localhost)
 *
 * 6. Replace the values below with your actual IDs
 */

window.EMAILJS_CONFIG = {
  serviceId: 'service_hpyq3ot',     // Your EmailJS Service ID
  templateId: 'template_maystq5',   // Your EmailJS Template ID
  publicKey: 'Ab4iWm_3BC9Chf8bO'    // Your EmailJS Public Key
};
