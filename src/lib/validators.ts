import { z } from "zod";

// Validates reservation details, including that the end time follows the start time.
export const createReservationSchema = z
  .object({
    resourceId: z.string().min(1, "Resource selection is required"),
    userId: z.string().min(1, "User is required"),
    title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title cannot exceed 100 characters"),
    startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Valid start time is required",
    }),
    endTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Valid end time is required",
    }),
    attendeesCount: z.coerce.number().int().min(1, "At least 1 attendee is required").default(1),
    notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.startTime);
      const end = new Date(data.endTime);
      return end > start;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );

// Validates optional filters used to search for resources.
export const resourceFilterSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  minCapacity: z.coerce.number().optional(),
  status: z.enum(["AVAILABLE", "MAINTENANCE", "RETIRED", "ALL"]).optional(),
  location: z.string().optional(),
});

// Validates the fields required to update an existing resource.
export const updateResourceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(2, "Code must be at least 2 characters"),
  categoryId: z.string().min(1, "Category is required"),
  location: z.string().min(2, "Location is required"),
  capacity: z.coerce.number().int().min(1, "Capacity must be at least 1"),
  description: z.string().min(5, "Description is required"),
  status: z.enum(["AVAILABLE", "MAINTENANCE", "RETIRED"]),
  amenities: z.array(z.string()).default([]),
});