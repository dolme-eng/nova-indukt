import { ProductsContent } from './ProductsContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Unsere Produkte | NOVA INDUKT',
  description: 'Entdecken Sie unser Premium-Sortiment an Induktions-Kochgeschirr, Pfannen, Töpfen und Küchenzubehör. Deutsche Qualität für Ihre Küche.',
  keywords: ['Produkte', 'Kochgeschirr', 'Pfannen', 'Töpfe', 'Induktion', 'Küche', 'Online-Shop'],
}

export default function ProductsPage() {
  return <ProductsContent />
}
