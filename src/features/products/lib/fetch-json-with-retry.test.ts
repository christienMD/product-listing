import { describe, expect, it, vi } from "vitest";
import {
  FetchJsonError,
  fetchJsonWithRetry,
} from "@/features/products/lib/fetch-json-with-retry";

const jsonResponse = (body: unknown) =>
  new Response(JSON.stringify(body), { status: 200 });

const statusResponse = (status: number, headers?: Record<string, string>) =>
  new Response("{}", { status, headers });

function setup(responses: (Response | Error)[]) {
  const fetchImpl = vi.fn(async () => {
    const next = responses.shift();
    if (next instanceof Error) throw next;
    return next!;
  }) as unknown as typeof fetch;
  const sleep = vi.fn(async () => {});
  return { fetchImpl, sleep };
}

describe("fetchJsonWithRetry", () => {
  it("returns the body on the first success", async () => {
    const { fetchImpl, sleep } = setup([jsonResponse({ ok: 1 })]);
    await expect(fetchJsonWithRetry("u", { fetchImpl, sleep })).resolves.toEqual({ ok: 1 });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(sleep).not.toHaveBeenCalled();
  });

  it("retries a rate-limited response, then succeeds", async () => {
    const { fetchImpl, sleep } = setup([statusResponse(429), jsonResponse({ ok: 1 })]);
    await expect(fetchJsonWithRetry("u", { fetchImpl, sleep })).resolves.toEqual({ ok: 1 });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("retries network errors, 5xx and non-JSON bodies with exponential backoff", async () => {
    const { fetchImpl, sleep } = setup([
      new TypeError("fetch failed"),
      new Response("<html>", { status: 200 }),
      jsonResponse({ ok: 1 }),
    ]);
    await expect(
      fetchJsonWithRetry("u", { fetchImpl, sleep, backoffMs: 100 }),
    ).resolves.toEqual({ ok: 1 });
    expect(sleep.mock.calls).toEqual([[100], [200]]);
  });

  it("waits for Retry-After, capped at 2 seconds", async () => {
    const { fetchImpl, sleep } = setup([
      statusResponse(429, { "retry-after": "60" }),
      jsonResponse({}),
    ]);
    await fetchJsonWithRetry("u", { fetchImpl, sleep });
    expect(sleep.mock.calls).toEqual([[2000]]);
  });

  it("does not retry a 404", async () => {
    const { fetchImpl, sleep } = setup([statusResponse(404)]);
    await expect(fetchJsonWithRetry("u", { fetchImpl, sleep })).rejects.toBeInstanceOf(
      FetchJsonError,
    );
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("throws the last error after every attempt fails", async () => {
    const { fetchImpl, sleep } = setup([
      statusResponse(503),
      statusResponse(503),
      statusResponse(429),
    ]);
    await expect(fetchJsonWithRetry("u", { fetchImpl, sleep })).rejects.toThrow("HTTP 429");
    expect(fetchImpl).toHaveBeenCalledTimes(3);
  });

  it("times out a request that never answers", async () => {
    const fetchImpl = vi.fn(() => new Promise<Response>(() => {})) as unknown as typeof fetch;
    await expect(
      fetchJsonWithRetry("u", { fetchImpl, attempts: 1, timeoutMs: 10 }),
    ).rejects.toThrow("Timed out after 10ms");
  });
});
