# 🚀 Vercel Deployment Checklist

## ✅ Status: Ready for Deployment

### 1. Environment Variables (CRITICAL)
Visit: https://vercel.com/your-team/amg-realestate/settings/environment-variables

**Required Variables:**
```bash
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dkvqlvucy
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here

# Database
DATABASE_URL=your_mysql_connection_string

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_secret_here

# Admin
ADMIN_SECRET_KEY=your_admin_key
```

### 2. How to Add Environment Variables on Vercel

1. Go to your Vercel dashboard
2. Select your project (amg-realestate)
3. Click **Settings** → **Environment Variables**
4. Add each variable:
   - **Variable Name**: e.g., `CLOUDINARY_API_KEY`
   - **Value**: Your actual value
   - **Environments**: Select **Production**, **Preview**, **Development**
5. Click **Save**

### 3. Redeploy After Adding Variables

**Option A: Automatic (Recommended)**
```bash
git commit --allow-empty -m "Trigger Vercel redeploy"
git push origin main
```

**Option B: Manual**
1. Go to Vercel Dashboard → Deployments
2. Click the three dots (•••) on latest deployment
3. Click **Redeploy**
4. Select **Use existing Build Cache** (optional)

### 4. Verify Deployment

After redeployment, check:

✅ **Homepage loads**: https://your-domain.vercel.app
✅ **Images display**: Check portfolio section
✅ **No 404 errors**: Open browser console (F12)
✅ **Image optimization works**: Check Network tab for `/_next/image` requests

### 5. Common Issues & Solutions

#### Issue: Images still showing 404
**Solution:**
- Verify `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set correctly
- Check Cloudinary images exist: https://res.cloudinary.com/dkvqlvucy/image/upload/amg-projects/your-image.jpg
- Verify Next.js image config in `next.config.ts` has correct domains

#### Issue: "Invalid src prop"
**Solution:**
- Ensure image URLs start with `https://`
- Check `remotePatterns` in `next.config.ts` includes cloudinary domains

#### Issue: Build fails
**Solution:**
- Check Vercel build logs for errors
- Run `npm run build` locally to test
- Ensure all dependencies are in `package.json`

### 6. Files Changed in This Fix

1. ✅ `src/app/manifest.ts` - Simplified icon paths
2. ✅ `src/app/layout.tsx` - Updated favicon links
3. ✅ `public/icon.svg` - Created basic AMG icon
4. ✅ `next.config.ts` - Fixed image optimization config
5. ✅ `src/app/api/upload/image/route.ts` - Fixed Cloudinary upload
6. ✅ `src/app/api/admin/projects/route.ts` - Fixed mainImage saving

### 7. Quick Test Commands

**Test Cloudinary Connection:**
```bash
curl -X GET "https://res.cloudinary.com/dkvqlvucy/image/list/amg-projects.json"
```

**Test Local Build:**
```bash
npm run build
npm start
```

**Check Environment Variables Locally:**
```bash
Get-Content .env.local
```

---

## 🎯 Next Steps

1. **Add environment variables to Vercel** (see section 2)
2. **Trigger redeploy** (see section 3)
3. **Test the live site** (see section 4)
4. **Upload test project** in admin panel
5. **Verify images display** on homepage

## 📞 Support

If issues persist:
- Check Vercel Functions logs: Dashboard → Deployments → [Latest] → Functions tab
- Review build logs: Dashboard → Deployments → [Latest] → Building tab
- Test API endpoints: `/api/upload/image`, `/api/admin/projects`

---

**Last Updated:** 2025-01-26
**Status:** ✅ Code ready, pending Vercel configuration
