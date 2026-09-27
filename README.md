# Niyam Insights (नियम)
> A regulatory navigation and interpretation platform for Indian and Global Capital Markets (SEBI & IFSCA).

---

## 🚀 Live Deployment to Vercel

This repository is pre-configured with `vercel.json` and a Serverless Function entry point (`api/index.js`).

### Option 1: Deploy via GitHub (Recommended — 2 Minutes)
1. Push this repository to **GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Niyam Insights platform"
   git branch -M main
   git remote add origin https://github.com/your-username/niyam-insights.git
   git push -u origin main
   ```
2. Go to **[https://vercel.com/new](https://vercel.com/new)**.
3. Import your `niyam-insights` repository.
4. Keep the default settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**. Your website is immediately live on `https://niyam-insights.vercel.app`!

---

### Option 2: Deploy via Vercel CLI
If you have the Vercel CLI installed:
```bash
npx vercel
```
Follow the interactive prompts:
* Set up and deploy: `Y`
* Link to existing project: `N`
* Project name: `niyam-insights`
* In which directory is your code located: `./`
* Overwrite build settings: `N`

To deploy straight to production:
```bash
npx vercel --prod
```

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start both backend server (port 5000) and frontend (port 5173)
npm run dev
```

* **Frontend**: [http://localhost:5173/](http://localhost:5173/)
* **SEBI Repository**: [http://localhost:5173/regulator/sebi](http://localhost:5173/regulator/sebi)
* **IFSCA Repository**: [http://localhost:5173/regulator/ifsca](http://localhost:5173/regulator/ifsca)
* **Blogs & Notes**: [http://localhost:5173/blogs](http://localhost:5173/blogs)
* **Admin Control Center**: [http://localhost:5173/admin](http://localhost:5173/admin)

---

## 🏛️ Platform Architecture

* **Frontend**: React 19, Vite, Vanilla CSS Design System (Newsreader Serif + Plus Jakarta Sans).
* **Backend**: Express REST APIs & Vercel Serverless Functions (`api/index.js`).
* **Database**: Atomic JSON Database with one-click JSON backup/restore for effortless migration to Laravel, PostgreSQL, or Next.js.
* **SEO**: Indexable clean URLs, semantic markup, and metadata tags.
