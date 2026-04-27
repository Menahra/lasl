# Design: profile-settings

## Screen inventory
| # | File | Description |
|---|------|-------------|
| 01 | 01_top-nav-authenticated | Top navigation bar showing the user menu indicator (avatar with initials) instead of the "Sign In" button, and the open popover showing "Account settings" and "Logout". |
| 02 | 02_profile-settings-page | The main Profile Settings page at `/settings/profile`. Includes editable "Display Name", read-only "Email Address", "Change Password" fields, and a "Delete Account" button. |
| 03 | 03_delete-account-modal | A confirmation modal that opens when the user clicks "Delete Account". It shows a warning message, requires the "Current Password" input, and has "Cancel" and "Confirm Deletion" buttons. |

## Design decisions
- **Page Layout**: The settings page uses a max-width container (`800px`) centered on the screen, split into distinct cards ("Personal Information", "Change Password", "Danger Zone") to organize functionality clearly.
- **RTL handling**: RTL handling is not explicitly modeled in these mockups as they primarily use English text, but the CSS layout is mostly flex-based which will adapt well to RTL if `dir="rtl"` is applied (margins/paddings might need logical properties like `margin-inline-start`).
- **Danger Zone**: The delete account section is visually distinct, using the `--error-500` and `--error-700` colors to indicate a destructive action. The button uses a danger variant.
- **Modal Overlay**: The delete account modal uses a dark semi-transparent overlay (`rgba(15, 23, 42, 0.5)`) and blurs the background content slightly to draw focus to the critical confirmation step.

## New components needed
- **Avatar**: A simple circular component displaying user initials.
- **Popover/Dropdown**: A menu that positions itself relative to an anchor element (like the Avatar).
- **SettingsCard**: A layout component to group related settings sections.
- **Modal**: A dialog overlay for critical confirmations (like account deletion), including header (with icon), body, and footer areas.
- **Button Variants**: A danger variant (`Button--danger`) is needed for destructive actions.

## Token usage notes
All tokens satisfied by existing system.
