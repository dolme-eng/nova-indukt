'use client'

import { useEffect } from 'react'

// Précharger les ressources critiques
export function PreloadResources() {
  useEffect(() => {
    // Précharger les polices
    const fontLinks = [
      '/fonts/inter-var.woff2',
    ]
    
    fontLinks.forEach(href => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'font'
      link.href = href
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })

    // Préconnecter aux domaines externes
    const preconnectDomains = [
      'https://images.unsplash.com',
    ]
    
    preconnectDomains.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = domain
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })

    // Précharger les images hero
    const heroImages = [
      '/images/hero/Die-Zukunft-der-Induktion.webp',
      '/images/hero/Professionelle-Topfsets.webp',
    ]
    
    heroImages.forEach(src => {
      const img = new Image()
      img.src = src
    })
  }, [])

  return null
}
