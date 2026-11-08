export type OfferType = "job" | "internship" | "message";
export type RiskLevel = "low" | "guarded" | "high";
export type DemoScan = {
  id: string;
  type: OfferType;
  company: string;
  content: string;
  score: number;
  level: RiskLevel;
  findings: string[];
  positiveSignals: string[];
  date: string;
};

export const scanStorageKey = "jobshield-demo-scans";

export const offerTypes: Record<OfferType, { label: string; shortLabel: string; description: string }> = {
  job: {
    label: "Job offer",
    shortLabel: "Job",
    description: "A full-time or part-time job offer",
  },
  internship: {
    label: "Internship offer",
    shortLabel: "Internship",
    description: "An internship or placement offer",
  },
  message: {
    label: "Recruitment message",
    shortLabel: "Message",
    description: "A recruiter message, email, or text",
  },
};

export const scannerExamples: Record<OfferType, string> = {
  job: "Congratulations! You are hired immediately with a $95,000 salary. Pay the $250 refundable registration fee today to secure your remote job. No interview required. Contact our recruiter on Telegram.",
  internship: "Your application is shortlisted for our exclusive internship. Reserve your guaranteed spot with a training deposit by tonight. Your certificate and paid placement start next Monday.",
  message: "Hi! A recruiter noticed your profile and wants to hire you today. We just need a small processing fee. Message our hiring manager privately on WhatsApp to get started.",
};

export const demoHistory: DemoScan[] = [
  {
    id: "demo-01",
    type: "internship",
    company: "Brightpath Digital",
    content: "Pay a refundable registration fee today to secure your guaranteed placement.",
    score: 93,
    level: "high",
    findings: ["Upfront fee requested", "Guaranteed placement without an interview"],
    positiveSignals: [],
    date: "Example scan · demo data",
  },
  {
    id: "demo-02",
    type: "job",
    company: "Northstar Analytics",
    content: "A recruiter contacted you about a role and scheduled an interview.",
    score: 27,
    level: "low",
    findings: [],
    positiveSignals: ["An interview process is mentioned", "No payment request detected"],
    date: "Example scan · demo data",
  },
  {
    id: "demo-03",
    type: "message",
    company: "Unnamed recruiter",
    content: "An urgent message asks you to move to a private messaging app.",
    score: 64,
    level: "guarded",
    findings: ["Urgent deadline", "Request to use a private messaging app"],
    positiveSignals: [],
    date: "Example scan · demo data",
  },
];

export const safeReadScans = (): DemoScan[] => {
  try {
    const saved = window.localStorage.getItem(scanStorageKey);
    if (!saved) return [];
    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (scan): scan is DemoScan =>
        typeof scan === "object" &&
        scan !== null &&
        "id" in scan &&
        "score" in scan &&
        "content" in scan &&
        "type" in scan,
    );
  } catch {
    return [];
  }
};

export const safeSaveScans = (scans: DemoScan[]): boolean => {
  try {
    window.localStorage.setItem(scanStorageKey, JSON.stringify(scans.slice(0, 24)));
    return true;
  } catch {
    return false;
  }
};

export const getRiskLevel = (score: number): RiskLevel => {
  if (score >= 65) return "high";
  if (score >= 38) return "guarded";
  return "low";
};

export const riskLabels: Record<RiskLevel, string> = {
  low: "Fewer signs detected",
  guarded: "Proceed carefully",
  high: "Several warning signs",
};

export function createDemoScan(content: string, type: OfferType): DemoScan {
  const normalized = content.toLowerCase();
  const patterns: [RegExp, string, number][] = [
    [/\b(pay|payment|fee|deposit|registration fee|processing fee|wire money|crypto|bank details)\b/, "A payment or sensitive financial detail is requested", 43],
    [/\b(guaranteed|instant|hired immediately|no interview|everyone accepted|no experience)\b/, "A guaranteed offer or hiring-without-an-interview claim", 22],
    [/\b(urgent|today|tonight|immediately|within 24 hours|expires tonight|act now)\b/, "Pressure to make a quick decision", 16],
    [/\b(telegram|whatsapp|signal|private message|personal account)\b/, "A move to a private or informal messaging channel", 14],
    [/[\w.+-]+@(gmail|yahoo|outlook|hotmail|icloud)\.(com|net)/, "A recruiter is using a personal email service rather than a company email", 18],
    [/\b(password|one-time code|verification code|social security|passport number)\b/, "A request for private identity or account information", 30],
    [/\b(remote job|work from home|easy money|large salary|\$\s?\d{2,3},?\d{3})\b/, "An unusually attractive pay or work-from-home claim", 8],
  ];
  const findings: string[] = [];
  let score = 12;
  for (const [pattern, finding, weight] of patterns) {
    if (pattern.test(normalized)) {
      findings.push(finding);
      score += weight;
    }
  }
  score = Math.min(score, 98);
  const positiveSignals: string[] = [];
  if (/\b(interview|video call|meet the team|recruitment process)\b/.test(normalized)) {
    positiveSignals.push("A standard interview or recruitment step is mentioned");
    score = Math.max(8, score - 10);
  }
  if (/\b(official (company )?(email|website)|company careers page)\b/.test(normalized)) {
    positiveSignals.push("The message mentions an official company channel");
    score = Math.max(8, score - 8);
  }
  if (!/\b(company|inc\.?|corporation|careers page|official website|recruiter at)\b/.test(normalized)) {
    findings.push("The message does not give clear company details");
    score += 12;
  }
  if (findings.length === 0) {
    positiveSignals.push("This demo check did not match its example warning phrases");
  }
  score = Math.min(98, score);
  const level = getRiskLevel(score);
  return {
    id: `scan-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    company: guessCompany(content),
    content,
    score,
    level,
    findings,
    positiveSignals,
    date: new Date().toLocaleString(),
  };
}

function guessCompany(content: string): string {
  const named = content.match(/(?:at|from|with)\s+([A-Z][\w&.-]*(?:\s+[A-Z][\w&.-]*)?)/);
  return named?.[1] ?? "Offer not identified";
}