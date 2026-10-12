"use client";

import React, { useState } from "react";
import { ResourceWithCategory, ReservationWithDetails } from "@/lib/types";
import { ReservationModal } from "./ReservationModal";
import { StatusBadge } from "./StatusBadge";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Users,
  AlertTriangle,
  Info,
} from "lucide-react";

interface TimelineScheduleProps {
  resources: ResourceWithCategory[];
  reservations: ReservationWithDetails[];
  selectedDate?: string; // YYYY-MM-DD
  onDateChange?: (date: string) => void;
}

export function TimelineSchedule({
  resources,
  reservations,
  selectedDate: initialDate,
}: TimelineScheduleProps) {
  const getTodayStr = () => new Date().toISOString().slice(0, 10);
  const [currentDateStr, setCurrentDateStr] = useState(initialDate || getTodayStr());
  const [selectedResourceForBooking, setSelectedResourceForBooking] = useState<ResourceWithCategory | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  // Parse current viewing date
  const viewDate = new Date(currentDateStr + "T00:00:00");

  const changeDateBy = (days: number) => {
    const nextDate = new Date(viewDate);
    nextDate.setDate(nextDate.getDate() + days);
    setCurrentDateStr(nextDate.toISOString().slice(0, 10));
  };

  // Timeline hours from 8:00 (8) to 20:00 (20)
  const hours = Array.from({ length: 13 }, (_, i) => i + 8);

  // Filter reservations occurring on this date
  const dayReservations = reservations.filter((r) => {
    const rStart = new Date(r.startTime);
    const rEnd = new Date(r.endTime);
    const dayStart = new Date(currentDateStr + "T00:00:00");
    const dayEnd = new Date(currentDateStr + "T23:59:59");
    return rStart <= dayEnd && rEnd >= dayStart && r.status !== "CANCELLED";
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Date Header Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/70">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button
              type="button"
              onClick={() => changeDateBy(-1)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-slate-800 select-none">
              {viewDate.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <button
              type="button"
              onClick={() => changeDateBy(1)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setCurrentDateStr(getTodayStr())}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors shadow-sm"
          >
            Today
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-blue-500" /> Confirmed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500" /> In Session
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-400" /> Maintenance
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded border border-dashed border-slate-300 bg-slate-50" /> Available Slot
          </span>
        </div>
      </div>

      {/* Timeline Grid Table */}
      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Header row with hours */}
          <div className="grid grid-cols-[220px_repeat(12,_1fr)] border-b border-slate-200 bg-slate-100/70 text-slate-600 text-[11px] font-semibold sticky top-0">
            <div className="p-3 border-r border-slate-200">Resource / Facility</div>
            {hours.slice(0, 12).map((hour) => (
              <div key={hour} className="p-2.5 text-center border-r border-slate-200/60 last:border-r-0">
                {hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? "12:00 PM" : `${hour}:00 AM`}
              </div>
            ))}
          </div>

          {/* Resource rows */}
          <div className="divide-y divide-slate-100">
            {resources.map((resource) => {
              const resBookings = dayReservations.filter((r) => r.resourceId === resource.id);
              const isMaintenance = resource.status === "MAINTENANCE";

              return (
                <div
                  key={resource.id}
                  className="grid grid-cols-[220px_repeat(12,_1fr)] min-h-[64px] hover:bg-slate-50/50 transition-colors"
                >
                  {/* Resource Column */}
                  <div className="p-3 border-r border-slate-200 flex flex-col justify-center bg-white">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-1.5 py-0.5 rounded">
                        {resource.code}
                      </span>
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {resource.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                      <span>{resource.location}</span>
                      <span>•</span>
                      <span>Cap: {resource.capacity}</span>
                    </div>
                  </div>

                  {/* 12-hour timeline track */}
                  <div className="col-span-12 relative flex h-full items-center bg-slate-50/30">
                    {/* Hour grid guidelines */}
                    <div className="absolute inset-0 grid grid-cols-12 pointer-events-none">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="border-r border-slate-200/50 h-full last:border-r-0" />
                      ))}
                    </div>

                    {/* Maintenance Overlay if resource in maintenance */}
                    {isMaintenance ? (
                      <div className="absolute inset-1 rounded-xl bg-amber-50/90 border border-amber-300 flex items-center justify-center gap-2 text-xs font-medium text-amber-800">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        Under Maintenance Inspection — Bookings Suspended
                      </div>
                    ) : (
                      <>
                        {/* Empty Click-to-book action */}
                        <div
                          onClick={() => {
                            setSelectedResourceForBooking(resource);
                            setBookingModalOpen(true);
                          }}
                          className="absolute inset-0 cursor-pointer hover:bg-brand-50/30 transition-colors group flex items-center justify-center opacity-0 hover:opacity-100"
                        >
                          <span className="text-[11px] font-semibold text-brand-700 bg-white px-2 py-0.5 rounded-lg shadow-sm border border-brand-200">
                            + Click to reserve slot
                          </span>
                        </div>

                        {/* Render booked blocks */}
                        {resBookings.map((b) => {
                          const start = new Date(b.startTime);
                          const end = new Date(b.endTime);

                          // Calculate percentage position across 8:00 (start 8) to 20:00 (end 20 = 12 total hours)
                          const startHourDecimal = start.getHours() + start.getMinutes() / 60;
                          const endHourDecimal = end.getHours() + end.getMinutes() / 60;

                          const clampedStart = Math.max(8, Math.min(20, startHourDecimal));
                          const clampedEnd = Math.max(8, Math.min(20, endHourDecimal));

                          if (clampedEnd <= clampedStart) return null;

                          const leftPercent = ((clampedStart - 8) / 12) * 100;
                          const widthPercent = ((clampedEnd - clampedStart) / 12) * 100;

                          const isCheckedIn = b.status === "CHECKED_IN";

                          return (
                            <div
                              key={b.id}
                              style={{
                                left: `${leftPercent}%`,
                                width: `${Math.max(widthPercent, 4)}%`,
                              }}
                              className={`absolute top-1.5 bottom-1.5 rounded-xl px-2.5 py-1 z-10 text-white shadow-sm flex flex-col justify-center overflow-hidden transition-all hover:scale-[1.01] hover:shadow-md cursor-pointer ${
                                isCheckedIn
                                  ? "bg-emerald-600 border border-emerald-500"
                                  : "bg-blue-600 border border-blue-500"
                              }`}
                              title={`${b.title} | ${b.user.name} (${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`}
                            >
                              <p className="text-[11px] font-bold truncate leading-tight">
                                {b.title}
                              </p>
                              <p className="text-[9px] text-white/90 truncate leading-tight">
                                {b.user.name} • {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reservation Modal if empty slot clicked */}
      {selectedResourceForBooking && (
        <ReservationModal
          resource={selectedResourceForBooking}
          isOpen={bookingModalOpen}
          onClose={() => {
            setBookingModalOpen(false);
            setSelectedResourceForBooking(null);
          }}
          defaultDate={currentDateStr}
        />
      )}
    </div>
  );
}