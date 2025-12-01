import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllCategories,
  getPostsByCategory,
  CATEGORIES,
  Category,
} from "@/lib/posts";
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
    <>
      {/* Header */}
      <section className="border-b-3 border-border bg-bg-secondary">
        <div className="container-default py-16">
          {/* Breadcrumbs */}
          <div className="mb-8 animate-fade-up">
            <Breadcrumbs
              items={[
                { label: "Accueil", href: "/" },
                { label: "Categories" },
                { label: categoryInfo.label },
              ]}
            />
          </div>

          <div className="animate-fade-up stagger-1">
            <span className="category-badge mb-6 inline-block">Categorie</span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl text-text-primary mb-6 animate-fade-up stagger-2">
            {categoryInfo.label}
          </h1>

          <p className="text-xl text-text-muted max-w-xl mb-4 animate-fade-up stagger-3">
            {categoryInfo.description}
          </p>

          <div className="font-mono text-sm text-accent animate-fade-up stagger-4">
            {posts.length} article{posts.length !== 1 ? "s" : ""}
          </div>
        </div>
      </section>

      {/* Category navigation */}
      <section className="border-b-3 border-border-light py-6">
        <div className="container-default">
          <div className="flex flex-wrap gap-3">
            {getAllCategories().map((cat) => (
              <Link
                key={cat}
                href={`/category/${cat}`}
                className={`px-5 py-2.5 font-body text-sm font-medium transition-all ${
                  cat === category
                    ? "bg-accent text-text-inverse border-3 border-border"
                    : "bg-bg-secondary border-3 border-border text-text-muted hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal-sm"
                }`}
              >
                {CATEGORIES[cat].label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="py-16">
        <div className="container-default">
          {posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <ArticleCard key={post.slug} post={post} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-3 border-border-light">
              <p className="font-body text-text-muted text-lg mb-4">
                Aucun article dans cette categorie pour le moment.
              </p>
              <Link href="/blog" className="brutal-btn-secondary">
                Voir tous les articles
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
