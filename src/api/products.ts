import type { Product, ProductResponse } from "@/types";
import api from "@/api";
import { handleAPIError } from "@/lib/errors";

export const getProducts = async (
  params: {
    limit?: number;
    skip?: number;
    sortBy?: string;
    order?: "asc" | "desc";
  } = {},
): Promise<ProductResponse> => {
  try {
    const res = await api.get<{ products: ProductResponse }>(
      `/products?limit=${params.limit}&skip=${params.skip}`,
    );

    const result = {
      ...res.data,
      products: res.data.products?.map((product: Product) => ({
        id: product.id,
        title: product.title,
        category: product.category,
        price: product.price,
      })),
    };

    return result;
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
    return res.data.products?.map((product) => ({
      id: product.id,
      title: product.title,
      category: product.category,
      price: product.price,
    }));
  } catch (err) {
    throw handleAPIError(err);
  }
};
