# AMG Real Estate Website

A modern, full-featured real estate platform built with Next.js, TypeScript, and MySQL.

## 🚀 Features

### User Features
- **Property Listings**: Browse and search properties with advanced filters
- **User Dashboard**: Manage your property listings
- **Add Properties**: Upload property listings with images (stored on Cloudinary)
- **Favorites**: Save favorite properties
- **Inquiries**: Contact property owners

### Admin Features
- **Admin Dashboard**: Complete CMS for managing all content
- **Projects Management**: Showcase company projects
- **Portfolio Management**: Display completed works
- **Services Management**: Manage company services
- **User Management**: Admin and user permissions
- **Analytics**: View site statistics and reports

### Technical Features
- **Next.js 15**: Latest App Router with Server Components
- **TypeScript**: Full type safety
- **Prisma ORM**: Type-safe database queries
- **Cloudinary**: Cloud-based image storage with auto-delete
- **Authentication**: JWT-based auth system
- **Responsive Design**: Mobile-first approach
- **SEO Optimized**: Meta tags and sitemap
- **Performance**: Optimized images and lazy loading

## 📦 Tech Stack

- **Framework**: Next.js 15.4.4
- **Language**: TypeScript
- **Database**: MySQL with Prisma ORM
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI, Heroicons
- **Animations**: Framer Motion
- **Image Storage**: Cloudinary
- **Email**: Nodemailer
- **Validation**: Zod

## �️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Final
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
Create `.env` file with:
```env
DATABASE_URL="mysql://user:password@localhost:3306/amg_real_estate"
JWT_SECRET="your-secret-key"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
```

4. **Setup database**
```bash
npx prisma generate
npx prisma db push
```

5. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
Final/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── admin/        # Admin dashboard
│   │   ├── dashboard/    # User dashboard
│   │   ├── api/          # API routes
│   │   └── ...
│   ├── components/       # React components
│   │   ├── admin/        # Admin components
│   │   ├── features/     # Feature components
│   │   ├── layout/       # Layout components
│   │   └── ui/           # UI components
│   ├── lib/              # Utilities and helpers
│   └── types/            # TypeScript types
├── prisma/               # Database schema
├── public/               # Static assets
└── ...
```

## 🔐 Default Admin Credentials

**Important**: Change these after first login!

```
Email: admin@amgrealestate.com
Password: admin123456
```

## 🖼️ Image Management

All images are stored on Cloudinary with automatic deletion:
- Properties images auto-delete when property is deleted
- Project images auto-delete when project is deleted
- Portfolio images auto-delete when item is deleted
- Service images auto-delete when service is updated/deleted

## 📝 Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # Run ESLint
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/amggit2025/amg-real-estate)

#### Quick Start on Vercel:

1. **Click the button above** or go to [vercel.com](https://vercel.com)
2. **Import** your GitHub repository
3. **Configure** environment variables (see `ENV_VARIABLES.md`)
4. **Deploy** and wait for build to complete

📖 **Detailed deployment guide:** See [DEPLOYMENT.md](./DEPLOYMENT.md)
🔐 **Environment variables guide:** See [ENV_VARIABLES.md](./ENV_VARIABLES.md)

#### Required Services:
- **Database**: PlanetScale (free), Railway, or Aiven
- **Image Storage**: Cloudinary (free tier available)
- **Email**: Any SMTP provider (Hostinger, Gmail, SendGrid)

### Manual Deployment

1. **Build for production**
```bash
npm run build
```

2. **Environment variables**
Set all environment variables on your hosting platform (see `.env.vercel` template)

3. **Database**
Run migrations on production database:
```bash
npx prisma generate
npx prisma db push
```

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Complete Vercel deployment instructions
- [Environment Variables](./ENV_VARIABLES.md) - All required environment variables
- [Copilot Instructions](./.github/copilot-instructions.md) - AI coding assistant setup

## � License

Private - AMG Real Estate Company

## 👨‍💻 Development

Built with ❤️ for AMG Real Estate

---

## 🔗 Links

- **GitHub**: [github.com/amggit2025/amg-real-estate](https://github.com/amggit2025/amg-real-estate)
- **Live Demo**: Coming soon on Vercel 🚀

