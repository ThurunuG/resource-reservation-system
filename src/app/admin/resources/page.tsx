import React from "react";
import { getResources, getCategories } from "@/lib/actions/resources";
import { AdminResourceManager } from "@/components/AdminResourceManager";
import { Settings } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminResourcesPage() {
  const [resources, categories] = await Promise.all([
    getResources(),
    getCategories(),
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <AdminResourceManager
        initialResources={resources as any}
        categories={categories as any}
      />
    </div>
  );
}