# Profile Settings Page

## Metadata
- **Feature ID**: 0001
- **Slug**: profile-settings
- **Stage**: PO Spec
- **Date**: 2025-03-24

## Summary
This feature provides authenticated users with a dedicated page to manage their account. It includes updating their personal information (First and Last name), viewing their registered email, changing their password, and the ability to permanently delete their account. This ensures users have full control over their data and security.

## User Story
As an **authenticated user**, I want to **access a settings page**, so that **I can update my display name, change my password, or delete my account if I no longer want to use the service**.

## Background & Context
The application currently has the foundation for user management (see `PROJECT_CONTEXT.md` section 5 and 17), but lacks a user-facing settings interface. The user model in `authentication-service` stores `firstName` and `lastName`. This feature will expose these for editing. The "Display Name" referred to in the request will be implemented as the combination of `firstName` and `lastName`.

## Acceptance Criteria
- [ ] **AC-1**: The profile settings page is available at the route `/settings/profile`.
- [ ] **AC-2**: Only authenticated users can access `/settings/profile`. Unauthenticated users attempting to access this route are redirected to `/login`.
- [ ] **AC-3**: The top navigation bar displays a user menu (avatar/initials) for authenticated users. Clicking it reveals a dropdown/popover with "Account settings" (linking to `/settings/profile`) and "Logout".
- [ ] **AC-4**: The page displays the user's current email address in a disabled/read-only input field.
- [ ] **AC-5**: The page provides input fields for "First Name" and "Last Name", pre-populated with current values.
- [ ] **AC-6**: Saving changes to the name requires both fields to be non-empty and have a maximum length of 50 characters.
- [ ] **AC-7**: A "Change Password" section allows users to update their password. It requires "Current Password", "New Password", and "Confirm New Password".
- [ ] **AC-8**: Password change validation: "New Password" must match "Confirm New Password" and meet system complexity rules (min 8 chars, 1 uppercase, 1 lowercase, 1 number).
- [ ] **AC-9**: A "Delete Account" button is located in a "Danger Zone" section.
- [ ] **AC-10**: Clicking "Delete Account" opens a confirmation modal. The "Confirm" button in the modal is disabled until the user enters their correct "Current Password".
- [ ] **AC-11**: Confirming account deletion triggers a `DELETE` request. On success, the user's data is removed, they are logged out, and redirected to the home page with a confirmation toast/message.

## Out of Scope
- Changing the account email address.
- Uploading a profile picture.
- Notification or language preference settings (these will be separate features).

## Edge Cases & Error Handling
| Scenario | Expected Behaviour |
|----------|--------------------|
| User submits empty First or Last name | Frontend validation prevents submission; shows "Field is required". |
| User enters incorrect current password during password change | API returns `401 Unauthorized` or `400 Bad Request` with `INCORRECT_PASSWORD` code; UI shows error message. |
| User enters new password that is the same as the old one | Allowed, but shows a warning or succeeds as normal. |
| Account deletion fails due to network error | Modal remains open; shows "An error occurred. Please try again." |
| User enters incorrect password in deletion modal | "Confirm Deletion" remains disabled or returns error message on click. |

## i18n Requirements
New strings for `en-US`, `de-DE`, `fr-FR`:
- "Profile Settings"
- "First Name"
- "Last Name"
- "Email Address" (Read-only)
- "Save Changes"
- "Change Password"
- "Current Password"
- "New Password"
- "Confirm New Password"
- "Update Password"
- "Delete Account"
- "Danger Zone"
- "Are you sure you want to delete your account? This action is permanent and all your data will be removed."
- "Enter your password to confirm"
- "Cancel"
- "Confirm Deletion"
- "Profile updated successfully"
- "Password updated successfully"
- "Your account has been deleted"

## Testing Notes
- **Manual/E2E**: Verify navigation from the top-right user menu.
- **Manual/E2E**: Test the password change flow and verify the old password no longer works.
- **Manual/E2E**: Test the account deletion flow and verify the user is redirected and their credentials no longer work.
- **UI**: Ensure the email field is visually distinct as read-only.

## Dependencies
- Authentication Service: Needs `PATCH /users/me` (or similar) for name/password updates and `DELETE /users/me` for deletion.
- App Contracts: Shared schemas for the update and delete requests.

## Open Questions
- Should we use a single "Display Name" field in the DB instead of `firstName`/`lastName`? *Decision: No, stick to the existing `firstName`/`lastName` model to avoid breaking changes, but label them clearly in the UI.*
