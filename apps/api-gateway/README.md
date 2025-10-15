# API Gateway

## Architecture

```
                         ┌──────────────────────────┐
                         │   Client (i.e. Browser)  │
                         └────────────┬─────────────┘
                                      │
                              HTTPS / HTTP requests
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │       API Gateway        │
                         │    (Fastify-based)       │
                         └────────────┬─────────────┘
               Proxies /users         │     Proxies /documents
                                      │
         ┌────────────────────────────┴─────────────────────────────┐
         │                                                          │
┌────────────────────────┐                              ┌──────────────────────┐
│ Authentication Service │                              │ Document Service     │
│                        │                              │ (future service)     │
│ - /users               │                              │ - /documents         │
│ - /sessions            │                              │ - /documents/:id     │
│ - /sessions/refresh    │                              │                      │
└────────────────────────┘                              └──────────────────────┘
         │                                                          │
         └─────────────► MongoDB, other dependencies                │
                                                             (same idea for others)
```