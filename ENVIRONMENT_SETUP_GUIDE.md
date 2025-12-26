# 🔐 Environment Variables Setup Guide

## Step 1: Get Your Cloudinary Credentials

1. Go to https://cloudinary.com/console
2. Login to your account
3. On the dashboard, you'll see:
   - **Cloud name**: `dkvqlvucy` (already configured)
   - **API Key**: Copy this
   - **API Secret**: Click "Reveal" then copy

## Step 2: Get Your Database URL

1. Go to https://railway.app (or your database provider)
2. Select your MySQL database
3. Go to **Connect** tab
4. Copy the **MySQL Connection URL**
   - Format: `mysql://user:password@host:port/database`

## Step 3: Generate NextAuth Secret

Open PowerShell and run:
```powershell
# Generate a random secret
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

Or use this online tool:
https://generate-secret.vercel.app/32

## Step 4: Create Local Environment File

1. Copy `.env.local.example` to `.env.local`:
```powershell
Copy-Item .env.local.example .env.local
```

2. Open `.env.local` and fill in your actual values:
```bash
DATABASE_URL="mysql://root:password@roundhouse.proxy.rlwy.net:12345/railway"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dkvqlvucy"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="abcdefghijklmnopqrstuvwxyz123456"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-from-step-3"
ADMIN_SECRET_KEY="choose-a-strong-password"
```

## Step 5: Add to Vercel

1. Go to https://vercel.com/dashboard
2. Select your project: **amg-realestate**
3. Go to **Settings** → **Environment Variables**
4. Add ALL variables from your `.env.local`:
   - Click **Add**
   - Enter **Key** (e.g., `DATABASE_URL`)
   - Enter **Value**
   - Select **All** environments (Production, Preview, Development)
   - Click **Save**

**IMPORTANT:** Change `NEXTAUTH_URL` on Vercel to your production URL:
```
NEXTAUTH_URL=https://amg-realestate.vercel.app
```

## Step 6: Test Locally

```powershell
# Install dependencies
npm install

# Run database migrations
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

Visit http://localhost:3000 and test:
- ✅ Homepage loads
- ✅ Portfolio section shows projects
- ✅ Admin panel works (`/admin`)
- ✅ Image upload works

## Step 7: Deploy to Vercel

```powershell
# Commit the example file (NOT .env.local!)
git add .env.local.example ENVIRONMENT_SETUP_GUIDE.md
git commit -m "Add environment setup guide"
git push origin main
```

Vercel will automatically deploy. Check the deployment at:
https://vercel.com/dashboard

## Troubleshooting

### ❌ "Invalid Cloudinary credentials"
- Check `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` are correct
- Ensure no extra spaces or quotes

### ❌ "Database connection failed"
- Verify `DATABASE_URL` format
- Check database is running
- Ensure IP is whitelisted (Railway auto-whitelist should work)

### ❌ "NextAuth error"
- Generate a new `NEXTAUTH_SECRET`
- Ensure `NEXTAUTH_URL` matches your domain

### ❌ Images still not uploading
1. Check Cloudinary credentials are correct
2. Verify upload folder exists: `amg-projects`
3. Test API endpoint: `POST /api/upload/image`
4. Check browser console for errors

## Security Notes

⚠️ **NEVER commit `.env.local` to git!**

It's already in `.gitignore`, but double-check:
```powershell
git status
# Should NOT see .env.local listed
```

If you accidentally committed it:
```powershell
git rm --cached .env.local
git commit -m "Remove .env.local from git"
git push origin main
```

Then immediately change all your secrets!

---

**Ready to start?** Follow steps 1-4 now to set up your local environment! 🚀
