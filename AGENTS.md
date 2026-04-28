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
    │ Software Architect │  writes 03_arch-design.md → opens PR
    └────────────────────┘
            │ you review & merge
            ▼ (automatic — 03_arch-design.md appears on branch)
    ┌─────────────────────────┐
    │  Contracts Engineer     │  updates packages/app-contracts/ → builds → opens PR
    └─────────────────────────┘
            │ you review & merge
            ▼ (automatic — 04_contracts-notes.md appears on branch)
    ┌─────────────────────────┐
    │  Backend Engineer       │  implements authentication-service → tests → opens PR
    └─────────────────────────┘
            │ you review & merge
            ▼ (automatic — 05_backend-notes.md appears on branch)
    ┌─────────────────────────┐
    │  Frontend Engineer      │  implements apps/frontend/ → tests → opens PR
    └─────────────────────────┘
            │ you review & merge
            ▼ (automatic — 06_frontend-notes.md appears on branch)
    ┌────────────────────┐
    │  DevOps Engineer   │  writes 07_infra-notes.md → opens PR
    └────────────────────┘
            │ you review & merge
            ▼ (automatic — 07_infra-notes.md appears on branch)
    ┌────────────────────┐
    │   QA Engineer      │  writes Playwright .spec.ts files → opens PR
    └────────────────────┘
            │ you review & merge
            ▼
    Open final PR: feature/* → main ✅
```

### How the chain advances

Each stage triggers the next by file presence — no labels needed. When you merge a Jules PR
into the feature branch, the output file lands on the branch and GitHub fires a push event
that triggers the next stage automatically.

| Stage | Watches for | Produces |
|-------|-------------|----------|
| 1 PO | `features/*/00_request.md` | `01_po-spec.md` |
| 2 UI/UX | `features/*/01_po-spec.md` | `02_design/00_design-notes.md` |
| 3 Architect | `features/*/02_design/00_design-notes.md` | `03_arch-design.md` |
| 4 Contracts | `features/*/03_arch-design.md` | `packages/app-contracts/` + `04_contracts-notes.md` |
| 5 Backend | `features/*/04_contracts-notes.md` | backend code + `05_backend-notes.md` |
| 6 Frontend | `features/*/05_backend-notes.md` | frontend code + `06_frontend-notes.md` |
| 7 DevOps | `features/*/06_frontend-notes.md` | `07_infra-notes.md` |
| 8 QA | `features/*/07_infra-notes.md` | `packages/e2e-tests/tests/…` |

Each workflow run completes in under 10 seconds — it fires Jules and exits immediately.
Jules takes however long it needs and opens a PR when done.

### Why three engineer stages?

The single Software Engineer stage was too broad — it required Jules to update shared
types, backend services, and the full frontend in one session, which regularly ran for
14+ hours and failed. Splitting by layer solves this:

- **Contracts** has no app dependencies — it's pure types and constants. Usually done in 20 min.
- **Backend** has no frontend dependencies. Scoped to one service, tests pass quickly.
- **Frontend** can import fully-built contracts and assume a working API. Focused on UI only.

Each agent also runs `pnpm turbo run check:types --filter=@lasl/<package>` instead of the
root-level `pnpm check:types`, which prevented errors in unrelated packages from causing loops.

### On every PR you can

- **Post a review comment** → Jules reads it and pushes a revision commit automatically
- **Push directly to the Jules branch** → edit files yourself, merge when ready

Jules listens for comments natively via the Jules GitHub App. Switch to **Reactive Mode**
in [Jules UI settings](https://jules.google.com) if you only want it to respond to `@jules`.

### If a stage is skipped

Go to **Actions → [stage workflow] → Run workflow**, select your feature branch, click Run.
No inputs needed — the branch name is all the workflow requires.

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

---

## Feature Directory After the Pipeline

```
features/0001_example-feature/
  00_request.md              ← your input (never modified by agents)
  01_po-spec.md              ← Product Owner
  02_design/
    00_design-notes.md       ← UI/UX Designer: screen inventory and decisions
    01_screen-name.html      ← mockup
    01_screen-name.png       ← screenshot
    …
  03_arch-design.md          ← Architect
  04_contracts-notes.md      ← Contracts Engineer (pipeline sentinel)
  05_backend-notes.md        ← Backend Engineer (pipeline sentinel)
  06_frontend-notes.md       ← Frontend Engineer (pipeline sentinel)
  07_infra-notes.md          ← DevOps Engineer (pipeline sentinel)
```

Actual code is written to `apps/`, `packages/`, and `packages/e2e-tests/` as normal.

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

Each agent's instructions are in `.github/agents/`. Edit these files to adjust behaviour.

| File | Agent | Stage |
|------|-------|-------|
| `.github/agents/product-owner.md` | Product Owner | 1 |
| `.github/agents/ui-ux-designer.md` | UI/UX Designer | 2 |
| `.github/agents/software-architect.md` | Software Architect | 3 |
| `.github/agents/contracts-engineer.md` | Contracts Engineer | 4 |
| `.github/agents/backend-engineer.md` | Backend Engineer | 5 |
| `.github/agents/frontend-engineer.md` | Frontend Engineer | 6 |
| `.github/agents/devops-engineer.md` | DevOps Engineer | 7 |
| `.github/agents/qa-engineer.md` | QA Engineer | 8 |

Every agent also reads `PROJECT_CONTEXT.md` — keep it up to date.
