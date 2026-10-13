const RETRYABLE_STATUS_CODES = new Set([408, 425, 429, 500, 502, 503, 504]);
const MAX_RETRY_AFTER_MS = 2000;

export class FetchJsonError extends Error {
  constructor(
    message: string,
    readonly retryable: boolean,
    readonly retryAfterMs: number | null = null,
  ) {
    super(message);
    this.name = "FetchJsonError";
  }
}

export type FetchJsonWithRetryOptions = {
  /** Total tries, including the first. */
  attempts?: number;
  /** Give up on a single try after this long. */
  timeoutMs?: number;
  /** Wait before retry n is `backoffMs * 2^(n-1)`, unless the server sends Retry-After. */
  backoffMs?: number;
  init?: RequestInit;
  /** Injected in tests. */
  fetchImpl?: typeof fetch;
  /** Injected in tests. */
  sleep?: (ms: number) => Promise<void>;
};

const defaultSleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

function parseRetryAfterMs(response: Response): number | null {
  const seconds = Number(response.headers.get("retry-after"));
  return Number.isFinite(seconds) && seconds > 0
    ? Math.min(seconds * 1000, MAX_RETRY_AFTER_MS)
    : null;
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new FetchJsonError(`Timed out after ${timeoutMs}ms`, true)),
      timeoutMs,
    );
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timer);
  }
}

async function fetchJsonOnce(
  url: string,
  init: RequestInit | undefined,
  fetchImpl: typeof fetch,
): Promise<unknown> {
  let response: Response;
  try {
    response = await fetchImpl(url, init);
  } catch (error) {
    throw new FetchJsonError(`Network error: ${String(error)}`, true);
  }

  if (!response.ok) {
    throw new FetchJsonError(
      `HTTP ${response.status} ${response.statusText}`,
      RETRYABLE_STATUS_CODES.has(response.status),
      parseRetryAfterMs(response),
    );
  }

  try {
    return await response.json();
  } catch {
    // e.g. an HTML error page from a proxy in front of the API.
    throw new FetchJsonError("Response body is not valid JSON", true);
  }
}

/**
 * GETs JSON, retrying timeouts, network errors, invalid bodies and
 * 408/425/429/5xx responses with exponential backoff. Other errors (e.g. 404)
 * fail at once. Throws the last error when every attempt fails.
 */
export async function fetchJsonWithRetry(
  url: string,
  {
    attempts = 3,
    timeoutMs = 5000,
    backoffMs = 300,
    init,
    fetchImpl = fetch,
    sleep = defaultSleep,
  }: FetchJsonWithRetryOptions = {},
): Promise<unknown> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await withTimeout(fetchJsonOnce(url, init, fetchImpl), timeoutMs);
    } catch (error) {
      lastError = error;
      const retryable = error instanceof FetchJsonError && error.retryable;
      if (!retryable || attempt === attempts) break;
      const retryAfterMs = error instanceof FetchJsonError ? error.retryAfterMs : null;
      await sleep(retryAfterMs ?? backoffMs * 2 ** (attempt - 1));
    }
  }

  throw lastError;
}
