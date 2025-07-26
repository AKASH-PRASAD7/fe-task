"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import {
  createProductSchema,
  updateProductSchema,
  type CreateProductInput,
  type UpdateProductInput,
  type Product,
} from "@/lib/validators";
import { productSchema } from "@/lib/validators";
import { useCreateProduct, useUpdateProduct } from "@/hooks/useProduct";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"; // Using your custom form components

interface ProductFormProps {
  type?: "create" | "edit";
  initialData?: Partial<Product>;
  onSuccess?: () => void; // Callback to run on successful submission
}

const ProductForm = ({
  type = "create",
  initialData = { title: "", category: "", price: 0 },
  onSuccess,
}: ProductFormProps) => {
  const isEditMode = type === "edit";

  const form = useForm<Product>({
    resolver: zodResolver(createProductSchema),
    defaultValues: initialData,
  });

  // Get mutation hooks for creating and updating
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

  const isProcessing = isCreating || isUpdating;

  // Define the submit handler
  const onSubmit = (data: Product) => {
    if (isEditMode) {
      updateProduct({ ...data, id: initialData?.id! }, { onSuccess });
    } else {
      createProduct(data, { onSuccess });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        {/* Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., iPhone 15 Pro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category Field */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="e.g., smartphones" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price Field */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 999" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isProcessing}
          className="w-full cursor-pointer"
        >
          {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditMode
            ? isProcessing
              ? "Saving..."
              : "Save Changes"
            : isProcessing
              ? "Adding..."
              : "Add Product"}
        </Button>
      </form>
    </Form>
  );
};

export default ProductForm;
