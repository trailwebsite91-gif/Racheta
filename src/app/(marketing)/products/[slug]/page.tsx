import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "./client";
import { getProductBySlug, getRelatedProducts } from "@/lib/mock-products";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} | SmartPrint Studio`,
      description: product.description.slice(0, 160),
      images: [product.images[0]],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = getRelatedProducts(slug, 4);

  return <ProductDetailClient product={product} related={related} />;
}
