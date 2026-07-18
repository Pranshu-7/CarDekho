// Test Case 2: Subtle off-by-one + boundary logic bug
// Paginates an array but skips the last item on the final page

export function paginate<T>(items: T[], pageSize: number, pageNumber: number): T[] {
  const start = pageNumber * pageSize;
  // Bug: should be start + pageSize, this excludes the final element
  const end = start + pageSize - 1;
  return items.slice(start, end);
}

// Edge case inputs to expose the bug:
// paginate([1,2,3,4,5], 2, 0) -> should return [1,2] but returns [1]
// paginate([], 5, 0) -> should return [] safely
// paginate([1], 5, 10) -> pageNumber way beyond range, should return []

export function average(numbers: number[]): number {
  // Missing guard: division by zero when numbers.length === 0
  const sum = numbers.reduce((a, b) => a + b, 0);
  return sum / numbers.length;
}
