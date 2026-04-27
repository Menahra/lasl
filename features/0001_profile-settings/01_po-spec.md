# Profile Settings Page

## Metadata
- **Feature ID**: 0001
- **Slug**: profile-settings
- **Stage**: PO Spec
- **Date**: 2024-05-24

## Summary
This feature introduces a profile settings page where authenticated users can manage their account details. It allows users to update their display name, view their current email address in a read-only state, change their password, and permanently delete their account. This feature gives users autonomy over their profile data and security credentials within the application.

## User Story
As an **authenticated user**, I want to **access a settings page to manage my profile and security details**, so that **I can keep my display name up to date, change my password, or delete my account if I no longer wish to use the service**.

## Background & Context
According to Section 17 of `PROJECT_CONTEXT.md`, the system currently has a complete authentication and user management foundation (register, login, verify, password reset), but there is currently no centralized page for logged-in users to manage their account details. This feature bridges that gap by providing a settings page, leveraging the existing authentication mechanisms to ensure these actions are performed securely.

## Acceptance Criteria
- [ ] **AC-1**: The profile settings page is accessible only to authenticated users.
- [ ] **AC-2**: The page displays a "Display Name" input field, pre-populated with the user's current display name, which the user can edit and save.
- [ ] **AC-3**: The page displays the user's current email address in a read-only field (or clearly marked as non-editable).
- [ ] **AC-4**: The page provides a "Change Password" section with inputs for "Current Password", "New Password", and "Confirm New Password".
- [ ] **AC-5**: Submitting a password change requires all three password fields, and the "New Password" must exactly match "Confirm New Password".
- [ ] **AC-6**: The page includes a "Delete Account" button that, when clicked, opens a confirmation modal warning the user that the action is destructive and irreversible. The modal includes a text input requiring the user to type "DELETE" to enable the confirmation button.
- [ ] **AC-7**: Confirming the account deletion permanently deletes the user's data from the system, invalidates their session, and redirects them to the logged-out state (e.g., login or home page).
- [ ] **AC-8**: The display name input enforces a minimum length of 2 characters and a maximum length of 50 characters.

## Out of Scope
- Avatar / profile photo management
- Email address change flow
- Managing notification preferences
- Managing learning preferences

## Edge Cases & Error Handling
| Scenario | Expected Behaviour |
|----------|--------------------|
| Updating display name to an empty or whitespace-only string | Shows a validation error indicating that display name is required |
| Updating display name with less than 2 or more than 50 characters | Shows a validation error indicating the length requirement |
| Changing password with incorrect "Current Password" | Returns an error indicating the current password is incorrect |
| Changing password where "New Password" does not match "Confirm New Password" | Frontend validation prevents submission and shows an error |
| Changing password with a new password that fails complexity requirements | Shows an error detailing the password requirements |
| Closing or cancelling the "Delete Account" modal | Modal closes, account is not deleted, user remains on the settings page |
| Unauthenticated access attempt to the settings page | User is redirected to the login page |

## i18n Requirements
The following new user-visible strings need translations in en-US, de-DE, and fr-FR:
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
- "Are you sure you want to delete your account? This action is permanent and cannot be undone."
- "Cancel"
- "Confirm Deletion"
- Validation and success messages (e.g., "Display name updated", "Password changed successfully", "Passwords do not match", "Incorrect current password")

## Testing Notes
- **Happy Path**: Log in, navigate to Settings. Verify the email is correct and read-only. Change the display name and verify the change persists. Change the password successfully, then log out and log back in with the new password. Click "Delete Account", confirm the modal, and verify the user is redirected and cannot log back in.
- **Error Cases**: Attempt to save an empty display name. Attempt a password change with a wrong current password. Attempt a password change with mismatched new passwords.

## Dependencies
- Authentication service (needs to provide/support endpoints for updating display name, updating password, and deleting account).
- `app-contracts` (needs to contain shared schemas and paths for the new API endpoints).

## Open Questions
None
