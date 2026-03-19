import { PostMeta, Post, Category } from "./posts";

const PB_URL = process.env.POCKETBASE_URL || "http://pocketbase-codia:8090";

interface PBRecord {
  id: string;
  slug: string;
  title: string;
  description?: string;
  content?: string;
  date: string;
  tags?: string | string[];
  category?: string;
  published?: boolean;
  image?: string;
  source?: string;
}

function parseTags(tags: string | string[] | undefined): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  try {
    return JSON.parse(tags);
  } catch {
    return [];
  }
}

function toPostMeta(record: PBRecord): PostMeta {
  return {
    slug: record.slug,
    title: record.title,
    description: record.description || "",
    date: record.date,
    tags: parseTags(record.tags),
    readingTime: estimateReadingTime(record.content || ""),
    published: record.published !== false,
    image: record.image || undefined,
    category: (record.category as Category) || undefined,
  };
}

function estimateReadingTime(content: string): string {
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

export async function getAllArticlesPB(): Promise<PostMeta[]> {
  try {
    const filter = encodeURIComponent('published=true');
    const res = await fetch(
      `${PB_URL}/api/collections/articles/records?filter=${filter}&sort=-date&perPage=200`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.items || []).map(toPostMeta);
  } catch {
    return [];
  }
}

export async function getArticleBySlugPB(slug: string): Promise<Post | null> {
  try {
    const filter = encodeURIComponent(`slug="${slug}" && published=true`);
    const res = await fetch(
      `${PB_URL}/api/collections/articles/records?filter=${filter}&perPage=1`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const items: PBRecord[] = data.items || [];
    if (items.length === 0) return null;
    const record = items[0];
    return {
      ...toPostMeta(record),
      content: record.content || "",
    };
  } catch {
    return null;
  }
}
