import { graphql } from "../graphql";
import { useQuerySub } from "../utils";

const queryDebrisTypes = graphql(/* GraphQL */ `
  query AllDebrisTypesByProject($project_id: uuid!) {
    debris_types(where: { project_id: { _eq: $project_id } }) {
      id
      name
    }
  }
`);

export const mutationInsertDebrisType = graphql(/* GraphQL */ `
  mutation InsertDebristype($object: debris_types_insert_input!) {
    insert_debris_types_one(
      object: $object
      on_conflict: { constraint: debris_types_id_key, update_columns: [name] }
    ) {
      id
      project_id
    }
  }
`);

export function useAllDebrisTypesByProject(projectId: string) {
  const { data, loading, error } = useQuerySub(queryDebrisTypes, {
    variables: { project_id: projectId },
  });

  return { data, loading, error };
}

export function useDebrisTypeById(projectId: string, debris: string) {
  const { data, ...rest } = useAllDebrisTypesByProject(projectId);
  return {
    ...rest,
    data: data?.debris_types.find((debrisType) => debrisType.id === debris),
  };
}
