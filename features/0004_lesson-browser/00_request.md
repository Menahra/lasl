# Feature Request: Lesson Browser

## What I want

Now that there's a content service (feature 0003), I want a frontend experience where logged-in users can browse available lessons and read them. This is the first real "learning" screen in the app.

## What it should look like

Two screens:

**1. Lesson list page (`/lessons`)**
A simple grid or list of lesson cards. Each card shows the lesson title and a short description or keyword tags. Clicking a card navigates to the lesson detail page. The list is visible to logged-in users only.

**2. Lesson detail page (`/lessons/:id`)**
Shows the full lesson content. The content is structured (sections, text blocks, styling) as defined by the schema-engine. The page should render it cleanly — readable typography, good spacing, Arabic text rendered correctly (right-to-left where needed, appropriate font size). A back button returns to the lesson list.

## How I imagine the navigation

After logging in, the user is taken to a `/dashboard` or `/lessons` page instead of the current blank state. Add a "Lessons" link to the main navigation header so users can always get back to the list.

## Acceptance criteria

- `/lessons` lists all available lessons (title + keywords).
- `/lessons/:id` renders the full content of a specific lesson.
- Both routes are protected — unauthenticated users are redirected to `/login`.
- Arabic text is rendered right-to-left with appropriate styling.
- If a lesson ID doesn't exist, a friendly "not found" message is shown (no crash).
- Loading states are shown while content is being fetched.
- The header navigation includes a link to the lessons list for logged-in users.

## Out of scope

- Marking lessons as complete (progress tracking).
- Search or filtering lessons.
- Lesson creation or editing.
- Offline reading.
