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
    }
  }
`);

export const mutationInsertTruck = graphql(/* GraphQL */ `
mutation InsertTruck($object: trucks_insert_input!) {
  insert_trucks_one(object: $object, on_conflict: {constraint: trucks_pkey}) {
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
