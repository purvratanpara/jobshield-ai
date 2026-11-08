import { createFileRoute } from "@tanstack/react-router";

import { AuthPreview } from "@/components/jobshield/auth-preview";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create an account preview · JobShield AI" },
      { name: "description", content: "Preview the JobShield AI account registration screen. Live sign-up is not connected yet." },
      { property: "og:title", content: "JobShield AI sign-up preview" },
      { property: "og:description", content: "Sample account screen; real account creation is not connected." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignUpPage,
});

function SignUpPage() {
  return <AuthPreview mode="signup" />;
}