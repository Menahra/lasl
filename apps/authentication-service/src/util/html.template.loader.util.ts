import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type AvailableHtmlTemplates = "verification-email";

export const loadHtmlTemplate = async (
  templateName: AvailableHtmlTemplates,
  variables: Record<string, string>,
) => {
  const templatePath = path.join(
    __dirname,
    "..",
    "templates",
    `${templateName}.html`,
  );

  let html = await readFile(templatePath, "utf-8");

  for (const [key, value] of Object.entries(variables)) {
    const pattern = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    html = html.replace(pattern, value);
  }

  return html;
};
