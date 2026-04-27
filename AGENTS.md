# AI Agent Pipeline

An automated, file-driven development pipeline for Lughat Al-Asl, powered by the Gemini API and GitHub Actions.

---

## How It Works

```
You push features/0001_my-feature/00_request.md to main
            │
            ▼ (automatic)
    ┌────────────────────┐
    │   Product Owner    │  writes 01_po-spec.md → opens PR
    └────────────────────┘
            │ you review & merge
            ▼ (automatic)
    ┌────────────────────┐
    │ Software Architect │  writes 02_arch-design.md → opens PR
    └────────────────────┘
            │ you review & merge
            ▼ (automatic)
    ┌────────────────────┐
    │ Software Engineer  │  writes code + Vitest tests → pnpm check:types + pnpm test → opens PR
    └────────────────────┘
            │ you review & merge
            ▼ (automatic)
    ┌────────────────────┐
    │  DevOps Engineer   │  writes 03_infra-notes.md → opens PR
    └────────────────────┘
            │ you review & merge
            ▼ (automatic)
    ┌────────────────────┐
    │   QA Engineer      │  writes Playwright .spec.ts files → e2e-test.yml validates → opens PR
    └────────────────────┘
            │ you review & merge
            ▼
        Feature complete ✅
```

### On every PR you can

- **Post a review comment** → the agent reads all your comments and pushes a revised commit automatically
- **Push directly to the branch** → edit files yourself, no workflow fires, merge when ready
- **Mix both** → use whichever is faster for each change

---

## Starting a Feature

Create a new directory under `features/` and write your request:

```
features/
  0002_content-delivery/
    00_request.md   ← you write this and push to main
```

**Naming convention:** `NNNN_kebab-case-description` — use the next sequential 4-digit number.

**What to write:** Anything. A rough paragraph, bullet points, a sketch. The PO agent will refine it into a proper spec and ask open questions in the PR if needed.

---

## Feature Directory After the Pipeline

```
features/0001_example-feature/
  00_request.md         ← your input (never modified by agents)
  01_po-spec.md         ← Product Owner output
  02_arch-design.md     ← Architect output
  03_infra-notes.md     ← DevOps output
```

Actual code and Playwright tests are written to `apps/`, `packages/`, and `packages/e2e-tests/` as normal.

---

## One-Time Setup

### 1. Add your Gemini API key as a repository secret

Go to **Settings → Secrets and variables → Actions → New repository secret**:
```
Name:  GEMINI_API_KEY
Value: your-key-here
```

Get a key at [aistudio.google.com](https://aistudio.google.com). Use **Gemini 2.5 Pro** for best results.

### 2. Set workflow permissions

Go to **Settings → Actions → General → Workflow permissions**
Select: **Read and write permissions** ✓

### 3. Create the pipeline labels

Run once from the repo root (requires `gh` CLI):

```bash
gh label create "stage:po-review"     --color "0075ca" --description "PO spec awaiting review"
gh label create "stage:arch-review"   --color "e4e669" --description "Arch design awaiting review"
gh label create "stage:eng-review"    --color "d93f0b" --description "Implementation awaiting review"
gh label create "stage:devops-review" --color "0e8a16" --description "Infra notes awaiting review"
gh label create "stage:qa-review"     --color "5319e7" --description "E2E tests awaiting review"
```

---

## Tuning Agent Behaviour

Each agent's instructions are in `.github/agents/`. Edit these files to adjust how an agent behaves — e.g. to add project-specific constraints, change output format, or tune how it approaches a particular type of feature.

| File | Agent | Stage |
|------|-------|-------|
| `.github/agents/product-owner.md` | Product Owner | 1 |
| `.github/agents/software-architect.md` | Software Architect | 2 |
| `.github/agents/software-engineer.md` | Software Engineer | 3 |
| `.github/agents/devops-engineer.md` | DevOps Engineer | 4 |
| `.github/agents/qa-engineer.md` | QA Engineer | 5 |

Every agent also reads `PROJECT_CONTEXT.md` — keep it up to date.

---

## Changing the Model

Default: `gemini-2.5-pro`

To use a different model, add a repository **variable** (not secret) under Settings → Actions:
```
Name:  GEMINI_MODEL
Value: gemini-2.0-flash
```

Flash is faster and cheaper; 2.5 Pro produces better output for complex implementation tasks.
