import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ClipboardPaste, RotateCcw, ScanSearch, ShieldAlert, ShieldCheck, Sparkles } from "lucide-react";

import { SiteLayout } from "@/components/jobshield/site-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createDemoScan, offerTypes, safeReadScans, safeSaveScans, scannerExamples, type OfferType } from "@/lib/jobshield";

export const Route = createFileRoute("/check")({
  head: () => ({
    meta: [
      { title: "Check a job or internship offer · JobShield AI" },
      { name: "description", content: "Check common warning phrases in a job offer, internship, or recruiter message using a sample-only demo." },
      { property: "og:title", content: "Offer checker demo · JobShield AI" },
      { property: "og:description", content: "Try a clear, student-friendly scam warning-sign example." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OfferCheckPage,
});

const types: OfferType[] = ["job", "internship", "message"];

function OfferCheckPage() {
  const navigate = useNavigate();
  const [type, setType] = useState<OfferType>("job");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  function pasteExample() {
    setMessage(scannerExamples[type]);
    setError("");
    setNotice("A sample offer is ready. Its result will be marked as demo data.");
  }

  function analyze(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleaned = message.trim();
    if (cleaned.length < 25) {
      setError("Add at least 25 characters so the demo has something to check.");
      return;
    }
    if (cleaned.length > 4000) {
      setError("Keep your message under 4,000 characters for this demo.");
      return;
    }
    setError("");
    setNotice("");
    setBusy(true);
    window.setTimeout(() => {
      const scan = createDemoScan(cleaned, type);
      const saved = safeSaveScans([scan, ...safeReadScans()]);
      if (!saved) {
        setNotice("Results can still be reviewed, but this browser cannot save previous demo scans.");
      }
      setBusy(false);
      void navigate({ to: "/results/$scanId", params: { scanId: scan.id } });
    }, 850);
  }

  return (
    <SiteLayout>
      <section className="page-shell max-w-5xl py-12 sm:py-16">
        <div className="max-w-2xl animate-fade-up">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="gap-1.5 border-primary/25 bg-primary/8 text-primary"><ScanSearch className="size-3.5" /> Interactive example</Badge>
            <span className="text-xs text-muted-foreground">No sign-in required</span>
          </div>
          <h1 className="display-font text-3xl font-semibold text-foreground sm:text-[2.5rem]">Check the details before you reply.</h1>
          <p className="mt-3 leading-7 text-muted-foreground">Choose the kind of message and review common warning signs in the sample checker.</p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <h2 className="mb-3 text-sm font-semibold text-foreground">What would you like to check?</h2>
            <div className="grid grid-cols-3 gap-2" role="group" aria-label="Offer type">
              {types.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={type === option}
                  onClick={() => { setType(option); setMessage(""); setError(""); setNotice(""); }}
                  className={cn("min-h-20 rounded-md border px-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", type === option ? "border-primary/60 bg-primary/10 text-foreground" : "border-border bg-card/70 text-muted-foreground hover:border-primary/40 hover:text-foreground")}
                >
                  <span className="block text-sm font-semibold">{offerTypes[option].shortLabel}</span>
                  <span className="mt-1 block text-xs leading-4">{option === "message" ? "Email or text" : "Offer details"}</span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{offerTypes[type].description}</p>

            <form className="mt-7 space-y-4" onSubmit={analyze}>
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label htmlFor="offer-message" className="text-sm font-semibold text-foreground">Paste the message</label>
                  <Button type="button" variant="ghost" size="sm" onClick={pasteExample}><ClipboardPaste aria-hidden="true" /> Try an example</Button>
                </div>
                <Textarea
                  id="offer-message"
                  value={message}
                  onChange={(event) => { setMessage(event.target.value); setError(""); setNotice(""); }}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "message-error" : "message-help"}
                  placeholder="Paste a message you'd like to look at…"
                  rows={8}
                  maxLength={5000}
                  className="min-h-52 resize-y border-border/90 bg-surface-soft text-sm leading-6 placeholder:text-muted-foreground/70"
                />
                <div className="mt-1.5 flex items-start justify-between gap-3 text-xs text-muted-foreground">
                  <span id="message-help">Redact names, phone numbers, and other private details first.</span>
                  <span className="shrink-0 tabular-nums">{message.length}/4,000</span>
                </div>
                {error && <p id="message-error" role="alert" className="mt-2 text-sm font-medium text-destructive">{error}</p>}
                {notice && <p role="status" className="mt-2 text-sm text-warning">{notice}</p>}
              </div>
              <Button type="submit" disabled={busy} className="h-11 w-full">
                {busy ? <><span className="size-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" /> Checking example message…</> : <>Show demo result <ArrowRight aria-hidden="true" /></>}
              </Button>
              <Button type="button" variant="ghost" size="sm" disabled={busy || !message} onClick={() => { setMessage(""); setError(""); setNotice(""); }} className="w-full text-muted-foreground"><RotateCcw aria-hidden="true" /> Clear message</Button>
            </form>
          </div>

          <aside className="border-l border-border/80 pl-0 lg:pl-8" aria-label="Important information about the demo">
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-warning/10 text-warning"><ShieldAlert aria-hidden="true" className="size-4.5" /></span>
                <div><h2 className="text-sm font-semibold text-foreground">A useful clue, never proof</h2><p className="mt-1.5 text-sm leading-6 text-muted-foreground">No warning phrase can verify an employer or prove that an offer is genuine. Confirm important details independently.</p></div>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"><Sparkles aria-hidden="true" className="size-4.5" /></span>
                <div><h2 className="text-sm font-semibold text-foreground">This is a front-end demo</h2><p className="mt-1.5 text-sm leading-6 text-muted-foreground">The example checker looks for a few common phrases in this browser. No real AI, company lookup, or live verification is connected.</p></div>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-positive/10 text-positive"><ShieldCheck aria-hidden="true" className="size-4.5" /></span>
                <div><h2 className="text-sm font-semibold text-foreground">Your decision is yours</h2><p className="mt-1.5 text-sm leading-6 text-muted-foreground">Avoid payments and requests for verification codes. Find the company's official careers page yourself.</p></div>
              </div>
              <Button asChild variant="outline" className="mt-2"><a href="/safety">Read the student safety guide <ArrowRight aria-hidden="true" /></a></Button>
            </div>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}