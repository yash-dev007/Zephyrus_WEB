import type { Folder, Item, Node, Root } from "fumadocs-core/page-tree";
import { findNeighbour, findPath, getPageTreeRoots } from "fumadocs-core/page-tree";

export type DocVersion = {
  id: string;
  name: string;
  baseUrl: string;
  root?: Folder;
};

export type DocCrumb = {
  name: string;
  url?: string;
};

const CURRENT_VERSION_ID = "next";

export function normalizePath(path: string): string {
  if (!path) return "/";
  const withLeading = path.startsWith("/") ? path : `/${path}`;
  return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
}

export function getDocVersions(tree: Root): DocVersion[] {
  const versions: DocVersion[] = [
    {
      id: CURRENT_VERSION_ID,
      name: "Next",
      baseUrl: "/docs",
    },
  ];

  for (const node of getPageTreeRoots(tree)) {
    if (node === tree || node.type !== "folder" || !node.root) continue;

    const segment = node.$ref?.folder.split("/").filter(Boolean).at(-1);
    if (!segment) continue;

    versions.push({
      id: segment,
      name: typeof node.name === "string" && node.name ? node.name : segment,
      baseUrl: `/docs/${segment}`,
      root: node,
    });
  }

  return versions;
}

export function getActiveVersion(pathname: string, versions: DocVersion[]): DocVersion {
  const path = normalizePath(pathname);

  return (
    [...versions]
      .sort((a, b) => b.baseUrl.length - a.baseUrl.length)
      .find((version) => {
        const base = normalizePath(version.baseUrl);
        return path === base || path.startsWith(base);
      }) ?? versions[0]!
  );
}

export function getSidebarTree(tree: Root, version: DocVersion): Root {
  if (version.root) {
    const index = version.root.index;
    const children = [...version.root.children];
    const hasIndex =
      index !== undefined &&
      children.some((child) => child.type === "page" && child.url === index.url);

    return {
      type: "root",
      name: version.root.name,
      children: index && !hasIndex ? [index, ...children] : children,
    };
  }

  return {
    type: "root",
    name: tree.name,
    children: tree.children.filter((child) => !(child.type === "folder" && child.root)),
  };
}

export function getBreadcrumbs(tree: Root, url: string): DocCrumb[] {
  const path = findPath(
    tree.children,
    (node) => node.type === "page" && node.url === url,
  );

  if (!path) return [];

  return path.flatMap<DocCrumb>((node) => {
    if (node.type === "page") {
      return [{ name: nodeName(node.name), url: node.url }];
    }

    if (node.type === "folder") {
      return [
        {
          name: nodeName(node.name),
          url: node.index?.url,
        },
      ];
    }

    return [];
  });
}

export function getPrevNext(tree: Root, url: string) {
  return findNeighbour(tree, url, { separateRoot: true });
}

export function getVersionHref(
  pathname: string,
  current: DocVersion,
  target: DocVersion,
  knownUrls: string[],
): string {
  if (current.id === target.id) return normalizePath(pathname);

  const path = normalizePath(pathname);
  const currentBase = normalizePath(current.baseUrl);
  const relative =
    path === currentBase ? "" : path.slice(currentBase.length).replace(/\/$/, "");

  const targetBase = target.baseUrl.replace(/\/$/, "");
  const candidate = normalizePath(relative ? `${targetBase}/${relative}` : targetBase);

  if (knownUrls.includes(candidate)) return candidate;
  return normalizePath(target.baseUrl);
}

export function collectPageUrls(tree: Root): string[] {
  const urls: string[] = [];

  const walk = (nodes: Node[]) => {
    for (const node of nodes) {
      if (node.type === "page") {
        urls.push(normalizePath(node.url));
      } else if (node.type === "folder") {
        if (node.index) urls.push(normalizePath(node.index.url));
        walk(node.children);
      }
    }
  };

  walk(tree.children);
  return urls;
}

export function pageMatchesPath(pageUrl: string, pathname: string): boolean {
  return normalizePath(pageUrl) === normalizePath(pathname);
}

export function formatDocDate(date: Date | undefined): string | undefined {
  if (!date) return undefined;
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function nodeName(name: Item["name"]): string {
  return typeof name === "string" ? name : "";
}
