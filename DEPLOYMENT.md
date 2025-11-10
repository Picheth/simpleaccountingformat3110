# Deployment Guide - Vercel

## Quick Deploy (GitHub)

### Step 1: Push to GitHub

```bash
cd /Users/picheth/Desktop/Build/SAF/simpleaccountingformat3110
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Deploy to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your repository: `Picheth/simpleaccountingformat3110`
5. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

6. Click "Deploy"

That's it! Your app will be live at `https://your-project-name.vercel.app`

---

## Alternative: Deploy with Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

Navigate to your project root:

```bash
cd /Users/picheth/Desktop/Build/SAF/simpleaccountingformat3110
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- What's your project's name? `simpleaccountingformat3110`
- In which directory is your code located? `./frontend`
- Want to override settings? **N**

### Step 4: Deploy to Production

```bash
vercel --prod
```

---

## Important Notes

### Data Storage
- Your app uses **localStorage** (browser storage)
- Data is stored locally in each user's browser
- Data is **NOT synced** between devices or users
- If you clear browser data, all information is lost

### For Multi-User or Cloud Data

If you want to store data in the cloud (accessible from any device), you'll need:

1. **Option A: Add Vercel Postgres Database** (requires backend API)
2. **Option B: Use Firebase/Supabase** (simpler, no backend needed)

Let me know if you want to add cloud database later!

---

## Vercel Configuration

The `vercel.json` file in your root directory configures:
- Build command and output directory
- SPA routing (all routes serve index.html)
- Environment variables (if needed)

---

## Automatic Deployments

Once connected to GitHub:
- Every push to `main` branch = automatic deployment
- Pull requests get preview deployments
- Rollback to any previous deployment

---

## Custom Domain (Optional)

After deployment, you can add a custom domain:
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `accounting.yourdomain.com`)
3. Update DNS records as instructed by Vercel

---

## Troubleshooting

### Build Errors
```bash
# Test build locally first
cd frontend
npm run build
npm run preview
```

### Port Issues
Vercel automatically handles ports - no configuration needed

### Environment Variables
If you need API keys later, add them in:
Vercel Dashboard → Project Settings → Environment Variables

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Vite Deployment: https://vitejs.dev/guide/static-deploy.html

