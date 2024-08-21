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
