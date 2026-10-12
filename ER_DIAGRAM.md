# Entity Relationship (ER) Diagram
## PrimeWave Resource Reservation Management System

This document outlines the database design, entity schemas, and relational architecture of the **Resource Reservation Management System** built with **PostgreSQL** and **Prisma ORM**.

---

## 1. Visual Entity Relationship Diagram (Mermaid)

```mermaid
erDiagram
    USER ||--o{ RESERVATION : "reserves"
    USER ||--o{ MAINTENANCE_LOG : "performs / logs"
    RESOURCE_CATEGORY ||--o{ RESOURCE : "categorizes"
    RESOURCE ||--o{ RESERVATION : "is booked in"
    RESOURCE ||--o{ MAINTENANCE_LOG : "records"

    USER {
        string id PK "cuid"
        string name "Full Name"
        string email UK "Unique corporate email"
        string department "e.g. Engineering, AI, Ops"
        enum role "ADMIN | MEMBER"
        string avatarUrl "Profile image URL"
        datetime createdAt
        datetime updatedAt
    }

    RESOURCE_CATEGORY {
        string id PK "cuid"
        string name UK "e.g. Conference Rooms"
        string slug UK "e.g. conference-rooms"
        string description "Category description"
        string icon "Lucide icon key"
        datetime createdAt
    }

    RESOURCE {
        string id PK "cuid"
        string code UK "e.g. CR-101, LAB-01"
        string name "Asset Name"
        string description "Detailed description"
        string categoryId FK "References ResourceCategory.id"
        string location "Floor, Wing, Room"
        int capacity "Maximum attendee capacity"
        string amenities "JSON array of equipment"
        enum status "AVAILABLE | MAINTENANCE | RETIRED"
        string imageUrl "Cover photo URL"
        int minBookingMinutes "Minimum slot duration (e.g. 15)"
        int maxBookingMinutes "Maximum slot duration (e.g. 480)"
        boolean requiresApproval "Admin review flag"
        datetime createdAt
        datetime updatedAt
    }

    RESERVATION {
        string id PK "cuid"
        string resourceId FK "References Resource.id"
        string userId FK "References User.id"
        string title "Purpose of reservation"
        datetime startTime "Start of booked window"
        datetime endTime "End of booked window"
        enum status "CONFIRMED | CHECKED_IN | COMPLETED | CANCELLED"
        string notes "Optional requirements"
        int attendeesCount "Expected headcount"
        datetime checkInTime "Timestamp of physical check-in"
        string cancellationReason "Reason if cancelled"
        datetime createdAt
        datetime updatedAt
    }

    MAINTENANCE_LOG {
        string id PK "cuid"
        string resourceId FK "References Resource.id"
        string userId FK "References User.id (Nullable)"
        string action "e.g. MAINTENANCE_ENABLED, CALIBRATION"
        string details "Technical notes & reason"
        string performedBy "Staff member name / email"
        datetime createdAt
    }
```

---

## 2. Relational Architecture & Cardinality

### A. `ResourceCategory` → `Resource` (1 : N)
- Each category (e.g., *Conference & Meeting Rooms*, *Hardware & AV Tech*, *Laboratories*) groups multiple physical resources.
- `Resource.categoryId` references `ResourceCategory.id` with `onDelete: Cascade`.

### B. `User` → `Reservation` (1 : N)
- A corporate user can create multiple bookings across different resources and dates.
- `Reservation.userId` references `User.id` with `onDelete: Cascade`.

### C. `Resource` → `Reservation` (1 : N)
- A physical resource contains multiple time-sliced reservation records.
- Overlapping time conflicts (`startTime < newEnd && endTime > newStart`) for active reservations on the same resource are strictly blocked via atomic database transactions.

### D. `Resource` → `MaintenanceLog` (1 : N)
- Tracks full audit history of repairs, annual safety inspections, and offline periods.

---

## 3. Performance & Indexing Strategy

To guarantee rapid queries and zero race conditions under high concurrent booking traffic:

| Table | Index Columns | Purpose |
|---|---|---|
| `reservations` | `[resourceId, startTime, endTime]` | **Crucial:** Accelerates overlap conflict checks to <5ms |
| `reservations` | `[userId]` | Fast lookup of individual user booking history |
| `reservations` | `[status]` | High-speed filtering of active vs cancelled bookings |
| `resources` | `[categoryId]` | Category filtering |
| `resources` | `[status]` | Instant lookup of `AVAILABLE` vs `MAINTENANCE` facilities |

---

## 4. How to View / Share this Diagram

1. **GitHub Markdown Rendering**: This file uses standard GitHub-flavored Mermaid syntax and renders natively inside GitHub repositories.
2. **Mermaid Live Editor**: Copy the Mermaid block above into [mermaid.live](https://mermaid.live/) to export high-resolution PNG/SVG images for submission.