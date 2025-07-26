import { request } from "./api";

// Admin endpoints
export const makeDbReset = async (): Promise<void> =>
  await request("/admin-service/make-db-reset", {
    method: "GET",
  });

export const processCastHashApi = async (castHash: string): Promise<void> =>
  await request("/training-service/run", {
    method: "POST",
    body: { cast_hash: castHash },
  });
