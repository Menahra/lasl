import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isRunningFromDist = path.basename(__dirname) === "dist";

const templatesPath = path.resolve(
  __dirname,
  isRunningFromDist ? "./templates" : "../templates",
);

type AvailableHtmlTemplateDataMap = {
  "verification-email": {
    userName: string;
    currentYear: string;
    verifyUrl: string;
  };
  "password-reset-unverified-email": {
    userName: string;
    currentYear: string;
    verifyUrl: string;
  };
  "password-reset-email": {
    userName: string;
    currentYear: string;
    resetPasswordUrl: string;
  };
};

export const loadHtmlTemplate = async <
  T extends keyof AvailableHtmlTemplateDataMap,
>(
  templateName: T,
  variables: AvailableHtmlTemplateDataMap[T],
) => {
  const templatePath = path.join(templatesPath, `${templateName}.html`);

  let html = await readFile(templatePath, "utf-8");

  for (const [key, value] of Object.entries(variables)) {
    const pattern = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    html = html.replace(pattern, value);
  }

  return html;
};
