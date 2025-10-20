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

export const deleteRun = async (castHash: string): Promise<{ message: string; castHash: string }> =>
  await request(`/admin-service/runs/${castHash}`, {
    method: "DELETE",
  });

export const banUser = async (fid: number): Promise<{ user: any; message: string }> =>
  await request(`/admin-service/users/${fid}/ban`, {
    method: "POST",
  });
