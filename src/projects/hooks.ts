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
    strict: false,
  });

  const links: Parameters<typeof TopNav>[number]["links"] = [
    {
      id: "tasks",
      to: "/projects/$project/task-report",
      label: "Reports",
      params,
    },
    { id: "users", to: "/projects/$project/users", label: "Users", params },
    {
      id: "ticketing-names",
      to: "/projects/$project/ticketing-names",
      label: "Ticketing Names",
      params,
    },
    {
      id: "trucks",
      to: "/projects/$project/trucks",
      label: "Trucks",
      params,
    },
    {
      id: "disposal-sites",
      to: "/projects/$project/disposal-sites",
      label: "Disposal Sites",
      params,
    },
    {
      id: "debris-types",
      to: "/projects/$project/debris-types",
      label: "Debris Types",
      params,
    },
    {
      id: "contractors",
      to: "/projects/$project/contractors",
      label: "Contractors",
      params,
    },
    {
      id: "edit",
      to: "/projects/$project/edit",
      label: "Edit Project",
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

export function useProjectOptions() {
  const { data, loading, error } = useProjects();
  const options = useMemo(() => {
    const sortedOptions =
      data
        ?.map((p) => ({
          label: p.name,
          value: p.id,
        }))
        .sort((a, b) =>
          a.label
            .toLocaleLowerCase()
            .localeCompare(b.label.toLocaleLowerCase()),
        ) || [];
    return [{ label: "Unemployed", value: "unemployed" }, ...sortedOptions];
  }, [data]);
  return { data: options, loading, error };
}

export const deleteAllTasksMutation = graphql(/* GraphQL */ `
  mutation DeleteTasks($projectId: uuid!) {
    delete_tasks_collection(where: { project_id: { _eq: $projectId } }) {
      affected_rows
      returning {
        id
      }
    }
    delete_tasks_disposal(where: { project_id: { _eq: $projectId } }) {
      affected_rows
      returning {
        id
      }
    }
    delete_tasks_stump_removal(where: { project_id: { _eq: $projectId } }) {
      affected_rows
      returning {
        id
      }
    }
    delete_tasks_ticketing(where: { project_id: { _eq: $projectId } }) {
      affected_rows
      returning {
        id
      }
    }
    delete_tasks_tree_removal(where: { project_id: { _eq: $projectId } }) {
      affected_rows
      returning {
        id
      }
    }
  }
`);

export const deleteTaskIdsMutation = graphql(/* GraphQL */ `
  mutation DeleteTaskIds($taskIds: [uuid!]!) {
    delete_task_ids(where: { id: { _in: $taskIds } }) {
      affected_rows
      returning {
        id
      }
    }
  }
`);

export const deleteProjectRelatedDataMutation = graphql(/* GraphQL */ `
  mutation DeleteProjectRelatedData($projectId: uuid!) {
    delete_contractors(where: { project_id: { _eq: $projectId } }) {
      affected_rows
    }
    delete_debris_types(where: { project_id: { _eq: $projectId } }) {
      affected_rows
    }
    delete_disposal_sites(where: { project_id: { _eq: $projectId } }) {
      affected_rows
    }
    delete_logs(where: { project_id: { _eq: $projectId } }) {
      affected_rows
    }
    delete_materials(where: { project_id: { _eq: $projectId } }) {
      affected_rows
    }
    delete_trucks(where: { project_id: { _eq: $projectId } }) {
      affected_rows
    }
    delete_ticketing_names(where: { project_id: { _eq: $projectId } }) {
      affected_rows
    }
  }
`);

export const deleteProjectMutation = graphql(/* GraphQL */ `
  mutation DeleteProject($projectId: uuid!) {
    delete_projects_by_pk(id: $projectId) {
      id
    }
  }
`);

export const deleteAllProjectImagesMutation = graphql(/* GraphQL */ `
  mutation DeleteAllProjectImages($projectId: uuid!) {
    delete_images(
      where: {
        task_id_data: {
          _or: [
            { tasks_ticketings: { project_id: { _eq: $projectId } } }
            { tasks_disposals: { project_id: { _eq: $projectId } } }
            { tasks_collections: { project_id: { _eq: $projectId } } }
            { tasks_tree_removals: { project_id: { _eq: $projectId } } }
            { tasks_stump_removals: { project_id: { _eq: $projectId } } }
          ]
        }
      }
    ) {
      affected_rows
      returning {
        id
      }
    }
  }
`);
