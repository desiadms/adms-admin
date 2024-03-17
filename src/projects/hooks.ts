import { useParams } from "@tanstack/react-router";
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

export const mutationCreateProject = graphql(/* GraphQL */ `
  mutation CreateProject($project: projects_insert_input!) {
    insert_projects_one(object: $project) {
      id
    }
  }
`);

export function useProjects() {
  const { loading, data } = useQuerySub(queryProjects);

  return { loading, data: data?.projects };
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
  const projects = useProjects();
  const project = projects.data?.find((p) => p.id === projectId);
  return project;
}
