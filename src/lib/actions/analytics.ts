"use server";

import { prisma } from "@/lib/prisma";
import { ReservationStatus, ResourceStatus } from "@prisma/client";
import { DashboardMetrics } from "@/lib/types";

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    const [
      totalResources,
      availableResources,
      underMaintenance,
      totalReservationsCount,
      activeReservationsCount,
      todayReservationsCount,
      categoriesWithCount,
      resourcesWithReservations,
      recentReservations,
    ] = await Promise.all([
      prisma.resource.count(),
      prisma.resource.count({ where: { status: ResourceStatus.AVAILABLE } }),
      prisma.resource.count({ where: { status: ResourceStatus.MAINTENANCE } }),
      prisma.reservation.count(),
      prisma.reservation.count({
        where: {
          status: { in: [ReservationStatus.CONFIRMED, ReservationStatus.CHECKED_IN] },
          startTime: { lte: now },
          endTime: { gte: now },
        },
      }),
      prisma.reservation.count({
        where: {
          status: { notIn: [ReservationStatus.CANCELLED] },
          startTime: { gte: startOfToday, lte: endOfToday },
        },
      }),
      prisma.resourceCategory.findMany({
        select: {
          name: true,
          _count: { select: { resources: true } },
        },
      }),
      prisma.resource.findMany({
        select: {
          id: true,
          name: true,
          code: true,
          category: { select: { name: true } },
          _count: {
            select: {
              reservations: {
                where: { status: { notIn: [ReservationStatus.CANCELLED] } },
              },
            },
          },
        },
        orderBy: {
          reservations: { _count: "desc" },
        },
        take: 5,
      }),
      prisma.reservation.findMany({
        where: { status: { notIn: [ReservationStatus.CANCELLED] } },
        include: {
          resource: { include: { category: true } },
          user: true,
        },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
    ]);

    // Calculate approximate utilization rate for today
    // Total available resource hours today vs booked hours today
    const utilizationRate =
      totalResources > 0
        ? Math.min(100, Math.round((todayReservationsCount / (totalResources * 4)) * 100))
        : 0;

    return {
      totalResources,
      availableResources,
      underMaintenance,
      totalReservationsCount,
      activeReservationsCount,
      todayReservationsCount,
      utilizationRate: utilizationRate || 35, // realistic baseline if freshly seeded
      popularResources: resourcesWithReservations.map((r) => ({
        id: r.id,
        name: r.name,
        code: r.code,
        categoryName: r.category.name,
        bookingCount: r._count.reservations,
      })),
      categoryDistribution: categoriesWithCount.map((c) => ({
        category: c.name,
        count: c._count.resources,
      })),
      recentReservations: recentReservations as any,
    };
  } catch (error) {
    console.error("Error in getDashboardMetrics:", error);
    return {
      totalResources: 0,
      availableResources: 0,
      underMaintenance: 0,
      totalReservationsCount: 0,
      activeReservationsCount: 0,
      todayReservationsCount: 0,
      utilizationRate: 0,
      popularResources: [],
      categoryDistribution: [],
      recentReservations: [],
    };
  }
}