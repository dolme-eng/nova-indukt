'use client'

import { useTranslations } from 'next-intl'
import { Award, Globe, Leaf, Target, Heart, ShieldCheck, BadgeCheck, Star, Trophy, Medal, Recycle } from 'lucide-react'

export default function AboutContent() {
  const t = useTranslations('about')
  
  const values = [
    {
      icon: Award,
      titleKey: 'values.quality.title',
      descriptionKey: 'values.quality.description'
    },
    {
      icon: Leaf,
      titleKey: 'values.sustainability.title',
      descriptionKey: 'values.sustainability.description'
    },
    {
      icon: Target,
      titleKey: 'values.innovation.title',
      descriptionKey: 'values.innovation.description'
    }
  ]

  const stats = [
    { value: '2018', labelKey: 'stats.founded' },
    { value: '50.000+', labelKey: 'stats.customers' },
    { value: '120+', labelKey: 'stats.products' },
    { value: '15', labelKey: 'stats.employees' }
  ]

  const team = [
    {
      name: 'Max Mustermann',
      roleKey: 'team.ceo.role',
      descriptionKey: 'team.ceo.description'
    },
    {
      name: 'Anna Schmidt',
      roleKey: 'team.product.role',
      descriptionKey: 'team.product.description'
    },
    {
      name: 'Thomas Weber',
      roleKey: 'team.support.role',
      descriptionKey: 'team.support.description'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              {t('hero.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t('story.title')}</h2>
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p>{t('story.paragraph1')}</p>
                <p>{t('story.paragraph2')}</p>
                <p>{t('story.paragraph3')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">{t('values.title')}</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#4ECCA3]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-[#4ECCA3]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t(value.titleKey)}</h3>
                <p className="text-gray-600 text-sm">{t(value.descriptionKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">{t('stats.title')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <div className="text-3xl md:text-4xl font-bold text-[#4ECCA3] mb-2">{stat.value}</div>
                <p className="text-gray-600 text-sm">{t(stat.labelKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t('location.title')}</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('location.headquarters')}</h3>
                <div className="space-y-3 text-gray-700">
                  <p>NOVA INDUKT GmbH</p>
                  <p>Industriestraße 123</p>
                  <p>12345 Berlin</p>
                  <p className="pt-2">{t('location.phone')}: +49 (0) 30 12345678</p>
                  <p>{t('location.email')}: info@nova-indukt.de</p>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">{t('location.hours')}</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{t('location.hoursWeekday')}</p>
                    <p>{t('location.hoursSaturday')}</p>
                    <p>{t('location.hoursSunday')}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 rounded-2xl h-64 md:h-auto flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Globe className="w-16 h-16 mx-auto mb-4" />
                  <p>{t('location.mapView')}</p>
                  <p className="text-sm">{t('location.mapIntegration')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">{t('team.title')}</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-[#4ECCA3] text-sm mb-2">{t(member.roleKey)}</p>
                <p className="text-gray-600 text-sm">{t(member.descriptionKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promise */}
      <section className="py-16 bg-[#4ECCA3]/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Heart className="w-12 h-12 text-[#4ECCA3] mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('promise.title')}</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              {t('promise.description')}
            </p>
            <div className="bg-white rounded-xl p-6 inline-block">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#4ECCA3]">2 {t('promise.years')}</div>
                  <p className="text-sm text-gray-600">{t('promise.warranty')}</p>
                </div>
                <div className="w-px h-12 bg-gray-200" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#4ECCA3]">30 {t('promise.days')}</div>
                  <p className="text-sm text-gray-600">{t('promise.returns')}</p>
                </div>
                <div className="w-px h-12 bg-gray-200" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#4ECCA3]">{t('promise.free')}</div>
                  <p className="text-sm text-gray-600">{t('promise.shipping')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t('certifications.title')}</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-6 text-center w-40">
              <div className="w-12 h-12 mx-auto mb-3 bg-[#4ECCA3]/10 rounded-full flex items-center justify-center">
                <Medal className="w-6 h-6 text-[#4ECCA3]" />
              </div>
              <p className="text-sm font-medium text-gray-700">{t('certifications.madeInGermany')}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center w-40">
              <div className="w-12 h-12 mx-auto mb-3 bg-[#4ECCA3]/10 rounded-full flex items-center justify-center">
                <Recycle className="w-6 h-6 text-[#4ECCA3]" />
              </div>
              <p className="text-sm font-medium text-gray-700">{t('certifications.eco')}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center w-40">
              <div className="w-12 h-12 mx-auto mb-3 bg-[#4ECCA3]/10 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-[#4ECCA3]" />
              </div>
              <p className="text-sm font-medium text-gray-700">{t('certifications.tuv')}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center w-40">
              <div className="w-12 h-12 mx-auto mb-3 bg-[#4ECCA3]/10 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-[#4ECCA3]" />
              </div>
              <p className="text-sm font-medium text-gray-700">{t('certifications.trusted')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
