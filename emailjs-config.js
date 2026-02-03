/**
 * EmailJS Configuration for Ripples Solutions Contact Form
 * =========================================================
 * 
 * 1. Sign up at https://www.emailjs.com/ (free tier: 200 emails/month)
 * 2. Add Email Service: Dashboard > Email Services > Add New
 *    - Connect Gmail (or Outlook, etc.)
 *    - Copy the SERVICE ID
 * 
 * 3. Create Email Template: Dashboard > Email Templates > Create New
 *    - Template ID: e.g. "ripples_contact" (copy this)
 *    - To Email: {{to_email}}        (recipient: krishnan or stephen based on brand)
 *    - From Name: {{from_name}}
 *    - Reply-To: {{from_email}}      (client's email for reply)
 *    - Subject: {{subject}}
 *    - Content (plain text):
 * 
 *      New inquiry from Ripples Solutions website
 *      ----------------------------------------
 *      {{message}}
 * 
 * 4. Get Public Key: Dashboard > Account > API Keys
 *    - Copy your Public Key
 * 
 * 5. Add domain to allowlist (if needed): Dashboard > Email Services > Your Service > Settings
 *    - Add your website domain (e.g. ripplessolutions.com, localhost) to prevent blocking
 * 
 * 6. Replace the values below with your actual IDs:
 */
window.EMAILJS_CONFIG = {
  serviceId: 'YOUR_SERVICE_ID',     // e.g. 'service_abc123'
  templateId: 'YOUR_TEMPLATE_ID',   // e.g. 'template_xyz789'
  publicKey: 'YOUR_PUBLIC_KEY'      // e.g. 'abcdefghijk123456'
};
