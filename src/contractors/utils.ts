import { z } from "zod";
import { AllContractorsByProjectQuery } from "../__generated__/gql/graphql";

export type ContractorForm =
  AllContractorsByProjectQuery["contractors"][number];

export const contractorValidation = z.object({
  name: z.string().min(3),
  id: z.string().optional(),
});
