import { useParams } from "@tanstack/react-router";
import { useMemo } from "react";
import { graphql } from "../graphql";
import { useQuerySub } from "../utils";

export const queryTicketingNames = graphql(/* GraphQL */ `
  query TicketingNames {
    ticketing_names {
      add_photos
      id
      name
      print_ticket
      comment
      project_id
    }
  }
`);

export function useTicketingNames() {
  const { loading, data, error } = useQuerySub(queryTicketingNames);

  return { loading, data: data?.ticketing_names, error };
}

export function useTicketingNamesByProject() {
  const { project } = useParams({
    from: "/projects/$project/ticketing-names",
  });
  const { loading, data, error } = useTicketingNames();

  const ticketingNames = useMemo(() => {
    if (!data) return [];
    return data.filter((ticketingName) => ticketingName.project_id === project);
  }, [data, project]);

  return { loading, data: ticketingNames, error };
}

export const mutationUpsertTicketingName = graphql(/* GraphQL */ `
  mutation UpsertTicketingName($object: ticketing_names_insert_input!) {
    insert_ticketing_names_one(
      object: $object
      on_conflict: {
        constraint: ticketing_names_pkey
        update_columns: [add_photos, name, print_ticket, comment]
      }
    ) {
      id
    }
  }
`);

export function useTicketingName(ticketingId: string) {
  const { loading, data, error } = useTicketingNames();

  const ticketingName = useMemo(() => {
    if (!data) return null;
    return data.find((ticketingName) => ticketingName.id === ticketingId);
  }, [data, ticketingId]);

  return { loading, data: ticketingName, error };
}
