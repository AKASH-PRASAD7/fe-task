import { z } from "zod";

export const createProductSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters long.",
  }),
  category: z.string().min(3, {
    message: "Category must be at least 3 characters long.",
  }),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a valid number." })
    .positive({ message: "Price must be a positive number." }),
  //   description: z.string().optional(),
});

export const updateProductSchema = z.object({
  id: z.number(),
  title: z
    .string()
    .min(3, {
      message: "Title must be at least 3 characters long.",
    })
    .optional(),
  category: z
    .string()
    .min(3, {
      message: "Category must be at least 3 characters long.",
    })
    .optional(),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a valid number." })
    .positive({ message: "Price must be a positive number." })
    .optional(),
  //   description: z.string().optional(),
});

export const productSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  discountPercentage: z.number(),
  rating: z.number(),
  stock: z.number(),
  brand: z.string(),
  category: z.string(),
  thumbnail: z.string().url(),
  images: z.array(z.string().url()),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export type Product = z.infer<typeof productSchema>;
