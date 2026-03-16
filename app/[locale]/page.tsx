import { Suspense } from 'react'
import { HomeContent } from './HomeContent'

export default function Page({ params }: { params: { locale: string } }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <HomeContent locale={params.locale} />
    </Suspense>
  )
}
