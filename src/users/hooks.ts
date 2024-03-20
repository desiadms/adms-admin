import { useParams } from "@tanstack/react-router";
import { useMemo } from "react";
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
      usersMetadata_user {
        createdAt
        disabled
        email
        metadata
        emailVerified
        lastSeen
      }
    }
  }
`);

export const mutationUpsertUser = graphql(/* GraphQL */ `
  mutation UpsertUser($user: usersMetadata_insert_input!) {
    insert_usersMetadata_one(
      object: $user
      on_conflict: {
        constraint: usersMetadata_pkey
        update_columns: [first_name, hire_date, last_name, status]
      }
    ) {
      id
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

type TUserMetadata = {
  activeProject: string;
};

export function useProjectUsers() {
  const { project } = useParams({ from: "/projects/$project/users" });
  const { data, loading, error } = useAllUsers();

  const projectUsers = useMemo(
    () =>
      data?.filter(
        (user) =>
          (user.usersMetadata_user.metadata as unknown as TUserMetadata)
            .activeProject === project,
      ),
    [data, project],
  );

  return { loading, error, data: projectUsers };
}
