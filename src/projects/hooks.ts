import { useParams } from "@tanstack/react-router";
import { useMemo } from "react";
import { graphql } from "../graphql";
import { TopNav } from "../nav/Components";
import { useQuerySub } from "../utils";

export const queryProjects = graphql(/* GraphQL */ `
  query Projects {
    projects {
      id
      name
      poc
      status
      sub_contractor
      location
      comment
      contractor
      created_at
    }
  }
`);

export const mutationUpsertProject = graphql(/* GraphQL */ `
  mutation UpsertProject($project: projects_insert_input!) {
    insert_projects_one(
      object: $project
      on_conflict: {
        update_columns: [
          name
          poc
          status
          sub_contractor
          location
          comment
          contractor
        ]
        constraint: projects_pkey
      }
    ) {
      id
    }
  }
`);

export function useProjects() {
  const { loading, data, error } = useQuerySub(queryProjects);

  return { loading, data: data?.projects, error };
}

export function useSingleProjectLinks() {
  const params = useParams({
    from: "/projects/$project",
  });

  const links: Parameters<typeof TopNav>[number]["links"] = [
    { id: "users", to: "/projects/$project/users", label: "Users", params },
    {
      id: "tasks",
      to: "/projects/$project/tasks",
      label: "Tasks",
      params,
    },
  ];

  return links;
}

export function useProjectId() {
  const params = useParams({
    strict: false,
  });
  if (!("project" in params)) return undefined;
  const projectId = params.project;
  return projectId;
}

export function useProject() {
  const projectId = useProjectId();
  const { data, loading, error } = useProjects();
  const project = useMemo(
    () => data?.find((p) => p.id === projectId),
    [data, projectId],
  );
  return { data: project, loading, error };
}
