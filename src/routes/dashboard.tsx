import { useEffect, useMemo, useState, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, ArrowRight, ChevronRight, Clock3, ScanSearch, ShieldAlert, ShieldCheck, Sparkles, Trash2 } from "lucide-react";

import { SiteLayout } from "@/components/jobshield/site-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { demoHistory, offerTypes, riskLabels, safeReadScans, safeSaveScans, type DemoScan, type RiskLevel } from "@/lib/jobshield";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Example scan history · JobShield AI" },
      { name: "description", content: "Review saved demo checks in this browser and clearly labeled example scan results." },
      { property: "og:title", content: "Example scan history · JobShield AI" },
      { property: "og:description", content: "An illustrative student scam-check dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

type FilterValue = "all" | "job" | "internship" | "message";
const riskStyles: Record<RiskLevel, string> = { high: "border-destructive/25 bg-destructive-soft/40 text-destructive", medium: "border-warning/25 bg-warning/10 text-warning", low: "border-positive/25 bg-positive/10 text-positive" };

function DashboardPage() {
  const [savedScans, setSavedScans] = useState<DemoScan[]>([]);
  const [filter, setFilter] = useState<FilterValue>("all");
  const [notice, setNotice] = useState("");
  useEffect(() => setSavedScans(safeReadScans()), []);
  const filtered = useMemo(() => savedScans.filter((scan) => filter === "all" || scan.type === filter), [savedScans, filter]);
  const higherRisk = savedScans.filter((scan) => scan.level !== "low").length;

  function clearSaved() {
    if (!window.confirm("Clear locally saved demo checks from this browser?")) return;
    if (safeSaveScans([])) {
      setSavedScans([]);
      setNotice("Saved demo checks were cleared from this browser.");
    } else {
      setNotice("This browser could not clear saved demo checks.");
    }
  }

  return (
    <SiteLayout>
      <section className="page-shell max-w-6xl py-12 sm:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><Badge variant="outline" className="mb-3 border-warning/30 bg-warning/10 text-warning">DEMO DASHBOARD</Badge><h1 className="display-font text-3xl font-semibold text-foreground sm:text-4xl">Your check history.</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Your recent checks stay in this browser. Sign-in and cloud sync aren’t connected.</p></div><Button asChild className="sm:self-end"><Link to="/check"><ScanSearch aria-hidden="true" /> Check an offer <ArrowRight aria-hidden="true" /></Link></Button></div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Summary icon={<ScanSearch className="size-4 text-primary" />} label="Your saved demo checks" value={savedScans.length} note="Saved in this browser" />
          <Summary icon={<ShieldAlert className="size-4 text-warning" />} label="Worth a second look" value={higherRisk} note="Non-low demo phrases" />
          <Summary icon={<Activity className="size-4 text-positive" />} label="Checks available" value="03" note="Job · Internship · Message" />
        </div>

        {notice && <p role="status" className="mt-5 text-sm text-positive">{notice}</p>}
        <section className="mt-10" aria-labelledby="my-scans-heading">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h2 id="my-scans-heading" className="display-font text-xl font-semibold">Your recent checks</h2><p className="mt-1 text-xs text-muted-foreground">Only visible in this browser; these are not an account or cloud history.</p></div>{savedScans.length > 0 && <Button variant="ghost" size="sm" onClick={clearSaved}><Trash2 aria-hidden="true" /> Clear saved</Button>}</div>
          {savedScans.length > 0 ? <>
            <Tabs value={filter} onValueChange={(value) => setFilter(value as FilterValue)}>
              <TabsList aria-label="Filter saved scans" className="mb-4 flex h-auto flex-wrap justify-start gap-1"><TabsTrigger value="all">All checks</TabsTrigger><TabsTrigger value="job">Jobs</TabsTrigger><TabsTrigger value="internship">Internships</TabsTrigger><TabsTrigger value="message">Messages</TabsTrigger></TabsList>
            </Tabs>
            <div className="divide-y divide-border border-y border-border">{filtered.map((scan) => <ScanRow key={scan.id} scan={scan} />)}</div>
            {filtered.length === 0 && <p className="py-6 text-sm text-muted-foreground">No saved checks match this filter yet.</p>}
          </> : <div className="flex flex-col items-start gap-3 border-y border-border py-7 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-muted-foreground">No messages have been checked in this browser yet.</p><Button variant="outline" size="sm" asChild><Link to="/check">Try a sample check <ArrowRight aria-hidden="true" /></Link></Button></div>}
        </section>

        <section className="mt-12" aria-labelledby="sample-history-heading">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><h2 id="sample-history-heading" className="display-font text-xl font-semibold">Example scan history</h2><p className="mt-1 text-xs text-muted-foreground">Preloaded examples — not checks made by you.</p></div><Badge variant="secondary" className="gap-1.5"><Sparkles aria-hidden="true" className="size-3" /> Sample data</Badge></div>
          <div className="divide-y divide-border border-y border-border">{demoHistory.map((scan) => <ScanRow key={scan.id} scan={scan} sample />)}</div>
        </section>
        <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground"><Clock3 aria-hidden="true" className="size-3.5" /> Saved example checks are stored locally and only on a device that supports browser storage.</div>
      </section>
    </SiteLayout>
  );
}

function Summary({ icon, label, value, note }: { icon: ReactNode; label: string; value: string | number; note: string }) {
  return <div className="min-w-0 border-t border-border py-5"><div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">{icon}<span>{label}</span></div><p className="display-font mt-3 text-3xl font-semibold text-foreground">{value}</p><p className="mt-1 text-xs text-muted-foreground">{note}</p></div>;
}

function ScanRow({ scan, sample = false }: { scan: DemoScan; sample?: boolean }) {
  return <article className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:gap-5">
    <div className="flex min-w-0 flex-1 items-start gap-3"><span className={cn("mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md", scan.level === "high" ? "bg-destructive-soft/55 text-destructive" : scan.level === "medium" ? "bg-warning/10 text-warning" : "bg-positive/10 text-positive")}><ShieldCheck aria-hidden="true" className="size-4.5" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-semibold text-foreground">{scan.company}</h3><Badge variant="secondary" className="text-[0.65rem]">{offerTypes[scan.type].shortLabel}</Badge>{sample && <Badge variant="outline" className="border-warning/30 text-warning">EXAMPLE</Badge>}</div><p className="mt-1 truncate text-xs text-muted-foreground">{scan.content}</p><p className="mt-1 text-[0.68rem] text-muted-foreground">{sample ? "Sample scan · demo data" : scan.date}</p></div></div>
    <div className="flex items-center justify-between gap-4 sm:w-[16rem] sm:justify-end"><span className="display-font text-lg font-semibold tabular-nums text-foreground">{scan.score}<span className="ml-0.5 text-xs font-normal text-muted-foreground">/100</span></span><span className={cn("min-w-28 rounded-md border px-2 py-1 text-center text-[0.65rem] font-medium", riskStyles[scan.level])}>{riskLabels[scan.level]}</span><Button variant="ghost" size="icon" aria-label={sample ? "View the example report" : "Open saved check"} asChild><Link to="/results/$scanId" params={{ scanId: scan.id }}><ChevronRight aria-hidden="true" /></Link></Button></div>
  </article>;
}