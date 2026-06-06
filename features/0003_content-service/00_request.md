# Feature Request: Content Service (MVP)

## What I want

The core purpose of this platform is to deliver Classical Arabic learning content. Right now there's no way to serve content at all. I want to build the foundation: a new backend microservice that stores and serves lesson documents, validated against the existing `schema-engine` JSON schemas.

This is the most important infrastructure piece — everything else (lesson browser, progress tracking, search) builds on top of it.

## What the content service should do

- Store learning content documents in MongoDB. Each document follows the `schema-engine` JSON schema (meta + content sections).
- Expose a REST API behind the existing API Gateway (`/content/*` prefix):
  - `GET /content/api/v1/lessons` — list all lessons (id, title, path, keywords)
  - `GET /content/api/v1/lessons/:id` — get a full lesson document
- Validate all stored documents against the schema-engine before saving.
- The service follows the same patterns as the authentication service: Fastify 5, Typegoose/MongoDB, registered behind the API Gateway.

## Seed data

Include a small set of seed lesson documents (3–5 lessons) covering introductory Nahw (grammar) topics. These should be realistic examples that demonstrate the schema structure, not placeholder lorem ipsum content. The content can be simple — even a single paragraph explaining a concept is fine — but it should be real Arabic grammar content.

## Acceptance criteria

- Content service runs as a Docker container alongside the existing services.
- API Gateway proxies `/content/*` to the content service.
- `GET /content/api/v1/lessons` returns a list of available lessons.
- `GET /content/api/v1/lessons/:id` returns the full lesson document for a valid ID.
- `GET /content/api/v1/lessons/:id` returns 404 for an unknown ID.
- Documents are validated against the schema-engine on creation; invalid documents are rejected with a 400 error.
- The service has a healthcheck endpoint at `/api/v1/healthcheck`.
- Unit tests cover the list and get endpoints.

## Out of scope

- Authentication on content endpoints (public read access for now).
- Creating or editing content via the API (read-only service at this stage).
- A frontend lesson viewer (that's the next feature).
- Search functionality.
- User progress tracking.
