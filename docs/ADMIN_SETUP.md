# Admin CMS Setup Guide

This guide will help you set up and use the admin backend for Vision-RS.

## Features

- JWT-based authentication for single admin user
- Article CRUD operations (Create, Read, Update, Delete)
- MDX editor with live preview
- Article status management (draft, published, hidden, archived)
- Category and tag support
- Article sorting and filtering
- Catppuccin Macchiato theme UI

## Prerequisites

1. Vercel account (for deployment)
2. Upstash Redis / Vercel KV (for metadata storage)

## Setup Steps

### 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
JWT_SECRET=your-secret-key-here
INIT_SECRET=your-init-secret-here
KV_REST_API_URL=your-kv-rest-api-url
KV_REST_API_TOKEN=your-kv-rest-api-token
```

Generate secure secrets:

```bash
# Generate JWT secret
openssl rand -base64 32

# Generate init secret
openssl rand -base64 32
```

### 2. Vercel KV Setup

1. Go to Vercel Dashboard
2. Navigate to your project
3. Go to "Storage" tab
4. Create a new KV (Redis) database
5. Connect it to your project
6. Copy the environment variables to your `.env.local`

For local development, you can also use Upstash Redis directly:

1. Create an account at https://upstash.com
2. Create a Redis database
3. Copy the REST API URL and Token to your `.env.local`

### 3. Create Admin User

After deploying or running locally, create your admin account by making a POST request to `/api/auth/init`:

```bash
curl -X POST http://localhost:3000/api/auth/init \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-secure-password",
    "initSecret": "your-init-secret-here"
  }'
```

**Important**: You can only create one admin user. After creation, you should remove or change the `INIT_SECRET` environment variable to prevent unauthorized user creation.

### 4. Login

1. Navigate to `/admin/login`
2. Enter your email and password
3. You'll be redirected to the admin dashboard

## Usage

### Creating Articles

1. Click "New Article" button on the dashboard
2. Fill in the article details:
   - Title (required)
   - Slug (required) - URL-friendly identifier
   - Category (optional)
   - Tags (optional) - comma-separated
   - Status - draft, published, hidden, or archived
   - Content (required) - Write your MDX content with live preview

3. Click "Create Article"

### Editing Articles

1. Click "Edit" on any article in the dashboard
2. Modify the fields as needed
3. Click "Save Changes"

### Deleting Articles

1. Click "Delete" on any article
2. Confirm the deletion

### Article Status

- **Draft**: Work in progress, not visible to public
- **Published**: Live on the website
- **Hidden**: Temporarily hidden from public view
- **Archived**: Old content, removed from main listings

### Filtering Articles

Use the filter buttons on the dashboard to view articles by status:

- All
- Draft
- Published
- Hidden
- Archived

## File Structure

The admin system follows this structure:

```
app/
├── admin/
│   ├── login/page.tsx          # Login page
│   ├── page.tsx                # Admin dashboard (article list)
│   └── articles/
│       ├── new/page.tsx        # Create new article
│       └── [id]/page.tsx       # Edit article
├── api/
│   ├── auth/
│   │   ├── login/route.ts      # Login endpoint
│   │   └── init/route.ts       # Admin user initialization
│   └── articles/
│       ├── route.ts            # List & create articles
│       └── [id]/route.ts       # Get, update & delete article
components/
├── MDXEditor.tsx               # MDX editor component
contexts/
├── AuthContext.tsx             # Authentication context
lib/
├── auth.ts                     # JWT utilities
└── db.ts                       # Vercel KV database utilities
content/
└── articles/                   # MDX article files
    └── [id].mdx
```

## Architecture

- **Frontend**: Next.js 14 with App Router, React, TypeScript
- **Authentication**: JWT tokens stored in localStorage
- **Database**: Vercel KV (Redis) for metadata
- **File Storage**: Local filesystem for MDX content
- **Editor**: @uiw/react-md-editor with live preview

## Security

- JWT tokens expire after 7 days
- Passwords are hashed with bcrypt (10 rounds)
- API routes are protected with authentication middleware
- Admin routes redirect to login if not authenticated
- HTTPS required in production (provided by Vercel)

## Troubleshooting

### "Unauthorized" errors

- Check that you're logged in
- Verify your JWT token is valid
- Try logging out and logging in again

### "Invalid credentials" on login

- Verify your email and password are correct
- Ensure the admin user was created successfully

### Articles not saving

- Check Vercel KV connection
- Verify environment variables are set correctly
- Check browser console for errors

### MDX editor not loading

- Clear browser cache
- Ensure all dependencies are installed (`npm install`)
- Check for JavaScript errors in console

## Development

Run locally:

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm start
```

## License

Same as the main Vision-RS project.
