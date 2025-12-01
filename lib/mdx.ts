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
import { Alert } from "@/components/mdx/Alert";
import { Callout } from "@/components/mdx/Callout";
import { Tabs, Tab } from "@/components/mdx/Tabs";
import { CodeDiff } from "@/components/mdx/CodeDiff";
import { Video } from "@/components/mdx/Video";

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
  // Rich content components
  Alert,
  Callout,
  Tabs,
  Tab,
  CodeDiff,
  Video,
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
