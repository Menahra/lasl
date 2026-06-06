# Feature Request: Locale Preference Persistence

## What I want

Right now, when a user selects a language (English, German, French) using the language switcher in the header, that choice is lost when they log out or refresh the page. I'd like the user's preferred language to be saved to their account so it's automatically restored whenever they log in, on any device.

## Context

The app already has a language switcher that lets users pick between en-US, de-DE, and fr-FR. The choice is currently stored in the browser only. I want it to follow the user, not the browser.

## Acceptance criteria

- When a logged-in user changes their language using the language switcher, the preference is saved to their profile automatically (no extra save button needed).
- When a user logs in, the app restores their saved language preference immediately.
- Guests (not logged in) still use the browser's default behavior — no change there.
- The email address shown on the profile page should be read-only (display only, no editing).

## Out of scope

- Changing the available languages (en-US, de-DE, fr-FR are sufficient for now).
- Admin tooling or language management.
