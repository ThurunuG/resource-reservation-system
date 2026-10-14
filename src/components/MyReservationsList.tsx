"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { ReservationWithDetails } from "@/lib/types";
import { useCurrentUser } from "./UserContext";
import { checkInReservation, cancelReservation } from "@/lib/actions/reservations";
import { StatusBadge } from "./StatusBadge";
import {
  BookmarkCheck,
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  XCircle,
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

interface MyReservationsListProps {
  initialReservations: ReservationWithDetails[];
}

export function MyReservationsList({
  initialReservations,
}: MyReservationsListProps) {
  const { currentUser } = useCurrentUser();
  const [tab, setTab] = useState<"ALL" | "UPCOMING" | "PAST">("ALL");
  const [isPending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);

  // Show only reservations belonging to the user selected in the profile switcher.
  const userReservations = initialReservations.filter((r) => {
    // Support both the stable user ID and email for older reservation records.
    return (
      r.user.email === currentUser.email ||
      r.userId === currentUser.id
    );
  });

  // Reuse one timestamp so every reservation is compared against the same moment.
  const now = new Date();

  // Upcoming excludes cancelled bookings; history includes ended and cancelled bookings.
  const filteredReservations = userReservations.filter((r) => {
    const end = new Date(r.endTime);
    if (tab === "UPCOMING") {
      return end >= now && r.status !== "CANCELLED";
    }
    if (tab === "PAST") {
      return end < now || r.status === "CANCELLED";
    }
    return true;
  });

  const handleCheckIn = (reservationId: string) => {
    setActionError(null);
    // Run the server action as a transition so pending UI state can be displayed.
    startTransition(async () => {
      const res = await checkInReservation(reservationId);
      if (!res.success) {
        setActionError(res.error || "Failed to check in");
      }
    });
  };

  const handleCancel = (reservationId: string) => {
    if (!confirm("Are you sure you want to cancel this reservation? The slot will be released for others.")) {
      return;
    }
    setActionError(null);
    // Cancellation releases the reserved time slot for other users.
    startTransition(async () => {
      const res = await cancelReservation(reservationId, "Cancelled by user");
      if (!res.success) {
        setActionError(res.error || "Failed to cancel reservation");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* User notice */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-100"
          />
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {currentUser.name}
            </h3>
            <p className="text-xs text-slate-500">
              Department: {currentUser.department} • {currentUser.email}
            </p>
          </div>
        </div>

        {/* Tab filters */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setTab("ALL")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              tab === "ALL"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Bookings ({userReservations.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("UPCOMING")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              tab === "UPCOMING"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Upcoming
          </button>
          <button
            type="button"
            onClick={() => setTab("PAST")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              tab === "PAST"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            History
          </button>
        </div>
      </div>

      {actionError && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {actionError}
        </div>
      )}

      {/* Reservation list cards */}
      {filteredReservations.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 shadow-sm">
          <BookmarkCheck className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-800">
            No reservations found
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You don&apos;t have any reservations in this filter. Switch active users using the top-right profile selector to inspect other team members!
          </p>
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-sm"
          >
            Browse Facilities & Book
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredReservations.map((res) => {
            const start = new Date(res.startTime);
            const end = new Date(res.endTime);
            const isConfirmed = res.status === "CONFIRMED";
            const isCheckedIn = res.status === "CHECKED_IN";
            const isPast = end < now;

            return (
              <div
                key={res.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded bg-slate-100 text-slate-700">
                        {res.resource.code}
                      </span>
                      <StatusBadge status={res.status} size="sm" />
                    </div>
                    <Link
                      href={`/resources/${res.resourceId}`}
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                      title="View Facility"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 leading-snug">
                    {res.title}
                  </h4>
                  <p className="text-xs text-brand-700 font-semibold mt-0.5">
                    {res.resource.name}
                  </p>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {start.toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                        {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{res.resource.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{res.attendeesCount} attendees expected</span>
                    </div>
                  </div>

                  {res.notes && (
                    <p className="mt-3 text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      &ldquo;{res.notes}&rdquo;
                    </p>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  {isConfirmed && !isPast ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleCheckIn(res.id)}
                        disabled={isPending}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm active:scale-95 transition-all"
                      >
                        {isPending ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <ShieldCheck className="w-3.5 h-3.5" />
                        )}
                        Check In Now
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCancel(res.id)}
                        disabled={isPending}
                        className="inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Cancel
                      </button>
                    </>
                  ) : isCheckedIn ? (
                    <div className="w-full flex items-center justify-between text-xs text-emerald-700 font-semibold py-1">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Session In Progress
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCancel(res.id)}
                        className="text-slate-400 hover:text-rose-600 text-[11px]"
                      >
                        Release Early
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">
                      Archived Reservation
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}