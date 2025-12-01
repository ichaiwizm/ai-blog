"use client";

import { useEffect, useRef } from "react";

interface CommentsProps {
  slug: string;
}

export default function Comments({ slug }: CommentsProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Clear any existing giscus
    ref.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";

    // Configuration Giscus
    script.setAttribute("data-repo", "ichaiwizm/ai-blog");
    script.setAttribute("data-repo-id", "R_kgDOQfua2g");
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "DIC_kwDOQfua2s4CzOFw");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", "light");
    script.setAttribute("data-lang", "fr");
    script.setAttribute("data-loading", "lazy");

    ref.current.appendChild(script);
  }, [slug]);

  return (
    <section className="mt-16 pt-8 border-t-2 border-border">
      <h2 className="font-display text-2xl text-text-primary mb-4">
        Commentaires
      </h2>
      <p className="font-body text-sm text-text-muted mb-8">
        Connectez-vous avec GitHub pour participer a la discussion.
      </p>
      <div
        ref={ref}
        className="giscus border-3 border-border-light p-4 bg-bg-secondary"
      />
    </section>
  );
}
