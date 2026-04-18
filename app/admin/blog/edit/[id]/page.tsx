import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import BlogPostForm from "../../_components/blog-post-form"

export default async function EditBlogPostPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const post = await prisma.blogPost.findUnique({
    where: { id: resolvedParams.id }
  })

  if (!post) notFound()

  return <BlogPostForm initialData={post} />
}
