import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { loadHtmlTemplate } from "@/src/util/html.template.loader.util.ts";

describe("html template loader util", () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const templatesDir = path.resolve(__dirname, "../../src/templates");

  const templateName = "verification-email";
  const templatePath = path.join(templatesDir, `${templateName}.html`);

  it("should properly read and return the html if no replacements are given", async () => {
    const html = await readFile(templatePath, "utf-8");

    // @ts-expect-error okay in test and also on purpose here
    const htmlTemplateLoaderResult = await loadHtmlTemplate(templateName, {});
    expect(htmlTemplateLoaderResult).toStrictEqual(html);
  });

  it("replaces the variables with given content", async () => {
    const html = await readFile(templatePath, "utf-8");

    const replacements = {
      userName: "John Doe Test1234590",
      currentYear: new Date().getFullYear().toString(),
      verifyUrl: "https://blab.com/api/v1/users/id/SomeVerificationCode",
    };

    const htmlTemplateLoaderResult = await loadHtmlTemplate(
      templateName,
      replacements,
    );
    expect(htmlTemplateLoaderResult).not.toStrictEqual(html);

    for (const key of Object.keys(replacements)) {
      expect(htmlTemplateLoaderResult).not.toContain(`{{${key}}}`);
      expect(html).toContain(`{{${key}}}`);
    }

    for (const replacement of Object.values(replacements)) {
      expect(htmlTemplateLoaderResult).toContain(replacement);
      expect(html).not.toContain(replacement);
    }
  });
});
