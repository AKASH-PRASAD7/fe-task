"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useProductById } from "@/hooks/useProduct"; // Assuming your hook is here
import { ProductPageSkeleton } from "./product-page-skeleton";
import { StarRating } from "./star-rating";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Bolt, CheckCircle, ShoppingCart, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

const ProductDetailPage = () => {
  const { id } = useParams();
  const numericId = Number(id);
  const router = useRouter();

  const {
    data: product,
    isPending,
    isError,
    error,
  } = useProductById(numericId);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    // Set the initial image when the product data loads
    if (product?.thumbnail) {
      setSelectedImage(product.thumbnail);
    }
  }, [product]);

  if (isPending) return <ProductPageSkeleton />;
  if (isError)
    return (
      <div className="text-center text-red-500">Error: {error.message}</div>
    );
  if (!product) return <div className="text-center">Product not found.</div>;

  const discountedPrice =
    product.price * (1 - product.discountPercentage / 100);

  return (
    <div className="bg-background">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-2">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
              {selectedImage && (
                <Image
                  src={selectedImage}
                  alt={product.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              )}
            </div>
            <div className="flex gap-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  className={cn(
                    "relative aspect-square w-20 overflow-hidden rounded-md border-2 transition-all",
                    selectedImage === img
                      ? "border-primary"
                      : "border-transparent",
                  )}
                  onClick={() => setSelectedImage(img)}
                >
                  <Image
                    src={img}
                    alt={`${product.title} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-2">
                {product.category}
              </Badge>
              <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
                {product.title}
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                by {product.brand}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <StarRating rating={product.rating} />
              <span className="text-muted-foreground text-sm">
                {product.reviews.length} reviews
              </span>
            </div>

            <div>
              <p className="text-foreground text-3xl font-bold">
                ${discountedPrice.toFixed(2)}
              </p>
              <p className="text-muted-foreground text-lg line-through">
                ${product.price.toFixed(2)}
              </p>
            </div>

            <p className="text-muted-foreground text-base leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-semibold text-green-600">
                {product.availabilityStatus}
              </span>
              <span className="text-muted-foreground text-sm">
                ({product.stock} left)
              </span>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="flex-1">
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
              </Button>
              <Button size="lg" variant="outline" className="flex-1">
                <Bolt className="mr-2 h-5 w-5" /> Buy Now
              </Button>
            </div>

            <Separator />

            <div className="space-y-4 text-sm">
              <h3 className="font-semibold">Specifications</h3>
              <ul className="text-muted-foreground list-inside list-disc space-y-2">
                <li>
                  <span className="text-foreground font-medium">SKU:</span>{" "}
                  {product.sku}
                </li>
                <li>
                  <span className="text-foreground font-medium">Warranty:</span>{" "}
                  {product.warrantyInformation}
                </li>
                <li>
                  <span className="text-foreground font-medium">Shipping:</span>{" "}
                  {product.shippingInformation}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight">
            Customer Reviews
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {product.reviews.map((review, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {review.reviewerName}
                    </CardTitle>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">"{review.comment}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetailPage;
