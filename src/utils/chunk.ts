/**
 * Iterable を指定したサイズで分割した配列を生成する
 */
export const chunk = <T>(items: Iterable<T>, size: number): T[][] => {
  if (size <= 0) {
    throw new Error('Chunk size must be greater than 0');
  }

  const result: T[][] = [];
  let buffer: T[] = [];

  for (const item of items) {
    buffer.push(item);
    if (buffer.length === size) {
      result.push(buffer);
      buffer = [];
    }
  }

  if (buffer.length > 0) {
    result.push(buffer);
  }

  return result;
};
