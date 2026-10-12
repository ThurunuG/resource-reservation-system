"use client";

import React, { useState, useEffect } from "react";
import { ResourceWithCategory } from "@/lib/types";
import { useCurrentUser } from "./UserContext";
import { checkAvailability, createReservation } from "@/lib/actions/reservations";
import { StatusBadge } from "./StatusBadge";
import {
  Calendar,
  Clock,
  Users,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldAlert,
} from "lucide-react";

interface ResourceBookingPanelProps {
  resource: ResourceWithCategory;
}

export function ResourceBookingPanel({ resource }: ResourceBookingPanelProps) {
  const { currentUser } = useCurrentUser();

  const getDefaultStart = () => {
    const d = new Date();
    d.setMinutes(0, 0, 0);
    d.setHours(d.getHours() + 1);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  };

  const getDefaultEnd = (startStr: string) => {
    const d = new Date(startStr);
    d.setHours(d.getHours() + 1);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  };

  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState(getDefaultStart());
  const [endTime, setEndTime] = useState(getDefaultEnd(getDefaultStart()));
  const [attendeesCount, setAttendeesCount] = useState(Math.min(2, resource.capacity));
  const [notes, setNotes] = useState("");

  const [isChecking, setIsChecking] = useState(false);
  const [conflictMessage, setConflictMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const isMaintenance = resource.status === "MAINTENANCE";

  // Real-time conflict checking
  useEffect(() => {
    if (isMaintenance || !startTime || !endTime) return;

    let isMounted = true;
    const timer = setTimeout(async () => {
      setIsChecking(true);
      const res = await checkAvailability(resource.id, new Date(startTime), new Date(endTime));
      if (isMounted) {
        setIsChecking(false);
        if (res.hasConflict) {
          setConflictMessage(res.message || "Schedule conflict detected.");
        } else {
          setConflictMessage(null);
        }
      }
    }, 350);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [resource.id, startTime, endTime, isMaintenance]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (conflictMessage || isMaintenance) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const result = await createReservation({
      resourceId: resource.id,
      userId: currentUser.id,
      title: title.trim(),
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      attendeesCount,
      notes: notes.trim() || undefined,
    });

    setIsSubmitting(false);

    if (result.success) {
      setIsSuccess(true);
      setTitle("");
      setNotes("");
      setTimeout(() => {
        setIsSuccess(false);
      }, 4000);
    } else {
      setSubmitError(result.error || "Failed to confirm reservation");
    }
  };

  if (isMaintenance) {
    return (
      <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 text-amber-900 space-y-3">
        <div className="flex items-center gap-2 font-bold text-base text-amber-800">
          <ShieldAlert className="w-5 h-5 text-amber-600" />
          Facility Under Maintenance
        </div>
        <p className="text-xs text-amber-700 leading-relaxed">
          This resource is currently suspended for safety inspection or technical maintenance. Bookings cannot be submitted until the facility manager restores status to Available.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
      <div>
        <h3 className="text-base font-bold text-slate-900">
          Reserve This Facility
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Atomic collision verification guarantees zero double-bookings.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Success Alert */}
        {isSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">Reservation Confirmed!</p>
              <p className="text-emerald-700">Slot secured and calendar synced.</p>
            </div>
          </div>
        )}

        {/* Conflict Alert */}
        {conflictMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in shake">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Slot Collision Detected</p>
              <p className="text-rose-700 mt-0.5">{conflictMessage}</p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {submitError && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {submitError}
          </div>
        )}

        {/* Active User Attribution */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
          <span className="text-slate-500">Booking As:</span>
          <span className="font-semibold text-slate-800">
            {currentUser.name} ({currentUser.department})
          </span>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Meeting Title / Purpose <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Sprint Backlog Grooming, Demo Session"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Times */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span>Start Time</span>
              {isChecking && <Loader2 className="w-3 h-3 text-brand-600 animate-spin" />}
            </label>
            <input
              type="datetime-local"
              required
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value);
                if (new Date(e.target.value) >= new Date(endTime)) {
                  setEndTime(getDefaultEnd(e.target.value));
                }
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              End Time
            </label>
            <input
              type="datetime-local"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none"
            />
          </div>
        </div>

        {/* Attendees */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <label className="font-semibold text-slate-700">Attendees</label>
            <span className="text-slate-400">Capacity: {resource.capacity}</span>
          </div>
          <input
            type="number"
            min={1}
            max={resource.capacity}
            value={attendeesCount}
            onChange={(e) => setAttendeesCount(parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Notes / Setup Requests
          </label>
          <textarea
            rows={2}
            placeholder="Special requirements or tech support needed..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none placeholder:text-slate-400"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !!conflictMessage || attendeesCount > resource.capacity}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 ${
            conflictMessage || attendeesCount > resource.capacity
              ? "bg-slate-300 cursor-not-allowed shadow-none"
              : "bg-brand-600 hover:bg-brand-700 active:scale-98 shadow-brand-500/20"
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Securing Slot...
            </>
          ) : (
            "Complete Reservation"
          )}
        </button>
      </form>
    </div>
  );
}