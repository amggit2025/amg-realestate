# Vercel Environment Variables Setup Guide

## Critical Environment Variables for Image Upload

Make sure these are set in your Vercel project settings:

### Cloudinary Settings
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dkvqlvucy
CLOUDINARY_API_KEY=594228169165472
CLOUDINARY_API_SECRET=MOhyNfJwsBE9DwQA2s2i4YB8Geg
```

### Database URL
```
DATABASE_URL=mysql://root:RiQGehslYCNRilpFqFzIRoxiJaLXnOQX@nozomi.proxy.rlwy.net:16757/railway
```

### Authentication
```
NEXTAUTH_SECRET=amg-real-estate-secret-key-2024-super-secure
NEXTAUTH_URL=https://amg-realestate.vercel.app
JWT_SECRET=amg-jwt-secret-key-very-secure-2024
JWT_ADMIN_SECRET=amg-admin-jwt-secret-key-super-secure-2024-v2
```

## How to Add to Vercel

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable above
5. Redeploy the project

## Testing After Deploy

Test the image optimization:
```
https://your-domain.vercel.app/_next/image?url=https://res.cloudinary.com/dkvqlvucy/image/upload/v1766773903/amg-projects/test.png&w=1080&q=75
```

Should return 200 OK, not 404.
