#!/usr/bin/env node
/**
 * run-agent.mjs
 *
 * Calls the Gemini API with a structured prompt assembled from:
 *   - An agent role file (.github/agents/*.md)
 *   - The project context (PROJECT_CONTEXT.md)
 *   - One or more input files (previous stage outputs)
 *
 * Writes the raw markdown response to an output file.
 *
 * Environment variables (all required):
 *   GEMINI_API_KEY    — Gemini API key
 *   AGENT_ROLE_FILE   — path to the agent's role/instruction file
 *   INPUT_FILES       — comma-separated list of input file paths
 *   OUTPUT_FILE       — path to write the agent's output
 *   FEATURE_ID        — e.g. "0001"
 *   FEATURE_SLUG      — e.g. "registration-flow"
 *
 * Optional:
 *   GEMINI_MODEL      — defaults to gemini-2.5-pro
 *   CONTEXT_FILE      — defaults to PROJECT_CONTEXT.md
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';

const {
  GEMINI_API_KEY,
  AGENT_ROLE_FILE,
  INPUT_FILES,
  OUTPUT_FILE,
  FEATURE_ID,
  FEATURE_SLUG,
  GEMINI_MODEL = 'gemini-2.5-pro',
  CONTEXT_FILE = 'PROJECT_CONTEXT.md',
} = process.env;

if (!GEMINI_API_KEY) exit('GEMINI_API_KEY is not set');
if (!AGENT_ROLE_FILE) exit('AGENT_ROLE_FILE is not set');
if (!INPUT_FILES)     exit('INPUT_FILES is not set');
if (!OUTPUT_FILE)     exit('OUTPUT_FILE is not set');

function exit(msg) {
  console.error(`❌ ${msg}`);
  process.exit(1);
}

function readFile(path, label) {
  if (!existsSync(path)) {
    console.warn(`⚠️  File not found, skipping: ${path}`);
    return `<!-- ${label} not found at ${path} -->`;
  }
  return readFileSync(path, 'utf8');
}

// ── Assemble prompt ────────────────────────────────────────────────────────

const roleInstructions = readFile(AGENT_ROLE_FILE, 'Agent role file');
const projectContext   = readFile(CONTEXT_FILE, 'Project context');

const inputSections = INPUT_FILES.split(',')
  .map(f => f.trim())
  .filter(Boolean)
  .map(f => {
    const content = readFile(f, f);
    return `### ${f}\n\n${content}`;
  })
  .join('\n\n---\n\n');

const prompt = `
${roleInstructions}

---

# Project Context

${projectContext}

---

# Your Inputs

Feature ID: ${FEATURE_ID}
Feature slug: ${FEATURE_SLUG}

${inputSections}

---

# Output Instructions

Produce ONLY the markdown content for the output file described in your role instructions above.
- Do NOT wrap the output in a code fence.
- Do NOT add any preamble like "Here is the spec:" or "Sure, here's...".
- Start directly with the first line of the markdown document.
- The output will be committed as-is to the repository.
`.trim();

// ── Call Gemini ────────────────────────────────────────────────────────────

console.log(`🤖 Calling ${GEMINI_MODEL} as ${AGENT_ROLE_FILE}...`);

const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const response = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 16384,
    },
  }),
});

if (!response.ok) {
  const body = await response.text();
  exit(`Gemini API returned ${response.status}: ${body}`);
}

const data = await response.json();
const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

if (!text) {
  exit(`No content in Gemini response: ${JSON.stringify(data, null, 2)}`);
}

// Strip accidental wrapping code fence if the model added one
const cleaned = text.replace(/^```(?:markdown)?\n/, '').replace(/\n```$/, '').trim();

writeFileSync(OUTPUT_FILE, cleaned + '\n', 'utf8');
console.log(`✅ Output written to ${OUTPUT_FILE} (${cleaned.length} chars)`);
