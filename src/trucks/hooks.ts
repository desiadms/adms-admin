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

export function useAllTrucksByProject(projectId: string) {
  const { data, loading, error } = useQuerySub(queryTrucks, {
    variables: { project_id: projectId },
  });

  return { data, loading, error };
}
