📄 PDF Editor Platform

A full-stack PDF Review & Extraction Dashboard where users can:

Upload and view PDFs in-browser

Extract invoice data using AI (Gemini or Groq)

Edit extracted data and perform CRUD operations with MongoDB

Manage everything through a modern dashboard UI

🚀 Tech Stack

Frontend: React + Vite + TypeScript + shadcn/ui

Backend: Node.js (TypeScript) + Express

Database: MongoDB Atlas

AI Models: Gemini API / Groq

PDF Rendering: pdf.js

Deployment: Vercel (Web + API in monorepo)

📂 Project Structure
apps/
  ├── web    # React + Vite frontend
  └── api    # Node.js backend API

⚙️ Features

PDF Upload & View: Upload local PDFs (≤25MB) and render them.

AI Extraction: Extract structured invoice data with Gemini or Groq.

Editable Form: Edit vendor/invoice/line items in a right-side panel.

CRUD Operations: Create, Read, Update, Delete invoice records.

Search: Search invoices by vendor name or invoice number.

📦 Installation

Clone the repo

git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>


Install dependencies (monorepo root)

npm install


Start frontend (web)

npm run dev --workspace=apps/web


Start backend (api)

npm run dev --workspace=apps/api

🔑 Environment Variables

Create a .env file in both apps/web and apps/api:

apps/api/.env

MONGODB_URI=your-mongodb-uri
GEMINI_API_KEY=your-gemini-key
GROQ_API_KEY=your-groq-key


apps/web/.env

VITE_API_URL=http://localhost:3000

🌐 Deployment

Web: https://<project>-web.vercel.app

API: https://<project>-api.vercel.app

📌 API Endpoints
Upload PDF

POST /upload

{ "fileId": "123", "fileName": "invoice.pdf" }

Extract Data

POST /extract

{ "vendor": { "name": "ACME Corp" }, "invoice": { "number": "INV-001" } }

List Invoices

GET /invoices?q=vendorName

Get Invoice

GET /invoices/:id

Update Invoice

PUT /invoices/:id

Delete Invoice

DELETE /invoices/:id

🎥 Demo Video

➡️ Coming soon (show flow: upload → view → extract → edit → save → list → update → delete).

✅ Acceptance Criteria

PDF uploads and renders successfully.

AI extraction works with Gemini/Groq and outputs correct JSON.

Edited fields persist to MongoDB.

CRUD operations function as expected.

Deployed frontend + backend live on Vercel.
