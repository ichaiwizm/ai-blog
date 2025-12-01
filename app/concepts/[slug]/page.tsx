import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllConcepts, getConceptBySlug, CONCEPT_LEVELS } from "@/lib/concepts";
import { compileMDXContent } from "@/lib/mdx";
import Breadcrumbs from "@/components/Breadcrumbs";
import ConceptCompleteButton from "./ConceptCompleteButton";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const concepts = getAllConcepts();
  return concepts.map((concept) => ({ slug: concept.slug }));
}

export async function generateMetadata({ params }: Props) {
  const concept = getConceptBySlug(params.slug);
  if (!concept) return { title: "Concept non trouvé" };

  return {
    title: `${concept.title} - Concepts - AI Blog`,
    description: concept.description,
  };
}

export default async function ConceptPage({ params }: Props) {
  const concept = getConceptBySlug(params.slug);

  if (!concept) {
    notFound();
  }

  const { content } = await compileMDXContent(concept.content);
  const levelInfo = CONCEPT_LEVELS[concept.level];
  const allConcepts = getAllConcepts();
  const currentIndex = allConcepts.findIndex((c) => c.slug === concept.slug);
  const prevConcept = currentIndex > 0 ? allConcepts[currentIndex - 1] : null;
  const nextConcept = currentIndex < allConcepts.length - 1 ? allConcepts[currentIndex + 1] : null;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b-3 border-border bg-bg-secondary">
        <div className="container-narrow py-16">
          {/* Breadcrumbs */}
          <div className="mb-8 animate-fade-up">
            <Breadcrumbs
              items={[
                { label: "Accueil", href: "/" },
                { label: "Concepts", href: "/concepts" },
                { label: concept.title },
              ]}
            />
          </div>

          {/* Back link */}
          <Link
            href="/concepts"
            className="inline-flex items-center gap-2 font-body text-sm font-medium text-text-muted hover:text-accent transition-colors mb-8 animate-fade-up"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Tous les concepts
          </Link>

          {/* Icon and Level */}
          <div className="flex items-center gap-4 mb-6 animate-fade-up stagger-1">
            <span className="text-5xl">{concept.icon}</span>
            <span
              className={`px-3 py-1 font-mono text-xs font-semibold uppercase ${
                concept.level === "debutant"
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : concept.level === "intermediaire"
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
              }`}
            >
              {levelInfo.label}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-4xl sm:text-5xl text-text-primary leading-[1.1] mb-6 animate-fade-up stagger-2">
            {concept.title}
          </h1>

          {/* Description */}
          <p className="font-body text-xl text-text-muted leading-relaxed mb-8 animate-fade-up stagger-3">
            {concept.description}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 font-mono text-sm text-text-muted animate-fade-up stagger-4">
            <span className="flex items-center gap-2">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              {concept.readingTime}
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container-narrow py-16">
        <div className="prose prose-lg max-w-none">{content}</div>

        {/* Mark as complete */}
        <div className="mt-16 pt-8 border-t-3 border-border">
          <ConceptCompleteButton slug={concept.slug} title={concept.title} />
        </div>

        {/* Navigation */}
        <div className="mt-12 grid sm:grid-cols-2 gap-4">
          {prevConcept ? (
            <Link
              href={`/concepts/${prevConcept.slug}`}
              className="group flex items-center gap-4 p-4 border-3 border-border bg-bg-secondary transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-text-muted group-hover:text-accent transition-colors flex-shrink-0"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <div>
                <p className="font-mono text-xs text-text-muted uppercase mb-1">
                  Précédent
                </p>
                <p className="font-body font-semibold text-text-primary group-hover:text-accent transition-colors">
                  {prevConcept.title}
                </p>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextConcept && (
            <Link
              href={`/concepts/${nextConcept.slug}`}
              className="group flex items-center justify-end gap-4 p-4 border-3 border-border bg-bg-secondary transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal text-right"
            >
              <div>
                <p className="font-mono text-xs text-text-muted uppercase mb-1">
                  Suivant
                </p>
                <p className="font-body font-semibold text-text-primary group-hover:text-accent transition-colors">
                  {nextConcept.title}
                </p>
              </div>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-text-muted group-hover:text-accent transition-colors flex-shrink-0"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>

        {/* Back to all */}
        <div className="mt-8 text-center">
          <Link href="/concepts" className="brutal-btn-secondary">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Voir tous les concepts
          </Link>
        </div>
      </div>
    </div>
  );
}
