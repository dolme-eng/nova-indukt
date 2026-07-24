import { redirect } from 'next/navigation'

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  // Redirect to products page with category filter
  redirect(`/produkte?kategorie=${resolvedParams.id}`)
}
