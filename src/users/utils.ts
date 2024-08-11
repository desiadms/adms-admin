import { z } from "zod";

export const createUserValidation = z.object({
  id: z.string().optional(),
  userId: z.string().min(3),
  activeProject: z.string().nullish(),
  password: z.string().min(3),
  first_name: z.string().min(3),
  last_name: z.string().min(3),
  hire_date: z.string().nullish(),
  disabled: z.boolean().optional(),
});

export const editUserValidation = z.object({
  id: z.string(),
  userId: z.string().min(3),
  activeProject: z.string().nullish(),
  first_name: z.string().min(3),
  last_name: z.string().min(3),
  hire_date: z.string().nullish(),
  disabled: z.boolean().optional(),
});

export type CrateUserForm = z.infer<typeof createUserValidation>;
export type EditUserForm = z.infer<typeof editUserValidation>;
