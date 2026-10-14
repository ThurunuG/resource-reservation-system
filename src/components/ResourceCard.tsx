"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ResourceWithCategory } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { ReservationModal } from "./ReservationModal";
import {
  MapPin,
  Users,
  Clock,
  ArrowRight,
  CalendarCheck2,
  Sparkles,
  Wrench,
} from "lucide-react";

interface ResourceCardProps {
  resource: ResourceWithCategory;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  // Keep the reservation dialog state local to this resource card.
  const [modalOpen, setModalOpen] = useState(false);
  // Only available resources can be booked directly from the card.
  const isAvailable = resource.status === "AVAILABLE";

  // Amenities are stored as JSON; fall back to an empty list if the value is invalid.
  let amenities: string[] = [];
  try {
    amenities = JSON.parse(resource.amenities || "[]");
  } catch {
    amenities = [];
  }

  return (
    <>
      <div className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-brand-200 transition-all duration-200 flex flex-col overflow-hidden">
        {/* Card Header & Image */}
        <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
          <img
            src={
              resource.imageUrl ||
              "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80"
            }
            alt={resource.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded-lg bg-white/95 text-slate-800 backdrop-blur shadow-sm">
              {resource.code}
            </span>
            <span className="px-2 py-0.5 text-[11px] font-medium rounded-lg bg-slate-900/70 text-slate-100 backdrop-blur">
              {resource.category.name}
            </span>
          </div>

          <div className="absolute top-3 right-3">
            <StatusBadge status={resource.status} size="sm" />
          </div>

          {/* Location on image footer */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center text-white/95 text-xs font-medium drop-shadow">
            <MapPin className="w-3.5 h-3.5 mr-1 text-brand-300" />
            <span className="truncate">{resource.location}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-slate-900 group-hover:text-brand-700 transition-colors line-clamp-1">
              {resource.name}
            </h4>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              {resource.description}
            </p>

            {/* Spec stats */}
            <div className="grid grid-cols-2 gap-2 mt-4 py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>Max: <strong>{resource.capacity} people</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{resource.minBookingMinutes}m - {resource.maxBookingMinutes / 60}h</span>
              </div>
            </div>

            {/* Amenities pills */}
            {amenities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3.5">
                {amenities.slice(0, 3).map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                  >
                    {item}
                  </span>
                ))}
                {amenities.length > 3 && (
                  <span className="text-[10px] text-slate-400 px-1 py-0.5">
                    +{amenities.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Card Actions */}
          <div className="pt-5 mt-5 border-t border-slate-100 flex items-center gap-2">
            <Link
              href={`/resources/${resource.id}`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Details & Schedule
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Show booking only when the resource is available. */}
            {isAvailable ? (
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl text-white bg-brand-600 hover:bg-brand-700 shadow-sm shadow-brand-600/20 active:scale-95 transition-all"
              >
                <CalendarCheck2 className="w-3.5 h-3.5" />
                Book Now
              </button>
            ) : (
              <button
                disabled
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl text-amber-700 bg-amber-50 cursor-not-allowed border border-amber-200"
              >
                <Wrench className="w-3.5 h-3.5" />
                In Service
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Render the modal alongside the card so it can be opened from the Book Now action. */}
      <ReservationModal
        resource={resource}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}