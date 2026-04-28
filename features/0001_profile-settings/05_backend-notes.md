# Backend Notes: Profile Settings

## What Was Implemented
Added backend support for the profile settings feature.
- **Controllers**: Added `update.password.controller.ts` for handling password changes, and `delete.user.controller.ts` for managing account deletion requests.
- **Routes**: Registered `POST /api/v1/users/me/password` and `DELETE /api/v1/users/me` using the existing `authApiRoutes` structure.
- **Schemas**: Extracted `updatePasswordSchema` and `deleteUserSchema` into Fastify JSON schemas in `update.password.schema.ts` and `delete.user.schema.ts`.
- **Tests**: Created unit tests for the new `updatePassword` and `deleteUser` controllers.

## New Endpoints
| Method | Path | Auth required | Success status |
|--------|------|---------------|---------------|
| POST   | /api/v1/users/me/password | Yes (deserializeUser) | 200 |
| DELETE | /api/v1/users/me          | Yes (deserializeUser) | 200 |

## Deviations from Arch Design
None — followed arch design exactly.

## Notes for Frontend Engineer
- If `updatePassword` or `deleteAccount` is called with an invalid password, the backend returns a `403 Forbidden` response with a localized message using the `USER_ERRORS.passwordIncorrect` constant. Ensure this maps properly on the frontend form.
