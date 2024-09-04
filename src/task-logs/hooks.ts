import { useQuery } from "@apollo/client";
import { useMemo } from "react";
import { graphql } from "../graphql";
import { useQuerySub } from "../utils";

const queryAllTaskIds = graphql(/* GraphQL */ `
  query AllTaskIds {
    task_ids {
      id
    }
  }
`);

const queryTaskLogs = graphql(/* GraphQL */ `
  query TaskLogs {
    logs {
      created_at
      created_at_server
      id
      project {
        name
      }
      data
      project_id
      type
      user {
        id
        email
      }
    }
  }
`);

export const deleteTaskLogMutation = graphql(/* GraphQL */ `
  mutation DeleteTaskLog($id: String!) {
    delete_logs_by_pk(id: $id) {
      id
    }
  }
`);

function useAllTasks() {
  return useQuery(queryAllTaskIds);
}

function useAllTasksSet() {
  const { data, loading } = useAllTasks();

  const allTasksSet = useMemo(
    () => new Set(data?.task_ids.map((task) => task.id)),
    [data],
  );

  return {
    data: allTasksSet,
    loading,
  };
}

export function useTaskLogs() {
  const { data, loading } = useQuerySub(queryTaskLogs);

  const taskLogs = useMemo(() => {
    return data?.logs.map((log) => {
      return {
        ...log,
        data: log.data as { id: string },
      };
    });
  }, [data]);

  const { data: allTasksSet, loading: allTasksSetLoading } = useAllTasksSet();
  return {
    data:
      taskLogs?.filter((log) => {
        return !allTasksSet.has(log.data.id);
      }) || [],
    loading: loading || allTasksSetLoading,
  };
}

export const upsertTicketingTasks = graphql(/* GraphQL */ `
  mutation UpsertTicketingTask(
    $tasks: [tasks_ticketing_insert_input!]!
    $images: [images_insert_input!]!
    $taskIds: [task_ids_insert_input!]!
  ) {
    insert_task_ids(
      objects: $taskIds
      on_conflict: { constraint: task_ids_pkey, update_columns: id }
    ) {
      returning {
        id
      }
    }
    insert_tasks_ticketing(
      objects: $tasks
      on_conflict: {
        update_columns: [comment, updated_at, _deleted]
        constraint: task_admin_pkey
      }
    ) {
      returning {
        id
      }
    }
    insert_images(
      objects: $images
      on_conflict: {
        constraint: images_pkey
        update_columns: [latitude, longitude, updated_at, _deleted]
      }
    ) {
      returning {
        id
      }
    }
  }
`);

export const upsertCollectionTasks = graphql(/* GraphQL */ `
  mutation UpsertCollectionTask(
    $tasks: [tasks_collection_insert_input!]!
    $images: [images_insert_input!]!
    $taskIds: [task_ids_insert_input!]!
  ) {
    insert_task_ids(objects: $taskIds) {
      returning {
        id
      }
    }

    insert_tasks_collection(
      objects: $tasks
      on_conflict: {
        update_columns: [comment, updated_at, _deleted]
        constraint: tasks_collection_pkey
      }
    ) {
      returning {
        id
      }
    }

    insert_images(
      objects: $images
      on_conflict: {
        constraint: images_pkey
        update_columns: [latitude, longitude, updated_at, _deleted]
      }
    ) {
      returning {
        id
      }
    }
  }
`);

export const upsertDisposalTasks = graphql(/* GraphQL */ `
  mutation UpsertDisposalTask(
    $tasks: [tasks_disposal_insert_input!]!
    $images: [images_insert_input!]!
    $taskIds: [task_ids_insert_input!]!
  ) {
    insert_task_ids(objects: $taskIds) {
      returning {
        id
      }
    }

    insert_tasks_disposal(
      objects: $tasks
      on_conflict: {
        update_columns: [comment, updated_at, _deleted]
        constraint: tasks_disposal_pkey
      }
    ) {
      returning {
        id
      }
    }

    insert_images(
      objects: $images
      on_conflict: {
        constraint: images_pkey
        update_columns: [latitude, longitude, updated_at, _deleted]
      }
    ) {
      returning {
        id
      }
    }
  }
`);

export const upsertStumpRemovalTasks = graphql(/* GraphQL */ `
  mutation UpsertStumpRemovalTask(
    $tasks: [tasks_stump_removal_insert_input!]!
    $images: [images_insert_input!]!
    $taskIds: [task_ids_insert_input!]!
  ) {
    insert_task_ids(
      objects: $taskIds
      on_conflict: { constraint: task_ids_pkey, update_columns: id }
    ) {
      returning {
        id
      }
    }
    insert_tasks_stump_removal(
      objects: $tasks
      on_conflict: {
        update_columns: [comment, completed, updated_at, _deleted]
        constraint: tasks_stump_removal_pkey
      }
    ) {
      returning {
        id
      }
    }
    insert_images(
      objects: $images
      on_conflict: {
        constraint: images_pkey
        update_columns: [
          latitude
          longitude
          taken_at_step
          updated_at
          _deleted
        ]
      }
    ) {
      returning {
        id
      }
    }
  }
`);

export const upsertTreeRemovalTasks = graphql(/* GraphQL */ `
  mutation UpsertTreeRemovalTask(
    $tasks: [tasks_tree_removal_insert_input!]!
    $images: [images_insert_input!]!
    $taskIds: [task_ids_insert_input!]!
  ) {
    insert_task_ids(
      objects: $taskIds
      on_conflict: { constraint: task_ids_pkey, update_columns: id }
    ) {
      returning {
        id
      }
    }
    insert_tasks_tree_removal(
      objects: $tasks
      on_conflict: {
        update_columns: [comment, completed, updated_at, _deleted, ranges]
        constraint: tree_removal_tasks_pkey
      }
    ) {
      returning {
        id
      }
    }
    insert_images(
      objects: $images
      on_conflict: {
        constraint: images_pkey
        update_columns: [
          latitude
          longitude
          taken_at_step
          updated_at
          _deleted
        ]
      }
    ) {
      returning {
        id
      }
    }
  }
`);
