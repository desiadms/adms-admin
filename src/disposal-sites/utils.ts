import { z } from "zod";
import { AllDisposalSitesByProjectQuery } from "../__generated__/gql/graphql";

export type DisposalSiteForm =
  AllDisposalSitesByProjectQuery["disposal_sites"][number];

export const disposalSiteValidation = z.object({
  name: z.string().min(3),
  id: z.string().optional(),
});
