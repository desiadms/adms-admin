import { useQuery } from "@apollo/client";
import { useParams } from "@tanstack/react-router";
import { graphql } from "../graphql";

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
  const res = useQuery(queryUsers);

  return { ...res, data: res.data?.usersMetadata };
}

export function useProjectUsers() {
  const { project } = useParams({ from: "/projects/$project/users" });
  const res = useAllUsers();

  const projectUsers = res.data?.filter(
    (user) => user?.active_project === project,
  );
  return { ...res, data: projectUsers };
}
