import { redirect } from 'next/navigation'

export default function RueckgabePage({ params }: { params: { locale: string } }) {
  redirect(`/${params.locale}/faq`)
}
