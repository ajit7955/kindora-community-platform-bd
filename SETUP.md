# Setup (Windows PowerShell)

## 1. Requirements
Install Node.js LTS, Git, and VS Code. Create a Neon PostgreSQL project.

## 2. Server
```powershell
cd server
npm install
Copy-Item .env.example .env
```
Edit `server/.env`:
- `DATABASE_URL`: Neon connection string (include `?sslmode=require`)
- `BETTER_AUTH_SECRET`: random secret, at least 32 characters
- `BETTER_AUTH_URL`: Better Auth base URL (for local development, `http://localhost:3000`)
- `CLIENT_URL`: `http://localhost:3000`

Then:
```powershell
npx prisma generate
npx prisma db push
npm run dev
```
Server runs at `http://localhost:5000`.

## 3. Client
Open another PowerShell:
```powershell
cd client
npm install
Copy-Item .env.example .env.local
```
Set `NEXT_PUBLIC_API_URL=http://localhost:5000/api` and Better Auth variables in `.env.local`.
Google OAuth is optional for local email/password testing. If enabled, add Google client ID and secret and configure the redirect URL shown in Better Auth docs.

```powershell
npm run dev
```
Open `http://localhost:3000`.

## Important auth note
Better Auth is hosted by the Next.js app; the Express API verifies the JWT issued by the auth integration. Keep the secret identical between auth and API. Never expose secrets as `NEXT_PUBLIC_*`.

## Deployment
- Client: Vercel
- Server: Render
- Database: Neon
- Set environment variables separately in each host.
- Add deployed client URL to server `CLIENT_URL`, and set auth base URL to the deployed client URL.
- Configure Google OAuth redirect URI according to Better Auth's current provider settings.

## Troubleshooting
- Neon: use the pooled connection string for serverless workloads and require SSL.
- If Prisma can't connect, verify `DATABASE_URL`, SSL, and database access.
- If a private route reloads to login, check auth session persistence and `NEXT_PUBLIC_API_URL`.
