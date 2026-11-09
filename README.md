# JobShield AI

A student-focused, responsive frontend for checking job offers, internships, and recruiter messages.

## Run the project

```sh
bun install
bun run dev
```

## Frontend screens and important files

- `src/routes/index.tsx` — the JobShield home screen.
- `src/routes/check.tsx` — the interactive example offer checker and input validation.
- `src/routes/results.$scanId.tsx` — the explained, clearly marked sample report.
- `src/routes/dashboard.tsx` — locally saved example scans and separately labeled sample history.
- `src/routes/safety.tsx` — the student safety guide.
- `src/routes/signin.tsx` and `src/routes/signup.tsx` — non-submitting account previews. They do not collect or send credentials.
- `src/components/jobshield/site-layout.tsx` — the shared JobShield navigation and footer.
- `src/components/jobshield/auth-preview.tsx` — the explicitly nonfunctional account preview.
- `src/lib/jobshield.ts` — demo warning-phrase examples, response types, risk bands, and browser-local demo report storage.
- `src/styles.css` — shared JobShield typography, semantic colors, responsive styles, and motion.
- `src/assets/jobshield-scanner-hero.jpg` — the JobShield shield-and-offer image used on the home screen.
- `src/test/jobshield.test.ts` — focused tests for warning phrases, representative examples, and demo risk bands.

The checker uses a small set of phrases in the submitted text inside the browser. It is not an AI model, a company or recruiter lookup, or proof that an offer is safe or fraudulent. Saved report text stays in the current browser only when its storage is available. Every report says demo/example; never present these sample results as real AI analysis.

## Preparing an existing Supabase connection

This copy of the application currently has no Supabase or Lovable Cloud integration, generated Supabase client, environment configuration, or database migration. I could not inspect your existing Supabase project, tables, policies, or configured credentials from the repository, so no live login, logout, session persistence, account-based report saving, user-isolation test, or Gemini analysis has been added.

Connect your existing project yourself in Lovable at **Project Settings → General → External Supabase → Connect**. Do not paste database credentials, a service-role key, or a Gemini key into this repository or into frontend code. Once connected, check the existing database tables and Row Level Security policies before deciding whether any migration is needed.

When a generated browser client is enabled, the publishable browser configuration is `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (some externally managed setups name the publishable value `VITE_SUPABASE_ANON_KEY`). Neither is a private service-role secret. The current `src/start.ts` contains CSRF and error middleware only and has no session-token middleware; do not call protected server functions until the generated authenticated client and required bearer middleware are configured.

After the real database and its policies can be inspected, the likely application files are a session-aware auth provider, sign-in/sign-up and logout controls, protected report create/list functions, a report-details page that verifies row ownership through authenticated RLS, and targeted access-isolation tests. Keep account reports separate from the explicitly local demo examples. Do not invent a database schema or weaken existing policies just to make the demo work.

## Preparing Gemini analysis

No Gemini request, Supabase Function, Gemini credential, or real-AI claim is present. The submitted message must be treated as untrusted input; private Gemini credentials must be stored server-side in the connected project's function secrets, never in a browser variable or source file. The requested final output should validate and explicitly identify uncertainty as `risk_score`, `risk_level`, `explanation`, `warning_signs`, `positive_signs`, `safety_recommendations`, and `uncertainty_notes`, while rate limiting and handling provider errors. Do not say that an employer has been verified unless an actual verification source was used.

The current JobShield screen and result type already expose a clearly labeled example workflow, which is the safe frontend seam for a future structured response. First connect and inspect the existing Supabase project; then choose its supported server-side function location and secret store before connecting Gemini. Never ship an unprotected credential in client JavaScript.

## Checks

```sh
bun run test
```