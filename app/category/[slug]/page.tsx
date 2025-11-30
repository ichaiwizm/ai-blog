import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCategories, getPostsByCategory, CATEGORIES, Category } from "@/lib/posts";
import ArticleCard from "@/components/ArticleCard";
import Breadcrumbs from "@/components/Breadcrumbs";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({ slug: category }));
}

export async function generateMetadata({ params }: Props) {
  const category = params.slug as Category;
  const categoryInfo = CATEGORIES[category];

  if (!categoryInfo) {
    return { title: "Categorie non trouvee" };
  }

  return {
    title: `${categoryInfo.label} - AI Blog`,
    description: categoryInfo.description,
  };
}

export default function CategoryPage({ params }: Props) {
  const category = params.slug as Category;
  const categoryInfo = CATEGORIES[category];

  if (!categoryInfo) {
    notFound();
  }

  const posts = getPostsByCategory(category);

  return (
    <main className="min-h-screen py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs
            items={[
              { label: "Accueil", href: "/" },
              { label: "Categories" },
              { label: categoryInfo.label },
            ]}
          />
        </div>

        {/* Header */}
        <header className="mb-12 pb-8 border-b border-[var(--border)]">
          <div className="font-mono text-xs text-[var(--text-muted)] mb-4">
            <span className="text-[var(--accent)]">&gt;</span> Categorie
          </div>
          <h1 className="font-mono text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
            {categoryInfo.label}
          </h1>
          <p className="font-serif text-lg text-[var(--text-secondary)]">
            {categoryInfo.description}
          </p>
          <div className="font-mono text-sm text-[var(--text-muted)] mt-4">
            {posts.length} article{posts.length !== 1 ? "s" : ""}
          </div>
        </header>

        {/* Category navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {getAllCategories().map((cat) => (
            <Link
              key={cat}
              href={`/category/${cat}`}
              className={`px-4 py-2 rounded font-mono text-xs transition-colors ${
                cat === category
                  ? "bg-[var(--accent)] text-[var(--bg-primary)]"
                  : "border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              }`}
            >
              {CATEGORIES[cat].label}
            </Link>
          ))}
        </div>

        {/* Posts */}
        {posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post, index) => (
              <div
                key={post.slug}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ArticleCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="font-mono text-[var(--text-muted)]">
              Aucun article dans cette categorie pour le moment.
            </p>
            <Link
              href="/blog"
              className="inline-block mt-4 font-mono text-sm text-[var(--accent)] hover:underline"
            >
              Voir tous les articles
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
