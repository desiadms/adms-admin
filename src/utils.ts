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

export function sortAlphabeticallyEarlyMatch(
  word1: string,
  word2: string,
  query: string,
) {
  const indexA = word1.toLowerCase().indexOf(query.toLowerCase());
  const indexB = word2.toLowerCase().indexOf(query.toLowerCase());

  if (indexA !== indexB) {
    return indexA - indexB;
  }

  return word1.localeCompare(word2);
}
