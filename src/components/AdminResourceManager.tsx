"use client";

import React, { useState, useTransition } from "react";
import { ResourceWithCategory, ResourceCategory } from "@/lib/types";
import { useCurrentUser } from "./UserContext";
import {
  toggleResourceMaintenance,
  createResource,
} from "@/lib/actions/resources";
import { StatusBadge } from "./StatusBadge";
import {
  Settings,
  Plus,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Building,
  Users,
  MapPin,
  X,
  ShieldAlert,
} from "lucide-react";

interface AdminResourceManagerProps {
  initialResources: ResourceWithCategory[];
  categories: ResourceCategory[];
}

export function AdminResourceManager({
  initialResources,
  categories,
}: AdminResourceManagerProps) {
  const { currentUser } = useCurrentUser();
  const [isPending, startTransition] = useTransition();

  // Create Resource Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState(4);
  const [description, setDescription] = useState("");
  const [amenitiesStr, setAmenitiesStr] = useState("4K Display, Whiteboard, Video Conference");
  const [createError, setCreateError] = useState<string | null>(null);

  // Maintenance Toggle Modal State
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<ResourceWithCategory | null>(null);
  const [maintenanceReason, setMaintenanceReason] = useState("");
  const [maintenanceAction, setMaintenanceAction] = useState<"ENABLE" | "DISABLE">("ENABLE");

  const openMaintenanceModal = (resource: ResourceWithCategory) => {
    // Set the available action to the inverse of the resource's current status.
    setSelectedResource(resource);
    const willEnable = resource.status !== "MAINTENANCE";
    setMaintenanceAction(willEnable ? "ENABLE" : "DISABLE");
    setMaintenanceReason(
      willEnable
        ? "Scheduled routine inspection and hardware safety diagnostics"
        : "Inspection completed, verified ready for general use"
    );
    setMaintenanceModalOpen(true);
  };

  const handleMaintenanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResource) return;

    // Track the async server update so submission buttons can show pending state.
    startTransition(async () => {
      const res = await toggleResourceMaintenance(
        selectedResource.id,
        maintenanceAction === "ENABLE",
        maintenanceReason,
        currentUser.name
      );
      if (res.success) {
        setMaintenanceModalOpen(false);
        setSelectedResource(null);
      }
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    // Normalize the comma-separated amenities field to the action's array format.
    const amenitiesList = amenitiesStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    startTransition(async () => {
      const res = await createResource({
        name,
        code,
        categoryId,
        location,
        capacity,
        description,
        amenities: amenitiesList,
      });

      if (res.success) {
        setCreateModalOpen(false);
        setName("");
        setCode("");
        setLocation("");
        setDescription("");
      } else {
        setCreateError(res.error || "Failed to create resource");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Add */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-brand-600" />
            Operational Facilities Control Panel
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage physical resources, toggle safety maintenance shutdowns, and track usage.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Facility
        </button>
      </div>

      {/* Resource Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Code & Facility</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4 text-center">Capacity</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Total Bookings</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {initialResources.map((res) => {
                const isMaint = res.status === "MAINTENANCE";
                return (
                  <tr key={res.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-extrabold text-[10px]">
                          {res.code}
                        </span>
                        <span>{res.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {res.category.name}
                    </td>
                    <td className="py-4 px-4 text-slate-500">
                      {res.location}
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-slate-800">
                      {res.capacity}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <StatusBadge status={res.status} size="sm" />
                    </td>
                    <td className="py-4 px-4 text-center font-semibold text-slate-800">
                      {res._count?.reservations || 0}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => openMaintenanceModal(res)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all ${
                          isMaint
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                        }`}
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        {isMaint ? "Restore Service" : "Set Maintenance"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Maintenance Toggle Modal */}
      {maintenanceModalOpen && selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  {selectedResource.code}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {maintenanceAction === "ENABLE"
                    ? `Suspend ${selectedResource.name} for Maintenance`
                    : `Restore ${selectedResource.name} to Active Service`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setMaintenanceModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              {maintenanceAction === "ENABLE"
                ? "Placing this resource in maintenance will immediately prevent new bookings until maintenance is lifted."
                : "Restoring this facility makes it immediately available in the catalog and open for reservations."}
            </p>

            <form onSubmit={handleMaintenanceSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason / Technical Details
                </label>
                <textarea
                  rows={3}
                  required
                  value={maintenanceReason}
                  onChange={(e) => setMaintenanceReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-brand-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMaintenanceModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl text-white shadow-md ${
                    maintenanceAction === "ENABLE"
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {maintenanceAction === "ENABLE" ? "Confirm Maintenance Mode" : "Return to Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Resource Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 space-y-4 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Register New Facility or Resource
              </h3>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Resource Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Executive Studio A"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Code / ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CR-104"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Max Capacity *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Physical Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2nd Floor, Innovation Wing"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Description *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Capabilities, room layout, and intended purpose..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Amenities (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 4K Display, Dual Microphones, Whiteboard"
                  value={amenitiesStr}
                  onChange={(e) => setAmenitiesStr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md"
                >
                  {isPending ? "Creating..." : "Add Resource"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}