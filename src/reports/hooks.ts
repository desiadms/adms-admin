import { useParams } from "@tanstack/react-router";
import { useMemo } from "react";
import { AllTasksByProjectQuery } from "../__generated__/gql/graphql";
import { graphql } from "../graphql";
import { objectEntries, useQuerySub } from "../utils";

export const queryAllTasksByProjectAndUser = graphql(/* GraphQL */ `
  query AllTasksByProjectAndUser($project_id: uuid!, $user_id: uuid!) {
    tasks_collection(
      where: {
        _and: { project_id: { _eq: $project_id }, user_id: { _eq: $user_id } }
      }
    ) {
      id
      comment
      latitude
      longitude
      project_id
      created_at
    }
    tasks_disposal(
      where: {
        _and: { project_id: { _eq: $project_id }, user_id: { _eq: $user_id } }
      }
    ) {
      id
      comment
      latitude
      longitude
      project_id
      created_at
    }
    tasks_stump_removal(
      where: {
        _and: { project_id: { _eq: $project_id }, user_id: { _eq: $user_id } }
      }
    ) {
      id
      comment
      project_id
      created_at
      user_id
      tasks_stump_removal_images {
        id
        latitude
        longitude
        created_at
        taken_at_step
      }
    }
    tasks_ticketing(
      where: {
        _and: { project_id: { _eq: $project_id }, user_id: { _eq: $user_id } }
      }
    ) {
      id
      latitude
      longitude
      comment
      project_id
      created_at
      user_id
      task_ticketing_name {
        name
      }
    }
    tasks_tree_removal(
      where: {
        _and: { project_id: { _eq: $project_id }, user_id: { _eq: $user_id } }
      }
    ) {
      id
      project_id
      created_at
      comment
      user_id
      tasks_tree_removal_images {
        id
        latitude
        longitude
        created_at
        taken_at_step
      }
    }
  }
`);

export const queryAllTasksByProject = graphql(/* GraphQL */ `
  query AllTasksByProject($project_id: uuid!) {
    tasks_collection(where: { project_id: { _eq: $project_id } }) {
      id
      latitude
      longitude
      project_id
      created_at
    }
    tasks_disposal(where: { project_id: { _eq: $project_id } }) {
      id
      latitude
      longitude
      project_id
      created_at
    }
    tasks_stump_removal(where: { project_id: { _eq: $project_id } }) {
      id
      project_id
      created_at
      user_id
      tasks_stump_removal_images {
        id
        latitude
        longitude
        created_at
        taken_at_step
      }
    }
    tasks_ticketing(where: { project_id: { _eq: $project_id } }) {
      id
      latitude
      longitude
      project_id
      created_at
      user_id
      task_ticketing_name {
        name
      }
      images {
        id
        latitude
        longitude
        created_at
      }
    }
    tasks_tree_removal(where: { project_id: { _eq: $project_id } }) {
      id
      project_id
      created_at
      user_id
      tasks_tree_removal_images {
        id
        latitude
        longitude
        created_at
        taken_at_step
      }
    }
  }
`);

function useFlattenTasksWithImages(data: AllTasksByProjectQuery | undefined) {
  return useMemo(() => {
    if (!data) return [];
    return objectEntries(data)
      .map(([key, tasks]) => {
        if (key === "tasks_stump_removal") {
          const allImageCoordinates = tasks
            ?.map((task) => {
              return task.tasks_stump_removal_images.map(
                (stumpRemovalImage) => {
                  return {
                    taskId: task.id,
                    taskName: "Stump Removal",
                    id: stumpRemovalImage.id,
                    projectId: task.project_id,
                    latitude: stumpRemovalImage.latitude,
                    longitude: stumpRemovalImage.longitude,
                  };
                },
              );
            })
            .flat();

          return {
            label: "Stump Removal",
            key,
            tasks: allImageCoordinates,
          };
        } else if (key === "tasks_tree_removal") {
          const allImageCoordinates = tasks
            ?.map((task) => {
              return task.tasks_tree_removal_images.map((treeRemovalImage) => {
                return {
                  taskId: task.id,
                  taskName: "Tree Removal",
                  id: treeRemovalImage.id,
                  projectId: task.project_id,
                  latitude: treeRemovalImage.latitude,
                  longitude: treeRemovalImage.longitude,
                };
              });
            })
            .flat();

          return {
            label: "Tree Removal",
            key,
            tasks: allImageCoordinates,
          };
        } else if (key === "tasks_ticketing") {
          const allImageCoordinates = tasks
            ?.map((task) => {
              return task.images.map((taskTicketingImages) => {
                return {
                  taskId: task.id,
                  taskName: task.task_ticketing_name?.name,
                  id: taskTicketingImages.id,
                  projectId: task.project_id,
                  latitude: taskTicketingImages.latitude,
                  longitude: taskTicketingImages.longitude,
                };
              });
            })
            .flat();

          return {
            label: "Task Ticketing",
            key,
            tasks: allImageCoordinates,
          };
        } else if (key === "tasks_collection" || key === "tasks_disposal") {
          const label = key === "tasks_collection" ? "Collection" : "Disposal";

          return {
            label: label,
            key,
            tasks: tasks.map((task) => {
              return {
                taskId: task.id,
                taskName: label,
                id: task.id,
                projectId: task.project_id,
                latitude: task.latitude,
                longitude: task.longitude,
              };
            }),
          };
        }
      })
      .filter(Boolean);
  }, [data]);
}

export function useAllTasksByProjectAndUser(projectId: string, userId: string) {
  const { loading, data, error } = useQuerySub(queryAllTasksByProjectAndUser, {
    variables: {
      project_id: projectId,
      user_id: userId,
    },
    skip: !projectId || !userId,
  });

  const flattendTasks = Object.entries(data || {}).flatMap(([key, tasks]) => {
    if (tasks === "query_root") return [];
    return tasks.map((task) => {
      const { latitude, longitude } = {
        latitude:
          task.latitude ??
          (task.tasks_stump_removal_images?.[0]?.latitude ||
            task.tasks_tree_removal_images?.[0]?.latitude),
        longitude:
          task.longitude ??
          (task.tasks_stump_removal_images?.[0]?.longitude ||
            task.tasks_tree_removal_images?.[0]?.longitude),
      };
      return {
        ...task,
        latitude,
        longitude,
        key,
      };
    });
  });

  return { loading, data: flattendTasks, error };
}

export function useAllTasksByProject(projectId: string) {
  const { loading, data, error } = useQuerySub(queryAllTasksByProject, {
    variables: {
      project_id: projectId,
    },
    skip: !projectId,
  });

  const flattenedTasksWithImages = useFlattenTasksWithImages(data);

  return { loading, data: flattenedTasksWithImages, error };
}

export const queryTreeRemoval = graphql(/* GraphQL */ `
  query TreeRemoval($id: uuid!) {
    tasks_tree_removal_by_pk(id: $id) {
      id
      project_id
      comment
      completed
      created_at
      tasks_tree_removal_images {
        id
        latitude
        longitude
        taken_at_step
        task_id
        updated_at
        user_id
        created_at
      }
    }
  }
`);

export const queryTicketingTask = graphql(/* GraphQL */ `
  query TaskTicketing($id: uuid!) {
    tasks_ticketing_by_pk(id: $id) {
      comment
      created_at
      id
      images {
        created_at
        id
        latitude
        longitude
      }
      task_ticketing_name {
        name
        comment
      }
    }
  }
`);

export function useTreeRemovalTask() {
  const { taskId } = useParams({
    from: "/projects/$project/task-report/tree-removal/$taskId",
  });
  const { data, loading, error } = useQuerySub(queryTreeRemoval, {
    variables: {
      id: taskId,
    },
  });

  return { data: data?.tasks_tree_removal_by_pk, loading, error };
}

export function useTicketingTask() {
  const { taskId } = useParams({
    from: "/projects/$project/task-report/ticketing/$taskId",
  });
  const { data, loading, error } = useQuerySub(queryTicketingTask, {
    variables: {
      id: taskId,
    },
  });

  return { data: data?.tasks_ticketing_by_pk, loading, error };
}
