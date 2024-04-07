import { useParams } from "@tanstack/react-router";
import { useMemo } from "react";
import { graphql } from "../graphql";
import { objectEntries, useQuerySub } from "../utils";

export const queryTasksLatLon = graphql(/* GraphQL */ `
  query TasksLatLon {
    tasks_collection {
      id
      latitude
      longitude
      project_id
    }
    tasks_disposal {
      id
      latitude
      longitude
      project_id
    }
    tasks_stump_removal {
      id
      project_id
      tasks_stump_removal_images {
        id
        latitude
        longitude
      }
    }
    tasks_ticketing {
      id
      latitude
      longitude
      project_id
    }
    tasks_tree_removal {
      id
      project_id
      tasks_tree_removal_images {
        id
        latitude
        longitude
      }
    }
  }
`);

export function useTasksLatLon() {
  const { loading, data, error } = useQuerySub(queryTasksLatLon);

  const flattenedTasksWithImages = useMemo(() => {
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
        } else if (
          key === "tasks_collection" ||
          key === "tasks_disposal" ||
          key === "tasks_ticketing"
        ) {
          const label =
            key === "tasks_collection"
              ? "Collection"
              : key === "tasks_disposal"
              ? "Disposal"
              : "Ticketing";
          return {
            label: label,
            key,
            tasks: tasks.map((task) => {
              return {
                taskId: task.id,
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

  console.log(flattenedTasksWithImages);

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

export function useTreeRemoval() {
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
