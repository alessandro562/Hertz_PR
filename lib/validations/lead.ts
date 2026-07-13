import { z } from "zod";

const priority = z.enum(["low", "medium", "high"]);
const interest = z.enum(["cold", "warm", "hot"]);
const leadType = z.enum(["pr", "festaiolo", "supporter_social"]);
const tags = z.array(z.string()).optional();

export const createLeadSchema = z.object({
  instagram_username: z.string().trim().min(1, "Inserisci l'@ Instagram."),
  first_name: z.string().trim().optional(),
  last_name: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  city: z.string().trim().optional(),
  source: z.string().trim().optional(),
  priority: priority.optional(),
  interest_level: interest.optional(),
  lead_type: leadType.optional(),
  tags,
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
  lead_type: leadType.optional(),
  tags,
  next_action: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  next_follow_up_at: z.string().trim().optional(),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
