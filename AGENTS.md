# AI Agent Pipeline

An automated, file-driven development pipeline for Lughat Al-Asl, powered by Jules (Gemini 3 Pro) and GitHub Actions.

---

## How It Works

```
You push features/0001_my-feature/00_request.md to a feature/* branch
            │
            ▼ (automatic)
    ┌────────────────────┐
    │   Product Owner    │  writes 01_po-spec.md → opens PR
    └────────────────────┘
            │ you review & merge
            ▼ (automatic)
    ┌────────────────────┐
    │  UI/UX Designer    │  writes HTML mockups → screenshots with Playwright → opens PR
    └────────────────────┘
            │ you review & merge
            ▼ (automatic)
    ┌────────────────────┐
    │ Software Architect │  reads spec + mockups → writes 02_arch-design.md → opens PR
    └────────────────────┘
            │ you review & merge
            ▼ (automatic)
    ┌────────────────────┐
    │ Software Engineer  │  implements feature → runs type check + tests → opens PR
    └────────────────────┘
            │ you review & merge
            ▼ (automatic)
    ┌────────────────────┐
    │  DevOps Engineer   │  writes 03_infra-notes.md → opens PR
    └────────────────────┘
            │ you review & merge
            ▼ (automatic)
    ┌────────────────────┐
    │   QA Engineer      │  writes Playwright .spec.ts files → opens PR
    └────────────────────┘
            │ you review & merge
            ▼
    Open final PR: feature/* → main ✅
```

### On every PR you can

- **Post a review comment** → Jules re-runs with your feedback, opens a fresh revised PR, and closes the old one automatically
- **Push directly to the Jules branch** → edit files yourself, no workflow fires, merge when ready
- **Mix both** → use whichever is faster for each change

---

## Starting a Feature

1. Create a `feature/*` branch: `git checkout -b feature/0002-content-delivery`
2. Create the feature directory and write your request:

```
features/
  0002_content-delivery/
    00_request.md   ← you write this and push to the feature branch
```

**Naming convention:** `NNNN_kebab-case-description` — use the next sequential 4-digit number.

**What to write in `00_request.md`:** Anything. A rough paragraph, bullet points, user stories. The PO agent will refine it into a proper spec.

---

## Feature Directory After the Pipeline

```
features/0001_example-feature/
  00_request.md           ← your input (never modified by agents)
  01_po-spec.md           ← Product Owner output
  design/
    00_design-notes.md    ← UI/UX Designer: screen inventory and decisions
    01_screen-name.html   ← mockup
    01_screen-name.png    ← screenshot (visible inline on the PR)
    …
  02_arch-design.md       ← Architect output
  03_infra-notes.md       ← DevOps output
```

Actual code and Playwright tests are written to `apps/`, `packages/`, and `packages/e2e-tests/` as normal.

---

## One-Time Setup

### 1. Add your Jules API key as a repository secret

Go to **Settings → Secrets and variables → Actions → New repository secret**:
```
Name:  JULES_API_KEY
Value: your-key-here
```

Get a key at [jules.google.com → Settings → API](https://jules.google.com/settings#api).
Requires a Jules Pro plan (Google AI Pro via [one.google.com/ai](https://one.google.com/ai)) — currently only available on personal @gmail.com accounts.

### 2. Set workflow permissions

Go to **Settings → Actions → General → Workflow permissions**
Select: **Read and write permissions** ✓

### 3. Create the pipeline labels

Run once from the repo root (requires `gh` CLI):

```bash
gh label create "stage:po-review"     --color "0075ca" --description "PO spec awaiting review"
gh label create "stage:ui-review"     --color "f9d0c4" --description "UI mockups awaiting review"
gh label create "stage:arch-review"   --color "e4e669" --description "Arch design awaiting review"
gh label create "stage:eng-review"    --color "d93f0b" --description "Implementation awaiting review"
gh label create "stage:devops-review" --color "0e8a16" --description "Infra notes awaiting review"
gh label create "stage:qa-review"     --color "5319e7" --description "E2E tests awaiting review"
```

---

## Tuning Agent Behaviour

Each agent's instructions are in `.github/agents/`. Edit these files to adjust how an agent behaves.

| File | Agent | Stage |
|------|-------|-------|
| `.github/agents/product-owner.md` | Product Owner | 1 |
| `.github/agents/ui-ux-designer.md` | UI/UX Designer | 2 |
| `.github/agents/software-architect.md` | Software Architect | 3 |
| `.github/agents/software-engineer.md` | Software Engineer | 4 |
| `.github/agents/devops-engineer.md` | DevOps Engineer | 5 |
| `.github/agents/qa-engineer.md` | QA Engineer | 6 |

Every agent also reads `PROJECT_CONTEXT.md` — keep it up to date.
