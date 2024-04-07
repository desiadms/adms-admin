import { z } from "zod";
import { TicketingNamesQuery } from "../__generated__/gql/graphql";

export type TicketingNameForm = TicketingNamesQuery["ticketing_names"][number];

export const ticketingNameValidation = z.object({
  id: z.string().optional(),
  name: z.string().min(3),
  add_photos: z.boolean().nullish(),
  print_ticket: z.boolean().nullish(),
  comment: z.string().optional(),
});
