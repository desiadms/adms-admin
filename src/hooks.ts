import { useQuery } from "@apollo/client";
import { graphql } from "./graphql";

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

export function useProjects() {
  const res = useQuery(queryProjects);

  return { ...res, data: res.data?.projects };
}
