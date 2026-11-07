import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CircleAlert, ExternalLink, FileCheck2, ShieldAlert, ShieldCheck, WalletCards } from "lucide-react";

import { SiteLayout } from "@/components/jobshield/site-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/safety")({
  head: () => ({
    meta: [
      { title: "Student job-scam safety guide · JobShield AI" },
      { name: "description", content: "Practical ways to verify a recruiter, protect personal information, and respond to suspicious job and internship offers." },
      { property: "og:title", content: "Student job-scam safety guide · JobShield AI" },
      { property: "og:description", content: "Steps to check before you pay, apply, or share your details." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SafetyPage,
});

const guide = [
  { Icon: ShieldCheck, title: "Find the company independently", detail: "Type the organization’s known web address yourself. Look for the opening on its own careers page and contact the company through a number published there—not only a number in the message.", tone: "text-primary" },
  { Icon: CircleAlert, title: "Take your time", detail: "Be cautious of pressure to act right away, an unusually easy hiring process, unusually attractive pay, or a request to continue only in private chat.", tone: "text-warning" },
  { Icon: WalletCards, title: "Never pay to be hired", detail: "Don’t pay an application, interview, training, equipment-shipping, or placement fee to get a job or internship. Be wary of checks asking you to return money, too.", tone: "text-destructive" },
  { Icon: FileCheck2, title: "Keep sensitive details private", detail: "Don’t send account passwords or one-time codes. Wait to share identity or banking details until you have independently verified the employer and understand why the information is required.", tone: "text-violet" },
];

function SafetyPage() {
  return (
    <SiteLayout>
      <section className="page-shell max-w-4xl py-12 sm:py-16">
        <Badge variant="outline" className="mb-4 gap-1.5 border-positive/25 bg-positive/10 text-positive"><ShieldCheck className="size-3.5" /> Made for students</Badge>
        <h1 className="display-font max-w-3xl text-3xl font-semibold leading-tight text-foreground sm:text-[2.6rem]">Your offer. Your questions. Your call.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">Use a few careful steps to verify the people, the company, and the next thing they ask you to do.</p>

        <div className="mt-9 divide-y divide-border border-y border-border">
          {guide.map(({ Icon, title, detail, tone }, index) => (
            <article key={title} className="grid gap-3 py-6 sm:grid-cols-[2rem_1fr] sm:gap-4">
              <span className={`flex size-8 items-center justify-center rounded-md bg-muted ${tone}`}><Icon aria-hidden="true" className="size-4" /></span>
              <div><p className="mb-1 text-xs font-medium text-muted-foreground">STEP 0{index + 1}</p><h2 className="display-font text-lg font-semibold text-foreground">{title}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{detail}</p></div>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-md border border-warning/25 bg-warning/8 p-5 sm:p-6">
          <div className="flex items-start gap-3"><ShieldAlert className="mt-0.5 size-5 shrink-0 text-warning" /><div><h2 className="text-sm font-semibold text-foreground">Already shared money or details?</h2><p className="mt-1.5 text-sm leading-6 text-muted-foreground">Contact your bank or payment service using its official number. Update any affected passwords, tell someone you trust, and report the message through the channel you received it.</p></div></div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"><Button asChild><Link to="/check">Check an example message <ArrowRight aria-hidden="true" /></Link></Button><Button variant="ghost" asChild><Link to="/dashboard">See sample history</Link></Button></div>
        <p className="mt-7 max-w-2xl text-xs leading-5 text-muted-foreground">General safety information only; rules and reporting options vary by country. A cautious check does not replace independent employer verification.</p>
      </section>
    </SiteLayout>
  );
}