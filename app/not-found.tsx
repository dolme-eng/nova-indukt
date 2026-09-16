import Link from 'next/link'
import { Search, Home } from 'lucide-react'

export default function NotFound() {
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
    </div>
  )
}
