"use client";

import FavoriteButton from "./FavoriteButton";
import ShareButtons from "./ShareButtons";

interface ArticleActionsProps {
  slug: string;
  title: string;
  url: string;
}

export default function ArticleActions({ slug, title, url }: ArticleActionsProps) {
  return (
    <div className="flex items-center gap-4">
      <FavoriteButton slug={slug} type="post" showLabel />
      <ShareButtons title={title} url={url} />
    </div>
  );
}
