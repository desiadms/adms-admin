import { graphql } from "../graphql";
import { useQuerySub } from "../utils";

const queryTrucks = graphql(/* GraphQL */ `
  query AllTrucksByProject($project_id: uuid!) {
    trucks(where: { project_id: { _eq: $project_id } }) {
      cubic_yardage
      id
      project_id
      truck_number
      vin_number
      driver_name
      contractor
    }
  }
`);

export const mutationInsertTruck = graphql(/* GraphQL */ `
  mutation InsertTruck($object: trucks_insert_input!) {
    insert_trucks_one(
      object: $object
      on_conflict: {
        constraint: trucks_pkey
        update_columns: [
          contractor
          cubic_yardage
          truck_number
          vin_number
          driver_name
        ]
      }
    ) {
      id
      project_id
    }
  }
`);

export function useAllTrucksByProject(projectId: string) {
  const { data, loading, error } = useQuerySub(queryTrucks, {
    variables: { project_id: projectId },
  });

  return { data, loading, error };
}

export function useTruckById(projectId: string, truck: string) {
  const { data, ...rest } = useAllTrucksByProject(projectId);
  return {
    ...rest,
    data: data?.trucks.find((t) => t.id === truck),
  };
}
