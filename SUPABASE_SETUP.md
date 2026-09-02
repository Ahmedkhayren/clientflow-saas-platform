# ClientFlow setup and deployment

## 1. Create the Supabase project

1. Create a project in the Supabase dashboard and wait for it to finish provisioning.
2. Open **SQL Editor** and run the full migration in `supabase/migrations/20260831000000_clientflow.sql`.
3. In **Authentication → Providers → Anonymous**, enable **Allow anonymous sign-ins**. This is required for the one-click demo button.
4. In **Authentication → Providers → Email**, enable Email. For a production deployment, enable email confirmations and configure a custom SMTP provider if you need dependable delivery.
5. In **Authentication → URL Configuration**, add these redirect URLs:
   - `http://localhost:3000/dashboard`
   - `https://your-vercel-domain.vercel.app/dashboard`
   - Your custom domain equivalent, if applicable.
6. Copy the Project URL and the publishable/anon key from **Project Settings → API**.

## 2. Configure the app

1. Copy `.env.example` to `.env.local`.
2. Add the values from the Supabase project:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

3. Install and run the app:

```bash
npm install
npm run dev
```

The app intentionally has no service-role key. Browser requests use the anon key and are constrained by the RLS policies in the migration.

## 3. Deploy to Vercel

1. Push this project to a Git repository and import it into Vercel.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in **Vercel → Project → Settings → Environment Variables** for Production, Preview, and Development as needed.
3. Deploy. Vercel will use `npm run build`.
4. Add the generated Vercel URL to Supabase Auth redirect URLs, then redeploy if the URL changed.

## Security model

- Every client, project, task, and activity record belongs to a workspace.
- RLS checks membership with secure `auth.uid()`-based helper functions.
- Anonymous visitors receive an independent `is_demo` workspace through `initialize_workspace()`.
- `reset_demo_workspace()` only permits anonymous users to reset their own demo workspace.
- Normal email users receive an empty private workspace and can create their own records.

## Verification checklist

After deploying, test anonymous demo entry in two separate private browser sessions. Each user should see different workspace IDs and data changes must remain private. Then create two email accounts and verify that each account only sees its own workspace.
