# Resource Reservation Management System

**Technology Stack:** Next.js (App Router), TypeScript, PostgreSQL, Prisma ORM, Tailwind CSS

---

## 📌 Executive Summary & Business Problem

Growing organizations regularly face operational friction when coordinating shared facilities and physical equipment (e.g., conference rooms, prototyping labs, specialized presentation hardware, transit vehicles). When scheduling relies on informal communication channels (chat, email, verbal requests) or spreadsheets:
- **Scheduling Confusion & Double Bookings:** Multiple team members unknowingly reserve the same room or hardware for overlapping times.
- **Availability Uncertainty:** Staff members cannot determine whether a facility is genuinely vacant, under maintenance, or booked.
- **Ghost Reservations:** Booked slots go unused because meetings are rescheduled without cancelling the reservation.
- **Operational Blindspots:** Facilities managers lack visibility into actual resource utilization and equipment maintenance lifecycles.

### The Solution
This application provides a **centralized, reliable full-stack web solution** built to coordinate shared facilities with mathematical collision avoidance, live schedule visibility, self-service reservations, in-person check-in verification, and maintenance lifecycle controls.

---

## 🚀 Key Features

### 1. Zero-Collision Reservation Engine (Atomic Concurrency Control)
- Prevents overlapping bookings at both the **database level** and the **application level**.
- Utilizes the proven overlap interval theorem:
  $$\text{Overlap} \iff (\text{ExistingStart} < \text{RequestedEnd}) \land (\text{ExistingEnd} > \text{RequestedStart})$$
- Executed within **Prisma interactive transactions** (`prisma.$transaction`) to eliminate race conditions under concurrent submissions.
- **Real-Time Client Feedback:** As users select times in the booking modal, the client queries availability in real time and displays an immediate conflict warning if the slot is occupied.

### 2. Multi-Tier Resource Organization & Catalog
- Categorizes facilities into distinct operational domains:
  - *Conference & Meeting Rooms*
  - *Hardware & AV Presentation Tech*
  - *Laboratories & Testing Stations*
  - *Focus Pods & Hot Desks*
  - *Company Fleet & Transit*
- Instant client-side search across resource names, codes (`CR-101`, `LAB-01`), physical locations, and amenity tags.
- Capacity-based filtering (`2+`, `4+`, `8+`, `15+` people) and status filtering (`AVAILABLE`, `MAINTENANCE`).

### 3. Master Schedule & 12-Hour Timeline View (`/calendar`)
- Interactive schedule visualizing all organization facilities across the working day (8:00 AM – 8:00 PM).
- Color-coded status markers:
  - 🟦 **Confirmed Booking**
  - 🟩 **In Session (Checked-in)**
  - 🟨 **Under Maintenance Shutdown**
  - ⬜ **Open Slot (1-click to reserve)**

### 4. Ghost-Booking Mitigation via In-Person Check-In (`/my-reservations`)
- Addresses real-world operational challenges: when users fail to show up, resources are locked unnecessarily.
- When an active booking arrives, users can click **Check In Now** to transition status to `CHECKED_IN`.
- One-click **Cancellation** releases the slot immediately for other teammates.

### 5. Facility Maintenance & Lifecycle Controls (`/admin/resources`)
- Administrators can temporarily suspend a facility by placing it under **Maintenance Mode**.
- Records reason, date, and responsible staff member in a persistent `MaintenanceLog`.
- When under maintenance, all booking buttons are locked across the application to prevent scheduling during repairs or calibrations.

### 6. Interactive Multi-User Switcher (Evaluation / Demo Mode)
- Built directly into the top navigation bar.
- Evaluators can switch between realistic personas (**Alex Perera** - Engineering Admin, **Dilshan Silva** - Product Member, **Kavindi J.** - AI Member, **Niroshan F.** - Facilities Admin) in one click.
- Allows instant live demonstration of multi-user concurrency and booking conflict detection without logging in and out.

---

## 🛠️ Architecture & Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | **Next.js 14+ (App Router)** | High-performance React Server Components (RSC), native Server Actions, and file-system routing. |
| **Language** | **TypeScript (Strict Mode)** | Complete end-to-end type safety across database schemas, API actions, and UI components. |
| **Database** | **PostgreSQL** | Enterprise ACID compliance, relational integrity, foreign key cascading, and high concurrency support. |
| **ORM** | **Prisma ORM** | Type-safe schema definition, declarative migrations, connection pooling, and transaction support. |
| **Styling & UI** | **Tailwind CSS + Lucide Icons** | Clean, responsive enterprise interface designed for high usability and clarity. |
| **Validation** | **Zod** | Schema-driven input sanitization and validation on both client and server boundaries. |

---

## 🗄️ Database Design & Entity Relationships

The relational model is designed around 5 core entities:
1. `User`: Organization staff and facility administrators.
2. `ResourceCategory`: Logical grouping of facilities and equipment.
3. `Resource`: Individual bookable assets with capacity limits, rules, and status.
4. `Reservation`: Time-sliced bookings with status tracking and check-in audit timestamps.
5. `MaintenanceLog`: Historical record of equipment repairs, safety tests, and calibrations.

```mermaid
erDiagram
    USER ||--o{ RESERVATION : "reserves"
    USER ||--o{ MAINTENANCE_LOG : "logs"
    RESOURCE_CATEGORY ||--o{ RESOURCE : "categorizes"
    RESOURCE ||--o{ RESERVATION : "is booked in"
    RESOURCE ||--o{ MAINTENANCE_LOG : "records"
```
---

## ⚙️ Local Setup & Getting Started

### Prerequisites
- **Node.js**: v18.18+ or v20+ (Tested on Node v22)
- **npm** or **pnpm**
- **PostgreSQL**: Local instance, Docker container, or cloud PostgreSQL (e.g., [Neon](https://neon.tech) / [Supabase](https://supabase.com))

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/resource-reservation-system.git
cd resource-reservation-system
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure your `DATABASE_URL` is set correctly:
```env
# Example for local PostgreSQL:
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/resource_reservation_db?schema=public"

# Or use a free cloud PostgreSQL connection string (Neon / Supabase):
# DATABASE_URL="postgresql://user:pass@ep-cool-db.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

> **Optional Docker Setup:** If you have Docker installed, start a local PostgreSQL container with one command:
> ```bash
> docker-compose up -d
> ```

### Step 4: Push Database Schema & Seed Data
Generate the Prisma Client:
```bash
npm run prisma:generate
```
Push the schema to your PostgreSQL database:
```bash
npm run prisma:push
```
Seed the database with realistic sample facilities, users, and initial bookings:
```bash
npm run prisma:seed
```

### Step 5: Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Verification & Testing the Conflict Engine

1. **Browse Resources:** Navigate to `/resources` and filter by "Conference Rooms".
2. **Book a Facility:** Click **Book Now** on `CR-101 (Main Executive Boardroom)` and reserve it for today from `14:00` to `16:00`.
3. **Simulate Concurrent Collision:** 
   - Switch active user using the top-right user menu (e.g., switch to *Dilshan Silva*).
   - Attempt to book `CR-101` for an overlapping window (e.g., `15:00` to `17:00`).
   - Observe the **live conflict banner**: The UI immediately identifies the existing reservation and blocks submission.
4. **Inspect Master Schedule:** Visit `/calendar` to verify that the time slot is occupied on the timeline.
5. **Check-In:** Visit `/my-reservations` and click **Check In Now** on an active booking.
6. **Maintenance Shutdown:** Visit `/admin/resources` and toggle maintenance mode on any facility. Return to `/resources` and verify that bookings are suspended.

---

## 📂 Project Directory Structure

```text
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root enterprise layout & providers
│   │   ├── page.tsx                # Dashboard with real-time KPI metrics
│   │   ├── resources/
│   │   │   ├── page.tsx            # Filterable resource catalog
│   │   │   └── [id]/page.tsx       # Detail view & booking panel
│   │   ├── calendar/
│   │   │   └── page.tsx            # Master 12-hour schedule timeline
│   │   ├── my-reservations/
│   │   │   └── page.tsx            # User bookings & in-person check-in
│   │   └── admin/resources/
│   │       └── page.tsx            # Facility operations & maintenance
│   ├── components/
│   │   ├── Navbar.tsx              # Navigation & active user switcher
│   │   ├── Footer.tsx              # Application footer & status indicator
│   │   ├── ResourceCard.tsx        # Facility card with specs & actions
│   │   ├── ResourceCatalog.tsx     # Client-side instant filter engine
│   │   ├── ReservationModal.tsx    # Live conflict-checking booking modal
│   │   ├── ResourceBookingPanel.tsx# Inline booking widget
│   │   ├── TimelineSchedule.tsx    # Interactive 12-hour visual timeline
│   │   ├── MyReservationsList.tsx  # User bookings list & check-in actions
│   │   ├── AdminResourceManager.tsx# Facilities management & maintenance toggle
│   │   ├── StatusBadge.tsx         # Color-coded status indicators
│   │   └── UserContext.tsx         # Multi-user demo state provider
│   └── lib/
│       ├── prisma.ts               # Singleton Prisma client instance
│       ├── types.ts                # TypeScript interfaces and entity types
│       ├── validators.ts           # Zod schema definitions
│       └── actions/
│           ├── resources.ts        # Resource queries & admin actions
│           ├── reservations.ts     # Atomic reservation & conflict engine
│           └── analytics.ts        # Dashboard KPI metrics aggregator
├── prisma/
│   ├── schema.prisma               # PostgreSQL relational schema
│   └── seed.ts                     # Enterprise database seed script
├── docker-compose.yml              # Local PostgreSQL container definition
└── package.json
```
---
