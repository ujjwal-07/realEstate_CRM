import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  budget: z.number().positive("Budget must be a positive number"),
  location: z.string().min(2, "Location is required"),
propertyType: z.enum(["1 BHK", "2 BHK", "3 BHK", "4 BHK", "Plot", "Commercial"], {
    message: "Invalid property type selected",
  }),
  source: z.enum(["Facebook", "Google", "Referral", "Website", "Other"], {
    message: "Invalid lead source",
  }),
  status: z.enum(["New", "Contacted", "Site Visit", "Closed", "Lost"]).optional(),
  notes: z.array(z.string()).optional(),
});