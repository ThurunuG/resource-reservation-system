"use client";

import React, { useState, useMemo } from "react";
import { ResourceWithCategory, ResourceCategory } from "@/lib/types";
import { ResourceCard } from "./ResourceCard";
import {
  Search,
  Filter,
  Users,
  Building,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

interface ResourceCatalogProps {
  initialResources: ResourceWithCategory[];
  categories: (ResourceCategory & { _count?: { resources: number } })[];
}

export function ResourceCatalog({
  initialResources,
  categories,
}: ResourceCatalogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [minCapacity, setMinCapacity] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Apply each selected criterion to the original catalog before displaying results.
  const filteredResources = useMemo(() => {
    return initialResources.filter((res) => {
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = res.name.toLowerCase().includes(query);
        const matchesCode = res.code.toLowerCase().includes(query);
        const matchesDesc = res.description.toLowerCase().includes(query);
        const matchesLoc = res.location.toLowerCase().includes(query);
        if (!matchesName && !matchesCode && !matchesDesc && !matchesLoc) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== "ALL" && res.categoryId !== selectedCategory) {
        return false;
      }

      // Min Capacity
      if (minCapacity > 0 && res.capacity < minCapacity) {
        return false;
      }

      // Status
      if (statusFilter !== "ALL" && res.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [initialResources, searchTerm, selectedCategory, minCapacity, statusFilter]);

  // Used to conditionally show controls for clearing the current filters.
  const hasActiveFilters =
    searchTerm !== "" ||
    selectedCategory !== "ALL" ||
    minCapacity !== 0 ||
    statusFilter !== "ALL";

  const resetFilters = () => {
    // Restore all filter controls to their default values.
    setSearchTerm("");
    setSelectedCategory("ALL");
    setMinCapacity(0);
    setStatusFilter("ALL");
  };

  return (
    <div className="space-y-8">
      {/* Search & Filter Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by facility name, code (e.g. CR-101), location, or amenities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Min Capacity Dropdown */}
          <div className="flex items-center gap-2">
            <div className="relative min-w-[150px]">
              <Users className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={minCapacity}
                onChange={(e) => setMinCapacity(Number(e.target.value))}
                className="w-full pl-9 pr-8 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value={0}>Any Capacity</option>
                <option value={2}>2+ People</option>
                <option value={4}>4+ People</option>
                <option value={8}>8+ People</option>
                <option value={15}>15+ People</option>
              </select>
            </div>

            {/* Status Dropdown */}
            <div className="relative min-w-[150px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="AVAILABLE">Available Only</option>
                <option value="MAINTENANCE">In Maintenance</option>
              </select>
            </div>

            {/* Clear filters button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="Reset Filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 scrollbar-none border-t border-slate-100">
          <button
            type="button"
            onClick={() => setSelectedCategory("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
              selectedCategory === "ALL"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Categories ({initialResources.length})
          </button>
          {categories.map((cat) => {
            // Keep category totals independent of the other active filters.
            const count = initialResources.filter((r) => r.categoryId === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                  isSelected
                    ? "bg-brand-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count & Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-slate-500">
            Showing <strong className="text-slate-900">{filteredResources.length}</strong> of {initialResources.length} facilities
          </p>
        </div>

        {filteredResources.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <Building className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">
              No matching resources found
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn&apos;t find any resource matching your selected search or filter criteria. Try adjusting your search term.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-2 px-4 py-2 text-xs font-bold rounded-xl bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((res) => (
              <ResourceCard key={res.id} resource={res} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}