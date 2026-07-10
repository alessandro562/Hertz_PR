import { z } from "zod";

const priority = z.enum(["low", "medium", "high"]);
const interest = z.enum(["cold", "warm", "hot"]);

export const createLeadSchema = z.object({
  instagram_username: z.string().trim().min(1, "Inserisci l'@ Instagram."),
  first_name: z.string().trim().optional(),
  last_name: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  city: z.string().trim().optional(),
  source: z.string().trim().optional(),
  priority: priority.optional(),
  interest_level: interest.optional(),
  notes: z.string().trim().optional(),
});

export const updateLeadSchema = z.object({
  first_name: z.string().trim().optional(),
  last_name: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  city: z.string().trim().optional(),
  source: z.string().trim().optional(),
  priority: priority.optional(),
  interest_level: interest.optional(),
  next_action: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  next_follow_up_at: z.string().trim().optional(),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
