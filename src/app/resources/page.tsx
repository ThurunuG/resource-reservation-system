import React from "react";
import { getResources, getCategories } from "@/lib/actions/resources";
import { ResourceCatalog } from "@/components/ResourceCatalog";
import { Building2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  const [resources, categories] = await Promise.all([
    getResources(),
    getCategories(),
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-brand-600" />
            Resource Catalog & Facilities
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse conference rooms, audio/video equipment, specialized testing rigs, and transit.
          </p>
        </div>
      </div>

      <ResourceCatalog
        initialResources={resources as any}
        categories={categories as any}
      />
    </div>
  );
}