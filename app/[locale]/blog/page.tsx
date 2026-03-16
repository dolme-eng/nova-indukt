'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Link } from '@/navigation'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { 
  Search, Clock, ChevronRight, ArrowLeft, Tag,
  Calendar, User
} from 'lucide-react'
import { blogPosts } from '@/lib/data/products'

interface BlogContentProps {
  locale: string
}

function BlogContent({ locale }: BlogContentProps) {
  const t = useTranslations('blog')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPosts = blogPosts.filter(post => {
    const searchLower = searchQuery.toLowerCase()
    const title = post.title[locale as 'de' | 'en' | 'fr'].toLowerCase()
    const excerpt = post.excerpt[locale as 'de' | 'en' | 'fr'].toLowerCase()
    const category = post.category.toLowerCase()
    return title.includes(searchLower) || excerpt.includes(searchLower) || category.includes(searchLower)
  })

  // Get unique categories
  const categories = Array.from(new Set(blogPosts.map(post => post.category)))

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Breadcrumbs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 py-3 text-sm">
            <Link href="/" className="flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors lg:hidden">
              <ArrowLeft className="w-4 h-4" />
              <span>{t('nav.home')}</span>
            </Link>
            <div className="hidden lg:flex items-center gap-2">
              <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">{t('nav.home')}</Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 font-medium">{t('title')}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="max-w-4xl mx-auto text-center">
            <Link 
              href="/" 
              className="hidden lg:inline-flex items-center gap-2 text-gray-500 hover:text-[#4ECCA3] transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('backToHome') || 'Zurück zur Startseite'}
            </Link>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              {t('title')}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              {t('subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Search */}
          <div className="max-w-xl mx-auto mb-8 sm:mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder') || 'Artikel durchsuchen...'}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#4ECCA3] focus:ring-2 focus:ring-[#4ECCA3]/20 text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-12 px-2">
            <button
              onClick={() => setSearchQuery('')}
              className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                searchQuery === '' 
                  ? 'bg-[#4ECCA3] text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {t('allCategories') || 'Alle Kategorien'}
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSearchQuery(category)}
                className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                  searchQuery === category 
                    ? 'bg-[#4ECCA3] text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Blog Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow border border-gray-100"
                >
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title[locale as 'de' | 'en' | 'fr']}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                        <span className="px-2 sm:px-3 py-1 bg-[#4ECCA3] text-white text-xs font-bold rounded-full flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          {new Date(post.date).toLocaleDateString(locale === 'de' ? 'de-DE' : locale === 'fr' ? 'fr-FR' : 'en-US')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          {post.readTime}
                        </span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-[#4ECCA3] transition-colors line-clamp-2">
                        {post.title[locale as 'de' | 'en' | 'fr']}
                      </h2>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                        {post.excerpt[locale as 'de' | 'en' | 'fr']}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          {post.author}
                        </span>
                        <span className="flex items-center gap-1 text-[#4ECCA3] font-medium text-xs sm:text-sm">
                          {t('readMore')}
                          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                {t('noResults') || 'Keine Artikel gefunden'}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                {t('tryDifferent') || 'Versuchen Sie andere Suchbegriffe'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function BlogPage({ params }: { params: { locale: string } }) {
  return <BlogContent locale={params.locale} />
}
