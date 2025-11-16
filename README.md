# PluginVerse - Plugin Marketplace

A complete plugin marketplace web application built with Next.js 14, TailwindCSS, and Supabase.

## Features

- 🔐 User authentication (signup/login/logout)
- 💰 Coin-based economy system
- 🔌 Plugin marketplace with purchase system
- 📥 Secure plugin downloads
- 💳 Deposit request system with admin approval
- 👑 Admin panel for managing plugins, deposits, and settings
- 🎨 Dark theme with Minecraft-inspired design
- 📱 Fully responsive design

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+ and npm
- Supabase account
- Git

## Setup Instructions

### 1. Clone and Install

```bash
cd pluginverse
npm install
```

### 2. Configure Supabase

#### A. Environment Variables

The `.env.local` file has been created with your Supabase credentials. You need to add the service role key:

1. Go to your Supabase Dashboard
2. Navigate to Project Settings → API
3. Copy the `service_role` key (secret key)
4. Update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tazgwygxqtczolvetyvh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

#### B. Run Database Migrations

1. Go to Supabase Dashboard → SQL Editor
2. Create a new query
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Click "Run"
5. Repeat for `supabase/migrations/002_rls_policies.sql`
6. Repeat for `supabase/migrations/003_create_admin.sql`

#### C. Create Storage Buckets

Follow the instructions in `supabase/STORAGE_SETUP.md` to create three storage buckets:

1. **plugins** (Private) - for plugin files
2. **logos** (Public) - for plugin images
3. **receipts** (Private) - for deposit screenshots

Quick steps:
1. Go to Supabase Dashboard → Storage
2. Create bucket `plugins` (uncheck "Public bucket")
3. Create bucket `logos` (check "Public bucket")
4. Create bucket `receipts` (uncheck "Public bucket")
5. Run the storage policies SQL from `STORAGE_SETUP.md`

#### D. Create Admin User

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add user" → "Create new user"
3. Email: `admin@gmail.com`
4. Password: `admin@786`
5. Click "Create user"
6. Go to SQL Editor and run:

```sql
SELECT public.set_user_as_admin('admin@gmail.com');
```

This sets the admin role for the user.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
pluginverse/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth pages (login, signup)
│   ├── (user)/              # User pages (account, deposit)
│   ├── (admin)/             # Admin pages
│   ├── plugin/[id]/         # Plugin detail page
│   ├── api/                 # API routes
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # Base UI components
│   ├── Navbar.tsx           # Navigation bar
│   ├── AdminNav.tsx         # Admin sidebar
│   └── PluginCard.tsx       # Plugin display card
├── lib/                     # Utilities and types
│   ├── supabase/            # Supabase clients
│   ├── types/               # TypeScript types
│   └── utils/               # Helper functions
├── supabase/                # Database migrations
│   └── migrations/          # SQL migration files
├── middleware.ts            # Auth middleware
└── next.config.ts           # Next.js configuration
```

## Usage

### For Users

1. **Sign Up**: Create an account at `/signup`
2. **Browse Plugins**: View available plugins on the homepage
3. **Add Coins**: Request a deposit at `/deposit`
4. **Purchase Plugins**: Buy plugins using your coin balance
5. **Download**: Access purchased plugins from `/account`

### For Admins

1. **Login**: Use `admin@gmail.com` / `admin@786`
2. **Manage Plugins**: Add/edit/delete plugins at `/admin/plugins`
3. **Approve Deposits**: Review and approve deposit requests at `/admin/deposits`
4. **Configure Settings**: Update payment numbers at `/admin/settings`

## API Routes

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Plugins
- `GET /api/plugins` - List all plugins
- `POST /api/plugins` - Create plugin (admin)
- `PUT /api/plugins/[id]` - Update plugin (admin)
- `DELETE /api/plugins/[id]` - Delete plugin (admin)
- `POST /api/plugins/purchase` - Purchase plugin

### Deposits
- `GET /api/deposits` - List deposits
- `POST /api/deposits` - Create deposit request
- `PUT /api/deposits/[id]` - Approve/reject deposit (admin)

### Downloads
- `GET /api/download/[id]` - Download purchased plugin

### Settings
- `GET /api/settings` - Get payment settings
- `PUT /api/settings` - Update settings (admin)

## Database Schema

### Tables

- **users**: User profiles with coin balance
- **plugins**: Plugin catalog
- **purchases**: Purchase records
- **deposits**: Deposit requests
- **settings**: System settings (payment numbers)

### Storage Buckets

- **plugins**: Private bucket for plugin files
- **logos**: Public bucket for plugin images
- **receipts**: Private bucket for payment screenshots

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy

### Post-Deployment

1. Verify admin user exists
2. Test authentication flow
3. Upload test plugins
4. Test purchase and download flow

## Troubleshooting

### "User already registered" error
- The user already exists in Supabase Auth
- Try logging in instead

### "Insufficient balance" error
- Request a deposit at `/deposit`
- Wait for admin approval

### Can't access admin panel
- Verify user has `role: 'admin'` in user metadata
- Run the `set_user_as_admin` function

### File upload fails
- Check storage buckets exist
- Verify RLS policies are applied
- Check file size limits

### Download doesn't work
- Verify purchase record exists
- Check storage bucket permissions
- Ensure signed URLs are enabled

## Development Notes

- The app uses Server Components by default for better performance
- Client Components are marked with `'use client'`
- Middleware handles authentication and authorization
- RLS policies enforce data access control
- All API routes include error handling

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
