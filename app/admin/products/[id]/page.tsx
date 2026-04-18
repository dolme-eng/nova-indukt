import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ProductForm from "../_components/product-form"

export default async function EditProductPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: resolvedParams.id },
      include: { images: true }
    }),
    prisma.category.findMany({
      orderBy: { nameDe: 'asc' }
    })
  ])

  if (!product) notFound()

  return <ProductForm initialData={product} categories={categories} />
}
