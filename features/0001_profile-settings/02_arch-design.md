# Architecture Design: Profile Settings Page

## Metadata
- **Feature ID**: 0001
- **Slug**: profile-settings
- **Stage**: Architecture Design
- **Date**: 2024-05-24
- **PO Spec**: features/0001_profile-settings/01_po-spec.md

## Overview
This feature introduces a new page at `/settings/profile` for authenticated users to manage their account. This includes viewing their email, updating their display name (mapped to `firstName` and `lastName`), changing their password, and permanently deleting their account. This requires new backend endpoints for password change and account deletion, updates to the `updateUser` endpoint to handle name changes, and new frontend components for layout and modals.

## Affected Files

### New files
| Path | Package | Purpose |
|------|---------|---------|
| `apps/authentication-service/src/schema/update.password.schema.ts` | `@lasl/authentication-service` | Zod schema for changing password. |
| `apps/authentication-service/src/schema/delete.user.schema.ts` | `@lasl/authentication-service` | Zod schema for account deletion (password verification). |
| `apps/authentication-service/src/controller/update.password.controller.ts` | `@lasl/authentication-service` | Controller for changing password. |
| `apps/authentication-service/src/controller/delete.user.controller.ts` | `@lasl/authentication-service` | Controller for deleting user account. |
| `apps/frontend/src/app/pages/settings/profile/ProfileSettingsPage.tsx` | `@lasl/frontend` | The main settings page component. |
| `apps/frontend/src/app/pages/settings/profile/ProfileSettingsPage.css` | `@lasl/frontend` | Styling for settings page. |
| `apps/frontend/src/app/routes/_auth/settings/profile.tsx` | `@lasl/frontend` | TanStack router configuration for the settings page. |
| `apps/frontend/src/shared/components/avatar/Avatar.tsx` | `@lasl/frontend` | Component displaying user initials. |
| `apps/frontend/src/shared/components/avatar/Avatar.css` | `@lasl/frontend` | Styling for Avatar. |
| `apps/frontend/src/shared/components/popover/Popover.tsx` | `@lasl/frontend` | Popover menu component. |
| `apps/frontend/src/shared/components/popover/Popover.css` | `@lasl/frontend` | Styling for Popover. |
| `apps/frontend/src/shared/components/modal/Modal.tsx` | `@lasl/frontend` | Dialog overlay component. |
| `apps/frontend/src/shared/components/modal/Modal.css` | `@lasl/frontend` | Styling for Modal. |
| `apps/frontend/src/shared/components/settings-card/SettingsCard.tsx` | `@lasl/frontend` | Layout component for grouping settings sections. |
| `apps/frontend/src/shared/components/settings-card/SettingsCard.css` | `@lasl/frontend` | Styling for SettingsCard. |
| `apps/frontend/test/app/pages/settings/profile/ProfileSettingsPage.test.tsx` | `@lasl/frontend` | Tests for the settings page. |
| `apps/authentication-service/test/controller/update.password.controller.test.ts` | `@lasl/authentication-service` | Tests for update password logic. |
| `apps/authentication-service/test/controller/delete.user.controller.test.ts` | `@lasl/authentication-service` | Tests for delete user logic. |
| `packages/e2e-tests/tests/profile-settings.spec.ts` | `@lasl/e2e-tests` | E2E test for the profile settings flow. |

### Modified files
| Path | Package | Nature of change |
|------|---------|-----------------|
| `packages/app-contracts/src/api/auth.api.ts` | `@lasl/app-contracts` | Add API paths for `updatePassword` and `deleteAccount`. |
| `packages/app-contracts/src/routes/auth.routes.ts` | `@lasl/app-contracts` | Add frontend route for `/settings/profile`. |
| `packages/app-contracts/src/schemas/user.schemas.ts` | `@lasl/app-contracts` | Add schemas for updating password (with current password) and deleting account (with current password). |
| `packages/app-contracts/src/schemas/user.errors.ts` | `@lasl/app-contracts` | Add error constants for incorrect current password and display name length. |
| `apps/authentication-service/src/routes/user.routes.ts` | `@lasl/authentication-service` | Add new endpoints for password update and user deletion. |
| `apps/authentication-service/src/routes/user.routes.schema.ts` | `@lasl/authentication-service` | Add Swagger response schemas for the new endpoints. |
| `apps/authentication-service/src/schema/user.schema.ts` | `@lasl/authentication-service` | Export JSON schemas for the new endpoints. |
| `apps/frontend/src/app/layouts/main-layout/header/AuthButton.tsx` | `@lasl/frontend` | Update to replace "Logout" button with the new `Avatar` and `Popover` containing "Account settings" and "Logout" for authenticated users. |
| `apps/frontend/src/shared/components/button/Button.tsx` | `@lasl/frontend` | Add `--danger` variant to `Button`. |
| `apps/frontend/src/shared/components/button/Button.css` | `@lasl/frontend` | Add `--danger` variant styling. |
| `apps/frontend/src/api/user.api.ts` (or equivalent) | `@lasl/frontend` | Add API fetch functions for update password and delete account. |
| `apps/frontend/src/shared/hooks/api/useUser.ts` (or equivalent) | `@lasl/frontend` | Add mutations for update password and delete account. |
| `apps/frontend/src/locales/en-US/messages.po` | `@lasl/frontend` | LinguiJS generated updates (run `extract:messages`). |
| `apps/frontend/src/locales/de-DE/messages.po` | `@lasl/frontend` | LinguiJS generated updates. |
| `apps/frontend/src/locales/fr-FR/messages.po` | `@lasl/frontend` | LinguiJS generated updates. |

### Deleted files
| Path | Reason |
|------|--------|
| None | |

## New TypeScript Types & Interfaces

```typescript
// In packages/app-contracts/src/schemas/user.schemas.ts
export const updatePasswordSchema = z.object({
  currentPassword: z.string().nonempty({ error: USER_ERRORS.passwordRequired }),
  password: userPasswordSchema,
  passwordConfirmation: userPasswordConfirmationSchema,
}).superRefine(passwordMatchRefinement);

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;

export const deleteUserSchema = z.object({
  password: z.string().nonempty({ error: USER_ERRORS.passwordRequired }),
});

export type DeleteUserInput = z.infer<typeof deleteUserSchema>;
```

## New API Endpoints

1. **Update Password**
   - **Method**: `POST`
   - **Path Constant**: `authApiRoutes.user.updatePassword()` -> `/api/v1/users/me/password`
   - **Request Schema**: `updatePasswordSchema` (requires `currentPassword`, `password`, `passwordConfirmation`)
   - **Response Schema**: `genericMessageResponseSchema`
   - **Status Codes**: 200 OK, 400 Bad Request, 401 Unauthorized, 403 Forbidden (if current password wrong)
   - **Auth Required?**: Yes

2. **Delete Account**
   - **Method**: `DELETE`
   - **Path Constant**: `authApiRoutes.user.delete()` -> `/api/v1/users/me`
   - **Request Schema**: `deleteUserSchema` (requires `password`)
   - **Response Schema**: `genericMessageResponseSchema`
   - **Status Codes**: 200 OK, 400 Bad Request, 401 Unauthorized, 403 Forbidden (if password wrong)
   - **Auth Required?**: Yes

*Note*: Updating the display name will use the existing `PATCH authApiRoutes.user.me()` endpoint.

## app-contracts Changes
- **`src/api/auth.api.ts`**: Add `updatePassword` and `delete` to `authApiRoutes.user`.
- **`src/schemas/user.schemas.ts`**: Add `updatePasswordSchema` and `deleteUserSchema`.
- **`src/schemas/user.errors.ts`**: Add `passwordIncorrect: "errors.user.password.incorrect"` and length errors.
- **`src/routes/auth.routes.ts`**: Add `settingsProfile: "/settings/profile"`.

## New npm Dependencies
| Package | Workspace | Justification | Alternatives rejected |
|---------|-----------|---------------|-----------------------|
| `@radix-ui/react-popover` | `@lasl/frontend` | Accessible popover component for the user menu. | Building custom popover. Radix handles focus and a11y. |
| `@radix-ui/react-dialog` | `@lasl/frontend` | Accessible modal component for delete confirmation. | Building custom modal. Radix handles focus trap, ESC to close, etc. |
| `@radix-ui/react-avatar` | `@lasl/frontend` | Accessible avatar component. | Custom `div`. Radix handles image fallbacks cleanly. |

## Architecture Decisions

### Delete Account Session Invalidation
- **Choice**: After successful deletion in the backend, the backend will clear the refresh token cookie (similar to logout) and delete the user document. The frontend will then redirect to the home page or login page and clear its state.
- **Rationale**: Follows existing logout pattern.
- **Alternatives rejected**: Relying solely on token expiration. Immediate invalidation is safer.

## Refactoring Required
- The `AuthButton` component needs to be refactored to support rendering the new `Avatar` + `Popover` menu when a user is authenticated, replacing the simple "Logout" button.

## Error Handling
- **Wrong Current Password**: Backend responds with 403 Forbidden and `{ message: USER_ERRORS.passwordIncorrect }`. Frontend maps this to a form error.
- **Password Mismatch**: Frontend Zod validation catches this before submission.
- **Name Length**: Frontend Zod validation enforces min 2, max 50 on the "Display Name" field. Backend `updateUserInputSchema` should also enforce this if not already.

## i18n
New LinguiJS strings needed in `apps/frontend`. Use `<Trans>` and `t()` as appropriate.
- "Profile Settings"
- "Display Name"
- "Email Address"
- "Save Changes"
- "Change Password"
- "Current Password"
- "New Password"
- "Confirm New Password"
- "Update Password"
- "Delete Account"
- "Account settings"
- "Logout"
- "Are you sure you want to delete your account? This action is permanent and cannot be undone. Please enter your password to confirm."
- "Cancel"
- "Confirm Deletion"
- "Display name updated"
- "Password changed successfully"

## Testing Strategy

### Unit tests (Vitest)
- **Frontend**: Test `ProfileSettingsPage` rendering, form validations (password mismatch, name length), and correct submission payloads. Test `AuthButton` renders Avatar when logged in.
- **Backend**: Test `updatePasswordHandler` (success, wrong current password, invalid new password) in `update.password.controller.test.ts`. Test `deleteUserHandler` (success, wrong password) in `delete.user.controller.test.ts`.

### Integration tests (Vitest + mongodb-memory-server)
- Test `POST /api/v1/users/me/password` updates the password in DB and the new password can be used to log in.
- Test `DELETE /api/v1/users/me` removes the user document and invalidates the session.

## Security Considerations
- Require `currentPassword` for both password change and account deletion. This prevents CSRF attacks or a hijacked active session from locking the user out or deleting their account without knowing the password.
- Rate limit the password change and delete endpoints (if not already handled globally) to prevent brute-forcing the current password.

## Implementation Order
1. Update `packages/app-contracts/` — add schemas, path constants, error constants.
2. Rebuild app-contracts: `pnpm turbo run build --filter=@lasl/app-contracts`.
3. Update `authentication-service` backend routes, schemas, and controllers.
4. Write backend unit/integration tests and verify.
5. Install Radix UI primitives in `apps/frontend`.
6. Build new frontend components (`Avatar`, `Popover`, `Modal`, `SettingsCard`, `--danger` button).
7. Refactor `AuthButton` to use the new Avatar and Popover.
8. Build `ProfileSettingsPage` and wire up TanStack query mutations to the new APIs.
9. Write frontend Vitest tests.
10. Extract messages: `pnpm extract:messages`.
11. Run `pnpm check:ci`, `pnpm check:types`, `pnpm test`.