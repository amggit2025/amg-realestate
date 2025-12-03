# 🔐 Environment Variables Guide for Vercel Deployment

## Required Environment Variables

Copy these to Vercel Dashboard → Settings → Environment Variables

### 🗄️ Database Configuration

```env
# MySQL Database URL
# Get from: PlanetScale, Railway, or Aiven
DATABASE_URL="mysql://username:password@host:3306/database_name"
```

**Recommended Providers:**
- **PlanetScale** (Free tier available): https://planetscale.com
- **Railway**: https://railway.app
- **Aiven**: https://aiven.io

---

### 🔑 JWT Authentication

```env
# User JWT Secret (Generate a strong random string)
JWT_SECRET="REPLACE_WITH_RANDOM_64_CHAR_STRING"

# Admin JWT Secret (Generate a different strong random string)
JWT_ADMIN_SECRET="REPLACE_WITH_DIFFERENT_64_CHAR_STRING"

# JWT Expiration
JWT_EXPIRES_IN="7d"
JWT_REFRESH_EXPIRES_IN="30d"
```

**Generate secure secrets using:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

### ☁️ Cloudinary (Image Storage)

```env
# Public Cloud Name (visible in frontend)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"

# API Credentials (server-side only)
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

**Get Cloudinary credentials:**
1. Sign up at: https://cloudinary.com
2. Go to Dashboard → Account Details
3. Copy: Cloud Name, API Key, API Secret

---

### 📧 Email Configuration (SMTP)

```env
# SMTP Server Details
SMTP_HOST="smtp.hostinger.com"
SMTP_PORT="587"

# Email Account Credentials
SMTP_USER="site@amg-invest.com"
SMTP_PASS="your_email_password"

# From Email Details
FROM_EMAIL="site@amg-invest.com"
FROM_NAME="AMG Real Estate"
```

**Email Providers:**
- **Hostinger**: smtp.hostinger.com:587
- **Gmail**: smtp.gmail.com:587 (requires App Password)
- **SendGrid**: smtp.sendgrid.net:587
- **Mailgun**: smtp.mailgun.org:587

---

### 🌐 Application URL

```env
# Your Vercel deployment URL (update after first deploy)
NEXT_PUBLIC_APP_URL="https://your-app-name.vercel.app"

# Environment
NODE_ENV="production"
```

---

### 📊 Optional: Analytics & Performance

```env
# Disable Next.js telemetry
NEXT_TELEMETRY_DISABLED="1"
```

---

## 📝 How to Add to Vercel

### Method 1: Via Vercel Dashboard (Recommended)

1. Go to your project on Vercel
2. Navigate to: **Settings** → **Environment Variables**
3. Add each variable:
   - **Key**: Variable name (e.g., `DATABASE_URL`)
   - **Value**: Variable value
   - **Environments**: Select `Production`, `Preview`, `Development`
4. Click **Save**
5. **Redeploy** your application

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link your project
vercel link

# Add environment variable
vercel env add DATABASE_URL production
vercel env add JWT_SECRET production
# ... repeat for all variables

# Deploy
vercel --prod
```

### Method 3: Using .env file (Local Development)

```bash
# Copy template
cp .env.vercel .env.local

# Edit with your values
nano .env.local

# Pull from Vercel (if already set)
vercel env pull .env.local
```

---

## ⚠️ Important Notes

### Security Best Practices

1. **Never commit** `.env` or `.env.local` to Git
2. **Rotate secrets** regularly (especially JWT secrets)
3. **Use different secrets** for each environment
4. **Store backups** of your environment variables securely

### Variable Visibility

- **`NEXT_PUBLIC_*`** variables are exposed to the browser
- **Other variables** are only available on the server
- **Never put sensitive data** in `NEXT_PUBLIC_*` variables

### Database URLs

Make sure your `DATABASE_URL` includes:
- ✅ Correct protocol: `mysql://`
- ✅ Username and password
- ✅ Host and port
- ✅ Database name
- ✅ SSL parameters (if required)

**Example with SSL:**
```
mysql://user:pass@host:3306/db?sslaccept=strict
```

---

## 🧪 Testing Environment Variables

### Local Testing

```bash
# Create .env.local
cp .env.vercel .env.local

# Edit values
nano .env.local

# Test build
npm run build

# Test production mode
npm start
```

### Vercel Preview Testing

```bash
# Deploy to preview
git checkout -b test-env
git push origin test-env

# Vercel will create a preview deployment
# Check preview URL to test
```

---

## 🔍 Troubleshooting

### Issue: "DATABASE_URL is not defined"

**Solution:**
1. Verify variable is set in Vercel Dashboard
2. Check spelling matches exactly
3. Redeploy after adding variables

### Issue: "Cloudinary images not loading"

**Solution:**
1. Verify `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set
2. Check API credentials are correct
3. Ensure `next.config.ts` includes cloudinary in `remotePatterns`

### Issue: "Email not sending"

**Solution:**
1. Verify SMTP credentials
2. Check SMTP port (587 for TLS, 465 for SSL)
3. Enable "Less secure apps" for Gmail
4. Use App Password for Gmail

### Issue: "JWT token invalid"

**Solution:**
1. Ensure `JWT_SECRET` and `JWT_ADMIN_SECRET` are set
2. Check secrets are same across all deployments
3. Generate new secrets if compromised

---

## 📋 Complete Example

Here's a complete example with all variables:

```env
# Database
DATABASE_URL="mysql://user:password@aws-region.connect.psdb.cloud/amg-real-estate?sslaccept=strict"

# JWT
JWT_SECRET="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2"
JWT_ADMIN_SECRET="z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4z3y2x1w0v9u8"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_EXPIRES_IN="30d"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="amg-real-estate"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="abcdefghijklmnopqrstuvwxyz123456"

# Email
SMTP_HOST="smtp.hostinger.com"
SMTP_PORT="587"
SMTP_USER="site@amg-invest.com"
SMTP_PASS="SecurePassword123!"
FROM_EMAIL="site@amg-invest.com"
FROM_NAME="AMG Real Estate"

# App
NEXT_PUBLIC_APP_URL="https://amg-real-estate.vercel.app"
NODE_ENV="production"
NEXT_TELEMETRY_DISABLED="1"
```

---

## ✅ Verification Checklist

Before deploying, verify:

- [ ] All required variables are set in Vercel
- [ ] Database URL is correct and accessible
- [ ] JWT secrets are strong and unique
- [ ] Cloudinary credentials are valid
- [ ] SMTP credentials work (test with email)
- [ ] `NEXT_PUBLIC_APP_URL` matches deployment URL
- [ ] No `.env` files are committed to Git
- [ ] Backup of all environment variables is stored securely

---

**Ready to deploy?** Follow the steps in `DEPLOYMENT.md`! 🚀
