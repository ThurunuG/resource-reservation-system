import React from "react";
import { getUserReservations } from "@/lib/actions/reservations";
import { MyReservationsList } from "@/components/MyReservationsList";
import { BookmarkCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MyReservationsPage() {
  const allReservations = await getUserReservations();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <BookmarkCheck className="w-6 h-6 text-brand-600" />
            My Facility Reservations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track confirmed bookings, perform in-person check-in, or release slots.
          </p>
        </div>
      </div>

      <MyReservationsList initialReservations={allReservations as any} />
    </div>
  );
}