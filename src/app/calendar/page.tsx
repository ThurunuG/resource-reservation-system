import React from "react";
import { getResources, getCategories } from "@/lib/actions/resources";
import { getAllReservations } from "@/lib/actions/reservations";
import { TimelineSchedule } from "@/components/TimelineSchedule";
import { CalendarDays } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const [resources, reservations, categories] = await Promise.all([
    getResources(),
    getAllReservations(),
    getCategories(),
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <CalendarDays className="w-6 h-6 text-brand-600" />
            Master Schedule & Timeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time visualization of resource availability across all departments. Click any open slot to reserve.
          </p>
        </div>
      </div>

      <TimelineSchedule
        resources={resources as any}
        reservations={reservations as any}
      />
    </div>
  );
}