/**
 * 指定回数だけリトライを行う
 */
export const withRetry = async <T>(
  action: () => Promise<T>,
  options?: {
    retries?: number;
    delayMs?: number;
    onRetry?: (attempt: number, error: unknown) => void;
  },
): Promise<T> => {
  const retries = options?.retries ?? 3;
  const delayMs = options?.delayMs ?? 500;

  let attempt = 0;
  let lastError: unknown;

  while (attempt <= retries) {
    try {
      return await action();
    } catch (error) {
      lastError = error;
      if (attempt === retries) {
        break;
      }
      options?.onRetry?.(attempt + 1, error);
      await new Promise((resolve) => {
        setTimeout(resolve, delayMs);
      });
    }
    attempt += 1;
  }

  throw lastError;
};
