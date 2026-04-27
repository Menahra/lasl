#!/usr/bin/env node
/**
 * revise-from-comments.mjs
 *
 * Called when a human posts a review comment on an agent PR.
 * Reads the current file + all unresolved review comments, asks Gemini
 * to produce a revised version, and writes it back.
 *
 * Environment variables (all required):
 *   GEMINI_API_KEY   — Gemini API key
 *   CURRENT_FILE     — path to the file being revised
 *   AGENT_ROLE_FILE  — the agent role file (for revision context)
 *   COMMENTS_JSON    — JSON string: array of {author, body, path, line}
 *
 * Optional:
 *   GEMINI_MODEL     — defaults to gemini-2.5-pro
 *   CONTEXT_FILE     — defaults to PROJECT_CONTEXT.md
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';

const {
  GEMINI_API_KEY,
  CURRENT_FILE,
  AGENT_ROLE_FILE,
  COMMENTS_JSON,
  GEMINI_MODEL = 'gemini-2.5-pro',
  CONTEXT_FILE = 'PROJECT_CONTEXT.md',
} = process.env;

function exit(msg) { console.error(`❌ ${msg}`); process.exit(1); }

if (!GEMINI_API_KEY)  exit('GEMINI_API_KEY is not set');
if (!CURRENT_FILE)    exit('CURRENT_FILE is not set');
if (!AGENT_ROLE_FILE) exit('AGENT_ROLE_FILE is not set');
if (!COMMENTS_JSON)   exit('COMMENTS_JSON is not set');

function readFile(path, fallback = '') {
  return existsSync(path) ? readFileSync(path, 'utf8') : fallback;
}

const currentContent   = readFile(CURRENT_FILE);
const roleInstructions = readFile(AGENT_ROLE_FILE);
const projectContext   = readFile(CONTEXT_FILE);

let comments;
try {
  comments = JSON.parse(COMMENTS_JSON);
} catch (e) {
  exit(`Failed to parse COMMENTS_JSON: ${e.message}`);
}

const commentsList = comments
  .map((c, i) => `**Comment ${i + 1}** by @${c.author}${c.path ? ` on \`${c.path}\`` : ''}:\n> ${c.body}`)
  .join('\n\n');

const prompt = `
You are revising a document based on review feedback from the repository owner.

# Your Original Role
${roleInstructions}

# Project Context
${projectContext}

---

# Current Document (${CURRENT_FILE})

${currentContent}

---

# Review Comments to Address

${commentsList}

---

# Instructions

Produce a revised version of the document that addresses ALL of the review comments above.

Rules:
- Address every comment. If a comment is a question, answer it inline in the document.
- Preserve all sections and content that were NOT mentioned in the comments.
- Do NOT add a "Changes made" section or meta-commentary about what you changed.
- Output ONLY the revised document content — no preamble, no explanation, no code fences.
- Start directly with the first line of the revised document.
`.trim();

console.log(`🤖 Calling ${GEMINI_MODEL} to revise ${CURRENT_FILE} based on ${comments.length} comment(s)...`);

const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const response = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.2, maxOutputTokens: 16384 },
  }),
});

if (!response.ok) {
  const body = await response.text();
  exit(`Gemini API returned ${response.status}: ${body}`);
}

const data = await response.json();
const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
if (!text) exit(`No content in Gemini response: ${JSON.stringify(data, null, 2)}`);

const cleaned = text.replace(/^```(?:markdown)?\n/, '').replace(/\n```$/, '').trim();
writeFileSync(CURRENT_FILE, cleaned + '\n', 'utf8');
console.log(`✅ ${CURRENT_FILE} revised (${cleaned.length} chars)`);
