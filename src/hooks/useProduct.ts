"use client";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "@/api/products";
import type { Product } from "@/types";
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
    onSuccess: (updatedProduct) => {
      queryClient.setQueriesData<{ products: Product[]; total: number }>(
        { queryKey: ["products"] },
        (oldData) => {
          if (!oldData) return { products: [updatedProduct], total: 1 };

          return {
            ...oldData,
            products: oldData.products.map((product) =>
              product.id === updatedProduct.id
                ? {
                    title: updatedProduct.title,
                    category: updatedProduct.category,
                    price: updatedProduct.price,
                    id: updatedProduct.id,
                  }
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
