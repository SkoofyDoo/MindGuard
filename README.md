# MindGuard

**AI Mood Monitoring**

An AI-powered tool that helps you track your mood, receive personalized advice, and view long-term emotional statistics.

---

## The Idea

MindGuard is an AI-powered mood monitoring tool. You record a short 30–60 second video talking about your day. The app analyzes your facial expressions and voice locally, then gives you personalized recommendations and tracks your emotional trends over time.

The goal is practical: help you understand your mood patterns, receive useful advice, and see real progress through statistics — without questionnaires, without therapy framing, and with maximum privacy.

## The Goal

To give people a simple, private, and effective way to monitor their mood using AI.

MindGuard helps users:

- Quickly log how they feel through video
- Receive personalized, actionable advice
- See clear statistics and long-term emotional trends

The tool is designed to be useful and non-intrusive — focused on monitoring and improvement rather than clinical diagnosis.

## Philosophy

- **Radical privacy by default.** As much processing as possible happens on the user’s device.
- **Transparency over magic.** The Pipeline Visualizer shows exactly what happens to the data at every step.
- **Beauty matters.** The interface is deliberately calm, premium, and non-clinical.
- **No patients, only people.** This is not a medical or therapeutic tool.

## Current Status — Phase 1 (Live)

MindGuard is currently in an advanced prototype / high-fidelity demo stage.

**What is fully working today:**

- Beautiful marketing landing page with full internationalization (English, Russian, German)
- Fully functional **Live Demo** (`/demo`):
  - Record video directly in the browser or upload from device gallery
  - Drag & drop support
  - Real client-side frame extraction and sharpness scoring (pure JavaScript, no heavy dependencies)
  - Interactive frame selection gallery
  - Animated end-to-end Pipeline Visualizer (full transparency)
  - High-quality, multilingual mock analysis results with empathetic summaries and personal recommendations
- Working **Self-Pricing + Feedback + Waitlist** form that sends real emails via Resend
- Complete design system (dark theme, #00ff9d lime accents, premium micro-interactions)

Everything related to video processing runs **entirely in the browser**. No raw video ever leaves the user’s device in the current version.

## Real-World Validation Experiment

**Date:** Started May 31, 2026  
**Channel:** Instagram Advertising (Germany)  
**Objective:** A low-budget idea validation test. Random users were invited to try the live demo, suggest a fair monthly price they would pay for the product, and join the Waitlist.

**Experiment Parameters**
- **Country:** Germany
- **Ad budget:** €10
- **Most active age group:** 25–34 years

**Results**

| Metric                  | Count |
|-------------------------|-------|
| Ad impressions / views  | 553   |
| Landing page visits     | 46    |
| Waitlist sign-ups       | 0     |

**Key Insights — Why zero conversions?**

- The product's value proposition was not immediately clear to first-time visitors
- Reliance on mocked data and simulated analysis results reduced perceived credibility and usefulness
- Strong concerns around video privacy and potential data leakage, even with explicit "zero-knowledge" and local-processing messaging

**Outcome**

The test returned a clear directional signal:

> **0 people** were willing to join the Waitlist after experiencing the current version of the product.

This real-world feedback is informing the next iterations of positioning, messaging clarity, trust-building mechanisms, and overall product experience.

## How It Works (High Level)

1. User records or uploads a short video (30–60s)
2. All frames are extracted and scored locally using sharpness + contrast heuristics
3. User can review and deselect any frames they don’t like
4. A beautiful animated pipeline shows exactly what would happen next (local extraction → quality selection → encryption → analysis)
5. User receives elegant emotional metrics + 2–4 thoughtful personal recommendations

## Technology

- **Next.js 16** (App Router) + **React 19** + TypeScript
- Pure client-side video processing (`<video>` + Canvas + custom Laplacian sharpness scoring)
- **Framer Motion** for premium animations
- Full i18n system with persistent language preference
- Resend for transactional emails (Self-Pricing form)
- Tailwind + custom premium design system

## Roadmap

### Phase 1 — Foundation & First Impression (Current)

- Marketing landing + Live Demo
- Client-side video processing and intelligent frame selection
- Beautiful results visualization
- Multilingual support (EN / RU / DE)
- Self-Pricing + Feedback form with real email delivery

### Phase 2 — History & Privacy (Next)

- Local history of check-ins (IndexedDB)
- Long-term emotional trends and patterns
- Full device-side AES-256 encryption with user passphrase
- Privacy settings and data control

### Phase 3 — Real Multimodal AI

- Production-grade backend using LangGraph
- True multimodal analysis (Vision + Audio prosody + Text)
- Significantly higher quality and more personalized insights
- Optional secure server-side processing (with explicit user consent)

### Phase 4 — Scale & Public Launch

- User accounts with end-to-end encrypted sync across devices
- Live pricing and subscription management
- Public product launch
- Partnerships and thoughtful integrations

The plan is intentionally ambitious but grounded. We are moving slowly and deliberately, prioritizing privacy, quality, and calm user experience over speed.

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and click **“Try Live Demo”**.

## Deployment

The easiest way to experience MindGuard on a real mobile device (where camera access is most meaningful) is to deploy it to Vercel.

### Recommended Flow (GitHub + Vercel)

1. Push the project to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import your repository.
3. Add the following environment variables in the Vercel dashboard:

| Name             | Description                                       | Required for                          |
| ---------------- | ------------------------------------------------- | ------------------------------------- |
| `RESEND_API_KEY` | Your Resend API key                               | Email delivery from Self-Pricing form |
| `WAITLIST_EMAIL` | Email address that should receive all submissions | Recommended                           |

4. Deploy.

After deployment you will receive a public HTTPS URL. Open it on your phone to test the camera and microphone experience.

## Privacy & Data

MindGuard is built with a zero-knowledge mindset:

- In Phase 1, **zero** video data ever leaves the browser.
- Future versions will only ever send a very small number of selected, encrypted frames.
- The user remains in full control at every step.

This is not a data collection product. It is a reflection tool.

---

**MindGuard • 2026**

\*Calm technology for people who want to understand themselves better.
