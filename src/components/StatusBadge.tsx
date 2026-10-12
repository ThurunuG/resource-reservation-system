import React from "react";
import { ResourceStatus, ReservationStatus } from "@prisma/client";
import { CheckCircle2, AlertTriangle, Clock, XCircle, Ban, ShieldCheck } from "lucide-react";

interface StatusBadgeProps {
  status: ResourceStatus | ReservationStatus | string;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const isSm = size === "sm";
  const sizeClasses = isSm ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1";

  switch (status) {
    // Resource Statuses
    case "AVAILABLE":
      return (
        <span className={`inline-flex items-center gap-1 font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Available
        </span>
      );
    case "MAINTENANCE":
      return (
        <span className={`inline-flex items-center gap-1 font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200 ${sizeClasses}`}>
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          Maintenance
        </span>
      );
    case "RETIRED":
      return (
        <span className={`inline-flex items-center gap-1 font-medium rounded-full bg-slate-100 text-slate-600 border border-slate-200 ${sizeClasses}`}>
          <Ban className="w-3.5 h-3.5 text-slate-500" />
          Retired
        </span>
      );

    // Reservation Statuses
    case "CONFIRMED":
      return (
        <span className={`inline-flex items-center gap-1 font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          Confirmed
        </span>
      );
    case "CHECKED_IN":
      return (
        <span className={`inline-flex items-center gap-1 font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 ${sizeClasses}`}>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          In Session
        </span>
      );
    case "COMPLETED":
      return (
        <span className={`inline-flex items-center gap-1 font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
          Completed
        </span>
      );
    case "CANCELLED":
      return (
        <span className={`inline-flex items-center gap-1 font-medium rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${sizeClasses}`}>
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          Cancelled
        </span>
      );

    default:
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-gray-100 text-gray-700 ${sizeClasses}`}>
          {status}
        </span>
      );
  }
}