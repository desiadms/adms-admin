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
