import { z } from "zod";
import { ProjectsQuery } from "../__generated__/gql/graphql";

export type ProjectForm = ProjectsQuery["projects"][number];

export const projectValidation = z.object({
  id: z.string().optional(),
  name: z.string().min(3),
  poc: z.string().min(3),
  status: z.boolean().nullish(),
  contractor: z.string().min(3),
  sub_contractor: z.string().min(3),
  location: z.string().min(3),
  comment: z.string().optional(),
});
