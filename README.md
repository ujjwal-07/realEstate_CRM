# Real Estate CRM

A modern, full-stack CRM built for real estate agents to manage leads, track property requirements, log internal notes, and maintain a full audit trail — all in one place.

Built with **Next.js 15 App Router**, **MongoDB (Mongoose)**, **TypeScript**, and **Tailwind CSS v4**.

---

## Features

- **Lead Management** — Create, view, edit, and delete leads with full contact and property details
- **Status Pipeline** — Track leads through `New → Contacted → Site Visit → Closed`
- **Source Tracking** — Know where every lead came from (Facebook, Google, Referral, Website, Other)
- **Internal Notes** — Add, edit, and delete private notes per lead
- **Audit Trail** — Auto-logged history of every field change with timestamps
- **Filtering & Search** — Filter by status, source, or search by name / phone
- **Responsive UI** — Mobile-friendly with a collapsible sidebar and horizontally scrollable tables
- **Form Validation** — Zod schema validation on all API routes

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript 5 |
| Database | MongoDB Atlas via [Mongoose 9](https://mongoosejs.com) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Icons | [Lucide React](https://lucide.dev) |
| Validation | [Zod](https://zod.dev) |
| Forms | [React Hook Form](https://react-hook-form.com) + `@hookform/resolvers` |
| Deployment | [Vercel](https://vercel.com) |

---

## Project Structure

```
uptown/
├── app/
│   ├── api/
│   │   └── leads/
│   │       ├── route.ts          # GET all leads, POST new lead
│   │       └── [id]/route.ts     # GET, PUT, DELETE a single lead
│   ├── leads/
│   │   ├── leadtable/page.tsx    # Leads list page (Server Component)
│   │   ├── [id]/page.tsx         # Lead detail page
│   │   └── new/page.tsx          # Add new lead form
│   ├── main/                     # Dashboard
│   ├── globals.css
│   ├── layout.tsx                # Root layout with Sidebar
│   └── page.tsx                  # Home / redirect
├── components/
│   ├── layout/
│   │   └── Sidebar.tsx           # Collapsible navigation sidebar
│   └── leads/
│       ├── LeadsTable.tsx        # Filterable, sortable leads table
│       ├── LeadDetails.tsx       # Lead detail view with inline editing
│       └── LeadForm.tsx          # New lead form
├── lib/
│   ├── db.ts                     # MongoDB connection with global caching
│   └── validation.ts             # Zod schema for Lead
├── models/
│   └── Lead.ts                   # Mongoose Lead model
└── types/
    └── index.ts                  # Shared TypeScript types
```

---

## Data Model

### Lead

| Field | Type | Description |
|---|---|---|
| `name` | `String` | Full name of the lead |
| `phone` | `String` | Contact phone number |
| `email` | `String` (optional) | Email address |
| `budget` | `Number` | Property budget in INR |
| `location` | `String` | Preferred location |
| `propertyType` | `String` (enum) | `1 BHK`, `2 BHK`, `3 BHK`, `4 BHK`, `Plot`, `Commercial` |
| `source` | `String` (enum) | `Facebook`, `Google`, `Referral`, `Website`, `Other` |
| `status` | `String` (enum) | `New`, `Contacted`, `Site Visit`, `Closed`, `Lost` |
| `notes` | `String[]` | Internal notes array |
| `history` | `HistoryEvent[]` | Auto-generated audit trail |
| `createdAt` | `Date` | Auto timestamp |
| `updatedAt` | `Date` | Auto timestamp |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (free tier works)

### 1. Clone the repository

```bash
git clone https://github.com/ujjwal-07/realEstate_CRM.git
cd realEstate_CRM
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root of the project:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/realEstateDB?retryWrites=true&w=majority
```

> Replace `<username>`, `<password>`, and the cluster URL with your own MongoDB Atlas credentials.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Routes

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/leads` | Fetch all leads (sorted by newest) |
| `POST` | `/api/leads` | Create a new lead (Zod validated) |
| `GET` | `/api/leads/:id` | Fetch a single lead by ID |
| `PUT` | `/api/leads/:id` | Update a lead + auto-log audit trail |
| `DELETE` | `/api/leads/:id` | Delete a lead |

---

## Deployment (Vercel)

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Add the `MONGODB_URI` environment variable in **Project Settings → Environment Variables**
4. Deploy — Vercel auto-builds on every push to `main`

> **Note:** All data-fetching pages use `export const dynamic = "force-dynamic"` to ensure fresh data is fetched on every request rather than being statically cached at build time.

---

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```
