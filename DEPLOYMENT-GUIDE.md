# Deployment Guide for Modern Page Builder 🚀

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Generate a new Vercel token:**
   - Visit: https://vercel.com/account/tokens
   - Click "Create Token"
   - Give it a name (e.g., "Page Builder Deploy")
   - Copy the token

2. **Deploy using the token:**
   ```bash
   npm install -g vercel
   vercel --token YOUR_NEW_TOKEN --yes --prod
   ```

### Option 2: Deploy via Vercel Web Interface

1. **Push to GitHub** (already done ✅)
   - Your code is at: https://github.com/samayhuf-star/VvvebJs-Page-Landing-Builder

2. **Import to Vercel:**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your repository: `VvvebJs-Page-Landing-Builder`
   - Click "Import"
   - Click "Deploy"

3. **Done!** Your site will be live at: `your-project.vercel.app`

### Option 3: One-Click Deploy Button

Click this button to deploy directly:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/samayhuf-star/VvvebJs-Page-Landing-Builder)

---

## Deploy to Other Platforms

### Netlify

1. **Via Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

2. **Via Netlify Web:**
   - Go to https://app.netlify.com/start
   - Connect your GitHub repository
   - Deploy!

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/samayhuf-star/VvvebJs-Page-Landing-Builder)

### GitHub Pages

1. **Enable GitHub Pages:**
   - Go to repository Settings > Pages
   - Select branch: `claude/page-builder-drag-drop-011CUpLoPpa1pCZy2qSx1huS`
   - Click Save

2. **Access your site at:**
   ```
   https://samayhuf-star.github.io/VvvebJs-Page-Landing-Builder/modern-builder.html
   ```

### Cloudflare Pages

1. **Via Cloudflare Dashboard:**
   - Go to https://dash.cloudflare.com/
   - Click "Pages" > "Create a project"
   - Connect your GitHub repository
   - Deploy!

2. **Build settings:**
   - Build command: (leave empty)
   - Build output directory: `/`

---

## Configuration Files Created

### vercel.json ✅
```json
{
  "version": 2,
  "name": "modern-page-builder",
  "rewrites": [
    {
      "source": "/",
      "destination": "/modern-builder.html"
    }
  ]
}
```

This ensures visitors to your root URL see the modern page builder.

---

## Quick Fix for Your Vercel Token

Your token might be:
- **Expired**: Tokens can expire after a certain period
- **Scoped incorrectly**: May not have deployment permissions
- **Typo**: Double-check the token string

### Get a new token:

1. Login to Vercel: https://vercel.com/login
2. Go to Settings: https://vercel.com/account/tokens
3. Click "Create Token"
4. Name: "Modern Builder Deploy"
5. Expiration: Choose based on your needs
6. Scope: Select your account
7. Click "Create Token"
8. **Copy the token immediately** (shown only once)

### Use the new token:

```bash
vercel --token YOUR_NEW_TOKEN --yes --prod
```

---

## Alternative: Deploy as Static Site

### Using Python HTTP Server (For Testing)

```bash
cd /home/user/VvvebJs-Page-Landing-Builder
python3 -m http.server 8000
```

Then open: http://localhost:8000/modern-builder.html

### Using Node.js HTTP Server

```bash
npx http-server -p 8000
```

Then open: http://localhost:8000/modern-builder.html

---

## Recommended: Deploy with Vercel Web Interface

**This is the easiest method:**

1. Visit: https://vercel.com/new
2. Click "Import Git Repository"
3. Authorize GitHub access
4. Select: `samayhuf-star/VvvebJs-Page-Landing-Builder`
5. Click "Import"
6. Configure (optional):
   - Project Name: `modern-page-builder`
   - Framework Preset: Other
   - Root Directory: `./`
7. Click "Deploy"

**Your site will be live in ~2 minutes!**

The URL will be: `https://modern-page-builder-[random].vercel.app`

You can then set a custom domain if desired.

---

## Files Ready for Deployment ✅

All files are ready to deploy:
- ✅ modern-builder.html (Main builder interface)
- ✅ demo/modern-landing/ (Example landing page)
- ✅ css/modern-builder-theme.css (Styling)
- ✅ libs/builder/ (All scripts)
- ✅ vercel.json (Deployment config)
- ✅ MODERN-BUILDER-README.md (Documentation)

---

## Troubleshooting

### Issue: "Token is not valid"
**Solution:** Generate a new token from Vercel dashboard

### Issue: "Project already exists"
**Solution:** Use `vercel --prod` to update existing deployment

### Issue: "Build failed"
**Solution:** This is a static site, no build needed. Check vercel.json

### Issue: "404 errors on deployed site"
**Solution:** Ensure all asset paths are relative (already done ✅)

---

## Next Steps After Deployment

1. **Test the deployment:**
   - Open the deployed URL
   - Test drag and drop functionality
   - Check responsive design
   - Verify all assets load correctly

2. **Set up custom domain (optional):**
   - Go to project settings in Vercel
   - Click "Domains"
   - Add your custom domain

3. **Enable analytics (optional):**
   - Vercel provides free analytics
   - Enable in project settings

---

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **GitHub Repository**: https://github.com/samayhuf-star/VvvebJs-Page-Landing-Builder

---

**Quick Start: Use Vercel Web Interface** 👆
It's the fastest way to get your modern page builder live!
