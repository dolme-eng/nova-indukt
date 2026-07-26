export function PreloadResources() {
  return (
    <>
      <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
      <link
        rel="preload"
        as="image"
        href="/images/hero/Die-Zukunft-der-Induktion.webp"
        imageSrcSet="/images/hero/Die-Zukunft-der-Induktion.webp"
      />
      <link
        rel="preload"
        as="image"
        href="/images/hero/Professionelle-Topfsets.webp"
        imageSrcSet="/images/hero/Professionelle-Topfsets.webp"
      />
    </>
  )
}
