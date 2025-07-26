"use client";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "@/api/products";
import type { Product } from "@/types";
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

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newProduct: Product) => {
      return createProduct(newProduct);
    },
    onSuccess: (newlyCreatedProduct) => {
      //add data to the cache at bootom of current page
      queryClient.setQueriesData<{ products: Product[]; total: number }>(
        // This is a query filter. It will match all keys like ["products", {limit, skip}]
        { queryKey: ["products"] },
        // This updater function receives the old data for each matching query
        (oldData) => {
          if (!oldData) {
            // If for some reason there's no old data, do nothing
            return { products: [newlyCreatedProduct], total: 1 };
          }

          // 2. Correct the data structure to access `oldData.products`
          // 3. Add the newly created product to the end of the list
          return {
            ...oldData,
            products: [...oldData.products, newlyCreatedProduct],
            total: oldData.total + 1,
          };
        },
      );
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Product) => {
      return updateProduct(data.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => {
      return deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
