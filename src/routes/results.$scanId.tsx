import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BadgeCheck, CircleAlert, LockKeyhole, ShieldAlert, ShieldCheck, TriangleAlert } from "lucide-react";

import { SiteLayout } from "@/components/jobshield/site-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { demoHistory, getRiskLevel, offerTypes, riskLabels, safeReadScans, type DemoScan, type RiskLevel } from "@/lib/jobshield";

export const Route = createFileRoute("/results/$scanId")({
  head: () => ({
    meta: [
      { title: "Example check result · JobShield AI" },
      { name: "description", content: "View the sample check's explained warning signs and sensible next steps." },
      { property: "og:title", content: "Example check result · JobShield AI" },
      { property: "og:description", content: "An example risk score—not employer verification or live AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResultPage,
});

const themes: Record<RiskLevel, { title: string; action: string; style: string; Icon: typeof CircleAlert }> = {
  high: { title: "Several warning signs", action: "Pause. Do not pay or share private information. Verify this employer independently first.", style: "text-destructive bg-destructive-soft/45 border-destructive/25", Icon: ShieldAlert },
  medium: { title: "Take a closer look", action: "Slow down and confirm who contacted you through the company’s official website or careers page.", style: "text-warning bg-warning/10 border-warning/25", Icon: TriangleAlert },
  low: { title: "Fewer example phrases found", action: "Still verify the employer and the opportunity independently. No demo score can guarantee that an offer is real.", style: "text-positive bg-positive/10 border-positive/25", Icon: ShieldCheck },
};

function ResultPage() {
  const { scanId } = Route.useParams();
  const [scan, setScan] = useState<DemoScan | null>(null);
  useEffect(() => {
    setScan(safeReadScans().find((item) => item.id === scanId) ?? demoHistory.find((item) => item.id === scanId) ?? null);
  }, [scanId]);

  if (!scan) {
    return <SiteLayout><section className="page-shell min-h-[28rem] max-w-2xl py-16"><Badge variant="outline" className="mb-4 border-warning/35 text-warning">Results are stored in your browser</Badge><h1 className="display-font text-3xl font-semibold text-foreground">We couldn't open this example.</h1><p className="mt-3 leading-7 text-muted-foreground">The result may be missing, or browser storage may be turned off. Try another demo check or open an example report from your dashboard.</p><div className="mt-6 flex flex-wrap gap-3"><Button asChild><Link to="/check">Check another message <ArrowRight aria-hidden="true" /></Link></Button><Button variant="outline" asChild><Link to="/dashboard">View example scans</Link></Button></div></section></SiteLayout>;
  }

  const theme = themes[getRiskLevel(scan.score)];
  const Icon = theme.Icon;
  const signals = scan.findings.length + scan.positiveSignals.length;

  return (
    <SiteLayout>
      <section className="page-shell max-w-4xl py-12 sm:py-16">
        <Button variant="ghost" size="sm" asChild className="mb-7 -ml-2"><Link to="/check"><ArrowLeft aria-hidden="true" /> Back to checker</Link></Button>
        <div className="flex flex-wrap items-center gap-2"><Badge variant="outline" className="border-warning/35 bg-warning/10 text-warning">SAMPLE RESULT · NOT AI</Badge><Badge variant="secondary">{offerTypes[scan.type].shortLabel}</Badge></div>
        <h1 className="display-font mt-4 text-3xl font-semibold text-foreground sm:text-[2.4rem]">An example check of your message.</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">For a {offerTypes[scan.type].label.toLowerCase()} · {scan.date}</p>

        <div className="mt-8 grid gap-5 md:grid-cols-[0.8fr_1.2fr]">
          <article className="rounded-md border border-border bg-card p-6 sm:p-8" aria-label={`Sample risk score ${scan.score} out of 100`}>
            <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-medium text-muted-foreground">Demo risk score</p><p className="mt-1 text-xs text-muted-foreground">An illustrative phrase match, not a probability.</p></div><span className="rounded-md border border-warning/30 bg-warning/10 px-2 py-1 text-[0.65rem] font-semibold tracking-normal text-warning">EXAMPLE</span></div>
            <div className="my-7 flex justify-center">
              <div className="risk-ring grid size-40 place-items-center rounded-full [--risk-progress:0%]" style={{ "--risk-progress": `${scan.score}%` } as React.CSSProperties}>
                <div className="grid size-32 place-content-center rounded-full bg-card text-center"><span className="display-font text-5xl font-semibold leading-none text-foreground">{scan.score}</span><span className="mt-1 text-xs text-muted-foreground">out of 100</span></div>
              </div>
            </div>
            <Badge className="mx-auto flex w-fit justify-center" variant={scan.level === "high" ? "destructive" : "secondary"}>{riskLabels[scan.level]}</Badge>
            <Progress aria-label="Illustrative demo score only" value={scan.score} className="mt-5 bg-muted" />
            <p className="mt-4 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">This number is calculated from example phrases in this browser, not an AI judgment or employer verification.</p>
          </article>

          <article className="rounded-md border border-border bg-card p-6 sm:p-8">
            <div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-foreground"><Icon aria-hidden="true" className="size-5" /></span><div><h2 className="display-font text-lg font-semibold">{theme.title}</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">{theme.action}</p></div></div>
            <div className="my-5 h-px bg-border" />
            <h3 className="text-sm font-semibold text-foreground">What stood out</h3>
            {signals > 0 ? <ul className="mt-3 space-y-3">{scan.findings.map((finding) => <li key={finding} className="flex items-start gap-2.5 text-sm leading-5 text-muted-foreground"><CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-warning" /><span>{finding}</span></li>)}{scan.positiveSignals.map((signal) => <li key={signal} className="flex items-start gap-2.5 text-sm leading-5 text-muted-foreground"><BadgeCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-positive" /><span>{signal}</span></li>)}</ul> : <p className="mt-2 text-sm text-muted-foreground">No example phrases were checked.</p>}
            <div className="my-5 h-px bg-border" />
            <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">Message snippet</p>
            <blockquote className="mt-2 border-l-2 border-primary/50 pl-3 text-sm leading-6 text-muted-foreground">{scan.content.length > 260 ? `${scan.content.slice(0, 260)}…` : scan.content}</blockquote>
          </article>
        </div>

        <div className={`mt-5 flex items-start gap-3 rounded-md border p-4 ${theme.style}`} role="note"><ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0" /><p className="text-sm font-medium leading-6">If money is requested: don’t send it. A legitimate employer generally won’t make you pay for a job offer, interview, or placement.</p></div>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button asChild><Link to="/safety">See safe next steps <ArrowRight aria-hidden="true" /></Link></Button>
          <Button variant="outline" asChild><Link to="/check">Check another message</Link></Button>
          <Button variant="ghost" asChild><Link to="/dashboard">Previous example scans</Link></Button>
        </div>
        <p className="mt-8 max-w-2xl text-xs leading-5 text-muted-foreground"><LockKeyhole aria-hidden="true" className="mr-1 inline size-3.5" /> Demo results are kept in this browser only. They aren’t sent anywhere or guaranteed to be saved if browser storage is unavailable.</p>
      </section>
    </SiteLayout>
  );
}