import { getProducts } from "@/api/products";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useProducts = (
  params: {
    limit?: number;
    skip?: number;
    sortBy?: string;
    order?: "asc" | "desc";
  } = {},
) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
  });
};
