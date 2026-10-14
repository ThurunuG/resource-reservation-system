"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrentUser } from "./UserContext";
import {
  Waves,
  LayoutDashboard,
  Building2,
  CalendarDays,
  BookmarkCheck,
  Settings,
  ChevronDown,
  UserCheck,
  Menu,
  X,
} from "lucide-react";

export function Navbar() {
  // Use the current route to highlight the active navigation link.
  const pathname = usePathname();
  const { currentUser, setCurrentUser, availableUsers } = useCurrentUser();

  // Track the two menus independently so either can be opened or closed.
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Define links once to keep desktop and mobile navigation in sync.
  const navLinks = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/resources", label: "Resources", icon: Building2 },
    { href: "/calendar", label: "Schedule", icon: CalendarDays },
    { href: "/my-reservations", label: "My Bookings", icon: BookmarkCheck },
    { href: "/admin/resources", label: "Facility Admin", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-emerald-400 flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Waves className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-brand-700 transition-colors">
                  PrimeWave
                </span>
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-brand-600 -mt-1">
                  Resource Hub
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-brand-50 text-brand-700 font-semibold shadow-sm"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-brand-600" : "text-slate-400"}`} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Role Switcher Dropdown */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:border-brand-400 bg-white hover:bg-slate-50/80 transition-all text-left shadow-sm"
              >
                <img
                  src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-100"
                />
                <div className="hidden sm:block">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold text-slate-900 leading-tight">
                      {currentUser.name}
                    </p>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      currentUser.role === "ADMIN" 
                        ? "bg-purple-100 text-purple-700" 
                        : "bg-slate-100 text-slate-600"
                    }`}>
                      {currentUser.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-none mt-0.5">
                    {currentUser.department}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 ml-1 hidden sm:block" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Switch Active User (Demo Mode)
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Test multi-user concurrency and role-based permissions:
                    </p>
                  </div>
                  <div className="p-1.5 space-y-1">
                    {availableUsers.map((u) => {
                      const isSelected = u.id === currentUser.id;
                      return (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => {
                            // Apply the selected demo user and dismiss the dropdown.
                            setCurrentUser(u);
                            setUserDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                            isSelected
                              ? "bg-brand-50 border border-brand-200"
                              : "hover:bg-slate-50 border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <img
                              src={u.avatarUrl}
                              alt={u.name}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                            <div>
                              <p className={`text-xs font-semibold ${isSelected ? "text-brand-800" : "text-slate-800"}`}>
                                {u.name}
                              </p>
                              <p className="text-[10px] text-slate-500">
                                {u.department}
                              </p>
                            </div>
                          </div>
                          {isSelected && <UserCheck className="w-4 h-4 text-brand-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive ? "bg-brand-50 text-brand-700 font-semibold" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-brand-600" : "text-slate-400"}`} />
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}