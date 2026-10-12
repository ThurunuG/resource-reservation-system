import { Resource, ResourceCategory, Reservation, User, MaintenanceLog, ResourceStatus, ReservationStatus, Role } from "@prisma/client";

export type { Resource, ResourceCategory, Reservation, User, MaintenanceLog, ResourceStatus, ReservationStatus, Role };

export interface ResourceWithCategory extends Resource {
  category: ResourceCategory;
  reservations?: Reservation[];
  _count?: {
    reservations: number;
  };
}

export interface ReservationWithDetails extends Reservation {
  resource: Resource & {
    category: ResourceCategory;
  };
  user: User;
}

export interface DashboardMetrics {
  totalResources: number;
  availableResources: number;
  underMaintenance: number;
  totalReservationsCount: number;
  activeReservationsCount: number;
  todayReservationsCount: number;
  utilizationRate: number; // percentage
  popularResources: {
    id: string;
    name: string;
    code: string;
    categoryName: string;
    bookingCount: number;
  }[];
  categoryDistribution: {
    category: string;
    count: number;
  }[];
  recentReservations: ReservationWithDetails[];
}

export interface ConflictCheckResult {
  hasConflict: boolean;
  message?: string;
  conflictingReservation?: {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    userName: string;
  };
}

export interface CreateReservationInput {
  resourceId: string;
  userId: string;
  title: string;
  startTime: string | Date;
  endTime: string | Date;
  notes?: string;
  attendeesCount?: number;
}