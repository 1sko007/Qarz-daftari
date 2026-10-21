# Qarz Daftari — Vercel + Neon

## 1. Database
1. Create a Neon PostgreSQL database.
2. Open SQL Editor.
3. Paste everything from `schema.sql` and run it.
4. Copy the database connection string (`DATABASE_URL`).

## 2. Deploy
1. Upload this project to a GitHub repository.
2. In Vercel choose **Add New Project** and import the repository.
3. Add Environment Variable:
   - `DATABASE_URL` = your Neon connection string
4. Deploy.

The app will be available at a Vercel HTTPS address.

## 3. Important
This version stores debt data online in PostgreSQL. The browser is only the interface.
Do not publish your DATABASE_URL in frontend code or GitHub.

## Current features
- Dashboard with total remaining debt
- Returned and overdue totals
- Add debt with shop, phone, product, quantity, price, dates
- Partial payments and payment history
- Search and filters
- Shop summary
- Delete debt
- Vercel serverless API
