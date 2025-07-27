"use client";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "@/api/products";
import type { Product, ProductResponse } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useProducts = (
  params: {
    limit?: number;
    skip?: number;
    sortBy?: string;
    order?: "asc" | "desc";
  } = {},
) => {
  return useQuery<ProductResponse, Error>({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
  });
};

export const useProductById = (id: number) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newProduct: Product) => {
      return createProduct(newProduct);
    },
    onSuccess: (apiResponse, variables) => {
      const newProductForCache = {
        ...apiResponse,
        ...variables,
      };

      queryClient.setQueriesData<{ products: Product[]; total: number }>(
        { queryKey: ["products"] },
        (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            products: [newProductForCache, ...oldData.products],
            total: oldData.total + 1,
          };
        },
      );
      toast.success("Product created successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to create product: ${error.message}`);
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Product) => {
      return updateProduct(data.id, data);
    },
    onSuccess: (_apiResponse, variables) => {
      queryClient.setQueriesData<{ products: Product[]; total: number }>(
        { queryKey: ["products"] },
        (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            products: oldData.products.map((product) =>
              product.id === variables.id
                ? { ...product, ...variables }
                : product,
            ),
          };
        },
      );
      toast.success("Product updated successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to update product: ${error.message}`);
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
      toast.success("Product deleted successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to delete product: ${error.message}`);
    },
  });
};
