# ⚡ Quick Deployment Guide - Vercel

## 🚀 Deploy in 5 Minutes!

### Step 1: Prepare Database (Choose One)

#### Option A: PlanetScale (Recommended - Free)
1. Go to [planetscale.com](https://planetscale.com) → Sign Up
2. Create New Database → Name: `amg-real-estate`
3. Copy connection string from "Connect" tab
4. **Important**: Add to `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "mysql"
     url      = env("DATABASE_URL")
     relationMode = "prisma"  // Add this line!
   }
   ```

#### Option B: Railway (Free $5 credit)
1. Go to [railway.app](https://railway.app) → Sign Up
2. New Project → Add MySQL
3. Copy `DATABASE_URL` from Variables tab

---

### Step 2: Setup Cloudinary (Required)

1. Go to [cloudinary.com](https://cloudinary.com) → Sign Up (Free)
2. Dashboard → Copy these values:
   - Cloud Name
   - API Key
   - API Secret

---

### Step 3: Deploy to Vercel

1. **Go to** [vercel.com](https://vercel.com) → Sign in with GitHub

2. **Import Project**:
   - Click "Add New" → "Project"
   - Select `amg-real-estate` repository
   - Click "Import"

3. **Configure Project**:
   - Framework: **Next.js** (auto-detected)
   - Root Directory: `./`
   - Build Command: `prisma generate && next build`

4. **Add Environment Variables** (Click "Environment Variables"):

   ```env
   DATABASE_URL=your_planetscale_or_railway_url
   JWT_SECRET=generate_random_64_char_string
   JWT_ADMIN_SECRET=generate_different_64_char_string
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   SMTP_HOST=smtp.hostinger.com
   SMTP_PORT=587
   SMTP_USER=site@amg-invest.com
   SMTP_PASS=your_email_password
   FROM_EMAIL=site@amg-invest.com
   FROM_NAME=AMG Real Estate
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   NODE_ENV=production
   ```

   **Generate JWT Secrets**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

5. **Click "Deploy"** → Wait 2-5 minutes ⏱️

6. **Update URL**: After deployment, copy your Vercel URL and update `NEXT_PUBLIC_APP_URL`

---

### Step 4: Initialize Database

After first deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Run database push
vercel env pull .env.production
npx prisma db push --skip-generate
```

Or use PlanetScale/Railway web console to run migrations.

---

### Step 5: Test Your Site! 🎉

1. **Visit your site**: `https://your-app.vercel.app`
2. **Admin login**: `/admin/login`
   - Username: `admin`
   - Password: `admin123` (Change immediately!)
3. **Test features**:
   - Register new user
   - Add property
   - Upload images
   - Send inquiry

---

## ⚠️ Common Issues

### Issue: Build Failed
- **Check**: Environment variables are all set
- **Fix**: Ensure `DATABASE_URL` is correct

### Issue: Images Not Loading
- **Check**: Cloudinary credentials
- **Fix**: Verify `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`

### Issue: Database Connection Error
- **Check**: Database URL format
- **Fix**: Ensure SSL parameters if required

---

## 📞 Need Help?

- 📖 Full Guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
- 🔐 Environment Variables: [ENV_VARIABLES.md](./ENV_VARIABLES.md)
- 🐛 Vercel Logs: Dashboard → Project → Function Logs

---

**That's it! Your site is now live! 🚀**
