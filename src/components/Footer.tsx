import React from "react";
import { Waves, Heart, Shield, CheckCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Waves className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">
                PrimeWave Lab (Pvt) Ltd
              </p>
              <p className="text-xs text-slate-500">
                Resource Reservation Management System • Technical Assessment
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Service Status: Operational
            </span>
            <span>Next.js App Router</span>
            <span>TypeScript</span>
            <span>PostgreSQL</span>
          </div>

          <p className="text-xs text-slate-400">
            &copy; 2026 PrimeWave Lab. Built for Internship Evaluation.
          </p>
        </div>
      </div>
    </footer>
  );
}