import type { Product } from "@/types";
import api from "@/api";
import { handleAPIError } from "@/lib/errors";

export const getProducts = async (
  params: {
    limit?: number;
    skip?: number;
    sortBy?: string;
    order?: "asc" | "desc";
  } = {},
): Promise<Product[]> => {
  try {
    const res = await api.get<{ products: Product[] }>("/products", { params });
    return res.data.products;
  } catch (err) {
    throw handleAPIError(err);
  }
};

export const getProductById = async (id: number): Promise<Product> => {
  try {
    const res = await api.get<Product>(`/products/${id}`);
    return res.data;
  } catch (err) {
    throw handleAPIError(err);
  }
};

export const searchProducts = async (
  query: string,
  params: {
    limit?: number;
    skip?: number;
    sortBy?: string;
    order?: "asc" | "desc";
  } = {},
): Promise<Product[]> => {
  try {
    const res = await api.get<{ products: Product[] }>("/products/search", {
      params: { q: query, ...params },
    });
    return res.data.products;
  } catch (err) {
    throw handleAPIError(err);
  }
};
