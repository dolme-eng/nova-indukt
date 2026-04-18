import { redirect } from 'next/navigation'

export default function CategoryPage({ params }: { params: { id: string } }) {
  // Redirige vers la page produits avec le filtre de catégorie
  redirect(`/produkte?kategorie=${params.id}`)
}
