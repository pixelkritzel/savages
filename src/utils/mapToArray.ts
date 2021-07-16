export function mapToArray<T extends any>(map: Map<any, T>): T[] {
  return [...map.values()];
}
