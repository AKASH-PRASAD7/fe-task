import React from "react";
import ProductDetailPage from "./_components/products-details";
import type { Metadata } from "next";
import { getProductById } from "@/api/products";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  try {
    const product = await getProductById(id);

    return {
      title: `${product.title} – Vivid Cart`,
      description: product.description,
    };
  } catch (error) {
    console.error("Error fetching product for metadata:", error);
    return {
      title: "Product Not Found – Vivid Cart",
      description: "The product you're looking for does not exist.",
    };
  }
}

const page = () => {
  return <ProductDetailPage />;
};

export default page;
