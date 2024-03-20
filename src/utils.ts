import { useQuery } from "@apollo/client";
import { TypedDocumentNode } from "@graphql-typed-document-node/core";

export function keep<T, U>(
  coll: T[],
  mapperFn: (item: T) => U | null | undefined,
): NonNullable<U>[] {
  return coll.reduce((acc: NonNullable<U>[], item: T) => {
    const transformed = mapperFn(item);
    if (transformed !== null && transformed !== undefined) {
      acc.push(transformed as NonNullable<U>);
    }
    return acc;
  }, []);
}

type TOptions = {
  variables?: Record<string, unknown>;
  skip?: boolean;
};

/**
 * Custom hook for querying data with Apollo Client.
 * For now it just polls but in the future it could use subscriptions.
 *
 * @template T - The type of data returned by the query.
 * @template V - The type of variables used in the query.
 * @param {Object} options - The options for the query.
 * @param {TypedDocumentNode<T, V>} options.query - The GraphQL query document.
 * @param {Record<string, unknown>} [options.variables] - The variables used in the query.
 * @param {boolean} [options.pause] - Whether to pause the query.
 * @returns {Object} - An object containing the query data, loading state, and error.
 */
export function useQuerySub<T, V>(
  query: TypedDocumentNode<T, V>,
  options?: TOptions,
) {
  const {
    data: queryData,
    loading: queryLoading,
    error: queryError,
  } = useQuery(query, {
    variables: options?.variables,
    skip: options?.skip,
    pollInterval: 2000,
  });

  return {
    data: queryData,
    loading: queryLoading,
    error: queryError,
  };
}

export function convertToEmail(id: string) {
  return `${id}@desiadms.com`;
}

export function convertToPin(id: string) {
  const pin = id.split("@")[0];
  if (!pin) throw new Error("email cant be converted to pin");
  return pin;
}
