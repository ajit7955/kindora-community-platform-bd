# Kindora — Social Development Events Platform

A community-driven social service events platform built with Next.js, Express, PostgreSQL (Neon), Better Auth, and JWT.

## Features
- Responsive modern landing page with hero, feature cards, event gallery and newsletter
- Email/password authentication and Google OAuth (Better Auth)
- Create, edit, delete events (ownership enforced on server)
- Public upcoming events and event detail pages
- Join events and see joined events
- Profile update
- JWT-protected Express API
- Light/dark theme toggle
- Form validation, toast messages, loading states
- Neon PostgreSQL database via Prisma

## Project structure
- `client`: Next.js App Router
- `server`: Express API + Prisma

## Setup
See `SETUP.md`. Copy each `.env.example` to `.env` / `.env.local` and add your own secrets.
Never commit credentials.
