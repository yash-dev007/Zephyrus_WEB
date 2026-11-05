import Link from "next/link";
import type { ReactNode } from "react";
import type { InferPageType } from "fumadocs-core/source";
import {
  formatDocDate,
  getActiveVersion,
  getBreadcrumbs,
  getPrevNext,
  getSidebarTree,
  normalizePath,
  type DocCrumb,
  type DocVersion,
} from "@/lib/docs";
import type { Root } from "fumadocs-core/page-tree";
import { source, getPageMarkdownUrl } from "@/lib/source";
import { getMDXComponents } from "./mdx";
import { DocsMobileToc, DocsToc } from "./DocsToc";
import { PageActions } from "./PageActions";

type DocPageType = InferPageType<typeof source>;

export function DocsPage({
  page,
  tree,
  versions,
}: {
  page: DocPageType;
  tree: Root;
  versions: DocVersion[];
}) {
  const MDX = page.data.body;
  const activeVersion = getActiveVersion(page.url, versions);
  const sidebarTree = getSidebarTree(tree, activeVersion);
  const crumbs = getBreadcrumbs(tree, page.url);
  const { previous, next } = getPrevNext(sidebarTree, page.url);
  const lastModified = formatDocDate(page.data.lastModified);
  const markdownUrl = getPageMarkdownUrl(page);
  const githubUrl = `https://github.com/yash-dev007/Zephyrus_WEB/blob/main/content/docs/${page.path}`;

  return (
    <div className="docs-page">
      <article
        className="docs-article"
        id="docs-main"
        tabIndex={-1}
        aria-labelledby="docs-title"
      >
        <DocsBreadcrumbs crumbs={crumbs} version={activeVersion} />

        <header className="docs-page-header">
          <p className="docs-eyebrow">
            ({activeVersion.name} / {page.data.title})
          </p>
          <h1 className="docs-title" id="docs-title">
            {page.data.title}
          </h1>
          {page.data.description ? (
            <p className="docs-description">{page.data.description}</p>
          ) : null}

          <div className="docs-page-meta">
            {lastModified ? (
              <span className="docs-updated">Updated {lastModified}</span>
            ) : (
              <span className="docs-updated">Local-first documentation</span>
            )}
            <PageActions markdownUrl={markdownUrl} githubUrl={githubUrl} />
          </div>
        </header>

        <DocsMobileToc toc={page.data.toc} />

        <div className="docs-prose">
          <MDX components={getMDXComponents()} />
        </div>

        <DocsPager previous={previous} next={next} />

        <footer className="docs-article-footer">
          <span>
            Zephyrus docs <span aria-hidden="true">·</span> {activeVersion.name}
          </span>
          <div>
            <a href="/llms.txt">llms.txt</a>
            <a
              href="https://github.com/yash-dev007/Zephyrus_WEB/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              Report an issue
            </a>
          </div>
        </footer>
      </article>

      <DocsToc toc={page.data.toc} />
    </div>
  );
}

function DocsBreadcrumbs({
  crumbs,
  version,
}: {
  crumbs: DocCrumb[];
  version: DocVersion;
}) {
  return (
    <nav className="docs-breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li>
          <Link href={normalizePath(version.baseUrl)}>Docs</Link>
        </li>
        {crumbs.map((crumb, index) => {
          const current = index === crumbs.length - 1;
          return (
            <li key={`${crumb.name}-${index}`}>
              <span className="docs-breadcrumb-sep" aria-hidden="true">
                /
              </span>
              {current || !crumb.url ? (
                <span aria-current={current ? "page" : undefined}>{crumb.name}</span>
              ) : (
                <Link href={normalizePath(crumb.url)}>{crumb.name}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function DocsPager({
  previous,
  next,
}: {
  previous?: { name: ReactNode; url: string };
  next?: { name: ReactNode; url: string };
}) {
  return (
    <nav className="docs-pager" aria-label="Documentation pagination">
      {previous ? (
        <Link
          className="docs-pager-card docs-pager-prev"
          href={normalizePath(previous.url)}
        >
          <span className="docs-pager-kicker">← Previous</span>
          <span className="docs-pager-title">{previous.name}</span>
        </Link>
      ) : (
        <span className="docs-pager-spacer" aria-hidden="true" />
      )}

      {next ? (
        <Link className="docs-pager-card docs-pager-next" href={normalizePath(next.url)}>
          <span className="docs-pager-kicker">Next →</span>
          <span className="docs-pager-title">{next.name}</span>
        </Link>
      ) : (
        <span className="docs-pager-spacer" aria-hidden="true" />
      )}
    </nav>
  );
}
