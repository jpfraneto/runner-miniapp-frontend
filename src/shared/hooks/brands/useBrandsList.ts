// /src/hooks/brands.ts - Update your useBrandList hook:

// Dependencies
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";

// Services
import { getBrandList, BrandTimePeriod } from "@/services/brands";

// Types
import { Brand, ListBrandTypes } from "./types";

export const useBrandList = (
  order: ListBrandTypes,
  searchQuery: string = "",
  pageId: number = 1,
  limit: number = 27,
  period: BrandTimePeriod = "all"
) => {
  const brandsRef = useRef<Brand[]>([]);
  const countRef = useRef<number>(0);

  const result = useQuery({
    queryKey: ["brands", searchQuery, pageId, limit, order, period], // NEW: Include period in query key
    queryFn: () =>
      getBrandList(searchQuery, String(pageId), String(limit), order, period), // NEW: Pass period
    retry: false,
    staleTime: 900000,
    enabled: false,
    placeholderData: (prev) => prev,
  });

  if (!result.isError && !result.isLoading) {
    const brands = result.data?.brands || [];

    if (searchQuery !== "" && pageId === 1) {
      brandsRef.current = brands;
    } else {
      const existingBrandIds = new Set(
        brandsRef.current.map((brand) => brand.id)
      );
      const newBrands = brands.filter(
        (brand) => !existingBrandIds.has(brand.id)
      );
      brandsRef.current = [...brandsRef.current, ...newBrands];
    }
    countRef.current = result.data?.count ?? 0;
  }

  return {
    ...result,
    data: {
      brands: brandsRef.current,
      count: countRef.current,
    },
  };
};
