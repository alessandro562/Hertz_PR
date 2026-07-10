import { z } from "zod";

export const createUserSchema = z.object({
  full_name: z.string().trim().min(1, "Inserisci il nome."),
  email: z.string().trim().email("Email non valida."),
  role: z.enum(["manager", "capo_pr"]),
  password: z.string().min(8, "La password deve avere almeno 8 caratteri."),
});
