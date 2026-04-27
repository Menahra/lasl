#!/usr/bin/env node
/**
 * run-engineer.mjs
 *
 * Calls Gemini to implement a feature (or write E2E tests for the QA stage).
 * Reads the PO spec + arch design + relevant existing source files, asks Gemini
 * to return a structured JSON list of file changes, and applies them.
 *
 * Environment variables (all required):
 *   GEMINI_API_KEY    — Gemini API key
 *   FEATURE_DIR       — e.g. features/0001_registration-flow
 *   FEATURE_ID        — e.g. 0001
 *   FEATURE_SLUG      — e.g. registration-flow
 *
 * Optional:
 *   GEMINI_MODEL          — defaults to gemini-2.5-pro
 *   CONTEXT_FILE          — defaults to PROJECT_CONTEXT.md
 *   SUMMARY_FILE          — where to write PR summary, defaults to /tmp/eng-summary.md
 *   AGENT_ROLE_OVERRIDE   — override the agent role file (used by QA stage)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname } from 'path';

const {
  GEMINI_API_KEY,
  FEATURE_DIR,
  FEATURE_ID,
  FEATURE_SLUG,
  GEMINI_MODEL = 'gemini-2.5-pro',
  CONTEXT_FILE = 'PROJECT_CONTEXT.md',
  SUMMARY_FILE = '/tmp/eng-summary.md',
  AGENT_ROLE_OVERRIDE,
} = process.env;

function exit(msg) { console.error(`❌ ${msg}`); process.exit(1); }

if (!GEMINI_API_KEY) exit('GEMINI_API_KEY is not set');
if (!FEATURE_DIR)    exit('FEATURE_DIR is not set');
if (!FEATURE_ID)     exit('FEATURE_ID is not set');
if (!FEATURE_SLUG)   exit('FEATURE_SLUG is not set');

function readFile(path, fallback = '') {
  if (!existsSync(path)) return fallback;
  return readFileSync(path, 'utf8');
}

// ── Determine agent role ───────────────────────────────────────────────────

const roleFile = AGENT_ROLE_OVERRIDE || '.github/agents/software-engineer.md';
const roleInstructions = readFile(roleFile);
if (!roleInstructions) exit(`Agent role file not found: ${roleFile}`);

// ── Gather inputs ──────────────────────────────────────────────────────────

const projectContext = readFile(CONTEXT_FILE);
const poSpec         = readFile(`${FEATURE_DIR}/01_po-spec.md`);
const archDesign     = readFile(`${FEATURE_DIR}/02_arch-design.md`);

if (!poSpec)     exit(`PO spec not found at ${FEATURE_DIR}/01_po-spec.md`);
if (!archDesign) exit(`Arch design not found at ${FEATURE_DIR}/02_arch-design.md`);

// Extract file paths from arch design to use as additional context.
// Matches paths like `apps/frontend/src/...`, `packages/app-contracts/src/...`
const mentionedFiles = [
  ...archDesign.matchAll(/`((?:apps|packages)\/[^\s`]+\.[a-z]+)`/g)
].map(m => m[1])
  .filter((v, i, a) => a.indexOf(v) === i) // unique
  .slice(0, 25); // cap at 25 files

const existingFileSections = mentionedFiles
  .filter(f => existsSync(f))
  .map(f => `### Existing file: ${f}\n\`\`\`typescript\n${readFile(f)}\n\`\`\``)
  .join('\n\n');

// ── Build prompt ───────────────────────────────────────────────────────────

const prompt = `
${roleInstructions}

---

# Project Context

${projectContext}

---

# Feature Inputs

## PO Spec (${FEATURE_DIR}/01_po-spec.md)
${poSpec}

---

## Architecture Design (${FEATURE_DIR}/02_arch-design.md)
${archDesign}

---

## Existing Source Files (for context)
${existingFileSections || '(no existing files listed in the arch design were found on disk)'}

---

# Output Format

You MUST return a single valid JSON object and nothing else — no markdown, no preamble, no explanation.

The JSON must follow this exact schema:
{
  "summary": "Brief description of what was implemented (2–3 sentences)",
  "acceptance_criteria_coverage": [
    { "criterion": "AC-1: ...", "implemented_in": "apps/..." }
  ],
  "files": [
    {
      "path": "apps/authentication-service/src/service/example.service.ts",
      "action": "create",
      "content": "// full file content here"
    },
    {
      "path": "apps/frontend/src/api/exampleApi.ts",
      "action": "modify",
      "content": "// complete new file content (full file, not a diff)"
    },
    {
      "path": "apps/authentication-service/src/old/obsolete.ts",
      "action": "delete",
      "content": ""
    }
  ],
  "notes_for_reviewer": "Anything non-obvious, trade-offs, deviations from arch doc, or bugs found"
}

Rules for the files array:
- For "create" and "modify": content must be the COMPLETE file content, not a snippet or diff.
- For "delete": content must be an empty string.
- Include all test files (*.test.ts, *.spec.ts).
- Include updates to PROJECT_CONTEXT.md section 5/6 if new env vars were added.
- Do NOT include binary files, pnpm-lock.yaml, or generated files (routeTree.gen.ts, *.po compiled).
- File paths must be relative to the repo root (e.g. apps/frontend/src/..., not ./src/...).
`.trim();

// ── Call Gemini ────────────────────────────────────────────────────────────

console.log(`🤖 Calling ${GEMINI_MODEL} (role: ${roleFile})...`);

const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const response = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 32768,
      responseMimeType: 'application/json',
    },
  }),
});

if (!response.ok) {
  const body = await response.text();
  exit(`Gemini API returned ${response.status}: ${body}`);
}

const data = await response.json();
const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
if (!rawText) exit(`No content in Gemini response: ${JSON.stringify(data, null, 2)}`);

// ── Parse and apply ────────────────────────────────────────────────────────

let result;
try {
  const jsonText = rawText.replace(/^```(?:json)?\n/, '').replace(/\n```$/, '').trim();
  result = JSON.parse(jsonText);
} catch (e) {
  exit(`Failed to parse Gemini response as JSON: ${e.message}\n\nFirst 500 chars:\n${rawText.slice(0, 500)}`);
}

const { files = [], summary = '', acceptance_criteria_coverage = [], notes_for_reviewer = '' } = result;

console.log(`📦 Applying ${files.length} file changes...`);

for (const { path, action, content } of files) {
  if (!path) { console.warn('⚠️  Skipping entry with no path'); continue; }

  if (action === 'delete') {
    console.log(`  🗑  delete: ${path}`);
    const existing = existsSync('/tmp/files-to-delete.txt') ? readFile('/tmp/files-to-delete.txt') : '';
    writeFileSync('/tmp/files-to-delete.txt', existing + path + '\n');
    continue;
  }

  const dir = dirname(path);
  if (dir && dir !== '.') mkdirSync(dir, { recursive: true });
  writeFileSync(path, content, 'utf8');
  console.log(`  ✅ ${action}: ${path}`);
}

// ── Write PR summary ───────────────────────────────────────────────────────

const criteriaRows = acceptance_criteria_coverage
  .map(c => `| ${c.criterion} | \`${c.implemented_in}\` |`)
  .join('\n');

const prSummary = `### What was implemented
${summary}

### Acceptance criteria coverage
| Criterion | File |
|-----------|------|
${criteriaRows || '| (see implementation) | — |'}

### Notes for reviewer
${notes_for_reviewer || 'None.'}
`;

writeFileSync(SUMMARY_FILE, prSummary, 'utf8');
console.log(`\n✅ Done. PR summary written to ${SUMMARY_FILE}`);
