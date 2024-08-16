import { graphql } from "../graphql";
import { useQuerySub } from "../utils";

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

export function useTaskLogs() {
    const { data, loading } = useQuerySub(queryTaskLogs);
    
    return {
        data: data?.logs,
        loading,
    };
    }