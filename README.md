# ClientFlow

A full-stack client and project management SaaS application built with Next.js and Supabase.

ClientFlow is designed to help freelancers, small teams, and service businesses organize clients, projects, and day-to-day work from a clean, responsive dashboard.

## Overview

ClientFlow demonstrates a modern SaaS workflow combining frontend development, authentication, database integration, protected application areas, and production deployment.

The project was built as a portfolio application to demonstrate practical full-stack development with a real backend rather than a static UI prototype.

## Features

- User authentication
- Secure sign-in and account workflow
- Client management
- Project management
- Dashboard interface
- Supabase database integration
- Protected application routes
- Responsive desktop and mobile layouts
- Reusable React components
- Form handling and data management
- Modern SaaS user interface
- Production deployment with Vercel

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL
- Vercel
- Git & GitHub

## Architecture

ClientFlow uses Next.js for the application frontend and routing, while Supabase provides the backend services used by the application.

The project separates UI components, application logic, and backend integration to keep the codebase maintainable and easier to extend.

## Supabase Integration

Supabase is used for:

- Authentication
- User sessions
- Database storage
- Client data
- Project data
- Application data retrieval and updates

Environment variables are used for Supabase configuration so credentials are not hardcoded into the source code.

## Local Development

Clone the repository:

```bash
git clone <YOUR-GITHUB-REPOSITORY-URL>
cd clientflow
```

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Add your Supabase configuration to `.env.local`.

Example:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Never commit `.env.local` or private credentials to Git.

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Production Build

Create an optimized production build:

```bash
npm run build
```

Then start the production server locally:

```bash
npm start
```

## Deployment

ClientFlow is designed for deployment on Vercel.

Production environment variables should be configured securely through the Vercel project settings rather than committed to the repository.

## Project Purpose

ClientFlow was created to demonstrate my ability to build full-stack SaaS applications with:

- Next.js and React
- TypeScript
- Supabase backend integration
- Authentication workflows
- Database-driven interfaces
- Dashboard development
- Responsive UI development
- Environment-variable management
- Production deployment
- Git and GitHub workflows

## Security

The repository does not include private environment variables or API secrets.

Sensitive configuration should be stored in `.env.local` during local development and configured securely in the deployment environment for production.

## Author

**Ahmed Yasin**

Full-Stack Web Developer focused on Next.js, React, TypeScript, Supabase, SaaS applications, and modern responsive websites.

**Upwork:**  
https://www.upwork.com/freelancers/~01200b5066e1768082

## License

This project is intended for portfolio and demonstration purposes.
