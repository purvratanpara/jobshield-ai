import { supabase, isConfigured } from "./lib/supabase.js";

const $ = (id) => document.getElementById(id);
const page = document.body.dataset.page || "home";
let user = null;
let authMode = "login";

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}
function showMessage(element, text, type = "info") {
  if (!element) return;
  element.textContent = text;
  element.className = `message ${type}`;
}
function toast(text) {
  const el = $("toast");
  if (!el) return;
  el.textContent = text;
  el.classList.add("show");
  window.setTimeout(() => el.classList.remove("show"), 2600);
}

function setUser(nextUser) {
  user = nextUser || null;

  const label = $("accountLabel");
  const link = $("accountLink");

  if (label) {
    label.textContent = user?.email || "Guest mode";
    label.title = user?.email || "Guest mode";
    label.setAttribute(
      "aria-label",
      user?.email ? `Signed in as ${user.email}` : "Guest mode"
    );
  }

  if (link) {
    link.textContent = user ? "Sign out" : "Sign in";
    link.href = user ? "#" : "account.html";

    link.onclick = user ? async (event) => {
      event.preventDefault();

      const confirmed = window.confirm(
        "Are you sure you want to sign out of JobShield AI?"
      );

      if (!confirmed) return;

      if (!supabase) {
        toast("Supabase is not configured.");
        return;
      }

      link.style.pointerEvents = "none";

      try {
        const { error } = await supabase.auth.signOut();

        if (error) throw error;

        setUser(null);
        toast("You have signed out successfully.");
        window.location.href = "account.html";
      } catch (error) {
        toast(error.message || "Sign out failed. Please try again.");
      } finally {
        link.style.pointerEvents = "";
      }
    } : null;
  }

  const signOut = $("signOutBtn");

  if (signOut) {
    signOut.classList.toggle("hidden", !user);
  }

  if (page === "history") loadHistory();
  if (page === "results") loadReportFromHistory();
}

function riskClass(level) { return String(level || "Low").toLowerCase(); }
function listHTML(items, fallback) {
  if (!Array.isArray(items) || !items.length) return `<p>${escapeHTML(fallback)}</p>`;
  return `<ul>${items.map(item => `<li>${escapeHTML(item)}</li>`).join("")}</ul>`;
}
function renderReport(report) {
  if (!report) return;
  const score = Math.max(0, Math.min(100, Number(report.risk_score) || 0));
  const level = report.risk_level || (score >= 70 ? "High" : score >= 35 ? "Medium" : "Low");
  const cls = riskClass(level);
  const content = $("resultContent");
  if (!content) return;
  content.innerHTML = `
    <div class="report-actions"><button id="downloadReportBtn" class="btn btn-outline">↓ Download report</button><a class="btn btn-primary" href="scan.html">New scan →</a></div>
    <div class="report-top">
      <div class="score-card"><div class="eyebrow">ESTIMATED RISK SCORE</div><div class="score-number ${cls}">${score}<span style="font-size:20px">/100</span></div><div class="score-label ${cls}">${escapeHTML(level)} RISK</div><small>Based only on details supplied</small></div>
      <div class="explanation-card"><h2>Job offer assessment</h2><p>${escapeHTML(report.explanation || "Not enough information for a detailed explanation.")}</p><div class="report-caveat"><strong>Important:</strong> This is an AI assessment, not a verified result. JobShield has not independently verified the company, recruiter or URL. A low score does not guarantee safety.</div></div>
    </div>
    <div class="report-grid">
      <article class="report-card"><h3>🚩 Possible warning signs</h3>${listHTML(report.warning_signs, "No specific warning signs identified. This does not guarantee safety.")}</article>
      <article class="report-card"><h3>✓ Positive signals</h3>${listHTML(report.positive_signs, "No clear positive signals supported by the text.")}</article>
      <article class="report-card"><h3>🛡 Safety recommendations</h3>${listHTML(report.safety_recommendations, "No extra recommendations returned.")}</article>
      <article class="report-card"><h3>⌕ Verification steps</h3>${listHTML(report.verification_steps, "Verify using independently found official channels.")}</article>
      <article class="report-card"><h3>ⓘ Uncertainty notes</h3>${listHTML(report.uncertainty_notes, "AI can miss context or make mistakes.")}</article>
    </div>`;
  $("downloadReportBtn")?.addEventListener("click", () => downloadReport(report));
}
function downloadReport(report) {
  const lines = [
    "JOBSHIELD AI — JOB OFFER RISK ASSESSMENT",
    `Date: ${new Date(report.created_at || Date.now()).toLocaleString()}`,
    `Company: ${report.company_name || "Not provided"}`,
    `Opportunity type: ${report.offer_type || "Not provided"}`,
    `Risk score: ${report.risk_score}/100`,
    `Risk level: ${report.risk_level || "Not provided"}`,
    "", "AI EXPLANATION", report.explanation || "",
    "", "POSSIBLE WARNING SIGNS", ...(report.warning_signs || []).map(x => "- " + x),
    "", "POSITIVE SIGNALS", ...(report.positive_signs || []).map(x => "- " + x),
    "", "SAFETY RECOMMENDATIONS", ...(report.safety_recommendations || []).map(x => "- " + x),
    "", "VERIFICATION STEPS", ...(report.verification_steps || []).map(x => "- " + x),
    "", "UNCERTAINTY NOTES", ...(report.uncertainty_notes || []).map(x => "- " + x),
    "", "DISCLAIMER: AI assessment only. This is not proof that an offer is genuine or fake. Independently verify the employer and recruiter."
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "JobShield-Scan-Report.txt"; a.click();
  URL.revokeObjectURL(url);
}

// Scan page
if (page === "scan") {
  const fileInput = $("offerFile");
  fileInput?.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    const preview = $("filePreview");
    if (!file || !preview) return;
    const allowed = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowed.includes(file.type) || file.size > 8 * 1024 * 1024) {
      fileInput.value = "";
      preview.classList.add("hidden");
      showMessage($("formMessage"), "Choose a PDF, JPG or PNG file smaller than 8 MB.", "error");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    const previewMedia = file.type.startsWith("image/")
      ? `<img src="${objectUrl}" alt="Selected offer preview" style="display:block;max-width:100%;max-height:180px;object-fit:contain;border-radius:8px;margin:0 auto 9px">`
      : `<div style="font-size:28px;margin-bottom:7px">📄</div>`;
    preview.innerHTML = `${previewMedia}<strong>✓ ${escapeHTML(file.name)}</strong><br><span>${(file.size / 1024 / 1024).toFixed(2)} MB selected. Paste the readable offer text below; automatic PDF/image text extraction is not enabled in this version.</span>`;
    preview.classList.remove("hidden");
  });
  $("offerText")?.addEventListener("input", () => {
    $("charCount").textContent = `${$("offerText").value.length.toLocaleString()} / 10,000`;
  });
  $("analyzeForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = $("formMessage");
    if (!isConfigured) return showMessage(message, "Supabase is not configured. Check your .env file.", "error");
    if (!user) {
      showMessage(message, "Please sign in first. Your scan report will be saved to your account.", "error");
      window.setTimeout(() => window.location.href = "account.html", 1000);
      return;
    }
    const offerText = $("offerText").value.trim();
    if (offerText.length < 30) return showMessage(message, "Please paste at least 30 characters of readable offer text.", "error");
    const file = $("offerFile").files?.[0];
    if (file && file.size > 8 * 1024 * 1024) return showMessage(message, "Your file is larger than 8 MB.", "error");
    const companyName = $("companyName").value.trim();
    const recruiterEmail = $("recruiterEmail").value.trim();
    const jobUrl = $("jobUrl").value.trim();
    const context = [
      offerText,
      jobUrl ? `\nJob advertisement URL supplied by user (not independently checked): ${jobUrl}` : "",
      recruiterEmail ? `\nRecruiter email supplied by user (not independently checked): ${recruiterEmail}` : ""
    ].join("");
    const button = $("analyzeBtn");
    button.disabled = true; button.innerHTML = "Analyzing securely…";
    try {
      const { data, error } = await supabase.functions.invoke("analyze-offer", {
        body: { offerText: context, companyName, offerType: $("offerType").value }
      });
      if (error) throw error;
      if (!data?.report) throw new Error(data?.error || "Unexpected response from the AI service.");
      sessionStorage.setItem("jobshieldLatestReport", JSON.stringify(data.report));
      window.location.href = "results.html";
    } catch (err) {
      showMessage(message, err.message || "Analysis failed. Please try again.", "error");
    } finally {
      button.disabled = false; button.innerHTML = 'Scan now <span>→</span>';
    }
  });
}

// Result page
async function loadReportFromHistory() {
  if (page !== "results" || !supabase || !user) return;
  const reportId = new URLSearchParams(window.location.search).get("id");
  if (!reportId) return;
  const { data, error } = await supabase.from("scan_reports").select("*").eq("id", reportId).single();
  if (error) toast("Could not load that report. Check that it belongs to your account.");
  else renderReport(data);
}
if (page === "results") {
  const params = new URLSearchParams(window.location.search);
  const cached = sessionStorage.getItem("jobshieldLatestReport");
  if (cached && !params.get("id")) {
    try { renderReport(JSON.parse(cached)); } catch { /* show empty state */ }
  }
}

// History page

let historyRequestId = 0;

async function loadHistory() {
  const list = $("historyList");
  const intro = $("historyIntro");

  if (!list) return;

  const requestId = ++historyRequestId;

  if (!isConfigured || !supabase) {
    if (intro) intro.textContent = "Supabase configuration is missing.";
    list.innerHTML = `
      <div class="empty-state">
        <h2>Connection required</h2>
        <p>Please check your Vercel environment variables.</p>
      </div>`;
    return;
  }

  if (!user) {
    if (intro) intro.textContent = "You are not signed in.";
    list.innerHTML = `
      <div class="empty-state">
        <h2>Sign in to view your scans</h2>
        <p>Your saved reports are private to your account.</p>
        <a class="btn btn-primary" href="account.html">Sign in →</a>
      </div>`;
    return;
  }

  const currentUser = user;

  if (intro) {
    intro.textContent = `Signed in as ${currentUser.email}`;
  }

  list.innerHTML = `
    <div class="empty-state">
      <p>Loading your saved reports...</p>
    </div>`;

  try {
    const queryPromise = supabase
      .from("scan_reports")
      .select("id,company_name,offer_type,risk_score,risk_level,created_at")
      .eq("user_id", currentUser.id)
      .order("created_at", { ascending: false })
      .limit(50);

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Loading took too long. Please check your internet and try again."));
      }, 15000);
    });

    const { data, error } = await Promise.race([
      queryPromise,
      timeoutPromise
    ]);

    if (requestId !== historyRequestId) return;

    if (user?.id !== currentUser.id) return;

    if (error) throw error;

    if (!data || data.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">✓</div>
          <h2>No scans yet</h2>
          <p>Your completed scans will appear here.</p>
          <a class="btn btn-primary" href="scan.html">
            Start your first scan →
          </a>
        </div>`;
      return;
    }

    list.innerHTML = data.map(row => `
      <article class="history-row">
        <div>
          <strong>${escapeHTML(row.company_name || "Unnamed opportunity")}</strong>
          <small>
            ${escapeHTML(row.offer_type || "Job offer")}
            · ${new Date(row.created_at).toLocaleString()}
          </small>
        </div>
        <div class="history-score">
          ${Number(row.risk_score) || 0}/100
          · ${escapeHTML(row.risk_level || "Unknown")}
          <br>
          <a href="results.html?id=${encodeURIComponent(row.id)}">
            Open report →
          </a>
        </div>
      </article>
    `).join("");

  } catch (error) {
    if (requestId !== historyRequestId) return;

    list.innerHTML = `
      <div class="empty-state">
        <h2>Unable to load your history</h2>
        <p>${escapeHTML(error.message || "Please try again.")}</p>
        <button class="btn btn-primary" id="retryHistoryBtn">
          Try again
        </button>
      </div>`;

    $("retryHistoryBtn")?.addEventListener("click", loadHistory);
  }
}

$("refreshHistoryBtn")?.addEventListener("click", loadHistory);

// Company verification page — this is a checklist, not a registry lookup.
$("verifyForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = $("verifyName").value.trim();
  const website = $("verifyWebsite").value.trim();
  const email = $("verifyEmail").value.trim();
  const result = $("verifyResult");
  let host = "";
  try { host = new URL(website).hostname.replace(/^www\./, ""); }
  catch { showMessage(result, "Please enter a valid website URL beginning with https://", "error"); result.classList.remove("hidden"); return; }
  const emailDomain = email.includes("@") ? email.split("@").pop().toLowerCase() : "";
  const domainMatch = emailDomain && (emailDomain === host || emailDomain.endsWith("." + host));
  result.innerHTML = `<h3>Company review checklist</h3><p><strong>${escapeHTML(name)}</strong> · ${escapeHTML(host)}</p><p>This page has not searched a company registry or checked website ownership. Use these steps to investigate:</p><ul><li>Open the website by typing the domain yourself and check its contact and careers pages.</li><li>Search the company name with words such as “official”, “registration” and “scam”.</li><li>Contact HR using a phone number or email found independently on the official website.</li><li>${email ? (domainMatch ? "The email domain matches the website domain entered. This is only a consistency signal, not proof of identity." : "The recruiter email domain differs from the website domain entered. Ask the company to confirm the recruiter through an official channel.") : "Compare the recruiter email domain with the company's official domain."}</li></ul><div class="report-caveat">No verification has been performed by JobShield. A matching domain does not prove the company or recruiter is genuine.</div>`;
  result.classList.remove("hidden");
});

// Account page
function setAuthMode(mode) {
  authMode = mode;
  $("loginTab")?.classList.toggle("active", mode === "login");
  $("signupTab")?.classList.toggle("active", mode === "signup");
  const button = $("authSubmit");
  if (button) button.innerHTML = mode === "login" ? "Sign in →" : "Create account →";
}
$("loginTab")?.addEventListener("click", () => setAuthMode("login"));
$("signupTab")?.addEventListener("click", () => setAuthMode("signup"));
$("authForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = $("authMessage");
  if (!supabase) return showMessage(message, "Supabase is not configured. Check your .env file.", "error");
  const email = $("authEmail").value.trim();
  const password = $("authPassword").value;
  const button = $("authSubmit"); button.disabled = true;
  try {
    if (authMode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      if (data.session?.user) {
        setUser(data.session.user);
        showMessage(message, "Account created and signed in. You can now scan an offer.", "success");
      } else {
        showMessage(message, "Account created. Check your email and confirm it before signing in.", "success");
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setUser(data.user);
      showMessage(message, "You are signed in. Your scan history is ready.", "success");
      window.setTimeout(() => window.location.href = "history.html", 900);
    }
  } catch (err) {
    showMessage(message, err.message || "Could not complete account request.", "error");
  } finally { button.disabled = false; }
});

$("signOutBtn")?.addEventListener("click", async () => {
  if (!supabase) return;

  const confirmed = window.confirm(
    "Are you sure you want to sign out of JobShield AI?"
  );

  if (!confirmed) return;

  const button = $("signOutBtn");
  if (button) button.disabled = true;

  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    setUser(null);
    showMessage(
      $("authMessage"),
      "You have signed out successfully.",
      "success"
    );

    window.location.href = "account.html";
  } catch (error) {
    showMessage(
      $("authMessage"),
      error.message || "Sign out failed. Please try again.",
      "error"
    );
  } finally {
    if (button) button.disabled = false;
  }
});



// Premium motion polish: reveal content as it enters the viewport.
document.querySelectorAll(".feature-card,.safety-card,.side-card,.form-panel,.report-card,.history-row").forEach((item) => {
  item.classList.add("scroll-reveal");
});
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
  document.querySelectorAll(".scroll-reveal").forEach((item) => revealObserver.observe(item));
} else {
  document.querySelectorAll(".scroll-reveal").forEach((item) => item.classList.add("is-visible"));
}


// Mobile navigation: open, close and update accessibility state.

const menuToggle = $("menuToggle");
const mainNav = $("mainNav");

function closeMobileMenu() {
  if (!menuToggle || !mainNav) return;

  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
  menuToggle.textContent = "☰";
}

menuToggle?.addEventListener("click", (event) => {
  event.stopPropagation();

  const isOpen = mainNav?.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close menu" : "Open menu"
  );
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

// Close after selecting a navigation link.
mainNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

// Close when clicking outside the navigation.
document.addEventListener("click", (event) => {
  if (
    mainNav?.classList.contains("open") &&
    !mainNav.contains(event.target) &&
    !menuToggle?.contains(event.target)
  ) {
    closeMobileMenu();
  }
});

// Close with Escape key.
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileMenu();
  }
});

// Close mobile menu when returning to desktop layout.
window.addEventListener("resize", () => {
  if (window.innerWidth > 900) {
    closeMobileMenu();
  }
});



/* Initialize Supabase authentication on every page */

async function initializeAuthentication() {
  if (!supabase || !isConfigured) {
    setUser(null);

    if (page === "history") {
      $("historyIntro").textContent =
        "Supabase is not configured. Please check your settings.";
    }

    return;
  }

  // Listen for login, logout and token refresh events.
  supabase.auth.onAuthStateChange((event, session) => {
    setUser(session?.user || null);
  });

  try {
    // Restore the existing login session after page refresh.
    const { data, error } = await supabase.auth.getSession();

    if (error) throw error;

    setUser(data.session?.user || null);

  } catch (error) {
    console.error("Authentication initialization failed:", error);

    setUser(null);

    if (page === "history") {
      $("historyIntro").textContent =
        "Could not restore your login session. Please sign in again.";
    }
  }
}

initializeAuthentication();