"use client";

import React, { useState, useEffect } from "react";
import { ResourceWithCategory } from "@/lib/types";
import { useCurrentUser } from "./UserContext";
import { checkAvailability, createReservation } from "@/lib/actions/reservations";
import { StatusBadge } from "./StatusBadge";
import {
  X,
  Calendar,
  Clock,
  Users,
  AlertCircle,
  CheckCircle2,
  Loader2,
  FileText,
  MapPin,
} from "lucide-react";

interface ReservationModalProps {
  resource: ResourceWithCategory | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultDate?: string; // YYYY-MM-DD
}

export function ReservationModal({
  resource,
  isOpen,
  onClose,
  onSuccess,
  defaultDate,
}: ReservationModalProps) {
  const { currentUser } = useCurrentUser();

  // Helper to format ISO local datetime string for input (YYYY-MM-DDTHH:mm)
  const getDefaultStart = () => {
    const d = defaultDate ? new Date(defaultDate) : new Date();
    d.setMinutes(0, 0, 0);
    d.setHours(d.getHours() + 1);
    // Adjust for the local timezone so the value matches datetime-local input format.
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
  const [attendeesCount, setAttendeesCount] = useState(1);
  const [notes, setNotes] = useState("");

  const [isChecking, setIsChecking] = useState(false);
  const [conflictMessage, setConflictMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset form when modal opens with a new resource
  useEffect(() => {
    if (isOpen && resource) {
      const defStart = getDefaultStart();
      setStartTime(defStart);
      setEndTime(getDefaultEnd(defStart));
      setTitle("");
      setNotes("");
      setAttendeesCount(Math.min(2, resource.capacity));
      setConflictMessage(null);
      setSubmitError(null);
      setIsSuccess(false);
    }
  }, [isOpen, resource, defaultDate]);

  // Live conflict detection on time changes
  useEffect(() => {
    if (!isOpen || !resource || !startTime || !endTime) return;

    // Debounce availability checks and disregard results from outdated requests.
    let isMounted = true;
    const timer = setTimeout(async () => {
      setIsChecking(true);
      setSubmitError(null);
      const res = await checkAvailability(resource.id, new Date(startTime), new Date(endTime));
      if (isMounted) {
        setIsChecking(false);
        if (res.hasConflict) {
          setConflictMessage(res.message || "Time conflict detected.");
        } else {
          setConflictMessage(null);
        }
      }
    }, 350);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [resource, startTime, endTime, isOpen]);

  if (!isOpen || !resource) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Do not submit if the selected time range conflicts with another reservation.
    if (conflictMessage) return;

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
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        if (onSuccess) onSuccess();
      }, 1200);
    } else {
      setSubmitError(result.error || "Failed to create reservation");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                {resource.code}
              </span>
              <StatusBadge status={resource.status} size="sm" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 leading-snug">
              Reserve {resource.name}
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {resource.location} • Max {resource.capacity} people
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Success Overlay */}
          {isSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="text-sm font-bold">Reservation Confirmed!</p>
                <p className="text-xs text-emerald-700">
                  Your booking has been registered and verified with zero conflicts.
                </p>
              </div>
            </div>
          )}

          {/* Conflict Banner */}
          {conflictMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2.5 animate-in shake duration-200">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold">Overlapping Reservation Detected</p>
                <p className="text-rose-700 mt-0.5">{conflictMessage}</p>
              </div>
            </div>
          )}

          {/* Generic Error */}
          {submitError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {submitError}
            </div>
          )}

          {/* Booking User info */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <span>Booking on behalf of:</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-500" />
              {currentUser.name} ({currentUser.department})
            </span>
          </div>

          {/* Title / Purpose */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reservation Title / Purpose <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sprint Planning, Client Demo, Hardware Testing"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Time pickers (Start & End) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Start Time</span>
                {isChecking && <Loader2 className="w-3 h-3 text-brand-600 animate-spin" />}
              </label>
              <div className="relative">
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
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                End Time
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Attendees Count & Capacity Check */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <label className="font-semibold text-slate-700">Attendees Count</label>
              <span className="text-slate-500">Max Capacity: {resource.capacity}</span>
            </div>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={resource.capacity}
                value={attendeesCount}
                onChange={(e) => setAttendeesCount(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
              />
              <Users className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
            </div>
            {attendeesCount > resource.capacity && (
              <p className="text-[11px] text-rose-600 mt-1">
                Attendees exceed resource capacity ({resource.capacity} max).
              </p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Additional Notes / Requests (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Need video conference mic test, HDMI adapters..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !!conflictMessage || attendeesCount > resource.capacity}
              className={`flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl text-white shadow-md transition-all ${
                conflictMessage || attendeesCount > resource.capacity
                  ? "bg-slate-300 cursor-not-allowed shadow-none"
                  : "bg-brand-600 hover:bg-brand-700 active:scale-95 shadow-brand-500/20"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Verifying & Booking...
                </>
              ) : (
                "Confirm Reservation"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}