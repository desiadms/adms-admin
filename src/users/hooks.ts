import { useParams } from "@tanstack/react-router";
import { graphql } from "../graphql";
import { useQuerySub } from "../utils";

export const queryUsers = graphql(/* GraphQL */ `
  query Users {
    usersMetadata {
      first_name
      hire_date
      id
      last_name
      status
      active_project
      usersMetadata_user {
        createdAt
        email
        emailVerified
        lastSeen
      }
    }
  }
`);

export function useAllUsers() {
  const { loading, error, data } = useQuerySub(queryUsers);

  return {
    loading,
    error,
    data: data?.usersMetadata,
  };
}

export function useProjectUsers() {
  const { project } = useParams({ from: "/projects/$project/users" });
  const { data, loading, error } = useAllUsers();

  const projectUsers = data?.filter((user) => user?.active_project === project);
  return { loading, error, data: projectUsers };
}
