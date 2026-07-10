import { z } from "zod";

export const createTeamSchema = z.object({
  name: z.string().trim().min(1, "Dai un nome alla squadra."),
  description: z.string().trim().optional(),
  capo_pr_user_id: z.string().uuid("Scegli un capo PR."),
});

export const createGroupSchema = z.object({
  name: z.string().trim().min(1, "Dai un nome al gruppo."),
  type: z.enum(["bacheca", "pr", "sotto_pr"]),
  invite_link: z.string().trim().optional(),
  team_id: z.string().uuid().optional(),
});

export const updateCollaboratorSchema = z.object({
  phone: z.string().trim().optional(),
  city: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  reliability_notes: z.string().trim().optional(),
});
