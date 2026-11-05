import { defineDocs } from "fumadocs-mdx/macro";
import { loader } from "fumadocs-core/source";

const docs = defineDocs({
  dir: "content/docs",
  docs: {
    lastModified: true,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
});

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
});

export const docsContentRoute = "/llms.mdx/docs";

export function getPageMarkdownUrl(page: { slugs: string[] }): string {
  const segments = [...page.slugs, "content.md"];
  return `${docsContentRoute}/${segments.join("/")}`;
}
