// API Dependency
import { request } from "./api";

// Configuration
import { BRAND_SERVICE } from "@/config/api";

// Types
import { Brand, BrandCast } from "../shared/hooks/brands";

/* =======================================
   = = = = = = = = = = = = = = = = = = = =
   ======================================= */

/**
 * Interface for public podium data
 */
export interface PublicPodium {
  id: string;
  date: string;
  createdAt: string;
  user: {
    fid: number;
    username: string;
    photoUrl: string;
  };
  brands: Array<{
    id: number;
    name: string;
    imageUrl: string;
    score: number;
    ranking: number;
  }>;
  pointsAwarded: number;
}

export type BrandTimePeriod = "week" | "month" | "all";

/**
 * Response structure for recent podiums API
 */
export interface RecentPodiumsResponse {
  podiums: PublicPodium[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

/**
 * Fetches recent podiums from all users (public feed).
 *
 * @param {number} page - Page number for pagination
 * @param {number} limit - Number of podiums per page
 * @returns {Promise<RecentPodiumsResponse>} Recent podiums with pagination info
 */
export const getRecentPodiums = async (
  page: number = 1,
  limit: number = 20
): Promise<RecentPodiumsResponse> => {
  return await request<RecentPodiumsResponse>(
    `${BRAND_SERVICE}/recent-podiums`,
    {
      method: "GET",
      params: {
        page: page.toString(),
        limit: limit.toString(),
      },
    }
  );
};

/**
 * Defines the structure of the response returned by the getMe API.
 *
 * @property {User} data - Contains the user information retrieved.
 * @property {string} action - Describes the action performed.
 */
export interface GetBrandListResponse {
  brands: Brand[];
  count: number;
}

export type BrandResponse = {
  brand: Brand;
  casts: BrandCast[];
};

/**
 * Retrieves the list of brands from the brand service.
 *
 * @param {string} searchQuery - The search query to filter the brands.
 * @param {string} pageId - The ID of the page to retrieve.
 * @param {string} [limit='27'] - The number of brands to retrieve per page. Defaults to '27'.
 * @param {'top' | 'new' | 'all'} order - The order in which to retrieve the brands.
 * @param {BrandTimePeriod} [period='all'] - The time period for filtering. Defaults to 'all'.
 * @returns {Promise<GetBrandListResponse>} A promise that resolves with the list of brands and the count.
 */
export const getBrandList = async (
  searchQuery: string,
  pageId: string,
  limit: string = "27",
  order: "top" | "new" | "all" = "all",
  period: BrandTimePeriod = "all" // NEW: Added period parameter
): Promise<GetBrandListResponse> =>
  await request<GetBrandListResponse>(`${BRAND_SERVICE}/list`, {
    method: "GET",
    params: {
      search: searchQuery,
      pageId,
      limit,
      order,
      period,
    },
  });

/* =======================================
   = = = = = = = = = = = = = = = = = = = =
   ======================================= */

/**
 * Represents the parameters required for voting on brands.
 *
 * @property {number[]} ids - An array of brand IDs to vote for.
 */
export interface VoteBrandsParams {
  ids: number[];
}

/**
 * Represents the response structure for the vote brands operation.
 *
 * @property {object} data - Contains the response data.
 */
export type VoteBrandsResponse = {
  id: string;
  date: string;
  brand1: {
    id: number;
    name: string;
    imageUrl: string;
  };
  brand2: {
    id: number;
    name: string;
    imageUrl: string;
  };
  brand3: {
    id: number;
    name: string;
    imageUrl: string;
  };
};

/**
 * Sends a vote request to the brand service.
 *
 * @param {VoteBrandsParams} body - The parameters required for voting on brands.
 * @returns {Promise<VoteBrandsResponse>} A promise that resolves when the request is complete.
 */
export const voteBrands = async (body: VoteBrandsParams) =>
  await request<VoteBrandsResponse>(`${BRAND_SERVICE}/vote`, {
    method: "POST",
    body,
  });

/* =======================================
   = = = = = = = = = = = = = = = = = = = =
   ======================================= */

/**
 * Fetches a brand by its ID.
 *
 * @param {Brand['id']} id - The ID of the brand to fetch.
 * @returns {Promise<Brand>} A promise that resolves to the brand data.
 */
export const getBrandById = async (id: Brand["id"]): Promise<BrandResponse> => {
  return await request<BrandResponse>(`${BRAND_SERVICE}/brand/${id}`, {
    method: "GET",
  });
};

/* =======================================
   = = = = = = = = = = = = = = = = = = = =
   ======================================= */

export interface ClaimBrandParams {
  name: string;
}

/**
 * Sends a claim request to the brand service.
 *
 * @param {ClaimBrandParams} body - The parameters required for claiming brands.
 * @returns {Promise<void>} A promise that resolves when the request is complete.
 */
export const claimBrand = async (body: ClaimBrandParams) =>
  await request(`${BRAND_SERVICE}/request`, {
    method: "POST",
    body,
  });
