# PROJECT_CONTEXT.md — Lughat Al-Asl (لُغَةُ الْأَصْل)

> **Purpose of this file:** This document is the single source of truth for any AI agent working on this codebase. Read it in full before making any changes. It describes what the project is, how it is structured, how each service works, what conventions to follow, and what the current state of development is.

---

## 1. Project Overview

**Name:** Lughat Al-Asl (Arabic: لُغَةُ الْأَصْل — "The Original Language")

**Domain:** An open-source web platform for learning Classical Arabic. The curriculum focuses on the three core disciplines of classical Arabic scholarship:
- **Nahw** (نحو) — Arabic grammar and syntax
- **Sarf** (صرف) — Arabic morphology / conjugation
- **Balagha** (بلاغة) — Arabic rhetoric and eloquence

**Goal:** Deliver an efficient, structured, and accessible learning experience for students of the Arabic language. The platform is content-driven: learning material is defined using a custom JSON schema and served through a microservice backend to a React SPA frontend.

**Project type:** Open source. Contributions welcome via discussion or PR.

---

## 2. High-Level Architecture

```
Browser
  └── Frontend SPA (React/Vite)  :3000 (external)
        └── API Gateway (Fastify) :8080 (external)
              └── /auth/* → Authentication Service (Fastify) :3000 (internal)
                    └── MongoDB  :27017 (internal)

Dev tooling:
  └── Mailpit (SMTP trap)  SMTP :1025 / Web UI :8025
```

**Key design decisions:**
- **Microservices** orchestrated via Docker Compose. Each service is independently deployable with its own Dockerfile.
- **API Gateway** acts as the single entry point. The frontend only talks to the gateway. The gateway proxies `/auth/*` to the Authentication Service. Additional services will be added behind the gateway in future.
- **Secrets managed with Doppler** — no `.env` files are committed. All services read secrets at runtime via `doppler run --`.
- **Shared packages** live in `packages/` and are consumed by apps via pnpm workspace protocol (`workspace:*`).

---

## 3. Monorepo Structure

```
lasl/                              ← repo root
├── apps/
│   ├── api-gateway/               ← Fastify HTTP proxy / API entry point
│   ├── authentication-service/    ← Fastify + MongoDB auth microservice
│   ├── authentication-service-mongodb/  ← custom MongoDB Docker image
│   └── frontend/                  ← React 19 SPA
├── packages/
│   ├── app-contracts/             ← shared Zod schemas, route paths, API paths, locale constants
│   ├── schema-engine/             ← AJV-based JSON schema validator for content documents
│   ├── e2e-tests/                 ← Playwright end-to-end test suite
│   └── test-utils-fastify/        ← shared Fastify test setup utilities
├── biome.json                     ← root Biome config (lint + format, NO ESLint/Prettier)
├── turbo.json                     ← Turborepo pipeline config
├── tsconfig.base.json             ← shared TypeScript base config
├── pnpm-workspace.yaml
├── package.json                   ← root scripts
└── docker-compose*.yml            ← Docker Compose files (base, dev, test, prod)
```

**Workspace package naming convention:** `@lasl/<package-name>` (e.g. `@lasl/app-contracts`, `@lasl/authentication-service`).

---

## 4. Toolchain & Conventions

### Package Manager
- **pnpm 10.28.1** — use pnpm for all installs. Never use npm or yarn.

### Build System
- **Turborepo** — orchestrates builds, tests, linting across packages with caching. Tasks are defined in `turbo.json`.
  - `build` → depends on upstream `^build`, outputs `dist/**`
  - `test` → depends on `build`
  - `check:ci` → biome lint + format check (runs in CI)
  - `check:types` → TypeScript type-checking

### Language & Runtime
- **TypeScript 5.x**, strict mode, ESM-first (`"type": "module"` everywhere).
- Key `tsconfig.base.json` flags to be aware of:
  - `"erasableSyntaxOnly": true` — **no TypeScript enums, no namespaces, no decorators (except via Typegoose on the backend)**. Use `const` objects or Zod enums instead.
  - `"verbatimModuleSyntax": true` — always use `import type` for type-only imports.
  - `"exactOptionalPropertyTypes": true` — optional fields and `| undefined` are distinct.
  - `"noImplicitReturns": true`, `"noPropertyAccessFromIndexSignature": true` — strict return and index access.
- **Target:** ES2023, `module: nodenext`.
- **Build tool for backend packages:** `tsup` (outputs to `dist/`).
- **Build tool for frontend:** `Vite 8` with Rolldown.

### Linting & Formatting
- **Biome 2.x** — handles BOTH linting AND formatting. There is no ESLint or Prettier in this project.
- Root `biome.json` defines rules; each app/package may have a local `biome.json` that extends it.
- Key Biome rules enforced: `noExcessiveLinesPerFunction`, `noForEach`, `noMagicNumbers`, `useArrowFunction`, `noExcessiveCognitiveComplexity`, accessibility rules.
- CI gate: `biome check` (via `check:ci` turbo task).
- Common suppression pattern: `// biome-ignore lint/<rule>: <reason>` — always provide a reason.

### Testing
- **Vitest 4** — unit and integration tests for all apps and packages.
- **Playwright** — end-to-end tests in `packages/e2e-tests/`.
- **MSW (Mock Service Worker)** — used in frontend tests to mock API calls.
- **mongodb-memory-server** — used in authentication-service tests to spin up an in-memory MongoDB instance.
- **happy-dom** — frontend test environment (not jsdom).
- Test files live in a sibling `test/` directory next to `src/`.
- Frontend test wrappers are in `test/__wrappers__/` (providers for Router, Query, i18n).

### Path Aliases
- Backend apps use `@/src/...` as a path alias resolving to the package's own `src/`.
- Frontend uses tsconfig paths for `@/src/...` via `vite-tsconfig-paths`.

---

## 5. App: `authentication-service`

**Package name:** `@lasl/authentication-service`  
**Framework:** Fastify 5  
**Database:** MongoDB via Mongoose + Typegoose (ODM)  
**Port (internal):** 3000

### Responsibility
Handles the complete authentication and user lifecycle:
- User registration with email verification
- Session creation (login) and invalidation (logout)
- Access token refresh
- Password reset via email
- User profile retrieval and update

### Plugin Architecture (Fastify)
Plugins registered in `buildApp()` in order:
1. `fastifyEnvironmentPlugin` — validates and injects env vars via `@fastify/env` + Zod
2. MongoDB connection
3. `fastifyMailerPlugin` — email sending (Resend in prod, SMTP/Mailpit in dev)
4. `fastifySwaggerPlugin` — Swagger/OpenAPI docs at `/documentation`
5. `fastifyCookiePlugin` — `@fastify/cookie` for cookie parsing
6. `fastifyRateLimitPlugin` — `@fastify/rate-limit` on auth routes

### Route Groups
- `healthRoutes` — `GET /api/v1/healthcheck`
- `userRoutes` — CRUD on users, verification, password reset
- `authRoutes` — session create/refresh/logout

### Authentication Flow
1. **Register** — `POST /api/v1/users` → creates user with `verified: false`, sends verification email with `nanoid`-generated code.
2. **Verify** — `GET /api/v1/users/verify/:id/:verificationCode` → sets `verified: true`.
3. **Login** — `POST /api/v1/sessions` → validates credentials, creates a `Session` document, returns:
   - **Access token** (JWT, short-lived, RS256) in response body.
   - **Refresh token** (JWT, 7-day, RS256) as an `httpOnly`, `sameSite: strict`, `secure` (prod only) cookie scoped to `/auth/api/v1/sessions/refresh`.
4. **Refresh** — `POST /api/v1/sessions/refresh` → `deserializeSession` pre-handler validates refresh cookie, returns new access token.
5. **Logout** — `POST /api/v1/sessions/logout` → `deserializeUser` pre-handler validates access token, marks session `valid: false`, clears cookie.
6. **Forgot password** — `POST /api/v1/users/forgotpassword` → sends reset email with code.
7. **Reset password** — `POST /api/v1/users/resetpassword/:id/:code` → validates code, updates password.

### JWT Strategy
- **RS256 asymmetric keys** (private key for signing, public key for verification).
- Four keys: `jwtAccessPrivateKey`, `jwtAccessPublicKey`, `jwtRefreshPrivateKey`, `jwtRefreshPublicKey`.
- Keys are stored in Doppler and injected at runtime.

### Data Models (Typegoose)
**User:**
- `email` (lowercase, unique, required)
- `firstName`, `lastName`, `password` (argon2-hashed on save)
- `verificationCode` (nanoid, required)
- `passwordResetCode` (string | null)
- `verified` (boolean, default false)
- `settings` (embedded `UserSettings` sub-document)
- Timestamps: `createdAt`, `updatedAt`

**Session:**
- `user` (ref → User, required)
- `valid` (boolean, default true)
- Timestamps: `createdAt`, `updatedAt`

### Email
- **Production:** [Resend](https://resend.com) via `resend` SDK — configured via `RESEND_API_KEY`.
- **Development:** SMTP via Nodemailer pointing to Mailpit (port 1025). Mailpit web UI available at `:8025`.
- Provider is selected via a factory (`provider.factory.ts`) based on environment.
- HTML email templates are in `src/templates/` (`.html` files, copied to `dist/` by a build script).

### Rate Limiting
- Applied via `@fastify/rate-limit`. Auth endpoints are rate-limited.
- A `rateLimitBypassKey` header is used in tests to bypass rate limiting.

### Environment Variables (required)
| Variable | Description |
|---|---|
| `PORT` | Service port (default 3000) |
| `MONGO_URI` | MongoDB connection string |
| `FRONTEND_BASE_URL` | Frontend origin for email links |
| `JWT_ACCESS_PRIVATE_KEY` | RS256 private key for access tokens |
| `JWT_ACCESS_PUBLIC_KEY` | RS256 public key for access tokens |
| `JWT_REFRESH_PRIVATE_KEY` | RS256 private key for refresh tokens |
| `JWT_REFRESH_PUBLIC_KEY` | RS256 public key for refresh tokens |
| `APPLICATION_HOST_PORT` | Host-side port mapping (default 8080) |
| `RESEND_API_KEY` | API key for Resend email provider |
| `NODE_ENV` | `development` | `test` | `production` |
| `RATE_LIMIT_BYPASS_KEY` | Secret header value to bypass rate limiting in tests |

### Versioning
- Uses `standard-version` for changelog generation (CHANGELOG.md exists). Current version: `1.0.2`.

---

## 6. App: `api-gateway`

**Package name:** `@lasl/api-gateway`  
**Framework:** Fastify 5  
**Port (external):** 8080

### Responsibility
Single entry point for all client traffic. Currently proxies `/auth/*` to the authentication service. Designed to be extended as more microservices are added.

### Proxy Configuration
- Uses `@fastify/http-proxy` to forward `/auth/*` requests upstream.
- **Cookie path rewriting:** The authentication service sets the refresh token cookie with `Path=/api/v1/sessions/refresh`. The gateway rewrites this to `Path=/auth/api/v1/sessions/refresh` so the cookie is correctly scoped for browser requests going through the gateway prefix.

### Adding a new service
Register a new `fastifyHttpProxy` block in `app.ts` with a new prefix and upstream URL (loaded from env).

---

## 7. App: `frontend`

**Framework:** React 19 + Vite 8  
**Router:** TanStack Router v1 (file-based, auto-generated `routeTree.gen.ts`)  
**Data fetching:** TanStack Query v5  
**Forms:** React Hook Form + `@hookform/resolvers` (Zod)  
**UI primitives:** Radix UI (`@radix-ui/react-dialog`, `react-select`, `react-tooltip`, `react-label`, `react-icons`)  
**Styling:** Custom CSS with CSS custom properties (design tokens in `src/styles/tokens/`)  
**i18n:** LinguiJS v5 (`@lingui/core`, `@lingui/react`)  
**HTTP client:** Axios with interceptors  
**Port (external):** 3000 (served by nginx in Docker)

### Route Structure (TanStack Router, file-based)
```
src/app/routes/
├── __root.tsx                         ← root layout
├── index.tsx                          ← / (landing page)
├── imprint.tsx                        ← /imprint
├── privacy.tsx                        ← /privacy
├── terms.tsx                          ← /terms
└── _auth.tsx                          ← auth layout group (unauthenticated only)
    ├── login.tsx                      ← /login
    ├── register/
    │   ├── index.tsx                  ← /register
    │   ├── success.tsx                ← /register/success
    │   └── verify/$id/$verificationCode/index.tsx ← /register/verify/:id/:code
    ├── forgot-password/
    │   ├── index.tsx                  ← /forgot-password
    │   └── sent.tsx                   ← /forgot-password/sent
    ├── reset-password/
    │   ├── index.tsx                  ← /reset-password
    │   ├── sent.tsx                   ← /reset-password/sent
    │   └── $id/$passwordResetCode/index.tsx
    └── resend-verification-mail/
        ├── index.tsx                  ← /resend-verification-mail
        └── sent.tsx                   ← /resend-verification-mail/sent
```

Route constants are defined in `@lasl/app-contracts/routes/auth` and used throughout to avoid string literals.

### API Client Pattern
- `src/api/apiClient.ts` — Axios instance with `baseURL: VITE_API_URL`, `withCredentials: true`.
- **Request interceptor:** attaches Bearer access token from `accessTokenManager` (in-memory storage).
- **Response interceptor:** on 401, attempts one token refresh via `/sessions/refresh`. If refresh succeeds, retries the original request. If refresh fails, redirects to `/login`. Implements a request queue to deduplicate concurrent 401 retries.
- `src/api/authApi.ts` — auth-specific API calls.
- `src/api/userApi.ts` — user profile API calls.

### Authentication Context
- `useAuthenticationContext` — React context + provider (`AuthenticationProvider` in `App.tsx`) that wraps the entire app.
- Exposes `isAuthenticated`, `isLoading`, and user data.
- TanStack Router context receives `auth` from this provider and uses it for route protection.

### i18n
- **LinguiJS** with three locales: `en-US` (default/source), `de-DE`, `fr-FR`.
- Message catalogs in `src/locales/{locale}/messages.po` (source) and compiled to `messages.ts`.
- Translation workflow:
  1. Extract: `pnpm extract:messages` → updates `.po` files.
  2. Translate `.po` files (auto-translate script at `scripts/auto-translate.js`).
  3. Compile: `pnpm compile:messages` → generates `.ts` files.
- Locale constants (`SUPPORTED_LOCALES`, `DEFAULT_LOCALE`) live in `@lasl/app-contracts/locales` and are shared with the lingui config.

### Design Tokens
CSS custom properties defined in `src/styles/tokens/`:
- `colors.css`, `typography.css`, `sizing-spacing.css`, `border.css`, `animation.css`, `effects.css`, `layout.css`
- Dark mode supported via `useDarkMode` hook.

### Shared Components
Located in `src/shared/components/`:
- `Button`, `InputField`, `FormInputField`, `Callout`, `TextLink`, `ExternalLink`
- `IconButton`, `IconLink`, `Skeleton`, `Tooltip`
- `BrandLogo`, `LanguageSelect`, `LightDarkModeButton`
- `AuthFormErrorCallout` — standardised error display for auth forms

### Environment Variables (frontend)
| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL for API calls (defaults to `http://localhost:3000/api` in dev) |

---

## 8. Package: `app-contracts`

**Package name:** `@lasl/app-contracts`  
**Purpose:** Single source of truth for all shared contracts between frontend and backend. Importing from this package prevents drift between services.

### Exports
| Export path | Contents |
|---|---|
| `@lasl/app-contracts/locales` | `SUPPORTED_LOCALES`, `DEFAULT_LOCALE`, locale labels |
| `@lasl/app-contracts/schemas/user` | Zod schemas: `createUserSchema`, `userEmailSchema`, `userPasswordSchema`, `resetPasswordParamsSchema`, etc. |
| `@lasl/app-contracts/schemas/session` | Zod session schemas, `vagueSessionErrorMessage` |
| `@lasl/app-contracts/errors/user` | `USER_ERRORS` — typed error message constants |
| `@lasl/app-contracts/api/auth` | `authApiRoutes` (API path builder functions), `REFRESH_TOKEN_COOKIE_NAME`, `ACCESS_TOKEN_NAME`, `AUTHENTICATION_TYPE` |
| `@lasl/app-contracts/api/headers` | Shared header constants |
| `@lasl/app-contracts/routes/auth` | `authRoutes` — frontend route path constants |
| `@lasl/app-contracts/routes/legal` | `legalRoutes` — imprint, privacy, terms route paths |

### Rules when modifying app-contracts
- Any change here potentially affects multiple consumers (frontend + authentication-service). Always check all imports.
- Zod schemas here must remain compatible with both Zod v4 (listed as `peerDependency`).
- Run `pnpm build` in this package and then re-test all consumers after changes.

---

## 9. Package: `schema-engine`

**Package name:** `@lasl/schema-engine`  
**Purpose:** Validates JSON learning-content documents against pre-defined JSON schemas. This is the foundation for the content-driven curriculum delivery.

### JSON Schema Hierarchy
```
main.schema.json         ← top-level document: { meta, content }
  └── sectionContainer.schema.json  ← content sections
        ├── text.schema.json        ← text content blocks
        └── style.schema.json       ← styling properties
```

**`main.schema.json` shape:**
```json
{
  "meta": {
    "path": "string",
    "searchKeywords": ["string"],
    "documentTitle": "string"
  },
  "content": { /* sectionContainer */ }
}
```

### API
- `validateSchema(data, schemaIdentifier?)` — validates data against a schema, logs AJV errors if invalid.
- `createSchemaCompiler(schemaIdentifier?)` — returns the compiled AJV validator for a given schema ID.
- Exports TypeScript types inferred from the schemas.

---

## 10. Package: `test-utils-fastify`

**Package name:** `@lasl/test-utils-fastify`

Provides shared test setup utilities for Fastify-based services:
- `setup.utils.ts` — helpers to build and tear down Fastify instances in tests.
- `swagger-doc.utils.ts` — utilities to validate Swagger/OpenAPI docs in tests.
- `global.setup.ts` — global Vitest setup (mongodb-memory-server lifecycle).

---

## 11. Package: `e2e-tests`

**Runner:** Playwright  
**Location:** `packages/e2e-tests/`

### Test Coverage
- `auth/auth.spec.ts` — full registration, login, logout flows
- `auth/login.spec.ts` — login-specific scenarios
- `auth/logout.spec.ts` — logout scenarios
- `auth/registration.spec.ts` — registration flow
- `auth/registration.validation.spec.ts` — form validation
- `auth/reset.password.spec.ts` — password reset flow
- `auth/route.protection.spec.ts` — protected route redirect behaviour
- `auth/auth.rate.limiting.spec.ts` — rate limiting behaviour
- `header.spec.ts`, `footer.spec.ts`, `landing.spec.ts` — UI smoke tests

### Utilities
- `utils/auth/createVerifiedUser.ts` — programmatic user creation for test setup
- `utils/auth/login.ts` — helper to perform login via API
- `utils/mailer/` — helpers to poll Mailpit for verification and reset emails
- `utils/components/` — Page Object Models for header, footer

---

## 12. Docker & Infrastructure

### Docker Compose Files
| File | Purpose |
|---|---|
| `docker-compose.yml` | Base definitions (shared by all environments) |
| `docker-compose.dev.yml` | Dev additions: Mailpit, exposes MongoDB port, dev network |
| `docker-compose.test.yml` | Test environment overrides |
| `docker-compose.prod.yml` | Production overrides |

### Service Startup Order (dev)
1. `authentication-service-mongodb` (health-checked)
2. `authentication-service` (depends on MongoDB, health-checked via `/api/v1/healthcheck`)
3. `api-gateway` (depends on authentication-service healthy, exposed on `:8080`)
4. `frontend` (depends on api-gateway healthy, exposed on `:3000`)

### Doppler Integration
- Each service gets its own `DOPPLER_TOKEN_<SERVICE>` environment variable from the host `.env.dev` file.
- The Docker entrypoint is `["doppler", "run", "--"]` followed by the start command, which injects all secrets at runtime.
- **Local setup:** `doppler login` → `doppler setup` → select `authentication-service` config.

### Useful Docker Commands (from root `package.json`)
```bash
pnpm docker:dev        # start dev stack
pnpm docker:dev:down   # stop dev stack
pnpm docker:test       # start test stack
pnpm docker:prod       # start prod stack
pnpm docker:clean      # prune stopped containers/networks
pnpm docker:clean:all  # prune everything including volumes (destructive!)
```

---

## 13. CI/CD (GitHub Actions)

Workflows in `.github/workflows/`. Each service has its own workflow that triggers on changes to its own directory OR shared packages/config.

### Workflow: `authenticationService.yml`
- **Triggers:** push/PR to `main` when `apps/authentication-service/**`, `packages/**`, or shared config files change.
- **Jobs:**
  1. `validate` — setup monorepo → `turbo run check:ci check:types test --filter=@lasl/authentication-service`
  2. `docker-build` (needs validate) — builds Docker image (push: false), uses GitHub Actions cache.
- **Concurrency:** cancels in-progress runs for the same workflow+ref.

Similar workflows exist for `frontendService.yml`, `apiGateway.yml`, `schemaEngine.yml`.

### Shared Action: `.github/actions/setup-monorepo`
Reusable composite action that handles Node/pnpm setup and dependency installation consistently across all workflows.

---

## 14. Development Workflow

### Initial Setup
```bash
# 1. Install dependencies
pnpm install

# 2. Set up Doppler (required for secrets)
doppler login
doppler setup  # select 'authentication-service' config

# 3. Start the full dev stack
pnpm docker:dev
```

### Common Commands
```bash
# Run all tests
pnpm test

# Run tests for a specific package
pnpm turbo run test --filter=@lasl/authentication-service

# Type check all packages
pnpm check:types

# Lint + format check (CI-equivalent)
pnpm check:ci

# Auto-fix lint + format issues
pnpm check:fix

# Build everything
pnpm build

# Build a specific package
pnpm turbo run build --filter=@lasl/app-contracts
```

### Adding a New Feature — Checklist
1. Determine if shared types/schemas belong in `app-contracts`. If yes, add them there first and rebuild.
2. Add backend route in the relevant service with full Zod/JSON Schema response definitions (for Swagger).
3. Add corresponding types/paths to `app-contracts` if the frontend needs them.
4. Implement frontend API call, hook, and page/component.
5. Write Vitest unit/integration tests alongside the code (in `test/`).
6. Write or update Playwright E2E tests in `packages/e2e-tests/`.
7. Ensure `biome check` passes with no suppressions added unnecessarily.

---

## 15. Naming & Code Conventions

### File Naming
- **Backend:** `kebab.case.with.dots.ts` for specificity (e.g. `create.user.controller.ts`, `auth.routes.schema.ts`).
- **Frontend:** `PascalCase.tsx` for React components; `camelCase.ts` for utilities and hooks.
- **Tests:** mirror source path exactly with `.test.ts` or `.test.tsx` suffix. Unit-only tests use `.unit.test.ts`.

### Backend Patterns
- **Controller:** handles HTTP request/response, delegates to service layer.
- **Service:** business logic, database operations.
- **Model:** Typegoose class definitions.
- **Schema:** Zod/JSON Schema definitions for request validation.
- **Routes schema:** Zod schemas for Swagger response documentation.
- **Plugin:** Fastify plugin (`fastify-plugin` wrapped, registered in `buildApp`).
- **Middleware / Hooks:** preHandler hooks (e.g. `deserializeUser`, `deserializeSession`).
- **Util:** stateless utility functions (JWT, mailer, template loader, etc.).

### Frontend Patterns
- One component per file; co-locate CSS file with same name (e.g. `Button.tsx` + `Button.css`).
- Hooks in `src/shared/hooks/`. API hooks (using TanStack Query) in `src/shared/hooks/api/`.
- API functions (raw Axios calls) in `src/api/`.
- Pages follow the pattern: `PageName/PageNamePage.tsx` (page shell) + `PageName/PageNameForm.tsx` (form logic).
- Shared component library in `src/shared/components/<component-name>/`.

### Imports
- Always use `import type` for type-only imports (`verbatimModuleSyntax`).
- Use path aliases (`@/src/...`) rather than deep relative paths.
- Import from `@lasl/app-contracts/...` sub-paths, not from the root.

---

## 16. Known Architecture Decisions & Constraints

- **No enums.** TypeScript enums are banned by `erasableSyntaxOnly`. Use `const` objects with `as const` or Zod enums.
- **No `forEach`.** Biome bans it (`noForEach`). Use `for...of` loops instead.
- **No magic numbers.** Use named constants. Biome enforces `noMagicNumbers`.
- **Function length limit.** Biome enforces `noExcessiveLinesPerFunction`. Break large functions into smaller helpers. Long route definitions are suppressed with `// biome-ignore`.
- **Cookie path scoping.** The refresh token cookie is scoped to the refresh endpoint path. The API Gateway must rewrite the `Set-Cookie` header path when proxying responses. This logic already exists in `api-gateway/src/app.ts`.
- **RS256 over HS256.** Asymmetric JWT signing means the public key can be shared with other services for verification without exposing the signing secret.
- **Vague auth error messages.** Login returns a generic forbidden message regardless of whether the email or password was wrong, to prevent user enumeration attacks. See `vagueSessionErrorMessage` in `app-contracts`.
- **Access token in memory only.** The access token is stored in-memory via `accessTokenManager` (not localStorage) to reduce XSS risk. The refresh token is httpOnly cookie only.
- **MongoDB-memory-server in tests.** Backend tests spin up an in-memory MongoDB instance instead of mocking Mongoose. This gives higher fidelity tests.

---

## 17. Current State & What's Next

The project currently has a **complete authentication and user management foundation** including:
- Full register/verify/login/logout/refresh/password-reset flows (backend + frontend)
- API Gateway routing
- i18n support (en-US, de-DE, fr-FR)
- Comprehensive unit and E2E test coverage for auth flows
- CI/CD pipelines per service

**What is not yet built** (implied by the project goal):
- The actual Arabic learning content delivery system (curriculum pages, lesson viewer)
- Content management / authoring tooling that produces documents conforming to the `schema-engine` JSON schemas
- User progress tracking
- Additional microservices behind the API Gateway (e.g. a content service)
- Any admin or CMS interface

The `schema-engine` package is the foundation for the content system and is already defined — the next major development phase will likely involve building content delivery on top of it.

---

## 18. AI Agent Pipeline — Constraints & Instructions

> This section is written specifically for AI agents working via the automated pipeline in `.github/workflows/`. Read it alongside all other sections.

### Hard Constraints — Never Violate These

- **No TypeScript enums.** `erasableSyntaxOnly: true` bans them. Use `const` objects: `const STATUS = { Active: 'active', Inactive: 'inactive' } as const; type Status = typeof STATUS[keyof typeof STATUS]`
- **No `forEach`.** Biome's `noForEach` rule bans it. Use `for...of` loops.
- **No magic numbers.** Use named constants. Biome enforces `noMagicNumbers`.
- **Always `import type` for type-only imports.** `verbatimModuleSyntax: true` requires it.
- **Distinguish optional from `| undefined`.** `exactOptionalPropertyTypes: true` — `foo?: string` and `foo: string | undefined` are different. Do not add `| undefined` to optional properties.
- **No ESLint, no Prettier.** This project uses Biome exclusively. Never add ESLint or Prettier config or dependencies.
- **No npm or yarn.** Use `pnpm` for all package operations.
- **No `.env` files.** Secrets are managed via Doppler. Never create `.env.example`, `.env.local`, or similar.
- **No scope expansion.** Implement exactly what the PO spec describes. Nothing more.
- **No unrelated changes.** Do not fix other bugs or refactor unrelated code in the same PR.

### Shared Types Rule

If a feature requires new types, Zod schemas, API path constants, or frontend route constants that are shared between the frontend and any backend service, they go in `packages/app-contracts/`. Add them there first, rebuild, then update consumers.

### Test Commands

| Scope | Command |
|-------|---------|
| All packages | `pnpm test` |
| Specific package | `pnpm turbo run test --filter=@lasl/<package-name>` |
| Type check all | `pnpm check:types` |
| Lint + format check | `pnpm check:ci` |
| Auto-fix lint + format | `pnpm check:fix` |
| E2E tests | Requires full Docker stack — deferred to `e2e-test.yml` CI workflow |

### Backend Service Pattern (Fastify 5)

When adding a new feature to a Fastify service:
1. Add Zod schemas to `src/<feature>/` (request/response validation)
2. Add model in `src/model/` if new Typegoose class is needed (note: decorators ARE allowed via Typegoose)
3. Add service in `src/service/`
4. Add controller in `src/controller/`
5. Add route handler in `src/routes/` and register in `buildApp()`
6. Add tests in `test/` mirroring the source structure

### File Naming Reminder

- **Backend:** `kebab.case.with.dots.ts` — e.g. `create.user.controller.ts`, `auth.routes.schema.ts`
- **Frontend:** `PascalCase.tsx` for components, `camelCase.ts` for utilities/hooks
- **Tests:** exactly mirror source path with `.test.ts` / `.test.tsx` suffix

### E2E Tests

New Playwright tests go in `packages/e2e-tests/tests/` using the `.spec.ts` extension. Use the existing utilities in `packages/e2e-tests/utils/` — do not recreate helpers that already exist. E2E tests are NOT run in the automated agent pipeline; they are run by the existing `e2e-test.yml` workflow when code is pushed to `main`.
