# Personal Portfolio

A sleek, modern personal portfolio built with React, Vite, Tailwind CSS (v4), and Framer Motion.
It includes a functional contact form that uses Vercel Serverless Functions and the Resend API to send emails.

## Features
- **Modern UI:** Built with Tailwind CSS and Framer Motion for smooth animations.
- **Serverless Contact Form:** Uses Vercel Serverless Functions (`/api/send.js`) to securely send emails without exposing API keys to the frontend.
- **Email Delivery:** Powered by [Resend](https://resend.com).

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root of your project based on the `.env.example` file:
```bash
cp .env.example .env
```
Fill in your details:
- `EMAIL_TO`: The email address where you want to receive contact form submissions.
- `RESEND_API_KEY`: Your API key from [Resend](https://resend.com).

### 3. Running Locally
Because this project uses Vercel Serverless Functions for the backend, you must use the Vercel CLI to run the development server (Vite's default `npm run dev` will not run the `/api` endpoints).

Install Vercel CLI globally (if you haven't already):
```bash
npm install -g vercel
```

Start the local development server:
```bash
vercel dev
```

### 4. Deployment
This project is pre-configured to be deployed on [Vercel](https://vercel.com).
1. Push your code to a GitHub repository.
2. Import the repository in your Vercel dashboard.
3. Add your `EMAIL_TO` and `RESEND_API_KEY` in the Vercel project's **Environment Variables** settings.
4. Deploy!
