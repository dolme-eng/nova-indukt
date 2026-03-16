import { redirect } from 'next/navigation'

export default function LieferungPage({ params }: { params: { locale: string } }) {
  redirect(`/${params.locale}/faq`)
}
