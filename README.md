# Safero

AI-powered email threat detection for Gmail, built with Next.js and an optional Chrome extension.

## Description
Safero is a security-focused web platform that helps users identify phishing and suspicious emails before they click harmful links or share sensitive information.

The project combines:
- A web application for secure sign-in and dashboard-based email analysis
- Gmail API integration to fetch real inbox messages (with user consent)
- AI/heuristic threat analysis to classify email risk
- A Chrome extension that can surface security badges directly inside Gmail

## Problem It Solves
Phishing emails are increasingly sophisticated and often look legitimate. Most users do not have fast, contextual security feedback while reading emails.

Safero addresses this by:
- Detecting risky language patterns (urgency, credential requests)
- Flagging suspicious senders and link behavior
- Assigning a clear risk level so users can decide quickly
- Bringing detection to both a dedicated dashboard and Gmail UI (via extension)

## Key Features
- Google OAuth authentication with Gmail read access
- Protected dashboard route with session-aware middleware
- Gmail message fetching across inbox categories (including spam/trash when available)
- AI-based email analysis via Groq LLM
- Automatic fallback heuristic analysis if AI service is unavailable
- Risk scoring and classification (low/medium/high in dashboard flow; safe/suspicious/dangerous in fallback flow)
- Threat indicators and actionable recommendations per email
- Batch "Analyze All" workflow in dashboard
- Optional Chrome extension for in-Gmail visual security badges and detailed analysis panel
- Responsive landing, feature, and pricing pages

## Tech Stack
- Framework: Next.js 16 (App Router)
- Language: TypeScript
- UI: React 19, Tailwind CSS v4, Radix UI, Lucide icons
- Authentication: NextAuth v5 beta (Google provider)
- APIs/SDKs: Gmail API (`googleapis`), Groq SDK
- State/UX Utilities: next-themes, react-hook-form, zod
- Analytics: Vercel Analytics
- Extension: Chrome Extension (Manifest V3, content script + service worker)

## How To Use
1. Sign in with Google.
2. Go to the dashboard.
3. Fetch Gmail emails.
4. Analyze individual emails or run "Analyze All".
5. Review risk level, score, detected threats, and recommendations.