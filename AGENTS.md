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
            ▼ (you open a contracts/* PR)
    ┌─────────────────────────┐
    │  You: Contracts work    │  update packages/ → open PR: contracts/* → feature/*
    │  Jules: Reviews it      │  runs checks, writes 04_contracts-notes.md → opens PR
    └─────────────────────────┘
            │ you merge Jules' reviewer PR, then your contracts PR
            ▼ (04_contracts-notes.md appears on feature branch)
    ┌─────────────────────────┐
    │  You: Backend work      │  implement backend apps/ → open PR: backend/* → feature/*
    │  Jules: Reviews it      │  runs checks + tests, writes 05_backend-notes.md → opens PR
    └─────────────────────────┘
            │ you merge Jules' reviewer PR, then your backend PR
            ▼ (05_backend-notes.md appears on feature branch)
    ┌─────────────────────────┐
    │  You: Frontend work     │  implement apps/frontend/ → open PR: frontend/* → feature/*
    │  Jules: Reviews it      │  runs checks + tests, writes 06_frontend-notes.md → opens PR
    └─────────────────────────┘
            │ you merge Jules' reviewer PR, then your frontend PR
            ▼ (automatic — 06_frontend-notes.md appears on feature branch)
    ┌────────────────────┐
    │  DevOps Engineer   │  writes 07_infra-notes.md → opens PR
    └────────────────────┘
            │ you review & merge
            ▼ (automatic — 07_infra-notes.md appears on feature branch)
    ┌────────────────────┐
    │   QA Engineer      │  writes Playwright .spec.ts files → opens PR
    └────────────────────┘
            │ you review & merge
            ▼
    Open final PR: feature/* → main ✅
```

---

## Stage Overview

| Stage | Who | Trigger | Produces |
|-------|-----|---------|----------|
| 1 PO | Jules | `features/*/00_request.md` pushed | `01_po-spec.md` |
| 2 UI/UX | Jules | `features/*/01_po-spec.md` on branch | `02_design/00_design-notes.md` + mockups |
| 3 Architect | Jules | `features/*/02_design/00_design-notes.md` on branch | `03_arch-design.md` |
| 4 Contracts | **You** + Jules reviewer | You open `contracts/*` → `feature/*` PR | `packages/` changes + `04_contracts-notes.md` |
| 5 Backend | **You** + Jules reviewer | You open `backend/*` → `feature/*` PR | backend code + `05_backend-notes.md` |
| 6 Frontend | **You** + Jules reviewer | You open `frontend/*` → `feature/*` PR | frontend code + `06_frontend-notes.md` |
| 7 DevOps | Jules | `features/*/06_frontend-notes.md` on branch | `07_infra-notes.md` |
| 8 QA | Jules | `features/*/07_infra-notes.md` on branch | `packages/e2e-tests/tests/…` + `08_qa-notes.md` |

---

## How the Reviewer Stages Work (4, 5, 6)

For the three implementation stages, you write the code and Jules reviews it:

1. **Create your branch** using the naming convention:
   - Contracts work: `contracts/<feature-id>-<slug>` (e.g. `contracts/0001-profile-settings`)
   - Backend work: `backend/<feature-id>-<slug>` (e.g. `backend/0001-profile-settings`)
   - Frontend work: `frontend/<feature-id>-<slug>` (e.g. `frontend/0001-profile-settings`)

2. **Write your code** on that branch and **open a PR** targeting the `feature/*` branch.

3. **Jules fires automatically** when the PR is opened (or when you push new commits). Jules:
   - Reads the arch design to understand what was required
   - Reviews your implementation against the spec
   - Runs scoped builds, type checks, and tests
   - Commits a review sentinel file to your branch via its own PR

4. **Merge Jules' reviewer PR** into your branch. This adds the sentinel file (e.g. `04_contracts-notes.md`) to your branch.

5. **Merge your PR** (`contracts/*` → `feature/*`). The sentinel lands on the feature branch and automatically triggers the next stage.

The sentinel file is Jules' sign-off — it documents what was reviewed, what checks ran, and any issues found. If Jules flagged issues, address them before merging.

---

## Branch Naming Convention

| Stage | Your branch | PR target |
|-------|-------------|-----------|
| Contracts | `contracts/NNNN-slug` | `feature/NNNN-slug` |
| Backend | `backend/NNNN-slug` | `feature/NNNN-slug` |
| Frontend | `frontend/NNNN-slug` | `feature/NNNN-slug` |

The branch prefix is how the reviewer workflow knows which agent to invoke.

---

## Starting a Feature

1. Create a `feature/*` branch: `git checkout -b feature/0002-content-service`
2. Create the feature directory and write your request:

```
features/
  0002_content-service/
    00_request.md   ← you write this and push to the feature branch
```

**Naming convention:** `NNNN_kebab-case-description` (directory) / `NNNN-kebab-case-description` (branch). Use the next sequential 4-digit number.

---

## Feature Directory After the Pipeline

```
features/0001_profile-settings/
  00_request.md              ← your input (never modified by agents)
  01_po-spec.md              ← Product Owner (Jules)
  02_design/
    00_design-notes.md       ← UI/UX Designer (Jules)
    01_screen-name.html      ← mockup
    01_screen-name.png       ← screenshot
    …
  03_arch-design.md          ← Architect (Jules)
  04_contracts-notes.md      ← Contracts Reviewer (Jules) — pipeline sentinel
  05_backend-notes.md        ← Backend Reviewer (Jules) — pipeline sentinel
  06_frontend-notes.md       ← Frontend Reviewer (Jules) — pipeline sentinel
  07_infra-notes.md          ← DevOps Engineer (Jules) — pipeline sentinel
  08_qa-notes.md             ← QA Engineer (Jules) — test coverage summary
```

Actual implementation code is written to `apps/` and `packages/` as normal.
QA test files are written to `packages/e2e-tests/tests/<feature-area>/` — not inside the feature directory.

---

## If a Stage Needs to Be Re-run

Go to **Actions → [stage workflow] → Run workflow**, select your branch, click Run.

For reviewer stages (4–6): re-running fires Jules against whatever is currently on your branch. You can also just push a new commit to the PR — the `synchronize` event re-triggers Jules automatically.

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
| `.github/agents/contracts-reviewer.md` | Contracts Reviewer | 4 |
| `.github/agents/backend-reviewer.md` | Backend Reviewer | 5 |
| `.github/agents/frontend-reviewer.md` | Frontend Reviewer | 6 |
| `.github/agents/devops-engineer.md` | DevOps Engineer | 7 |
| `.github/agents/qa-engineer.md` | QA Engineer | 8 |

Every agent also reads `PROJECT_CONTEXT.md` — keep it up to date.
