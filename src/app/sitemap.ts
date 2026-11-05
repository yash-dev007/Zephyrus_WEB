import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/site";
import { normalizePath } from "@/lib/docs";
import { source } from "@/lib/source";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const docs: MetadataRoute.Sitemap = source.getPages().map((page) => ({
    url: `${siteUrl}${normalizePath(page.url)}`,
    lastModified: page.data.lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...docs,
  ];
}
