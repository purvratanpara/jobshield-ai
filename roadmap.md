# JobShield AI roadmap

- [x] Build themed, responsive home and shared navigation.
- [x] Implement validated demo checkers, loading, explainable risk results, and browser-local history.
- [x] Add the safety guide and demo dashboard; finish clearly nonfunctional account screens without implying live authentication.
- [x] Add beginner-friendly setup/integration notes; record the client-only demo architecture in `AGENTS.md`.
- [ ] Verify navigation, primary interactions, mobile layout, tests, and preview diagnostics.
- [ ] Live Supabase email auth, session persistence, per-user reports, RLS testing, and logout — waiting for the user's existing project to be connected via Project Settings → General → External Supabase so the correct database and policies can be inspected.
- [ ] Live Gemini offer analysis via a secured Supabase function and AI response/error/rate-limit tests — waiting on that same Supabase project connection and its function deployment context; continue to keep all Gemini secrets server-side.
