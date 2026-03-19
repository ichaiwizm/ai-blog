import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import GithubSlugger from "github-slugger";
import { getAllArticlesPB, getArticleBySlugPB } from "./pocketbase";

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
  prerequisites?: string[];
}

export interface Post extends PostMeta {
  content: string;
}

function getMDXPosts(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) return [];

  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
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
        prerequisites: data.prerequisites || undefined,
      };
    })
    .filter((post) => post.published);
}

function getMDXPostBySlug(slug: string): Post | null {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;

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
    prerequisites: data.prerequisites || undefined,
    content,
  };
}

export async function getAllPosts(): Promise<PostMeta[]> {
  const mdxPosts = getMDXPosts();
  const pbPosts = await getAllArticlesPB();

  // Merge: MDX slugs take precedence, PB fills the rest
  const mdxSlugs = new Set(mdxPosts.map((p) => p.slug));
  const uniquePBPosts = pbPosts.filter((p) => !mdxSlugs.has(p.slug));

  const merged = [...mdxPosts, ...uniquePBPosts];
  return merged.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const mdx = getMDXPostBySlug(slug);
  if (mdx) return mdx;
  return getArticleBySlugPB(slug);
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tags = new Set<string>();
  posts.forEach((post) => post.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}

export async function getPostsByTag(tag: string): Promise<PostMeta[]> {
  const posts = await getAllPosts();
  return posts.filter((post) =>
    post.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  );
}

export function getAllCategories(): Category[] {
  return Object.keys(CATEGORIES) as Category[];
}

export async function getPostsByCategory(category: Category): Promise<PostMeta[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.category === category);
}

export async function getRelatedPosts(currentSlug: string, limit: number = 3): Promise<PostMeta[]> {
  const currentPost = await getPostBySlug(currentSlug);
  if (!currentPost) return [];

  const allPosts = (await getAllPosts()).filter((post) => post.slug !== currentSlug);

  const scoredPosts = allPosts.map((post) => {
    let score = 0;
    const commonTags = post.tags.filter((tag) =>
      currentPost.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
    );
    score += commonTags.length * 2;
    if (post.category && post.category === currentPost.category) score += 1;
    return { post, score };
  });

  return scoredPosts
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
    })
    .slice(0, limit)
    .map(({ post }) => post);
}

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

export function extractHeadings(content: string): TocHeading[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: TocHeading[] = [];
  const slugger = new GithubSlugger();
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = slugger.slug(text);
    headings.push({ id, text, level });
  }

  return headings;
}
