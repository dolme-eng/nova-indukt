'use client'

import { useEffect } from "react"
import { AlertCircle, ArrowLeft, RotateCcw } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 sm:p-12">
        <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-3">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4 font-heading">
          Etwas ist schief gelaufen
        </h1>
        
        <p className="text-gray-500 mb-8 leading-relaxed">
          Es gab ein Problem beim Laden dieser Seite. Bitte versuchen Sie es erneut ou kehren Sie zur Startseite zurück.
        </p>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full py-4 bg-[#0C211E] text-white font-bold rounded-2xl hover:bg-[#17423C] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#0C211E]/20"
          >
            <RotateCcw className="w-5 h-5" />
            Erneut versuchen
          </button>
          
          <Link
            href="/"
            className="w-full py-4 bg-gray-50 text-[#0C211E] font-bold rounded-2xl border border-gray-200 hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Zur Startseite
          </Link>
        </div>
        
        {error.digest && (
          <p className="mt-6 text-[10px] text-gray-400 font-mono">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
