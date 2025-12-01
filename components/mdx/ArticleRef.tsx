import ArticlePreviewPopover from "../ArticlePreviewPopover";

interface ArticleRefProps {
  slug: string;
  children: React.ReactNode;
}

/**
 * MDX Component for referencing other articles with Wikipedia-style preview on hover.
 *
 * Usage in MDX:
 * ```mdx
 * Découvrez comment configurer <ArticleRef slug="wsl-setup">WSL</ArticleRef> pour développer.
 * ```
 */
export default function ArticleRef({ slug, children }: ArticleRefProps) {
  return (
    <ArticlePreviewPopover slug={slug}>
      {children}
    </ArticlePreviewPopover>
  );
}
