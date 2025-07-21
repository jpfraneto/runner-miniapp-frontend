import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/config/api";
import { getFarcasterToken } from "@/shared/utils/auth";
import { RunningSession } from "@/shared/types/running";

interface CastProcessingResponse {
  isProcessing: boolean;
  runData?: RunningSession;
  error?: string;
}

async function checkCastProcessing(castHash: string): Promise<CastProcessingResponse> {
  const token = getFarcasterToken();
  if (!token) {
    throw new Error("No authentication token");
  }

  const response = await fetch(`${API_URL}/cast-processing/${castHash}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export function useCastProcessing(castHash: string | null, enabled = true) {
  return useQuery({
    queryKey: ["cast-processing", castHash],
    queryFn: () => checkCastProcessing(castHash!),
    enabled: enabled && !!castHash,
    refetchInterval: 5000, // Poll every 5 seconds
    refetchIntervalInBackground: true,
    staleTime: 0, // Always consider stale to ensure fresh data
  });
}