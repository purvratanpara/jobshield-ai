# JobShield AI — frontend build

## Goal
Build a complete, polished frontend for a student-focused scam-checking service, keeping checks explicitly labeled as demo examples until real AI integration is connected.

## Work
1. Replace the starter screen with a premium, responsive JobShield home page, shared navigation, and a site-wide design system.
2. Add the job, internship, and recruitment-message checkers; validate input, show an animated demo analysis state, and display an explainable risk result.
3. Add a safety guide, dashboard, prior demo scan history, and sign-in/sign-up pages, with working navigation and meaningful feedback for every action.
4. Write beginner-friendly setup/integration notes identifying the created files and safe follow-on integration points; do not add Cloud, live AI, or pretend demo data is genuine.
5. Verify generated routes, core screen interactions, form validation, and desktop/mobile rendering; run the existing routing tests and inspect preview diagnostics.

## Technical notes
- Use TanStack Start file routes, React, and existing shadcn controls; preserve all starter behavior not replaced by the requested app.
- Keep user scans as clearly marked local demo history; no authentication service, database, model call, API key, or account persistence is implied.
- Use accessible keyboard-operable forms, icons, live status/result announcements, and semantic theme tokens in `src/styles.css`.
