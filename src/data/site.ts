export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const siteConfig = {
  name: "Zephyrus",
  title: "Zephyrus — Local-first AI harness",
  description:
    "Zephyrus is a local-first AI harness that unites agents, memory, RAG, research, email and tools in one self-hosted FastAPI workspace.",
  shortDescription: "A self-hosted AI workspace for agents, memory and research.",
  version: "1.0.1",
  license: "AGPL-3.0",
  copyrightYear: 2026,
  tagline: "Think · Explore · Create · Beyond",
  url: siteUrl,
  github: "https://github.com/yash-dev007/Zephyrus",
  docs: "/docs/",
  releases: "https://github.com/yash-dev007/Zephyrus/releases",
  issues: "https://github.com/yash-dev007/Zephyrus/issues",
  readme: "https://github.com/yash-dev007/Zephyrus/blob/main/README.md",
  roadmap: "https://github.com/yash-dev007/Zephyrus/blob/main/ROADMAP.md",
  security: "https://github.com/yash-dev007/Zephyrus/blob/main/SECURITY.md",
  licenseUrl: "https://github.com/yash-dev007/Zephyrus/blob/main/LICENSE",
  contributing: "https://github.com/yash-dev007/Zephyrus/blob/main/CONTRIBUTING.md",
  credits: "https://github.com/yash-dev007/Zephyrus/blob/main/ACKNOWLEDGMENTS.md",
  moduleCount: 16,
  providerCount: 13,
  providerSuffix: "+",
} as const;

export type SectionId = "home" | "manifesto" | "trust";

export type NavItem =
  | {
      key: string;
      label: string;
      href: string;
      kind: "section";
      sectionId: SectionId;
    }
  | {
      key: string;
      label: string;
      href: string;
      kind: "route";
    }
  | {
      key: string;
      label: string;
      href: string;
      kind: "external";
    };

export const navItems: ReadonlyArray<NavItem> = [
  { key: "home", label: "Home", href: "#home", kind: "section", sectionId: "home" },
  {
    key: "manifesto",
    label: "Overview",
    href: "#manifesto",
    kind: "section",
    sectionId: "manifesto",
  },
  { key: "trust", label: "Modules", href: "#trust", kind: "section", sectionId: "trust" },
  { key: "docs", label: "Docs", href: siteConfig.docs, kind: "route" },
];

export const coreStack = ["FastAPI", "Ollama", "ChromaDB", "SearXNG"] as const;

export type IconName =
  | "chat"
  | "memory"
  | "research"
  | "email"
  | "calendar"
  | "tasks"
  | "documents"
  | "tools"
  | "cookbook";

export const heroMarks: ReadonlyArray<{ label: string; icon: IconName }> = [
  { label: "Chat", icon: "chat" },
  { label: "Memory", icon: "memory" },
  { label: "Research", icon: "research" },
  { label: "Email", icon: "email" },
  { label: "Calendar", icon: "calendar" },
  { label: "Cookbook", icon: "cookbook" },
];

export const moduleHighlights: ReadonlyArray<{ label: string; icon: IconName }> = [
  { label: "Chat", icon: "chat" },
  { label: "Memory", icon: "memory" },
  { label: "Research", icon: "research" },
  { label: "Email", icon: "email" },
  { label: "Calendar", icon: "calendar" },
  { label: "Tasks", icon: "tasks" },
  { label: "Documents", icon: "documents" },
  { label: "MCP tools", icon: "tools" },
];

export const localRuntimes = [
  "Ollama",
  "vLLM",
  "SGLang",
  "llama.cpp",
  "LM Studio",
  "Any endpoint",
] as const;

export const cloudProviders =
  "Plus Anthropic, Gemini, Groq, xAI, OpenRouter, OpenAI and DeepSeek.";

export const quickstartCommands = [
  "git clone https://github.com/yash-dev007/Zephyrus",
  "cd zephyrus && cp .env.example .env",
  "docker compose up -d --build",
] as const;

export const quickstartUrl = "http://localhost:7000";

export type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type FooterColumn = {
  title: string;
  links: ReadonlyArray<FooterLink>;
};

export const footerColumns: ReadonlyArray<FooterColumn> = [
  {
    title: "Product",
    links: [
      { label: "Overview", href: "#manifesto" },
      { label: "Modules", href: "#trust" },
      { label: "Releases", href: siteConfig.releases, external: true },
      { label: "Setup guide", href: siteConfig.docs },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "README", href: siteConfig.readme, external: true },
      { label: "Roadmap", href: siteConfig.roadmap, external: true },
      { label: "Security", href: siteConfig.security, external: true },
      { label: "License", href: siteConfig.licenseUrl, external: true },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "GitHub", href: siteConfig.github, external: true },
      { label: "Issues", href: siteConfig.issues, external: true },
      { label: "Contributing", href: siteConfig.contributing, external: true },
      { label: "Credits", href: siteConfig.credits, external: true },
    ],
  },
];

export const statementLines = [
  ["Zephyrus", "is", "a", "self-hosted", "AI", "harness"],
  ["that", "unites", "agents,", "memory,", "research,"],
  ["tools", "and", "models", "in", "one", "workspace."],
  ["Your", "data", "stays", "home.", "Your", "models"],
  ["stay", "yours.", "Your", "agents", "stay", "on", "task."],
] as const;
