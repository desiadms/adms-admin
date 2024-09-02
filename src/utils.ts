import { useQuery } from "@apollo/client";
import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(timezone);
dayjs.extend(utc);

export function formatToEST(dateString) {
  // Parse the date string as UTC
  const date = dayjs(dateString).utc();

  // Convert the date to EST timezone
  const estDate = date.tz("America/New_York");

  // Format the date in EST timezone
  return estDate.format("YYYY-MM-DD HH:mm:ss");
}

export function genUpperLowerDate() {
  const upperLimit = dayjs();
  const estDate = upperLimit.tz("America/New_York");
  const estDateStr = estDate.toISOString();

  const lowerLimit = dayjs().subtract(1, "day");
  const estLowerDate = lowerLimit.tz("America/New_York");
  const midnight = estLowerDate.startOf("day");
  const estLowerDateStr = midnight.toISOString();

  return { upperLimit: estDateStr, lowerLimit: estLowerDateStr };
}

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
  return useQuery(query, {
    variables: options?.variables,
    skip: options?.skip,
    pollInterval: 2000,
  });
}

export function convertToEmail(id: string) {
  return `${id}@desiadms.com`;
}

export function convertToPin(id: string) {
  const pin = id.split("@")[0];
  if (!pin) throw new Error("email cant be converted to pin");
  return pin;
}

/**
 * The type of a single item in `Object.entries<T>(value: T)`.
 *
 * Example:
 * ```
 * interface T {x: string; y: number}
 * type T2 = ObjectEntry<T>
 * ```
 * => type T2 = ["x", string] | ["y", number]
 */
export type ObjectEntry<T> = {
  // Without Exclude<keyof T, undefined>, this type produces `ExpectedEntries | undefined`
  // if T has any optional keys.
  [K in Exclude<keyof T, undefined>]: [K, T[K]];
}[Exclude<keyof T, undefined>];

/**
 * Like Object.entries, but returns a more specific type which can be less safe.
 *
 * Example:
 * ```
 * const o = {x: "ok", y: 10}
 * const unsafeEntries = Object.entries(o)
 * const safeEntries = objectEntries(o)
 * ```
 * => const unsafeEntries: [string, string | number][]
 * => const safeEntries: ObjectEntry<{
 *   x: string;
 *   y: number;
 * }>[]
 *
 * See `ObjectEntry` above.
 *
 * Note that Object.entries collapses all possible values into a single union
 * while objectEntries results in a union of 2-tuples.
 */
export const objectEntries = Object.entries as <T>(
  o: T,
) => Array<ObjectEntry<T>>;

export function formatDate(utcDate: string) {
  const createdAtDate: Date = new Date(utcDate);
  const dateOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZoneName: "short",
  };
  const dateString = new Intl.DateTimeFormat("en-US", dateOptions).format(
    createdAtDate,
  );

  return dateString;
}

export function dateComparator(
  filterLocalDateAtMidnight: Date,
  utcString: string,
) {
  const date = new Date(utcString);
  const cellDate = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  );

  if (cellDate < filterLocalDateAtMidnight) {
    return -1;
  } else if (cellDate > filterLocalDateAtMidnight) {
    return 1;
  } else {
    return 0;
  }
}

export function midnightDate(date: Date) {
  const midnight = new Date(date);
  midnight.setHours(0, 0, 0, 0);
  return midnight;
}

export function fromDateObjectToDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() returns 0-based month
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function normalizeKeyObjectToLabel(text: string) {
  // Convert camelCase to underscore_case
  const underscoreCase = text.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();

  // Replace underscores with spaces
  const displayText = underscoreCase.replace(/_/g, " ");

  return displayText;
}
