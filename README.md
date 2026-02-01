# Ripples Solutions

Professional website for **Ripples Solutions** — IT Systems Integrator, Lenovo Regional Sub Distributor, Sophos & Cyberoam Gold Partner.

## Features

- **Logo**: Replace `assets/logo.svg` or add `assets/logo.png` with your brand logo
- **Hero**: Scrollable carousel of company/office images (home section only)
- **Auth**: Google + email/password (Firebase). Login required for contact form.
- **Add Products** (Admin): Visible only when logged in as `krishnan@ripplessolutions.com` or `stephen@ripplessolutions.com`. Add product details + attach any file. Products appear as flash cards for all visitors.
- **Contact form**: Brand dropdown (Lenovo, Sophos, D-Link). Lenovo → stephen@ripplessolutions.com; Sophos/D-Link → krishnan@ripplessolutions.com.
- **Products**: Flash cards for all visitors. Click to view details. Admin-added products stored in localStorage.

## Run locally

```bash
npx serve .
# or
python -m http.server 3000
```

## Logo

Place your logo at `assets/logo.png` or `assets/logo.svg`. The site uses `assets/logo.svg` by default (ripple design with "Ripples Solutions" and "Innovate. Evolve. Prosper.").

## EmailJS setup

1. Sign up at [emailjs.com](https://www.emailjs.com/)
2. Add Gmail service, create template with `{{to_email}}`, `{{from_name}}`, `{{from_email}}`, `{{subject}}`, `{{message}}`
3. Edit `contact.js` — set `EMAILJS_CONFIG.serviceId`, `templateId`, `publicKey`

## Hero images

Replace the Unsplash URLs in `index.html` (hero-carousel) with your own company images for a custom carousel.
