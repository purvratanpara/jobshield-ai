import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";

import { Brand, SiteLayout } from "@/components/jobshield/site-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthPreview({ mode }: { mode: "signin" | "signup" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const signingUp = mode === "signup";

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (signingUp && password !== confirm) {
      setError("Those passwords don’t match. Please check them and try again.");
      return;
    }
    setMessage("Your demo account was not created. Email sign-in and saved cloud accounts are not connected yet; no password was saved or sent.");
  }

  return (
    <SiteLayout>
      <section className="page-shell flex min-h-[38rem] max-w-xl flex-col justify-center py-12 sm:py-16">
        <Link to="/" className="mb-7 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft aria-hidden="true" className="size-4" /> Home</Link>
        <div className="mb-5 flex items-center gap-3"><Brand /><span className="rounded-sm border border-warning/30 bg-warning/10 px-2 py-1 text-[0.65rem] font-semibold text-warning">PREVIEW</span></div>
        <h1 className="display-font text-3xl font-semibold text-foreground">{signingUp ? "Create an account" : "Welcome back"}</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{signingUp ? "An account can keep your checks together once authentication is connected." : "Sign in to see your personal check history once authentication is connected."}</p>

        <form onSubmit={submit} className="mt-7 space-y-4">
          <div className="space-y-2"><Label htmlFor="account-email">Email address</Label><Input id="account-email" type="email" autoComplete="email" placeholder="you@example.com" required value={email} onChange={(event) => setEmail(event.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="account-password">Password</Label><Input id="account-password" type="password" autoComplete={signingUp ? "new-password" : "current-password"} minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} /></div>
          {signingUp && <div className="space-y-2"><Label htmlFor="account-password-confirm">Confirm password</Label><Input id="account-password-confirm" type="password" autoComplete="new-password" minLength={8} required value={confirm} onChange={(event) => setConfirm(event.target.value)} /></div>}
          {error && <p role="alert" className="text-sm font-medium text-destructive">{error}</p>}
          <Button type="submit" className="w-full">{signingUp ? "Create account preview" : "Sign-in preview"} <ArrowRight aria-hidden="true" /></Button>
          {message && <p role="status" className="rounded-md border border-warning/25 bg-warning/8 p-3 text-sm leading-6 text-warning">{message}</p>}
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">{signingUp ? "Already have an account?" : "New to JobShield AI?"} <Link to={signingUp ? "/signin" : "/signup"} className="font-medium text-primary hover:underline">{signingUp ? "Sign in" : "Create an account"}</Link></p>
        <p className="mt-6 flex items-start gap-2 rounded-md border border-border bg-card/60 p-3 text-xs leading-5 text-muted-foreground"><LockKeyhole aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-primary" /> Preview only: the form never sends or stores your email or password. Account sign-in and cloud report history are waiting for your existing Supabase project to be connected.</p>
        <Button variant="outline" asChild className="mt-5 w-full"><Link to="/check"><ShieldCheck aria-hidden="true" /> Use the checker without an account</Link></Button>
      </section>
    </SiteLayout>
  );
}