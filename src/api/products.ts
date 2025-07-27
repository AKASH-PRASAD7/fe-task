import type { AllProduct, Product, ProductResponse } from "@/types";
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
    const queryParams = new URLSearchParams();

    if (params.limit !== undefined) {
      queryParams.append("limit", String(params.limit));
    }

    if (params.skip !== undefined) {
      queryParams.append("skip", String(params.skip));
    }

    if (params.sortBy && params.order) {
      queryParams.append("sortBy", params.sortBy);
      queryParams.append("order", params.order);
    }

    const queryString = queryParams.toString();
    const url = `/products${queryString ? `?${queryString}` : ""}`;

    const res = await api.get<ProductResponse>(url);

    const result = {
      ...res.data,
      products: res.data.products?.map((product: Product) => ({
        id: product.id,
        title: product.title,
        brand: product.brand,
        category: product.category,
        price: product.price,
        rating: product.rating,
        tags: product.tags,
      })),
    };

    return result;
  } catch (err) {
    throw handleAPIError(err);
  }
};

export const getProductById = async (id: number): Promise<AllProduct> => {
  try {
    const res = await api.get<AllProduct>(`/products/${id}`);
    return res.data;
  } catch (err) {
    throw handleAPIError(err);
  }
};

export const createProduct = async (data: Product): Promise<Product> => {
  try {
    const res = await api.post<Product>("/products/add", data);
    return res.data;
  } catch (err) {
    throw handleAPIError(err);
  }
};

export const updateProduct = async (
  id: number,
  data: Partial<Product>,
): Promise<Product> => {
  try {
    const { id: _, ...payload } = data;
    const res = await api.put<Product>(`/products/${id}`, payload);
    return res.data;
  } catch (err) {
    throw handleAPIError(err);
  }
};

export const deleteProduct = async (id: number): Promise<Number> => {
  try {
    await api.delete(`/products/${id}`);
    return id;
  } catch (err) {
    throw handleAPIError(err);
  }
};
