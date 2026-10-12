# 3–5 Minute Demonstration Video Presentation Script
## PrimeWave Lab Technical Assessment: Resource Reservation Management System

This guide provides a structured, time-stamped script to record your 3–5 minute demonstration video. It is designed to impress evaluators by communicating the **business problem**, **technical decisions**, **conflict prevention architecture**, and **user experience**.

---

## ⏱️ Video Timing Overview (Total: ~4 minutes)

| Segment | Time | Screen Content | Key Talking Points |
|---|---|---|---|
| **1. Introduction & Problem Statement** | 0:00 – 0:45 | Dashboard / Slide | Business challenges, manual booking confusion, project mission |
| **2. Architecture & Technical Choices** | 0:45 – 1:30 | Code / Architecture / ERD | Next.js App Router, TypeScript, PostgreSQL, Prisma, Concurrency design |
| **3. Live Walkthrough & Concurrency Test** | 1:30 – 3:00 | Active Web App | Catalog filtering, reserving a room, **triggering conflict warning**, switching users |
| **4. Operational Controls & Insights** | 3:00 – 3:45 | Admin / Calendar / Analytics | Maintenance mode lock, real-time timeline, check-in to avoid ghost bookings |
| **5. Conclusion & Engineering Summary** | 3:45 – 4:15 | Summary screen / GitHub repo | Scalability, reliability, and engineering trade-offs |

---

## 🎙️ Step-by-Step Recording Script

### Segment 1: Introduction (0:00 – 0:45)
**What to show:** Open the application at `http://localhost:3000` showing the **Dashboard** with KPI metrics and recent bookings.
> *"Hello, my name is [Your Name], and this is my submission for the PrimeWave Lab Software Engineering Internship Technical Assessment: the Resource Reservation Management System.*
>
> *Growing organizations face substantial operational drag when managing shared facilities—such as boardrooms, presentation hardware, prototyping labs, and transit vehicles. Informal communication channels like Slack or spreadsheets invariably lead to double-bookings, ghost reservations, and lack of visibility into availability.*
>
> *To solve this, I designed and developed a centralized, full-stack digital solution engineered with Next.js App Router, TypeScript, and PostgreSQL."*

---

### Segment 2: Architecture & Technical Decisions (0:45 – 1:30)
**What to show:** Briefly show `ER_DIAGRAM.md` or the database schema in VS Code.
> *"Let's examine the foundational technical decisions:*
>
> 1. *Full-Stack Framework: Next.js 14 App Router with React Server Components and Server Actions. This provides instant initial load times, secure server-side execution, and seamless mutations without bloated API middleware.*
> 2. *Type Safety: Strict TypeScript end-to-end—from database models to Zod validation schemas and client components.*
> 3. *Data Layer & Relational Integrity: PostgreSQL with Prisma ORM. The relational model cleanly separates Users, Resource Categories, Resources, Reservations, and Maintenance Audit Logs.*
> 4. *Concurrency & Race Condition Handling: In shared resource systems, the greatest risk is two users booking the same slot simultaneously. I implemented atomic database transactions with an overlap condition `(StartTime < NewEnd && EndTime > NewStart)` with composite database indexing on `[resourceId, startTime, endTime]`."*

---

### Segment 3: Live Application Demo & Conflict Prevention (1:30 – 3:00)
**What to show:** 
1. Navigate to **Resources (`/resources`)**. Filter by "Conference & Meeting Rooms", then select **CR-101 (Main Executive Boardroom)**.
2. Click **Book Now**.
3. Select a time (e.g., Today at 2:00 PM to 4:00 PM). Enter meeting title: *"Architecture Review"*. Submit reservation.
4. **The Conflict Test:** Open booking again for the exact same resource during the same time window.
> *"Now let's see how the system behaves under operational stress.*
>
> *As you can see, when Alex books the Boardroom from 2:00 PM to 4:00 PM, the reservation is confirmed instantly with zero latency.*
>
> *Now, let's switch users using the top-right profile switcher to simulate Dilshan from the Product team attempting to book the same room at 3:00 PM.*
>
> *Notice that as Dilshan picks the overlapping time slot, the live conflict engine immediately detects the collision and displays an alert: 'Already reserved for Architecture Review by Alex Perera'. Furthermore, the submit button is locked, and even if submitted simultaneously, the database transaction rejects the second write, guaranteeing 100% data consistency."*

---

### Segment 4: Master Timeline, Check-In & Maintenance (3:00 – 3:45)
**What to show:** 
1. Navigate to **Master Schedule (`/calendar`)**. Show the 12-hour visual timeline bars with booked slots.
2. Navigate to **My Bookings (`/my-reservations`)**. Click **Check In Now** on an active booking.
3. Navigate to **Facility Admin (`/admin/resources`)**. Toggle **Set Maintenance** on a resource.
> *"Next, the Master Schedule provides an intuitive 12-hour interactive timeline of all facilities across departments. Team members can see busy periods at a glance or click any open block to book.*
>
> *Under 'My Bookings', we addressed the real-world operational problem of ghost bookings: users must check in when their session begins, changing the status to 'In Session'.*
>
> *Finally, the Facility Admin panel allows facility managers to take a resource offline for maintenance. When a room or piece of equipment is placed under maintenance, the system immediately suspends bookings and displays a clear warning across the catalog."*

---

### Segment 5: Conclusion & Reflection (3:45 – 4:15)
**What to show:** Return to the Dashboard and show the GitHub repository README.
> *"In summary, this application delivers a focused, resilient, and production-ready solution to resource coordination. It prioritizes data integrity, user usability, and real-world operational safeguards over superficial complexity.*
>
> *The complete source code, setup instructions, and database documentation are available in the GitHub repository. Thank you for your consideration, and I look forward to discussing my technical approach with the PrimeWave team."*

---

## 🎥 Recording Checklist
- [ ] Screen resolution set to 1080p (1920x1080) for sharp text.
- [ ] Clear microphone audio with minimal background noise.
- [ ] Run `npm run dev` and ensure sample seed data is visible.
- [ ] Keep video within 3 to 5 minutes to adhere to the assessment guidelines.