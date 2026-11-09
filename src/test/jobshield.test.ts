import { describe, expect, it } from "vitest";

import { createDemoScan, getRiskLevel } from "@/lib/jobshield";

describe("JobShield's explicitly demo-only warning-phrase examples", () => {
  it("flags upfront job or internship fee requests as high risk", () => {
    const report = createDemoScan("Pay a $250 registration fee today to reserve your internship. No interview is needed and contact us on Telegram.", "internship");

    expect(report.level).toBe("high");
    expect(report.findings.some((finding) => finding.includes("payment"))).toBe(true);
  });

  it("flags a recruiter's personal email domain", () => {
    const report = createDemoScan("Your application has been selected by a recruiter at example. Reach us at recruiter@gmail.com.", "message");

    expect(report.findings.some((finding) => finding.includes("personal email"))).toBe(true);
  });

  it("flags urgency in recruitment messages", () => {
    const report = createDemoScan("We have an interview and need your reply immediately before the opportunity expires.", "message");

    expect(report.findings.some((finding) => finding.includes("quick decision"))).toBe(true);
  });

  it("flags claims that explicitly describe an unrealistic salary", () => {
    const report = createDemoScan("Earn $10,000 weekly for part-time work; this salary is unrealistic but guaranteed.", "job");

    expect(report.findings.some((finding) => finding.includes("unusually attractive pay"))).toBe(true);
  });

  it("flags requests for one-time passwords and verification codes", () => {
    const report = createDemoScan("Before your interview please share your OTP and one-time code.", "job");

    expect(report.findings.some((finding) => finding.includes("private identity"))).toBe(true);
  });

  it("warns when an offer includes no clear company details", () => {
    const report = createDemoScan("An urgent offer asks you to reply today before you hear back.", "message");

    expect(report.findings.some((finding) => finding.includes("clear company details"))).toBe(true);
  });

  it("keeps the check visibly illustrative for an ordinary-looking message", () => {
    const report = createDemoScan("A recruiter at a company invites you to a video call and says to apply on the company careers page.", "job");

    expect(report.level).not.toBe("high");
    expect(report.positiveSignals.length).toBeGreaterThan(0);
  });

  it("assigns the selected low, medium, and high demo score bands", () => {
    expect(getRiskLevel(37)).toBe("low");
    expect(getRiskLevel(38)).toBe("medium");
    expect(getRiskLevel(64)).toBe("medium");
    expect(getRiskLevel(65)).toBe("high");
  });
});