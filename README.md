# SupportFlow CRM

A production-oriented customer support ticketing CRM built for the Datastraw assessment. It implements every required core workflow and adds a focused standout feature: **Smart Triage** plus SLA/operations visibility.

## What is included

### Assessment requirements

- Create tickets with customer name/email, subject and description
- Auto-generated `TKT-0001` style IDs and timestamps
- Ticket inbox with ID, customer, subject, status, priority and date
- Live search across ID, name, email, subject and description
- Status filters: Open, In Progress, Closed
- Detailed ticket view
- Status updates and internal notes
- REST API with the four required ticket endpoints
- Responsive professional UI

### Standout features

- **Smart Triage:** optional Gemini API-powered category/priority/reply recommendation with a deterministic local fallback when no API key is configured.
- **SLA tracking:** deadline is calculated from priority and overdue tickets are surfaced on the dashboard.
- **Support dashboard:** workload, SLA risk, priority/category charts and recent activity.
- Assignment, category, channel, priority and tags for practical team routing.
- Activity timeline and CSV export.
- Security basics: Helmet, CORS, JSON limits, request logging and rate limiting.

The assessment asks candidates not to over-engineer the database; this project keeps two MongoDB collections: `tickets` and `notes`, while operational metadata is kept on the ticket itself.

## Stack

- Frontend: React + Vite + React Router + Recharts + Lucide
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Optional AI: Gemini API
- Deploy: Vercel (frontend) + Render/Railway (backend)

## Local setup

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Set `MONGO_URI` to your MongoDB connection string.

### 2. Frontend

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Open the Vite URL shown in the terminal.

# Smart Triage
- Uses Google Gemini for AI-assisted ticket classification.
- Determines category and priority.
- Generates a suggested customer response.
- Uses a deterministic local fallback when Gemini is unavailable.


## API

Required:

- `POST /api/tickets`
- `GET /api/tickets?status=Open&search=riya`
- `GET /api/tickets/:ticket_id`
- `PUT /api/tickets/:ticket_id`

Additional:

- `GET /api/tickets/dashboard`
- `GET /api/tickets/export/csv`
- `POST /api/ai/triage`
- `GET /api/health`

## Deployment

### Backend on Render

- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Environment: `MONGO_URI`, `CLIENT_URL`, optional `OPENAI_API_KEY`, `OPENAI_MODEL`

### Frontend on Vercel

- Root directory: `client`
- Build command: `npm run build`
- Output: `dist`
- Environment: `VITE_API_URL=https://YOUR-BACKEND/api`

## Demo flow for the 3–5 minute video

1. Open dashboard and explain workload/SLA cards.
2. Create a ticket with a realistic billing or technical issue.
3. Show auto-generated ID and priority/SLA.
4. Search the ticket from the inbox and filter by status.
5. Open details, run Smart Triage, apply recommendation.
6. Add an internal note and change assignment/status.
7. Show activity timeline and dashboard update.
8. Briefly show backend folders, MongoDB models and REST endpoints.

## Architecture

`React UI → Axios REST calls → Express routes → Mongoose → MongoDB`

Smart Triage uses `OpenAI API → JSON recommendation → optional apply to ticket`; when the API key is absent, the server uses a deterministic local triage engine.
