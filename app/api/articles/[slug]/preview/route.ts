import { NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/posts";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return NextResponse.json(
      { error: "Article non trouvé" },
      { status: 404 }
    );
  }

  // Return only preview data (no full content)
  return NextResponse.json({
    slug: post.slug,
    title: post.title,
    description: post.description,
    date: post.date,
    readingTime: post.readingTime,
    tags: post.tags.slice(0, 3), // Limit tags for preview
    category: post.category,
    image: post.image,
  });
}
