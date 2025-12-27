# Authentication Service

This is the **Frontend** for the LASL backend monorepo. It serves as the main user interface the customers face when working with the application. It is build using React and vite.

## Tools

The following tools are used in the frontend

- React for building user interfaces
- Radix UI as component library
- tanstack router and query
- Linguijs for handling i18n
- React hook form for form validation
- nginx as reverse proxy

### Nginx reverse proxy configuration

The frontend container uses nginx to:

1. Serve the static React build
2. Proxy API requests to avoid CORS issues

#### How It Works
When your frontend code makes a request:

`const response = await fetch('/api/auth/api/v1/users');`
Request flow:

1. Browser sends: http://localhost:3000/api/auth/api/v1/users
2. Nginx receives request and matches /api/ location
3. Nginx strips /api prefix → /auth/api/v1/users
4. Nginx proxies to: http://api-gateway:3000/auth/api/v1/users
5. API Gateway processes request
6. Response flows back through nginx to browser

Why no CORS? The browser sees everything coming from localhost:3000 (same origin), so no cross-origin request is made.
