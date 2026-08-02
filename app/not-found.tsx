import Link from 'next/link'
import Image from 'next/image'
import { Search, Home, ArrowRight, Sparkles } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatPriceDe } from '@/lib/utils/vat'

async function getBestsellers() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, badges: { has: 'bestseller' } },
      include: { images: true },
      take: 4,
    })
    return products
      .filter((p) => p.images.length > 0)
      .map((p) => ({
        id: p.id,
        slug: p.slug,
        name: { de: p.nameDe },
        price: Number(p.price),
        image: p.images[0]?.url ?? '',
      }))
  } catch {
    return []
  }
}

export default async function NotFound() {
  const bestsellers = await getBestsellers()

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 px-4 pb-24 pt-24 sm:px-6">
      {/* 404 Hero */}
      <div className="relative mx-auto mb-20 max-w-2xl text-center">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4ECCA3]/10 blur-[100px]" />

        <h1 className="relative z-10 mb-4 font-heading text-[150px] font-black leading-none tracking-tighter text-gray-200/50">
          404
        </h1>
        <h2 className="relative z-10 mb-6 font-heading text-3xl font-black tracking-tight text-[#0C211E] sm:text-4xl lg:text-5xl">
          Hier brennt nichts an...
        </h2>
        <p className="relative z-10 mb-10 text-lg leading-relaxed text-gray-500 sm:text-xl">
          Aber die gesuchte Seite oder das Produkt scheint verschwunden zu sein. Vielleicht haben
          Sie sich vertippt oder der Artikel ist umgezogen.
        </p>

        <div className="relative z-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/suche"
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-8 py-4 font-bold text-[#0C211E] shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 sm:w-auto"
          >
            <Search className="h-5 w-5" /> Zur Produktsuche
          </Link>
          <Link
            href="/"
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[#0C211E] px-8 py-4 font-bold text-white shadow-xl shadow-[#0C211E]/20 transition-colors hover:bg-[#17423C] sm:w-auto"
          >
            <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-[#4ECCA3]/0 via-[#4ECCA3]/20 to-[#4ECCA3]/0 transition-transform duration-700 group-hover:translate-x-[100%]" />
            <Home className="h-5 w-5" /> Zurück zur Startseite
          </Link>
        </div>
      </div>

      {/* Retention: Bestsellers */}
      {bestsellers.length > 0 && (
        <div className="mx-auto w-full max-w-7xl border-t border-gray-200 pt-16">
          <div className="mb-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4ECCA3]/20 text-[#0C211E]">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-2xl font-black tracking-tight text-[#0C211E] sm:text-3xl">
                Entdecken Sie unsere Bestseller
              </h3>
            </div>
            <Link
              href="/produkte"
              className="hidden items-center gap-2 font-bold text-[#0C211E] transition-colors hover:text-[#4ECCA3] sm:flex"
            >
              Gesamtes Sortiment <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-4">
            {bestsellers.map((product) => (
              <div
                key={product.id}
                className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-2xl"
              >
                <Link
                  href={`/produkt/${product.slug}`}
                  className="relative block aspect-square overflow-hidden bg-gray-50 p-4 sm:p-6"
                >
                  <div className="absolute inset-0 bg-white" />
                  <Image
                    src={product.image}
                    alt={product.name.de}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-contain p-6 mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                </Link>
                <div className="flex flex-1 flex-col bg-white p-5">
                  <h4 className="mb-2 line-clamp-2 flex-1 text-[13px] font-bold leading-snug text-gray-900 transition-colors group-hover:text-[#4ECCA3] sm:text-base">
                    {product.name.de}
                  </h4>
                  <div className="relative mt-auto border-t border-gray-50 pt-3 sm:pt-4">
                    <div className="mb-1 flex items-end gap-1.5 sm:gap-2">
                      <span className="whitespace-nowrap text-base font-black tabular-nums text-emerald-600 sm:text-lg">
                        {formatPriceDe(product.price)}
                      </span>
                    </div>
                    <Link
                      href={`/produkt/${product.slug}`}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-[0.85rem] border border-gray-200 bg-gray-50 py-2.5 text-[13px] font-bold text-gray-800 shadow-sm transition-all duration-300 group-hover:border-[#0C211E] group-hover:bg-[#0C211E] group-hover:text-white sm:rounded-xl sm:py-3.5 sm:text-sm"
                    >
                      <ArrowRight className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                      <span className="hidden sm:inline">Produkt ansehen</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
