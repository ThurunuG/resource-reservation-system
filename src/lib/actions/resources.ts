"use server";

import { prisma } from "@/lib/prisma";
import { ResourceStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  // Include resource counts for category usage summaries.
  try {
    return await prisma.resourceCategory.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { resources: true },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getResources(filters?: {
  search?: string;
  categoryId?: string;
  minCapacity?: number;
  status?: string;
  location?: string;
}) {
  try {
    // Add only the filters supplied by the caller to the Prisma query.
    const where: any = {};

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { code: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
        { location: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters?.categoryId && filters.categoryId !== "ALL") {
      where.categoryId = filters.categoryId;
    }

    if (filters?.minCapacity && filters.minCapacity > 0) {
      where.capacity = { gte: filters.minCapacity };
    }

    if (filters?.status && filters.status !== "ALL") {
      where.status = filters.status as ResourceStatus;
    }

    if (filters?.location) {
      where.location = { contains: filters.location, mode: "insensitive" };
    }

    const resources = await prisma.resource.findMany({
      where,
      include: {
        category: true,
        _count: {
          select: { reservations: true },
        },
      },
      orderBy: [{ status: "asc" }, { name: "asc" }],
    });

    return resources;
  } catch (error) {
    console.error("Error fetching resources:", error);
    return [];
  }
}

export async function getResourceById(id: string) {
  try {
    // Fetch upcoming reservations and recent maintenance history for this resource.
    return await prisma.resource.findUnique({
      where: { id },
      include: {
        category: true,
        reservations: {
          where: {
            status: { notIn: ["CANCELLED"] },
            endTime: { gte: new Date() },
          },
          orderBy: { startTime: "asc" },
          take: 10,
          include: {
            user: true,
          },
        },
        maintenanceLogs: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });
  } catch (error) {
    console.error(`Error fetching resource with id ${id}:`, error);
    return null;
  }
}

export async function toggleResourceMaintenance(
  resourceId: string,
  enable: boolean,
  reason: string,
  performedBy: string = "System Admin"
) {
  try {
    // Keep the status update and its maintenance log entry in one transaction.
    const newStatus = enable ? ResourceStatus.MAINTENANCE : ResourceStatus.AVAILABLE;

    const [updatedResource] = await prisma.$transaction([
      prisma.resource.update({
        where: { id: resourceId },
        data: { status: newStatus },
      }),
      prisma.maintenanceLog.create({
        data: {
          resourceId,
          action: enable ? "MAINTENANCE_ENABLED" : "MAINTENANCE_RESOLVED",
          details: reason || (enable ? "Resource marked for maintenance inspection" : "Maintenance completed and returned to service"),
          performedBy,
        },
      }),
    ]);

    revalidatePath("/resources");
    revalidatePath(`/resources/${resourceId}`);
    revalidatePath("/admin/resources");
    revalidatePath("/");

    return { success: true, resource: updatedResource };
  } catch (error: any) {
    console.error("Error toggling maintenance:", error);
    return { success: false, error: error.message || "Failed to update maintenance status" };
  }
}

export async function createResource(data: {
  name: string;
  code: string;
  categoryId: string;
  location: string;
  capacity: number;
  description: string;
  amenities: string[];
  imageUrl?: string;
}) {
  try {
    // Normalize the code before checking for duplicates and creating the resource.
    const existingCode = await prisma.resource.findUnique({
      where: { code: data.code.toUpperCase() },
    });

    if (existingCode) {
      return { success: false, error: `A resource with code "${data.code}" already exists.` };
    }

    const resource = await prisma.resource.create({
      data: {
        name: data.name,
        code: data.code.toUpperCase(),
        categoryId: data.categoryId,
        location: data.location,
        capacity: data.capacity,
        description: data.description,
        amenities: JSON.stringify(data.amenities || []),
        imageUrl: data.imageUrl || null,
        status: ResourceStatus.AVAILABLE,
      },
    });

    revalidatePath("/resources");
    revalidatePath("/admin/resources");
    revalidatePath("/");

    return { success: true, resource };
  } catch (error: any) {
    console.error("Error creating resource:", error);
    return { success: false, error: error.message || "Failed to create resource" };
  }
}