# SupportFlow CRM

A full-stack customer support CRM designed to help support teams manage customer tickets, track issues, collaborate on resolutions, and prioritize support operations.

SupportFlow combines ticket management, search and filtering, SLA tracking, analytics, activity history, CSV export, and AI-assisted ticket triage in a responsive web interface.

🔗 **Live Demo:** [View](https://customer-support-crm-iota.vercel.app)
## ✨ Features

🔐 Admin Authentication
Admin-only login
JWT-based authentication
Password hashing with bcrypt
Protected ticket, dashboard, and AI APIs
Token-based authorization
Automatic logout on expired/invalid token
Environment-based admin credentials
Role validation for admin access

### Core Ticket Management

* Create support tickets with customer information
* Automatically generated ticket IDs (`TKT-0001`, `TKT-0002`, ...)
* Customer name and email
* Order ID
* Subject and detailed description
* Automatic creation and update timestamps
* View complete ticket details
* Update ticket status
* Add internal notes
* Track ticket activity

### 🔎 Search & Filtering

Search tickets by:

* Ticket ID
* Customer name
* Customer email
* Subject
* Description

Filter tickets by:

* Status
* Priority
* Category
* Channel

Supported statuses:

* Open
* In Progress
* Closed

### 📊 Support Dashboard

The dashboard provides an overview of support operations including:

* Total tickets
* Open tickets
* In-progress tickets
* Closed tickets
* High-priority tickets
* Overdue tickets
* Recent ticket activity
* Ticket distribution by status/category/priority

### ⏱️ SLA Tracking

Tickets can be monitored against priority-based SLA targets.

The system can identify:

* SLA due time
* Overdue tickets
* First response time
* Resolution time

### 👥 Team Collaboration

Support agents can:

* Assign tickets
* Add internal notes
* Add tags
* Track ticket activity
* Update ticket status
* Follow the ticket lifecycle

### 🤖 AI-Assisted Smart Triage

SupportFlow integrates Google Gemini to assist support agents with ticket triage.

The AI analyzes a ticket and can suggest:

* Category
* Priority
* Customer reply
* Reasoning behind the classification

Example:

```text
Customer issue:
"I was charged twice for my order."

AI Triage:
Category: Billing
Priority: High
```

### 🛡️ AI Fallback

The CRM remains functional even if the AI provider is unavailable.

If Gemini is unavailable, the system uses deterministic local rules to classify the ticket.

```text
Gemini Available
      ↓
Gemini AI Triage
      ↓
Category + Priority + Suggested Reply

Gemini Unavailable
      ↓
Local Fallback
      ↓
Category + Priority + Suggested Reply
```

This prevents an external AI service from becoming a single point of failure.

### 📥 CSV Export

Support teams can export ticket information as CSV for reporting and offline analysis.

### 🔐 Backend Security

The backend includes:

* Helmet security headers
* CORS configuration
* Rate limiting
* Environment-based secrets
* Centralized error handling
* Request logging
* Input validation

---

## 🏗️ Architecture

```text
                    ┌──────────────────────┐
                    │      User/Agent      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React + Vite       │
                    │   Frontend           │
                    └──────────┬───────────┘
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │ Node.js + Express    │
                    │ Backend API          │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┴──────────────┐
                 ▼                            ▼
        ┌─────────────────┐          ┌─────────────────┐
        │ MongoDB Atlas   │          │ Google Gemini   │
        │ Tickets + Notes │          │ Smart Triage    │
        └─────────────────┘          └─────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend

* React
* Vite
* JavaScript
* CSS

### Backend

* Node.js
* Express.js
* REST API
* Mongoose

### Database

* MongoDB
* MongoDB Atlas

### AI

* Google Gemini API
* Local rule-based fallback

### Security & Middleware

* Helmet
* CORS
* Express Rate Limit
* Morgan
* dotenv

### Development & Testing

* Git
* GitHub
* VS Code
* Hoppscotch

---

## 📁 Project Structure

```text
support-crm/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── middleware/
│   │   └── errorHandler.js
│   │
│   ├── models/
│   │   ├── Ticket.js
│   │   └── Note.js
│   │
│   ├── routes/
│   │   ├── ticketRoutes.js
│   │   └── aiRoutes.js
│   │
│   ├── server.js
│   ├── utils.js
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Install:

* Node.js 20+
* npm
* MongoDB Atlas account
* Git

Optional:

* Google Gemini API key
* Hoppscotch for API testing

Check Node.js:

```bash
node -v
```

Check npm:

```bash
npm -v
```

---

# 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/supportflow-crm.git
```

Move into the project:

```bash
cd supportflow-crm
```

---

# 2. Setup Backend

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create:

```text
server/.env
```

Use the following structure:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

CLIENT_URL=http://localhost:5173

GEMINI_API_KEY=your_gemini_api_key

GEMINI_MODEL=your_available_gemini_model
```

### Environment Variables

| Variable         | Description                                |
| ---------------- | ------------------------------------------ |
| `PORT`           | Backend server port                        |
| `MONGO_URI`      | MongoDB Atlas connection string            |
| `CLIENT_URL`     | Frontend URL used for CORS                 |
| `GEMINI_API_KEY` | Google Gemini API key                      |
| `GEMINI_MODEL`   | Gemini model available to your API account |

**Never commit `.env` to GitHub.**

---

# 3. Setup MongoDB Atlas

1. Create an account at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a project.
3. Create a free database deployment/cluster.
4. Create a database user.
5. Configure Network Access.
6. Go to:

```text
Database
→ Connect
→ Drivers
→ Node.js
```

7. Copy the MongoDB connection string.
8. Add it to:

```text
server/.env
```

Example:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/supportflow
```

The application uses MongoDB/Mongoose to store ticket and note information.

---

# 4. Start Backend

From the `server` directory:

```bash
npm run dev
```

The API runs on:

```text
http://localhost:5000
```

Test the health endpoint:

```text
http://localhost:5000/api/health
```

---

# 5. Setup Frontend

Open another terminal.

From the project root:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create:

```text
client/.env
```

Add:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

# 🔌 API Documentation

## Health Check

```http
GET /api/health
```

Checks whether the backend is running.

---

## Create Ticket

```http
POST /api/tickets
```

Request:

```json
{
  "customer_name": "Rahul Sharma",
  "customer_email": "rahul@gmail.com",
  "subject": "Payment failed",
  "description": "My payment failed but the amount was deducted."
}
```

Response includes:

```json
{
  "ticket_id": "TKT-0001",
  "created_at": "..."
}
```

---

## Get Tickets

```http
GET /api/tickets
```

Optional filtering:

```http
GET /api/tickets?status=Open
```

Search:

```http
GET /api/tickets?search=Rahul
```

Combined:

```http
GET /api/tickets?status=Open&search=payment
```

---

## Get Ticket Details

```http
GET /api/tickets/:ticket_id
```

Example:

```http
GET /api/tickets/TKT-0001
```

---

## Update Ticket

```http
PUT /api/tickets/:ticket_id
```

Example:

```json
{
  "status": "In Progress",
  "notes": "Payment transaction is being investigated."
}
```

---

## Dashboard Statistics

```http
GET /api/tickets/dashboard
```

Returns aggregated ticket statistics used by the dashboard.

---

## CSV Export

```http
GET /api/tickets/export/csv
```

Exports ticket information for reporting.

---

## AI Smart Triage

```http
POST /api/ai/triage
```

Request:

```json
{
  "ticket_id": "TKT-0001"
}
```

Example response:

```json
{
  "category": "Billing",
  "priority": "High",
  "suggested_reply": "We are reviewing your payment issue and will assist you shortly.",
  "reasoning": "The customer reported a payment-related issue.",
  "source": "gemini"
}
```

If Gemini is unavailable:

```json
{
  "category": "Billing",
  "priority": "High",
  "source": "fallback"
}
```

---

# 🧪 API Testing with Hoppscotch

Recommended testing sequence:

```text
GET  /api/health
        ↓
POST /api/tickets
        ↓
GET  /api/tickets
        ↓
GET  /api/tickets/TKT-0001
        ↓
POST /api/ai/triage
        ↓
PUT  /api/tickets/TKT-0001
```

For JSON requests, use:

```http
Content-Type: application/json
```

---

# 🔒 Security

Sensitive configuration is stored in environment variables.

Example:

```env
MONGO_URI=...
GEMINI_API_KEY=...
```

These values should never be committed to GitHub.

The repository uses `.gitignore` to exclude:

```text
.env
node_modules/
dist/
build/
```

# 🤖 Smart Triage Flow

```text
Ticket
   │
   ▼
Express API
   │
   ▼
Gemini AI
   │
   ├── Category
   ├── Priority
   ├── Reasoning
   └── Suggested Reply
   │
   ▼
Support Agent
```

If Gemini is unavailable:

```text
Ticket
   │
   ▼
Local Rule Engine
   │
   ├── Category
   └── Priority
```

This fallback keeps the CRM operational even when the external AI service is unavailable.

---

# 🚀 Deployment

## Backend — Render

1. Push the project to GitHub.
2. Create a new Web Service on [Render](https://render.com/).
3. Connect your GitHub repository.
4. Set the root directory:

```text
server
```

5. Build command:

```bash
npm install
```

6. Start command:

```bash
npm start
```

7. Add environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
CLIENT_URL=https://your-frontend.vercel.app
GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=your_available_model
```

# 🔮 Future Improvements

Potential future improvements include:

* Authentication and role-based access control
* Multi-agent real-time collaboration
* Email integration
* WhatsApp/chat integrations
* Customer portal
* Advanced SLA policies
* AI-powered duplicate-ticket detection
* Knowledge-base recommendations
* Conversation history
* Real-time notifications
* Advanced reporting and analytics


