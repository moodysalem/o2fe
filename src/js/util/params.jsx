export function pageParams({pageNo, pageSize}) {
  return {start: pageNo * pageSize, count: pageSize};
}