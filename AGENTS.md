# AI Agent Pipeline

An automated, file-driven development pipeline for Lughat Al-Asl, powered by Jules (Gemini 3 Pro) and GitHub Actions.

---

## How It Works

```
You push features/0001_my-feature/00_request.md to a feature/* branch
            │
            ▼ (automatic — push trigger on 00_request.md)
    ┌────────────────────┐
    │   Product Owner    │  writes 01_po-spec.md → opens PR
    └────────────────────┘
            │ you review & merge
            ▼ (automatic — 01_po-spec.md appears on branch)
    ┌────────────────────┐
    │  UI/UX Designer    │  writes HTML mockups + screenshots → opens PR
    └────────────────────┘
            │ you review & merge
            ▼ (automatic — 02_design/00_design-notes.md appears on branch)
    ┌────────────────────┐
    │ Software Architect │  reads spec + mockups → writes 03_arch-design.md → opens PR
    └────────────────────┘
            │ you review & merge
            ▼ (automatic — 03_arch-design.md appears on branch)
    ┌────────────────────┐
    │ Software Engineer  │  implements feature → runs checks → writes 04_eng-notes.md → opens PR
    └────────────────────┘
            │ you review & merge
            ▼ (automatic — 04_eng-notes.md appears on branch)
    ┌────────────────────┐
    │  DevOps Engineer   │  writes 05_infra-notes.md → opens PR
    └────────────────────┘
            │ you review & merge
            ▼ (automatic — 05_infra-notes.md appears on branch)
    ┌────────────────────┐
    │   QA Engineer      │  writes Playwright .spec.ts files → opens PR
    └────────────────────┘
            │ you review & merge
            ▼
    Open final PR: feature/* → main ✅
```

### How the chain advances

Each stage triggers the next by file presence — no labels needed. When you merge a Jules PR
into the feature branch, the output file lands on the branch and GitHub fires a push event,
which triggers the next stage automatically.

| Stage | Watches for | Produces |
|-------|-------------|----------|
| 1 PO | `features/*/00_request.md` (you push) | `01_po-spec.md` |
| 2 UI/UX | `features/*/01_po-spec.md` | `02_design/00_design-notes.md` |
| 3 Architect | `features/*/02_design/00_design-notes.md` | `03_arch-design.md` |
| 4 Engineer | `features/*/03_arch-design.md` | code + `04_eng-notes.md` |
| 5 DevOps | `features/*/04_eng-notes.md` | `05_infra-notes.md` |
| 6 QA | `features/*/05_infra-notes.md` | `packages/e2e-tests/tests/…` |

Each workflow run completes in under 10 seconds — it fires Jules and exits immediately.
Jules takes however long it needs and opens a PR when done. There is no polling or timeout.

### On every PR you can

- **Post a review comment** → Jules reads it and pushes a revision commit to the same branch automatically
- **Push directly to the Jules branch** → edit files yourself, merge when ready
- **Mix both** → use whichever is faster for each change

Jules listens for comments natively via the Jules GitHub App. By default it reacts to all review comments. If you want it to only act when you explicitly write `@jules`, switch it to **Reactive Mode** in your [Jules UI settings](https://jules.google.com) under Pull Request.

### If a stage is skipped

If a stage fails to trigger automatically (e.g. you pushed a revision to a trigger file rather
than creating it fresh), use the manual fallback:

1. Go to **Actions → [the stage's workflow] → Run workflow**
2. Select your feature branch from the dropdown
3. Click **Run workflow** — no inputs needed

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
  00_request.md              ← your input (never modified by agents)
  01_po-spec.md              ← Product Owner output
  02_design/
    00_design-notes.md       ← UI/UX Designer: screen inventory and decisions
    01_screen-name.html      ← mockup
    01_screen-name.png       ← screenshot (visible inline on the PR)
    …
  03_arch-design.md          ← Architect output
  04_eng-notes.md            ← Engineer: implementation summary (pipeline sentinel)
  05_infra-notes.md          ← DevOps output (pipeline sentinel)
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

### 2. Install the Jules GitHub App

Go to [jules.google.com](https://jules.google.com) and install the GitHub App on your repository.
Without this step, Jules cannot clone your repo or open PRs.

### 3. Set workflow permissions

Go to **Settings → Actions → General → Workflow permissions**
Select: **Read and write permissions** ✓

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
