export function calcTotalPages(totalItems: number, perPage: number): number {
  return Math.ceil(totalItems / perPage);
}

export function paginateSlice<T>(
  items: T[],
  pageNum: number,
  perPage: number
): T[] {
  return items.slice((pageNum - 1) * perPage, pageNum * perPage);
}
