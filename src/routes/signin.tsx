import { createFileRoute } from "@tanstack/react-router";

import { AuthPreview } from "@/components/jobshield/auth-preview";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign in preview · JobShield AI" },
      { name: "description", content: "Preview the JobShield AI sign-in screen. Live sign-in is not connected yet." },
      { property: "og:title", content: "JobShield AI sign-in preview" },
      { property: "og:description", content: "Sample account screen; real account sign-in is not connected." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignInPage,
});

function SignInPage() {
  return <AuthPreview mode="signin" />;
}