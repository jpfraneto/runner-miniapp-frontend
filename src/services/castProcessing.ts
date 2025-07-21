import { request } from "./api";

// Types
export interface CastProcessingRequest {
  castHash: string;
  text: string;
  embeds: string[];
}

export interface CastProcessingResponse {
  success: boolean;
  data: {
    runningSession: {
      id: string;
      fid: number;
      distance: number;
      duration: number;
      castHash: string;
      completedDate: string;
      user: {
        fid: number;
        username: string;
        pfpUrl: string;
      };
    };
    extractedData: {
      distance?: number;
      duration?: number;
      units?: string;
      pace?: string;
      calories?: number;
      elevationGain?: number;
      avgCadence?: number;
      confidence?: number;
    };
    screenshotUrls: string[];
    isPersonalBest: boolean;
    personalBestType?: string;
  };
  message: string;
}

/**
 * Submit a cast for processing to extract run data
 */
export async function processCast(
  castData: CastProcessingRequest
): Promise<CastProcessingResponse> {
  return request<CastProcessingResponse>("/cast-processing", {
    method: "POST",
    body: castData,
  });
}

/**
 * Check the processing status of a cast
 */
export async function checkCastProcessingStatus(
  castHash: string
): Promise<CastProcessingResponse> {
  return request<CastProcessingResponse>(`/cast-processing/${castHash}`, {
    method: "GET",
  });
}
