import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const postsDirectory = path.join(process.cwd(), "content/posts");

export type Category = "tutoriels" | "actualites" | "opinions" | "comparatifs";

export const CATEGORIES: Record<Category, { label: string; description: string }> = {
  tutoriels: { label: "Tutoriels", description: "Guides pratiques et tutoriels pas à pas" },
  actualites: { label: "Actualités", description: "Les dernières nouvelles de l'IA" },
  opinions: { label: "Opinions", description: "Réflexions et analyses personnelles" },
  comparatifs: { label: "Comparatifs", description: "Tests et comparaisons d'outils IA" },
};

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readingTime: string;
  published: boolean;
  image?: string;
  category?: Category;
  series?: string;
  seriesOrder?: number;
  prerequisites?: string[]; // Concept slugs required before reading this article
}

export interface Post extends PostMeta {
  content: string;
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames
    .filter((name) => name.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        description: data.description || "",
        date: data.date || new Date().toISOString(),
        tags: data.tags || [],
        readingTime: readingTime(content).text,
        published: data.published !== false,
        image: data.image || undefined,
        category: data.category || undefined,
        series: data.series || undefined,
        seriesOrder: data.seriesOrder || undefined,
        prerequisites: data.prerequisites || undefined,
      };
    })
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || slug,
    description: data.description || "",
    date: data.date || new Date().toISOString(),
    tags: data.tags || [],
    readingTime: readingTime(content).text,
    published: data.published !== false,
    image: data.image || undefined,
    category: data.category || undefined,
    series: data.series || undefined,
    seriesOrder: data.seriesOrder || undefined,
    prerequisites: data.prerequisites || undefined,
    content,
  };
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tags = new Set<string>();
  posts.forEach((post) => post.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((post) =>
    post.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  );
}

// Category functions
export function getAllCategories(): Category[] {
  return Object.keys(CATEGORIES) as Category[];
}

export function getPostsByCategory(category: Category): PostMeta[] {
  return getAllPosts().filter((post) => post.category === category);
}

// Series functions
export interface SeriesInfo {
  slug: string;
  title: string;
  posts: PostMeta[];
}

export function getAllSeries(): SeriesInfo[] {
  const posts = getAllPosts();
  const seriesMap = new Map<string, PostMeta[]>();

  posts.forEach((post) => {
    if (post.series) {
      const existing = seriesMap.get(post.series) || [];
      seriesMap.set(post.series, [...existing, post]);
    }
  });

  return Array.from(seriesMap.entries()).map(([slug, seriesPosts]) => ({
    slug,
    title: slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    posts: seriesPosts.sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0)),
  }));
}

export function getPostsBySeries(seriesSlug: string): PostMeta[] {
  return getAllPosts()
    .filter((post) => post.series === seriesSlug)
    .sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));
}

// Related posts function
export function getRelatedPosts(currentSlug: string, limit: number = 3): PostMeta[] {
  const currentPost = getPostBySlug(currentSlug);
  if (!currentPost) return [];

  const allPosts = getAllPosts().filter((post) => post.slug !== currentSlug);

  // Score posts based on common tags and same category
  const scoredPosts = allPosts.map((post) => {
    let score = 0;

    // Points for each common tag
    const commonTags = post.tags.filter((tag) =>
      currentPost.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
    );
    score += commonTags.length * 2;

    // Points for same category
    if (post.category && post.category === currentPost.category) {
      score += 1;
    }

    // Points for same series
    if (post.series && post.series === currentPost.series) {
      score += 3;
    }

    return { post, score };
  });

  // Sort by score (descending) then by date (descending)
  return scoredPosts
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
    })
    .slice(0, limit)
    .map(({ post }) => post);
}

// Extract headings from MDX content for table of contents
export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

export function extractHeadings(content: string): TocHeading[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: TocHeading[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    headings.push({ id, text, level });
  }

  return headings;
}
