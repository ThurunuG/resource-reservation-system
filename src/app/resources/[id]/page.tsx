import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getResourceById } from "@/lib/actions/resources";
import { ResourceBookingPanel } from "@/components/ResourceBookingPanel";
import { StatusBadge } from "@/components/StatusBadge";
import {
  ArrowLeft,
  MapPin,
  Users,
  Clock,
  Sparkles,
  Calendar,
  CheckCircle,
  Wrench,
  AlertCircle,
  FileCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ResourceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Fetch the resource details before rendering the page.
  const resource = await getResourceById(params.id);

  if (!resource) {
    notFound();
  }

  // Amenities are stored as JSON; use an empty list if the data is malformed.
  let amenities: string[] = [];
  try {
    amenities = JSON.parse(resource.amenities || "[]");
  } catch {
    amenities = [];
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Back button */}
      <div>
        <Link
          href="/resources"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Resource Catalog
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Details, Amenities, Schedule */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Visual Header */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="relative h-64 sm:h-80 w-full bg-slate-900">
              <img
                src={
                  resource.imageUrl ||
                  "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=1000&auto=format&fit=crop&q=80"
                }
                alt={resource.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 text-xs font-extrabold rounded-lg bg-white/95 text-slate-900 shadow">
                    {resource.code}
                  </span>
                  <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white/20 backdrop-blur border border-white/20">
                    {resource.category.name}
                  </span>
                  <StatusBadge status={resource.status} size="sm" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {resource.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-200 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-brand-300 shrink-0" />
                  {resource.location}
                </p>
              </div>
            </div>

            {/* Description & Specs */}
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
                  About this Facility
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {resource.description}
                </p>
              </div>

              {/* Fast Spec Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                    <Users className="w-4 h-4 text-brand-600" />
                    Max Capacity
                  </div>
                  <p className="text-base font-bold text-slate-900">
                    {resource.capacity} People
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                    <Clock className="w-4 h-4 text-brand-600" />
                    Booking Window
                  </div>
                  <p className="text-base font-bold text-slate-900">
                    {resource.minBookingMinutes}m - {resource.maxBookingMinutes / 60}h
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                    <FileCheck className="w-4 h-4 text-brand-600" />
                    Approval
                  </div>
                  <p className="text-base font-bold text-slate-900">
                    {resource.requiresApproval ? "Admin Review" : "Instant Confirm"}
                  </p>
                </div>
              </div>

              {/* Amenities List */}
              {amenities.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Available Equipment & Amenities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {amenities.map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-50 text-brand-800 border border-brand-200/80"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Schedule for this Resource */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-brand-600" />
                  Upcoming Reservations
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Occupied time slots for {resource.name}
                </p>
              </div>
            </div>

            {resource.reservations.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                No active bookings scheduled. This facility is completely free!
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {resource.reservations.map((res: any) => {
                  const start = new Date(res.startTime);
                  const end = new Date(res.endTime);
                  return (
                    <div
                      key={res.id}
                      className="py-3.5 flex items-center justify-between gap-4"
                    >
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {res.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Organized by {res.user.name} ({res.user.department}) • {res.attendeesCount} attendees
                        </p>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={res.status} size="sm" />
                        <p className="text-xs text-slate-600 font-semibold mt-1">
                          {start.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                          , {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                          {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Maintenance Logs (if any) */}
          {resource.maintenanceLogs.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-amber-600" />
                Service & Maintenance History
              </h3>
              <div className="space-y-2.5">
                {resource.maintenanceLogs.map((log: any) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 space-y-1"
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>{log.action}</span>
                      <span className="text-[11px] font-normal text-amber-700">
                        {new Date(log.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-amber-800">{log.details}</p>
                    <p className="text-[10px] text-amber-600">
                      Logged by: {log.performedBy}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (1 col): Reservation Widget */}
        <div className="space-y-6">
          <ResourceBookingPanel resource={resource as any} />
        </div>
      </div>
    </div>
  );
}