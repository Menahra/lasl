/**
 * auto-translate.ts
 *
 * Detects untranslated/missing msgstr entries in target .po files
 * and fills them using a local LibreTranslate instance.
 *
 * Usage: npx ts-node scripts/auto-translate.ts
 *
 * Environment variables:
 *   LIBRETRANSLATE_URL  - defaults to http://localhost:5000/translate
 *   SOURCE_LOCALE       - defaults to "en"
 */

import * as fs from "fs";
import * as path from "path";

const LIBRETRANSLATE_URL =
  process.env.LIBRETRANSLATE_URL ?? "http://localhost:5000/translate";
const SOURCE_LOCALE = process.env.SOURCE_LOCALE ?? "en";
const TARGET_LOCALES = ["de", "fr"]; // de-DE and fr-FR folders use short codes for LibreTranslate
const LOCALE_FOLDERS = {
  en: "en-US",
  de: "de-DE",
  fr: "fr-FR",
};
const LOCALES_DIR = path.resolve(process.cwd(), "src", "locales");

// ---------------------------------------------------------------------------
// PO file parser / serialiser
// ---------------------------------------------------------------------------

function parsePo(content) {
  const entries = [];
  // Normalise line endings
  const lines = content.replace(/\r\n/g, "\n").split("\n");

  let comments = [];
  let msgid = null;
  let msgidPlural;
  let msgstr = [];
  let currentKey = null;
  let isPlural = false;

  const unquote = (s) =>
    s.replace(/^"/, "").replace(/"$/, "").replace(/\\n/g, "\n").replace(/\\"/g, '"');

  const flush = () => {
    if (msgid !== null) {
      entries.push({ comments, msgid, msgidPlural, msgstr, isPlural });
    }
    comments = [];
    msgid = null;
    msgidPlural = undefined;
    msgstr = [];
    currentKey = null;
    isPlural = false;
  };

  for (const line of lines) {
    if (line.startsWith("#")) {
      if (currentKey !== null) flush();
      comments.push(line);
    } else if (line.startsWith("msgid_plural ")) {
      msgidPlural = unquote(line.slice("msgid_plural ".length));
      currentKey = "msgid_plural";
      isPlural = true;
    } else if (line.startsWith("msgid ")) {
      flush();
      msgid = unquote(line.slice("msgid ".length));
      currentKey = "msgid";
    } else if (/^msgstr\[\d+\]/.test(line)) {
      const val = unquote(line.replace(/^msgstr\[\d+\]\s*/, ""));
      msgstr.push(val);
      currentKey = "msgstr";
      isPlural = true;
    } else if (line.startsWith("msgstr ")) {
      msgstr = [unquote(line.slice("msgstr ".length))];
      currentKey = "msgstr";
    } else if (line.startsWith('"') && currentKey) {
      const val = unquote(line);
      if (currentKey === "msgid") msgid = (msgid ?? "") + val;
      else if (currentKey === "msgid_plural") msgidPlural = (msgidPlural ?? "") + val;
      else if (currentKey === "msgstr") msgstr[msgstr.length - 1] += val;
    } else if (line.trim() === "") {
      // blank line = block separator
    }
  }
  flush();

  return entries;
}

function serialisePo(entries) {
  const escape = (s) =>
    s.replace(/"/g, '\\"').replace(/\n/g, "\\n");

  return entries
    .map((e) => {
      const parts = [];
      if (e.comments.length) parts.push(e.comments.join("\n"));
      parts.push(`msgid "${escape(e.msgid)}"`);
      if (e.isPlural && e.msgidPlural !== undefined) {
        parts.push(`msgid_plural "${escape(e.msgidPlural)}"`);
        e.msgstr.forEach((s, i) => parts.push(`msgstr[${i}] "${escape(s)}"`));
      } else {
        parts.push(`msgstr "${escape(e.msgstr[0] ?? "")}"`);
      }
      return parts.join("\n");
    })
    .join("\n\n") + "\n";
}

// ---------------------------------------------------------------------------
// LibreTranslate API
// ---------------------------------------------------------------------------

async function translateText(
  text,
  targetLang
) {
  if (!text.trim()) return text;

  const response = await fetch(LIBRETRANSLATE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: text,
      source: SOURCE_LOCALE,
      target: targetLang,
      format: "text",
    }),
  });

  if (!response.ok) {
    throw new Error(
      `LibreTranslate error ${response.status}: ${await response.text()}`
    );
  }

  const data = await response.json();
  return data.translatedText;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function processLocale(shortCode) {
  const folderName = LOCALE_FOLDERS[shortCode];
  const sourcePath = path.join(LOCALES_DIR, LOCALE_FOLDERS[SOURCE_LOCALE], "messages.po");
  const targetPath = path.join(LOCALES_DIR, folderName, "messages.po");

  if (!fs.existsSync(sourcePath)) {
    console.error(`❌  Source file not found: ${sourcePath}`);
    process.exit(1);
  }

  const sourceEntries = parsePo(fs.readFileSync(sourcePath, "utf-8"));

  // Load existing target entries (keyed by msgid)
  let existingEntries = new Map();
  if (fs.existsSync(targetPath)) {
    parsePo(fs.readFileSync(targetPath, "utf-8")).forEach((e) =>
      existingEntries.set(e.msgid, e)
    );
  } else {
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    console.log(`📁  Created directory for ${folderName}`);
  }

  // Build updated entries list, preserving order from source
  const updatedEntries = [];
  let changeCount = 0;

  for (const srcEntry of sourceEntries) {
    // Skip the PO header block (empty msgid)
    if (srcEntry.msgid === "") {
      updatedEntries.push(
        existingEntries.get("") ?? { ...srcEntry, msgstr: [srcEntry.msgstr[0] ?? ""] }
      );
      continue;
    }

    const existing = existingEntries.get(srcEntry.msgid);

    if (existing) {
      const isMissingTranslation =
        existing.msgstr.every((s) => s.trim() === "") ||
        existing.msgstr.length === 0;

      if (!isMissingTranslation) {
        // Already translated — keep as-is
        updatedEntries.push(existing);
        continue;
      }
    }

    // Needs translation
    console.log(`  🔤  Translating (${folderName}): "${srcEntry.msgid.slice(0, 60)}${srcEntry.msgid.length > 60 ? "…" : ""}"`);

    try {
      if (srcEntry.isPlural && srcEntry.msgidPlural) {
        const singular = await translateText(srcEntry.msgid, shortCode);
        const plural = await translateText(srcEntry.msgidPlural, shortCode);
        updatedEntries.push({
          ...srcEntry,
          msgstr: [singular, plural],
        });
      } else {
        const translated = await translateText(srcEntry.msgid, shortCode);
        updatedEntries.push({ ...srcEntry, msgstr: [translated] });
      }
      changeCount++;
    } catch (err) {
      console.error(`  ⚠️  Failed to translate "${srcEntry.msgid}": ${err}`);
      updatedEntries.push({ ...srcEntry, msgstr: [""] }); // leave blank on error
    }
  }

  if (changeCount === 0) {
    console.log(`  ✅  ${folderName}: nothing to update`);
    return false;
  }

  fs.writeFileSync(targetPath, serialisePo(updatedEntries), "utf-8");
  console.log(`  💾  ${folderName}: wrote ${changeCount} new translation(s) → ${targetPath}`);
  return true;
}

async function main() {
  console.log("🌍  Auto-translate starting…");
  console.log(`    Source locale : ${SOURCE_LOCALE}`);
  console.log(`    Target locales: ${TARGET_LOCALES.map((l) => LOCALE_FOLDERS[l]).join(", ")}`);
  console.log(`    LibreTranslate: ${LIBRETRANSLATE_URL}\n`);

  let anyChanges = false;
  for (const locale of TARGET_LOCALES) {
    const changed = await processLocale(locale);
    if (changed) anyChanges = true;
  }

  if (!anyChanges) {
    console.log("\n✅  All translations are up to date. No changes made.");
  } else {
    console.log("\n✅  Translation complete.");
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});