import type { ReactNode } from "react";
import { DocsShell } from "@/components/docs/DocsShell";
import { collectPageUrls, getDocVersions } from "@/lib/docs";
import { source } from "@/lib/source";

export default function DocsLayout({ children }: { children: ReactNode }) {
  const tree = source.getPageTree();
  const versions = getDocVersions(tree);
  const knownUrls = collectPageUrls(tree);

  return (
    <DocsShell tree={tree} versions={versions} knownUrls={knownUrls}>
      {children}
    </DocsShell>
  );
}
