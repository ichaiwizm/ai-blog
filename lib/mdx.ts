import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
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
import { Image, ImageGallery, GalleryImage, ImageCompare } from "@/components/mdx/Image";
import GlossaryTooltip, { Term } from "@/components/GlossaryTooltip";

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
  // Image components
  Image,
  ImageGallery,
  GalleryImage,
  ImageCompare,
  // Glossary components
  GlossaryTooltip,
  Term,
};

export async function compileMDXContent(source: string) {
  const { content, frontmatter } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
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
