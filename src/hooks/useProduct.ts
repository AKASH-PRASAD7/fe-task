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
      queryClient.setQueriesData<{ products: Product[]; total: number }>(
        { queryKey: ["products"] },

        (oldData) => {
          if (!oldData) {
            return { products: [newlyCreatedProduct], total: 1 };
          }

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
    onSuccess: (updatedProduct) => {
      queryClient.setQueriesData<{ products: Product[]; total: number }>(
        { queryKey: ["products"] },
        (oldData) => {
          if (!oldData) return { products: [updatedProduct], total: 1 };

          return {
            ...oldData,
            products: oldData.products.map((product) =>
              product.id === updatedProduct.id ? updatedProduct : product,
            ),
          };
        },
      );
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => {
      return deleteProduct(id);
    },

    onSuccess: (deletedProduct) => {
      queryClient.setQueriesData<{ products: Product[]; total: number }>(
        { queryKey: ["products"] },
        (oldData) => {
          if (!oldData) return;

          return {
            ...oldData,
            products: oldData.products.filter(
              (product) => product.id !== deletedProduct,
            ),
            total: oldData.total - 1,
          };
        },
      );
    },
  });
};
