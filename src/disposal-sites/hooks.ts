import { graphql } from "../graphql";
import { useQuerySub } from "../utils";

const queryDisposalSites = graphql(/* GraphQL */ `
  query AllDisposalSitesByProject($project_id: uuid!) {
    disposal_sites(where: { project_id: { _eq: $project_id } }) {
      name
      id
    }
  }
`);

export const mutationInsertTruck = graphql(/* GraphQL */ `
  mutation InsertDisposalSite($object: disposal_sites_insert_input!) {
    insert_disposal_sites_one(
      on_conflict: { constraint: disposal_sites_pkey, update_columns: [name] }
      object: $object
    ) {
      id
      project_id
    }
  }
`);

export function useAllDisposalSitesByProject(projectId: string) {
  const { data, loading, error } = useQuerySub(queryDisposalSites, {
    variables: { project_id: projectId },
  });

  return { data, loading, error };
}
