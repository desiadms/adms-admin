import { z } from "zod";

export const userValidation = z.object({
  id: z.string().optional(),
  userId: z.string().min(3),
  activeProject: z.string().nullish(),
  password: z.string().min(3),
  first_name: z.string().min(3),
  last_name: z.string().min(3),
  hire_date: z.string().nullish(),
});

export type UserForm = z.infer<typeof userValidation>;
