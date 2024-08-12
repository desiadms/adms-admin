import { z } from "zod";
import { AllDebrisTypesByProjectQuery } from "../__generated__/gql/graphql";

export type DebrisTypeForm =
  AllDebrisTypesByProjectQuery["debris_types"][number];

export const debrisTypeValidation = z.object({
  name: z.string().min(3),
  id: z.string().optional(),
});
