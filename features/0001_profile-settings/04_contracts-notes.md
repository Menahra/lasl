# Contract Notes for Profile Settings (Feature 0001)

Completed updates to `@lasl/app-contracts` as specified in the architecture design.

## Changes Included:
- **API Paths (`auth.api.ts`)**: Added `updatePassword` (`/api/v1/users/me/password`) and `delete` (`/api/v1/users/me`) paths to `authApiRoutes.user`.
- **Frontend Routes (`auth.routes.ts`)**: Added `settingsProfile` (`/settings/profile`) path.
- **Error Constants (`user.errors.ts`)**: Added `passwordIncorrect`.
- **Validation Schemas (`user.schemas.ts`)**: Added `updatePasswordSchema` (with refinement for matching password/passwordConfirmation) and `deleteUserSchema`. Exported inferred types `UpdatePasswordInput` and `DeleteUserInput`.
- Verified and formatted everything utilizing Biome and Turbo. Passed unit and type checks.
