import React from "react"
import ProductForm from "../_components/product-form"
import { prisma } from "@/lib/prisma"
export const dynamic = 'force-dynamic'
import { notFound } from "next/navigation"

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { nameDe: 'asc' }
  })

  return <ProductForm categories={categories} />
}
