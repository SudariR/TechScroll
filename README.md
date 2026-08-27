# TechScroll

**AI-Powered Interactive Learning Platform for Technology News**

TechScroll transforms complex technology news into short-form, swipeable
interactive explainers. Instead of generating video, an AI produces a
**structured JSON description** of a lesson, and the frontend renders it
through a registry of reusable animated scene templates.

> Core philosophy: information is always more important than animation.
> If an animation doesn't teach something, it shouldn't exist.

## Architecture

News Sources → Content Collector → AI Processing → Structured JSON
→ PostgreSQL → Animation Rendering Engine → Swipe Feed

## Status

🚧 In development 

- [x] JSON schema for scene templates
- [x] Registry-based scene dispatcher
- [x] Hero / Comparison / Statistic templates
- [x] Auto-advancing clip player with progress bar
- [x] Timeline & Cause→Effect templates
- [x] Vertical snap-scrolling swipe feed
- [x] IntersectionObserver-driven active clip detection
- [x] Keyboard navigation (scenes + clips)
- [ ] Feed windowing for large clip lists
- [ ] NestJS + Gemini content pipeline
- [ ] Admin dashboard, auth, bookmarks

## Tech Stack

**Frontend:** React, TypeScript, Vite, TailwindCSS, Framer Motion, Lucide
**Backend (planned):** NestJS, PostgreSQL, Prisma, JWT
**AI (planned):** Gemini API with structured output validation

## Running locally

```bash
cd frontend
npm install
npm run dev
