import { graphql } from "../graphql";
import { useQuerySub } from "../utils";

const queryContractors = graphql(/* GraphQL */ `
  query AllContractorsByProject($project_id: uuid!) {
    contractors(where: { project_id: { _eq: $project_id } }) {
      id
      name
    }
  }
`);

export const mutationInsertContractor = graphql(/* GraphQL */ `
  mutation InsertContractor($object: contractors_insert_input!) {
    insert_contractors_one(
      object: $object
      on_conflict: { constraint: contractors_pkey, update_columns: [name] }
    ) {
      id
      project_id
    }
  }
`);

export function useAllContractorsByProject(projectId: string) {
  const { data, loading, error } = useQuerySub(queryContractors, {
    variables: { project_id: projectId },
  });

  return { data, loading, error };
}

export function useContractorById(projectId: string, contractorId: string) {
  const { data, ...rest } = useAllContractorsByProject(projectId);
  return {
    ...rest,
    data: data?.contractors.find(
      (contractor) => contractor.id === contractorId,
    ),
  };
}
