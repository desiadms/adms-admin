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

export const mutationUpdateUserMetadata = graphql(/* GraphQL */ `
  mutation UpdateUserMetadata($id: uuid!, $metadata: jsonb!) {
    updateUser(pk_columns: { id: $id }, _set: { metadata: $metadata }) {
      id
    }
  }
`);

export function useAllUsers() {
  const { loading, error, data } = useQuerySub(queryUsers);

  const users = useMemo(() => {
    return data?.usersMetadata.map((user) => ({
      ...user,
      usersMetadata_user: {
        ...user.usersMetadata_user,
        metadata: user.usersMetadata_user.metadata as unknown as TUserMetadata,
      },
    }));
  }, [data]);

  return {
    loading,
    error,
    data: users,
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
      data?.filter((user) => {
        return user.usersMetadata_user.metadata?.activeProject === project;
      }),
    [data, project],
  );

  return { loading, error, data: projectUsers };
}

export function useUser() {
  const { user: userId } = useParams({
    from: "/users/$user",
  });
  const { data, loading, error } = useAllUsers();

  const projectUser = useMemo(() => {
    return data?.find((user) => userId === user.id);
  }, [data, userId]);

  return { loading, error, data: projectUser };
}
