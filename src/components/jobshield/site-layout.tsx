import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { ArrowUpRight, ShieldCheck, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";

const navigation = [
  { to: "/check" as const, label: "Check an offer" },
  { to: "/safety" as const, label: "Safety guide" },
  { to: "/dashboard" as const, label: "My dashboard" },
];

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" aria-label="JobShield AI home" className="group inline-flex shrink-0 items-center gap-2.5">
      <span className="brand-spark flex size-9 items-center justify-center rounded-md text-primary-foreground">
        <ShieldCheck aria-hidden="true" className="size-5" strokeWidth={2.2} />
      </span>
      <span className="display-font text-lg font-semibold leading-none tracking-normal text-foreground">
        JobShield<span className="text-primary">AI</span>
      </span>
      {!compact ? null : <span className="sr-only">Home</span>}
    </Link>
  );
}

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="app-backdrop min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border/70 surface-glass">
        <div className="page-shell flex h-[4.4rem] items-center justify-between gap-4">
          <Brand />
          <nav aria-label="Main navigation" className="hidden items-center gap-8 sm:flex">
            {navigation.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                data-active={location.pathname === item.to ? "true" : "false"}
                className="site-nav-link text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2 sm:flex">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/signin">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/signup">Get started <ArrowUpRight aria-hidden="true" /></Link>
            </Button>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="sm:hidden"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
        {menuOpen && (
          <nav aria-label="Mobile navigation" className="border-t border-border px-4 pb-5 pt-3 sm:hidden">
            <div className="page-shell flex flex-col items-stretch gap-1">
              {navigation.map((item) => (
                <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-3 text-sm font-medium hover:bg-muted">
                  {item.label}
                </Link>
              ))}
              <Link to="/signin" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-3 text-sm font-medium hover:bg-muted">Sign in</Link>
              <Button asChild className="mt-2 w-full"><Link to="/signup" onClick={() => setMenuOpen(false)}>Get started <ArrowUpRight aria-hidden="true" /></Link></Button>
            </div>
          </nav>
        )}
      </header>
      <main>{children}</main>
      <footer className="mt-20 border-t border-border/70">
        <div className="page-shell flex flex-col justify-between gap-5 py-7 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <Brand />
          <p>© 2026 JobShield AI · Stay informed. Decide with care.</p>
          <Link to="/safety" className="inline-flex items-center gap-1 font-medium text-foreground transition-colors hover:text-primary">
            Student safety guide <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </Link>
        </div>
        <p className="page-shell pb-5 text-xs text-muted-foreground">Demo only. This website doesn’t verify employers or determine whether an offer is real.</p>
      </footer>
    </div>
  );
}