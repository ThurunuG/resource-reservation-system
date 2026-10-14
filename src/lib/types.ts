import { Resource, ResourceCategory, Reservation, User, MaintenanceLog, ResourceStatus, ReservationStatus, Role } from "@prisma/client";

export type { Resource, ResourceCategory, Reservation, User, MaintenanceLog, ResourceStatus, ReservationStatus, Role };

/** A resource with its category and optional reservation summary data. */
export interface ResourceWithCategory extends Resource {
  category: ResourceCategory;
  reservations?: Reservation[];
  _count?: {
    reservations: number;
  };
}

/** A reservation joined with the associated resource, category, and user. */
export interface ReservationWithDetails extends Reservation {
  resource: Resource & {
    category: ResourceCategory;
  };
  user: User;
}

/** Aggregate counts and lists used to populate the dashboard. */
export interface DashboardMetrics {
  totalResources: number;
  availableResources: number;
  underMaintenance: number;
  totalReservationsCount: number;
  activeReservationsCount: number;
  todayReservationsCount: number;
  utilizationRate: number; // Percentage of resources currently in use.
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

/** Result of checking whether a requested reservation conflicts with another. */
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

/** Fields required to create a reservation. Times may be ISO strings or Date objects. */
export interface CreateReservationInput {
  resourceId: string;
  userId: string;
  title: string;
  startTime: string | Date;
  endTime: string | Date;
  notes?: string;
  attendeesCount?: number;
}