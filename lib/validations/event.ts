import { z } from "zod";

export const createEventSchema = z.object({
  name: z.string().trim().min(1, "Dai un nome all'evento."),
  event_date: z.string().trim().min(1, "Scegli una data."),
  venue: z.string().trim().optional(),
  city: z.string().trim().optional(),
  description: z.string().trim().optional(),
  target_attendance: z.string().trim().optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
