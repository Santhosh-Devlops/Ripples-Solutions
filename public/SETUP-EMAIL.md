# EmailJS Setup for Ripples Solutions Contact Form

This guide walks you through configuring EmailJS so the contact form sends inquiries to the correct owners (Krishnan or Stephen) based on the selected brand.

## 1. Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up (free tier: 200 emails/month)
3. Verify your email

## 2. Add Email Service

1. Dashboard → **Email Services** → **Add New Service**
2. Choose **Gmail** (or Outlook, etc.)
3. Connect your Gmail account (e.g. `contact@ripplessolutions.com` or a dedicated sender)
4. Copy the **Service ID** (e.g. `service_abc123`)
5. In **Settings**, add your domains to the allowlist:
   - `localhost` (for testing)
   - `ripplessolutions.com`
   - Your hosting domain (e.g. `your-site.vercel.app`)

## 3. Create Email Template

1. Dashboard → **Email Templates** → **Create New Template**
2. **Template ID**: Set to something like `ripples_contact`
3. Configure the template fields:

| Field      | Value                     |
|-----------|---------------------------|
| To Email  | `{{to_email}}`            |
| From Name | `{{from_name}}`           |
| Reply-To  | `{{from_email}}`          |
| Subject   | `{{subject}}`             |
| Content   | `{{message}}`             |

4. Save and copy the **Template ID**

## 4. Get Public Key

1. Dashboard → **Account** → **API Keys**
2. Copy your **Public Key**

## 5. Update Config

Edit `emailjs-config.js` and replace the placeholders:

```javascript
window.EMAILJS_CONFIG = {
  serviceId: 'service_abc123',   // Your Service ID
  templateId: 'template_xyz789', // Your Template ID
  publicKey: 'abcdefghijk123'    // Your Public Key
};
```

## Email Routing (Already Implemented)

- **Sophos, Dell, D-Link** → `krishnan@ripplessolutions.com`
- **Lenovo** → `stephen@ripplessolutions.com`
- **Other** → `contact@ripplessolutions.com`

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "EmailJS not configured" | Ensure all three values in `emailjs-config.js` are replaced (no `YOUR_` placeholders) |
| "Blocked" or "403" | Add your domain to the Email Service allowlist in EmailJS dashboard |
| "Failed to send" | Check browser console for details; verify Gmail connection in EmailJS |
| Ad blockers | Some ad blockers may block EmailJS; test in incognito or disable for your site |
