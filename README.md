# ScholarPath India — Student Portal

India's all-in-one portal for scholarships, education loans, interest subsidies, and student financial aid.

## Project Folder
`C:\Users\dadhi\.gemini\antigravity\scratch\student-portal\`

## Project Structure
| File | Purpose |
|---|---|
| `index.html` | Full semantic structure, 3D intro, eligibility form, directory grids, contact section |
| `style.css` | Dark theme, responsive breakpoints (320px–4K), 3D perspective animations |
| `data.js` | 45+ scholarships, 11 loan products, 4 govt interest subsidies, verified helplines |
| `app.js` | 3D intro typewriter, multi-filter matching, loan EMI calculator, contact composer |
| `vercel.json` | Vercel production edge-caching and security headers configuration |
| `assets/qr.png` | UPI QR code for developer donations |

---

## 🚀 How to Deploy on Vercel (100% Free)

Because ScholarPath India is a pure static web app, Vercel gives you:
- **Instant SSL (https://)**
- **Global Edge CDN distribution (under 25ms load time worldwide)**
- **Unlimited capacity for thousands of simultaneous student visits**

### Option A: Deploy via GitHub (Recommended — Auto-updates on push)
1. Go to [github.com](https://github.com/) and create a new repository (e.g. `scholarpath-india`).
2. Upload all files from this folder (`index.html`, `style.css`, `data.js`, `app.js`, `vercel.json`, `assets/`).
3. Log in to [vercel.com](https://vercel.com/) with your GitHub account.
4. Click **"Add New..."** → **"Project"**.
5. Select your `scholarpath-india` repository.
6. Framework Preset: Leave as **"Other"**.
7. Click **"Deploy"**.
8. In ~10 seconds, Vercel will give you a live production URL like `scholarpath-india.vercel.app`!

### Option B: Deploy via Vercel CLI
If you have Node.js / Vercel CLI installed on any terminal:
```bash
npm install -g vercel
vercel
```
Follow the 3 prompts and your site goes live instantly.
