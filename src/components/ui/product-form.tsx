"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { createProductSchema, updateProductSchema } from "@/lib/validators";

import {
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/hooks/useProduct";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TagInput } from "./tag-input";
import type { Product } from "@/types";

interface ProductFormProps {
  type?: "create" | "edit" | "delete";
  initialData?: Partial<Product>;
  onSuccess?: () => void;
}

const ProductForm = ({
  type = "create",
  initialData = { title: "", category: "", price: 0 },
  onSuccess,
}: ProductFormProps) => {
  const isEditMode = type === "edit";

  const form = useForm<any>({
    resolver: zodResolver(
      (isEditMode ? updateProductSchema : createProductSchema) as any,
    ),
    defaultValues: initialData,
  });

  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();

  const isProcessing = isCreating || isUpdating;

  const onSubmit = (data: Product) => {
    if (isEditMode) {
      updateProduct(
        { ...data },
        {
          onSuccess: () => {
            onSuccess?.();
          },
          onError: (error) => {
            console.error("Error updating product:", error);
            onSuccess?.();
          },
        },
      );
    } else {
      createProduct(data, { onSuccess });
    }
  };

  const handleDelete = () => {
    if (initialData.id) {
      deleteProduct(initialData.id, {
        onSuccess: () => {
          onSuccess?.();
        },
        onError: (error) => {
          console.error("Error deleting product:", error);
          onSuccess?.();
        },
      });
    }
  };

  return (
    <Form {...form}>
      {type === "delete" ? (
        <>
          <div className="text-md mb-4 text-red-500">
            Are you sure you want to delete {initialData.title}? This action
            cannot be undone.
          </div>
          <Button
            type="button"
            variant="destructive"
            className="cursor-pointer"
            onClick={() => {
              handleDelete();
              onSuccess?.();
            }}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Delete Product"
            )}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="ml-2 cursor-pointer"
            onClick={() => onSuccess?.()}
          >
            Cancel
          </Button>
        </>
      ) : (
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
          {/* Tags Field */}
          <TagInput
            value={form.watch("tags") || []}
            onChange={(tags) => form.setValue("tags", tags)}
            placeholder="Add tags (press Enter or comma to add)"
          />
          {/* Rating Field */}
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating (0-5)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="e.g., 4.5"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Brand Field */}
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Apple" {...field} />
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
      )}
    </Form>
  );
};

export default ProductForm;
