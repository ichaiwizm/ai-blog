import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import {
  PlatformContent,
  PlatformSwitcher,
  PlatformBadge,
  Mac,
  Windows,
  Linux,
  WSL,
  Unix,
  OnPlatforms,
} from "@/components/PlatformContent";

const options = {
  theme: "github-dark",
  keepBackground: true,
};

// MDX components available in all articles
const mdxComponents = {
  // Platform-aware components
  PlatformContent,
  PlatformSwitcher,
  PlatformBadge,
  Mac,
  Windows,
  Linux,
  WSL,
  Unix,
  OnPlatforms,
};

export async function compileMDXContent(source: string) {
  const { content, frontmatter } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
          [rehypePrettyCode, options],
        ],
      },
    },
  });

  return { content, frontmatter };
}
