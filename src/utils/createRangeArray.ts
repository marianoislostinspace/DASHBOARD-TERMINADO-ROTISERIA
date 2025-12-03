export function createRangeArray(start: number, end : number, step = 1) {
  // Calculate the length of the array needed
  const length = Math.floor((end - start) / step) + 1;

  // Use Array.from() to create and populate the array
  return Array.from({ length: length }, (_, index) => start + index * step);
}