# 🔐 Authentication Service

This is the **Authentication Service** for the LASL backend monorepo. It handles user login, session management, token issuance (access & refresh tokens), and secure logout. It is built using **Fastify**, **TypeScript**, and follows modern backend best practices including test coverage and semantic release.

---

## ✨ Features

- ✅ Email + password authentication
- ✅ Secure access & refresh tokens (JWT-based)
- ✅ HTTP-only cookie for refresh tokens
- ✅ Session invalidation on logout
- ✅ Token refresh endpoint
- ✅ Swagger (OpenAPI) documentation
- ✅ Tested with `vitest`
- ✅ Semantic versioning and changelog generation
- ✅ Dockerized

---

## 📁 Project Structure

```
.
├── src
│   ├── config/ # Environment definitions
│   ├── controller/ # Request handlers
│   ├── database/ # MongoDB setup
│   ├── middlware/ # Hooks for fastify endpoints
│   ├── model/ # Mongoose Models (i.e. User, Session)
│   ├── plugins/ # Fastify plugins (i.e. Swagger)
│   ├── routes/ # Endpoint definitions
│   ├── schema/ # Zod schema definitions
│   ├── service/ # Business logic (auth, user, session)  
│   ├── templates/ # HTML templates for emails
│   ├── util/ # Helpers (JWT, etc.) 
│   ├── index.js
├── test/# Unit and Integration tests
├── tsup.config.ts # Build tool configuration
└── vitest.config.ts # Test configuration
```

## 🚀 Getting Started

### 🔧 Requirements

- Node.js (LTS)
- PNPM
- MongoDB
- Docker (optional, for container builds)

### 🛠️ Install dependencies

```bash
pnpm install
```

### 🧪 Testing

Run unit and integration tests:
```bash
pnpm test
```

### API Endpoints

All endpoints are documented via Swagger UI, served by Fastify's OpenAPI plugin.

### 🧩 Releasing
This service follows semantic versioning using standard-version.
#### 📦 How it works
- Versions are stored in package.json
- Changelog is auto-generated
- Releases are tagged with GitHub
- A GitHub Actions workflow automates the release

#### 🧪 Manual release trigger
To create a new release:
- Go to Actions → Release Authentication Service
- Click Run workflow
- Based on commit messages (feat, fix, etc.), it determines patch/minor/major
- Updates package.json, CHANGELOG.md, and creates Git tag
- ✅ Uses GITHUB_TOKEN to push changes back to the repo
