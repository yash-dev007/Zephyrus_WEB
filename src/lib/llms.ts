import { llms } from "fumadocs-core/source/llms";
import { source } from "./source";

export const docsLlms = llms(source, {
  renderPage: async (page) =>
    `# ${page.data.title} (${page.url})\n\n${await page.data.getText("processed")}`,
});
