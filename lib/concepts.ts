import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

// Re-export types for convenience (server-side imports)
export { CONCEPT_LEVELS } from "./concepts-types";
export type { ConceptLevel, ConceptMeta, Concept } from "./concepts-types";
import type { ConceptLevel, ConceptMeta, Concept } from "./concepts-types";

const conceptsDirectory = path.join(process.cwd(), "content/concepts");

export function getAllConcepts(): ConceptMeta[] {
  if (!fs.existsSync(conceptsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(conceptsDirectory);
  const concepts = fileNames
    .filter((name) => name.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, "");
      const fullPath = path.join(conceptsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        description: data.description || "",
        icon: data.icon || "books",
        level: (data.level as ConceptLevel) || "debutant",
        readingTime: readingTime(content).text,
        order: data.order || 99,
      };
    })
    .sort((a, b) => a.order - b.order);

  return concepts;
}

export function getConceptBySlug(slug: string): Concept | null {
  const fullPath = path.join(conceptsDirectory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || slug,
    description: data.description || "",
    icon: data.icon || "📚",
    level: (data.level as ConceptLevel) || "debutant",
    readingTime: readingTime(content).text,
    order: data.order || 99,
    content,
  };
}

export function getConceptsByLevel(level: ConceptLevel): ConceptMeta[] {
  return getAllConcepts().filter((concept) => concept.level === level);
}

export function getConceptsBySlugs(slugs: string[]): ConceptMeta[] {
  const allConcepts = getAllConcepts();
  return slugs
    .map((slug) => allConcepts.find((c) => c.slug === slug))
    .filter((c): c is ConceptMeta => c !== undefined);
}
