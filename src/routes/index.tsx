import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Check, CircleAlert, ScanSearch, ShieldCheck, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/jobshield/site-layout";
import scannerImage from "@/assets/jobshield-scanner-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JobShield AI — pause before that offer" },
      { name: "description", content: "Check the warning signs in a job offer, internship, or recruiter message. Try JobShield AI's clearly labeled interactive demo." },
      { property: "og:title", content: "JobShield AI — pause before that offer" },
      { property: "og:description", content: "A calmer second look at suspicious job offers and internship messages." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const highlights = [
  { Icon: CircleAlert, title: "Spot pressure tactics", detail: "Notice urgency, unusually easy promises, and messages that push you off the record.", tone: "text-warning" },
  { Icon: ShieldCheck, title: "Get a second look", detail: "See common warning patterns explained in plain, student-friendly language.", tone: "text-primary" },
  { Icon: ScanSearch, title: "Know your next step", detail: "Take practical steps to verify a company before you share money or information.", tone: "text-positive" },
];

function HomePage() {
  return (
    <SiteLayout>
      <section className="page-shell grid min-h-[43rem] items-center gap-12 py-14 lg:grid-cols-[1.04fr_0.96fr] lg:gap-10 lg:py-20">
        <div className="animate-fade-up max-w-[38rem]">
          <Badge variant="outline" className="mb-6 gap-1.5 border-primary/25 bg-primary/8 px-3 py-1 text-primary">
            <Sparkles aria-hidden="true" className="size-3.5" /> A smarter first look for students
          </Badge>
          <h1 className="display-font max-w-[12ch] text-[2.85rem] font-semibold leading-[1.11] text-foreground sm:text-[3.55rem]">
            Pause before that <span className="text-gradient">offer.</span>
          </h1>
          <p className="mt-6 max-w-[34rem] text-lg leading-8 text-muted-foreground">
            A job or internship should never cost you your savings. Look for warning signs before you reply, pay, or share personal information.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button size="lg" asChild className="h-12 px-6">
              <Link to="/check">Check an offer <ArrowRight aria-hidden="true" /></Link>
            </Button>
            <Button variant="ghost" size="lg" asChild className="h-12 px-5">
              <Link to="/safety">Read the safety guide <ArrowUpRight aria-hidden="true" /></Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Check aria-hidden="true" className="size-4 text-positive" /> No account needed for a demo</span>
            <span className="inline-flex items-center gap-1.5"><Check aria-hidden="true" className="size-4 text-positive" /> Never pay to check</span>
          </div>
          <p className="mt-7 max-w-[36rem] rounded-sm border-l-2 border-warning/65 pl-3 text-xs leading-5 text-muted-foreground">
            Demo checker only. Example results illustrate common patterns; they are not AI analysis, proof, or a real-time employer check.
          </p>
        </div>
        <div className="animate-fade-up-delay relative mx-auto w-full max-w-[32rem] lg:max-w-none">
          <div className="hero-art-frame relative overflow-hidden rounded-md border border-border bg-card">
            <img
              src={scannerImage}
              width={1104}
              height={1200}
              alt="A translucent shield beside a job-offer document under a scanning light"
              fetchPriority="high"
              className="aspect-[0.92] w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-x-7 top-1/2 h-px bg-primary/70 shadow-[0_0_16px_var(--color-primary)] sm:inset-x-11" aria-hidden="true" />
            <div className="absolute inset-x-5 top-5 flex items-center justify-between sm:inset-x-7 sm:top-7">
              <Badge variant="outline" className="gap-1.5 border-border/70 bg-background/85 px-2.5 py-1.5 text-foreground backdrop-blur-sm">
                <ScanSearch aria-hidden="true" className="size-3.5 text-primary" /> Offer check, demo
              </Badge>
              <span className="flex items-center gap-2 rounded-md border border-border/70 bg-background/85 px-3 py-2 text-xs font-medium text-foreground backdrop-blur-sm">
                <span className="size-1.5 rounded-full bg-positive" /> Example scan
              </span>
            </div>
            <div className="absolute bottom-5 left-5 rounded-md border border-border/80 bg-background/90 p-3.5 backdrop-blur-sm sm:bottom-7 sm:left-7 sm:p-4">
              <p className="text-xs text-muted-foreground">What matters most</p>
              <p className="mt-1.5 text-sm font-semibold text-foreground">Never pay to get hired</p>
              <p className="mt-1 text-xs text-positive">You deserve a clear answer.</p>
            </div>
            <div className="absolute bottom-5 right-5 flex size-12 items-center justify-center rounded-full border border-positive/30 bg-background/90 text-positive backdrop-blur-sm sm:bottom-7 sm:right-7 sm:size-14" aria-hidden="true">
              <ShieldCheck className="size-6" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border/75 bg-surface-soft/70 py-6">
        <div className="page-shell flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium text-foreground">A useful pause, before your next reply.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground"><span>Job offers</span><span>Internship offers</span><span>Recruiter messages</span><span>Practical next steps</span></div>
        </div>
      </section>

      <section className="page-shell py-16 sm:py-20">
        <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-sm font-semibold text-primary">The calmer second look</p><h2 className="display-font mt-2 text-2xl font-semibold sm:text-3xl">Confidence starts with the right questions.</h2></div>
          <Link to="/check" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">Try an example check <ArrowRight aria-hidden="true" className="size-4" /></Link>
        </div>
        <div className="grid gap-x-8 gap-y-8 md:grid-cols-3">
          {highlights.map(({ Icon, title, detail, tone }, index) => (
            <article key={title} className="animate-fade-up border-t border-border pt-5" style={{ animationDelay: `${index * 75}ms` }}>
              <span className={`mb-4 inline-flex size-10 items-center justify-center rounded-md bg-muted ${tone}`}><Icon aria-hidden="true" className="size-5" /></span>
              <h3 className="display-font text-base font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-border/75 bg-surface-soft/65">
        <div className="page-shell flex flex-col gap-5 py-12 md:flex-row md:items-center md:justify-between">
          <div><p className="text-sm font-semibold text-primary">Be careful with anything that asks first</p><h2 className="display-font mt-2 text-xl font-semibold sm:text-2xl">A real opportunity should welcome your questions.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">An unfamiliar contact or quick offer isn't proof of a scam. Verify the employer through contact details you find independently.</p></div>
          <Button variant="outline" asChild className="shrink-0"><Link to="/safety">See how to verify <ArrowRight aria-hidden="true" /></Link></Button>
        </div>
      </section>
    </SiteLayout>
  );
}