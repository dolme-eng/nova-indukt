import { prisma } from "@/lib/prisma"

export async function getStaticPageContent(slug: string) {
  try {
    const page = await prisma.staticPageContent.findUnique({ where: { slug } })
    if (!page?.isActive) return null
    return page
  } catch {
    return null
  }
}

export async function getFaqItems() {
  try {
    return await prisma.faqItem.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    })
  } catch {
    return []
  }
}

