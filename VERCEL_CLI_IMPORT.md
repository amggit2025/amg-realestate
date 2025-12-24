# 🚀 Import Environment Variables to Vercel using CLI

## Prerequisites:
# Install Vercel CLI if not installed:
# npm install -g vercel

## Steps:

### 1. Login to Vercel
vercel login

### 2. Link to your project
cd "e:\WebSite\AMG WebSite\AMG\Final1\Final"
vercel link

### 3. Import all environment variables from .env.vercel
vercel env pull

### 4. Or add variables one by one:
vercel env add NEXT_PUBLIC_TAWK_PROPERTY_ID production
# Paste value: 694c4ff1f137851977fe43ff

vercel env add NEXT_PUBLIC_TAWK_WIDGET_ID production  
# Paste value: 1jd91gifn

### 5. Redeploy
vercel --prod

---

## 📝 Notes:
- The .env.vercel file is ready for import
- All variables are formatted correctly
- Sensitive data is included (be careful!)

## ⚠️ Security:
- Never commit .env.vercel to Git
- It's already in .gitignore
- Only use it for Vercel import
