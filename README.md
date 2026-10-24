# Qarz Daftari — Sukhrob's GROUPE

Vercel + Neon PostgreSQL. This version adds a secure login page, protected API routes, a matching SG favicon, and keeps the existing debt dashboard.

## 1. Neon database
If your existing Neon database already has the `debts` table, **do not delete or recreate it**. Keep your current data.

For a new database, run `schema.sql` once in Neon SQL Editor.

## 2. Vercel Environment Variables
Keep your existing:

- `DATABASE_URL` = your Neon connection string

Add these three new variables in Vercel → Project → Settings → Environment Variables:

- `ADMIN_USERNAME` = your login name
- `ADMIN_PASSWORD` = your strong password
- `AUTH_SECRET` = a long random secret (at least 32 characters)

Example only (do not copy this password):
`ADMIN_USERNAME=admin`
`ADMIN_PASSWORD=your-own-strong-password`
`AUTH_SECRET=your-own-long-random-secret`

**Never put these values into GitHub or frontend HTML.**

## 3. Deploy
Upload all project files to your GitHub repository, then redeploy in Vercel.

## 4. Login
Open your normal site URL. It will send you to the new Sukhrob's GROUPE login page. After successful login, the debt dashboard opens.

The session is stored in an HttpOnly, Secure cookie and expires after 7 days.

## 5. Important
- Existing debt records stay in Neon; the login layer does not use localStorage for debt data.
- `/api/debts` and `/api/debts/:id` require authentication.
- `favicon.svg` is the same dark SG-style branding used by the site.
