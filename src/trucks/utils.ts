import { z } from "zod";
import { AllTrucksByProjectQuery } from "../__generated__/gql/graphql";

export type TruckForm = AllTrucksByProjectQuery["trucks"][number];

export const truckValidation = z.object({
  truck_number: z.string(),
  vin_number: z.string(),
  cubic_yardage: z.string()
});
