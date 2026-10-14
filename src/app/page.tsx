import React from "react";
import Link from "next/link";
import { getDashboardMetrics } from "@/lib/actions/analytics";
import { getResources } from "@/lib/actions/resources";
import { ResourceCard } from "@/components/ResourceCard";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Building2,
  CalendarCheck,
  Activity,
  Layers,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Clock,
  MapPin,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Fetch current dashboard metrics and the complete resource list on each request.
  const metrics = await getDashboardMetrics();
  const allResources = await getResources();
  // Feature only a few resources here; the resources page shows the full list.
  const featuredResources = allResources.slice(0, 3);

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white p-8 sm:p-10 shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            PrimeWave Resource Hub
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Seamless Facility & Shared Resource Coordination
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Eliminate scheduling conflicts, double bookings, and availability confusion.
            Reserve conference rooms, AV hardware, test labs, and transport with real-time atomic conflict prevention.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 text-xs font-bold shadow-lg shadow-brand-500/20 active:scale-95 transition-all"
            >
              Browse All Resources
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/calendar"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur border border-white/15 transition-all"
            >
              View Master Schedule
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI summary of resource availability, reservations, utilization, and maintenance. */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Resources */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Managed Facilities</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {metrics.totalResources}
            </h3>
            <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {metrics.availableResources} ready for use
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2: Today's Bookings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Today&apos;s Reservations</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {metrics.todayReservationsCount}
            </h3>
            <p className="text-[11px] text-blue-600 font-medium mt-1">
              {metrics.activeReservationsCount} in-session right now
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <CalendarCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: Active In-Session */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Utilization Rate</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {metrics.utilizationRate}%
            </h3>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              Calculated on active hours
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4: Maintenance status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Service Maintenance</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {metrics.underMaintenance}
            </h3>
            <p className="text-[11px] text-amber-600 font-medium mt-1">
              {metrics.underMaintenance > 0 ? "Under inspection" : "All systems normal"}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Activity className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* A short resource preview with a link to browse the complete inventory. */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Popular Shared Resources
            </h2>
            <p className="text-xs text-slate-500">
              Frequently requested meeting spaces, presentation equipment, and test labs
            </p>
          </div>
          <Link
            href="/resources"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            Explore all {allResources.length} resources
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredResources.map((res: any) => (
            <ResourceCard key={res.id} resource={res} />
          ))}
        </div>
      </div>

      {/* Operational overview: recent reservations alongside resource category totals. */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Reservations Feed (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Recent Organization Bookings
              </h3>
              <p className="text-xs text-slate-500">
                Live log of confirmed reservations and check-ins
              </p>
            </div>
            <Link
              href="/calendar"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              Full Calendar View →
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {metrics.recentReservations.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No reservations registered yet. Book your first resource!
              </div>
            ) : (
              metrics.recentReservations.map((res) => {
                const start = new Date(res.startTime);
                const end = new Date(res.endTime);
                return (
                  <div key={res.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                        {res.resource.code}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {res.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span>{res.resource.name}</span>
                          <span>•</span>
                          <span>Booked by {res.user.name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <StatusBadge status={res.status} size="sm" />
                      <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3" />
                        {start.toLocaleDateString("en-US", { month: "short", day: "numeric" })},{" "}
                        {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Resource Categories Breakdown (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Facilities by Category
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Breakdown of organization assets
            </p>

            <div className="space-y-3">
              {metrics.categoryDistribution.map((cat, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-brand-500" />
                    <span className="text-xs font-semibold text-slate-700">
                      {cat.category}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                    {cat.count} {cat.count === 1 ? "unit" : "units"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>Zero-Collision Engine:</strong> All slots are verified with isolation-level concurrency locks.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}