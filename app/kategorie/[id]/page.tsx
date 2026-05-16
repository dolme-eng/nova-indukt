import { redirect } from 'next/navigation'

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  // Redirige vers la page produits avec le filtre de catégorie
  redirect(`/produkte?kategorie=${resolvedParams.id}`)
}
