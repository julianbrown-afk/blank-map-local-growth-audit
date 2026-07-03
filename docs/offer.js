(function () {
  "use strict";

  const baseConfig = window.MONEY_MAKER_CONFIG || {};
  const params = new URLSearchParams(window.location.search);

  function positiveNumber(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? number : fallback;
  }

  const config = {
    ...baseConfig,
    serviceName: params.get("service") || baseConfig.serviceName || "Local Growth Audit",
    marketCity: params.get("city") || baseConfig.marketCity || "Your City",
    businessName: params.get("business") || baseConfig.businessName || "Your Growth Studio",
    contactEmail: params.get("email") || baseConfig.contactEmail || "you@example.com",
    paymentLink: params.get("pay") || baseConfig.paymentLink || "",
    bookingLink: params.get("booking") || baseConfig.bookingLink || "",
    auditPrice: positiveNumber(params.get("audit"), positiveNumber(baseConfig.auditPrice, 399)),
    implementationPrice: positiveNumber(params.get("sprint"), positiveNumber(baseConfig.implementationPrice, 1500)),
    guaranteeLine: baseConfig.guaranteeLine || "A clear 30-day action plan, built from observable fixes.",
    included: Array.isArray(baseConfig.included) ? baseConfig.included : [],
    proofPoints: Array.isArray(baseConfig.proofPoints) ? baseConfig.proofPoints : []
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const initialTitle = document.title;
  let intakeCopyTimer = 0;
  let referralCopyTimer = 0;
  let referralBuilderCopyTimer = 0;
  let sampleCopyTimer = 0;
  let scoreCopyTimer = 0;
  let decisionCopyTimer = 0;
  let valueCopyTimer = 0;
  let homepageScoreTouched = false;

  function currency(value) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(Math.round(Number(value) || 0));
  }

  function ctaHref() {
    if (config.paymentLink) return config.paymentLink;
    if (config.bookingLink) return config.bookingLink;
    const subject = encodeURIComponent(`${config.serviceName} for my business`);
    return `mailto:${config.contactEmail}?subject=${subject}`;
  }

  function scorecardResultContext() {
    const handled = params.get("handled") || params.get("checks") || "";
    const missing = params.get("gaps") || params.get("missing") || "";
    const hasScoreContext = [
      "track",
      "lead",
      "prospect",
      "site",
      "website",
      "type",
      "value",
      "missed",
      "close",
      "handled",
      "checks",
      "gaps",
      "missing",
      "result"
    ].some((key) => params.has(key));

    if (!hasScoreContext) return null;

    const resultParams = new URLSearchParams();
    [
      "track",
      "lead",
      "prospect",
      "site",
      "website",
      "type",
      "value",
      "missed",
      "close",
      "handled",
      "checks",
      "gaps",
      "missing",
      "result"
    ].forEach((key) => {
      if (params.has(key)) resultParams.set(key, params.get(key));
    });

    if (params.get("result") !== "1" && (handled || missing)) {
      resultParams.set("result", "1");
    }

    return {
      businessName: params.get("lead") || params.get("prospect") || "",
      website: params.get("site") || params.get("website") || "",
      businessType: params.get("type") || params.get("track") || "",
      customerValue: params.get("value") || "",
      missedInquiries: params.get("missed") || "",
      closeRate: params.get("close") || "",
      handled,
      missing,
      resultLink: publicUrl(`scorecard.html?${resultParams.toString()}#scorecard-result`)
    };
  }

  function intakeText() {
    const scoreContext = scorecardResultContext();
    const scoreLines = scoreContext
      ? [
          "",
          "Scorecard context:",
          `Scorecard result link: ${scoreContext.resultLink}`,
          `Business type or track: ${scoreContext.businessType || ""}`,
          `Average booked customer value: ${scoreContext.customerValue || ""}`,
          `Missed qualified inquiries per month: ${scoreContext.missedInquiries || ""}`,
          `Likely close rate on recovered inquiries: ${scoreContext.closeRate || ""}`,
          `Handled checks: ${scoreContext.handled || ""}`,
          `Missing checks: ${scoreContext.missing || ""}`
        ]
      : [
          "",
          "Scorecard result link, if you have one:"
        ];

    return [
      `Hi ${config.businessName},`,
      "",
      "I purchased or booked the audit and want to start intake.",
      "",
      `Business name: ${scoreContext?.businessName || ""}`,
      `Website: ${scoreContext?.website || ""}`,
      "Service area:",
      "Highest-value service or offer:",
      "Current booking/contact path:",
      "Goal for this audit:",
      "Competitors or priority notes:",
      "Known booking, review, tracking, or follow-up bottlenecks:",
      ...scoreLines,
      "",
      "Payment name or email used at checkout:",
      "",
      "I understand the audit starts from public pages and the buyer path. I am not including passwords or account logins in this message.",
      ""
    ].join("\n");
  }

  function intakeMailto() {
    const subject = encodeURIComponent(`${config.serviceName} intake`);
    const body = encodeURIComponent(intakeText());
    return `mailto:${config.contactEmail}?subject=${subject}&body=${body}`;
  }

  function publicUrl(path = "") {
    const base = config.offerBaseUrl || window.location.href;
    try {
      return new URL(path, base).href;
    } catch (error) {
      return path || base;
    }
  }

  function writeClipboardText(text) {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      return Promise.resolve(false);
    }

    return Promise.race([
      navigator.clipboard.writeText(text).then(() => true).catch(() => false),
      new Promise((resolve) => setTimeout(() => resolve(false), 900))
    ]);
  }

  async function copyTextWithFallback(text) {
    let copied = await writeClipboardText(text);

    if (!copied) {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-999px";
      document.body.appendChild(area);
      area.focus();
      area.select();
      copied = document.execCommand("copy");
      area.remove();
    }

    return copied;
  }

  function updatePurchaseBarVisibility() {
    const bar = $(".purchase-bar");
    if (!bar) return;

    const threshold = Math.min(560, Math.round(window.innerHeight * 0.68));
    document.body.classList.toggle("purchase-bar-visible", window.scrollY > threshold);
  }

  function setupPurchaseBar() {
    if (!$(".purchase-bar")) return;
    window.addEventListener("scroll", updatePurchaseBarVisibility, { passive: true });
    window.addEventListener("resize", updatePurchaseBarVisibility);
    updatePurchaseBarVisibility();
  }

  async function copyIntakeTemplate() {
    const status = $("[data-intake-copy-status]");
    const manual = $("[data-intake-manual]");
    const text = intakeText();

    try {
      const copied = await copyTextWithFallback(text);

      if (!copied) throw new Error("Copy failed.");
      if (status) status.textContent = "Intake template copied.";
      if (manual) {
        manual.hidden = true;
        manual.value = "";
      }
    } catch (error) {
      if (status) status.textContent = "Copy blocked. The intake template is open below.";
      if (manual) {
        manual.value = text;
        manual.hidden = false;
        manual.focus();
        manual.select();
      }
    }

    clearTimeout(intakeCopyTimer);
    intakeCopyTimer = setTimeout(() => {
      if (status) status.textContent = "";
    }, 3600);
  }

  async function copyReferralText(event) {
    const button = event.currentTarget;
    const status = $("[data-referral-copy-status]");
    const manual = $("[data-referral-manual]");
    const text = button.dataset.copyText || button.dataset.copyUrl || "";
    const label = button.dataset.copyLabel || "Referral text";

    if (!text) return;

    try {
      const copied = await copyTextWithFallback(text);
      if (!copied) throw new Error("Copy failed.");
      if (status) status.textContent = `${label} copied.`;
      if (manual) {
        manual.hidden = true;
        manual.value = "";
      }
    } catch (error) {
      if (status) status.textContent = "Copy blocked. The text is open below.";
      if (manual) {
        manual.value = text;
        manual.hidden = false;
        manual.focus();
        manual.select();
      }
    }

    clearTimeout(referralCopyTimer);
    referralCopyTimer = setTimeout(() => {
      if (status) status.textContent = "";
    }, 3600);
  }

  function referralBuilderDetails() {
    const route = $("[data-referral-builder='route']");
    const type = $("[data-referral-builder='type']");
    const concern = $("[data-referral-builder='concern']");
    const business = $("[data-referral-builder='business']");
    const recipient = $("[data-referral-builder='recipient']");

    const selectedType = type?.selectedOptions?.[0];
    const selectedConcern = concern?.selectedOptions?.[0];
    const track = type?.value || "";
    const typeLabel = selectedType?.textContent.trim() || "local service business";

    return {
      route: route?.value || "scorecard",
      track,
      typeLabel,
      concern: selectedConcern?.textContent.trim() || "calls, bookings, reviews, tracking, or follow-up",
      businessName: business?.value.trim() || "",
      recipientName: recipient?.value.trim() || "there"
    };
  }

  function referralBuilderRoute(details = referralBuilderDetails()) {
    const scorecardPath = details.track
      ? `scorecard.html?track=${encodeURIComponent(details.track)}`
      : "scorecard.html";

    const routes = {
      scorecard: {
        label: "Free scorecard first",
        title: "Warm intro draft",
        linkLabel: "Free buyer-path scorecard",
        href: publicUrl(scorecardPath),
        setup: "A useful first step is to check the visible buyer path before spending more on ads, SEO, or a redesign."
      },
      calculator: {
        label: "Planning math first",
        title: "Value calculator intro",
        linkLabel: "Value calculator",
        href: publicUrl("lexington-local-growth-audit-value-calculator.html"),
        setup: "A useful first step is to size the possible buyer-path leak before deciding whether a paid audit is worth it."
      },
      quiz: {
        label: "Decision route first",
        title: "Decision quiz intro",
        linkLabel: "Decision quiz",
        href: publicUrl("lexington-local-growth-audit-decision-quiz.html"),
        setup: "A useful first step is to route the next move before buying anything."
      },
      sample: {
        label: "Proof first",
        title: "Sample-report intro",
        linkLabel: "Sample audit report",
        href: publicUrl("sample-audit.html"),
        setup: "A useful first step is to inspect the kind of deliverable before deciding whether the fixed-scope audit is worth buying."
      }
    };

    return routes[details.route] || routes.scorecard;
  }

  function referralBuilderText(details = referralBuilderDetails()) {
    const route = referralBuilderRoute(details);
    const businessLine = details.businessName
      ? `I thought of ${details.businessName} because the buyer path for a ${details.typeLabel.toLowerCase()} often depends on ${details.concern.toLowerCase()}.\n\n`
      : `I thought this may fit because the buyer path for a ${details.typeLabel.toLowerCase()} often depends on ${details.concern.toLowerCase()}.\n\n`;

    return `Hi ${details.recipientName},

${businessLine}${route.setup}

${route.linkLabel}:
${route.href}

If it shows clear gaps, the fixed-scope ${config.serviceName} turns the result into ranked findings, tracking notes, and a 30-day action plan for ${currency(config.auditPrice)}:
${publicUrl("")}

No pressure to buy first. The free result or sample should make the next step obvious. This is planning input, not a revenue guarantee.`;
  }

  function updateReferralBuilder() {
    const output = $("[data-referral-builder-output]");
    if (!output) return;

    const details = referralBuilderDetails();
    const route = referralBuilderRoute(details);
    const label = $("[data-referral-builder-route]");
    const title = $("[data-referral-builder-title]");
    const link = $("[data-referral-builder-link]");

    if (label) label.textContent = route.label;
    if (title) title.textContent = route.title;
    if (link) {
      link.href = route.href;
      link.textContent = route.linkLabel;
    }
    output.textContent = referralBuilderText(details);
  }

  async function copyReferralBuilderText() {
    const status = $("[data-referral-builder-status]");
    const manual = $("[data-referral-builder-manual]");
    const text = referralBuilderText();

    try {
      const copied = await copyTextWithFallback(text);
      if (!copied) throw new Error("Copy failed.");
      if (status) status.textContent = "Warm intro copied.";
      if (manual) {
        manual.hidden = true;
        manual.value = "";
      }
    } catch (error) {
      if (status) status.textContent = "Copy blocked. The intro is open below.";
      if (manual) {
        manual.value = text;
        manual.hidden = false;
        manual.focus();
        manual.select();
      }
    }

    clearTimeout(referralBuilderCopyTimer);
    referralBuilderCopyTimer = setTimeout(() => {
      if (status) status.textContent = "";
    }, 3600);
  }

  function sampleOrderBrief() {
    const bookingLine = config.bookingLink ? `Book a call: ${config.bookingLink}\n` : "";
    return `Local Growth Audit sample-to-order brief

I reviewed the sample report and want the same style of outside-in audit for my business.

What I am buying
${config.serviceName} for ${currency(config.auditPrice)}

What the audit should clarify
1. Where the public buyer path loses trust or momentum.
2. Which call, booking, quote, review, tracking, or follow-up gap should be fixed first.
3. What should be measured over the next 30 days.
4. Whether implementation work is worth quoting after the audit.

Next links
Buy audit: ${ctaHref()}
Audit intake after payment: ${publicUrl("audit-intake.html")}
${bookingLine}Sample report: ${publicUrl("sample-audit.html")}
Free scorecard: ${publicUrl("scorecard.html")}

This is planning input, not a revenue guarantee. The audit starts from public pages and the visible buyer path; no passwords are needed for the first report.`;
  }

  async function copySampleOrderBrief() {
    const status = $("[data-sample-copy-status]");
    const manual = $("[data-sample-manual]");
    const text = sampleOrderBrief();

    try {
      const copied = await copyTextWithFallback(text);
      if (!copied) throw new Error("Copy failed.");
      if (status) status.textContent = "Order brief copied.";
      if (manual) {
        manual.hidden = true;
        manual.value = "";
      }
    } catch (error) {
      if (status) status.textContent = "Copy blocked. The order brief is open below.";
      if (manual) {
        manual.value = text;
        manual.hidden = false;
        manual.focus();
        manual.select();
      }
    }

    clearTimeout(sampleCopyTimer);
    sampleCopyTimer = setTimeout(() => {
      if (status) status.textContent = "";
    }, 3600);
  }

  function renderCards(target, items) {
    target.innerHTML = items.map((item, index) => `
      <article>
        <strong>${String(index + 1).padStart(2, "0")}</strong>
        <p>${item}</p>
      </article>
    `).join("");
  }

  function scoreLeadDetails() {
    const details = {};
    $$("[data-score-lead]").forEach((input) => {
      details[input.dataset.scoreLead] = input.value.trim();
    });
    return details;
  }

  function homepageScoreState(options = {}) {
    const items = $$("[data-score-item]");
    const checked = items.filter((item) => item.checked).length;
    const gaps = Math.max(items.length - checked, 0);
    const missingLabels = items
      .filter((item) => !item.checked)
      .map((item) => {
        const label = item.closest("label");
        return label?.querySelector("span")?.textContent.trim() || "Unchecked buyer-path item";
      });
    const base = {
      checked,
      gaps,
      missingLabels,
      total: items.length
    };

    if (options.neutral && !homepageScoreTouched) {
      return {
        ...base,
        isScored: false,
        gaps: null,
        missingLabels: [],
        result: "Answer the five checks first",
        note: "Select what is already handled. Anything left unchecked becomes a visible gap to review."
      };
    }

    let result = "Lower audit priority";
    let note = "You may still use an audit for validation, but urgent gaps are not obvious from this quick check.";

    if (gaps >= 3) {
      result = "High audit priority";
      note = "Start with an audit before committing to implementation work.";
    } else if (gaps >= 1) {
      result = "Useful audit candidate";
      note = "A short audit can clarify which fixes are worth doing first.";
    }

    return {
      ...base,
      isScored: true,
      note,
      result
    };
  }

  function buildHomepageScoreSummary(state = homepageScoreState({ neutral: true }), details = scoreLeadDetails()) {
    const missingList = !state.isScored
      ? "Answer the quick check to see visible gaps."
      : state.missingLabels.length
      ? state.missingLabels.map((label, index) => `${index + 1}. ${label}`).join("\n")
      : "No urgent gap from this quick pass.";
    const gapLine = state.isScored ? `${state.gaps} of ${state.total}` : "Not scored yet";
    const usefulNextStep = state.isScored
      ? "If these gaps match what is happening in calls, bookings, quote requests, or follow-up, the paid audit turns the visible issues into ranked fixes, tracking notes, and a 30-day action plan."
      : "Answer the five visible buyer-path checks first. The result will show whether the paid audit has a clear job to do before larger marketing spend.";
    const businessLine = details.businessName ? `Business: ${details.businessName}\n` : "";
    const websiteLine = details.website ? `Website: ${details.website}\n` : "";
    const contactLine = details.contactEmail ? `Contact email: ${details.contactEmail}\n` : "";
    const bookingLine = config.bookingLink ? `Book a call: ${config.bookingLink}\n` : "";
    const paidAuditLine = config.paymentLink ? config.paymentLink : publicUrl("");

    return `Local Growth Audit quick self-check

${businessLine}${websiteLine}${contactLine}Result: ${state.result}
Gaps found: ${gapLine}
Recommendation: ${state.note}

Missing buyer-path basics
${missingList}

Useful next step
${usefulNextStep}

This is planning input, not a revenue guarantee.

Paid audit: ${paidAuditLine}
${bookingLine}Full scorecard: ${publicUrl("scorecard.html")}
Sample audit: ${publicUrl("sample-audit.html")}`;
  }

  function updateHomepageScoreActions(state = homepageScoreState({ neutral: true })) {
    const emailLink = $("[data-score-email]");
    if (!emailLink) return;

    const details = scoreLeadDetails();
    const subjectLead = details.businessName ? `${details.businessName}: ` : "";
    const subject = encodeURIComponent(`${subjectLead}${config.serviceName} self-check result`);
    const body = encodeURIComponent(`${buildHomepageScoreSummary(state, details)}\n\nI would like to understand what to fix first.`);
    emailLink.href = `mailto:${config.contactEmail}?subject=${subject}&body=${body}`;
  }

  async function copyHomepageScoreSummary() {
    const status = $("[data-score-copy-status]");
    const manual = $("[data-score-manual]");
    const text = buildHomepageScoreSummary(homepageScoreState({ neutral: true }));

    try {
      const copied = await copyTextWithFallback(text);
      if (!copied) throw new Error("Copy failed.");
      if (status) status.textContent = "Score summary copied.";
      if (manual) {
        manual.hidden = true;
        manual.value = "";
      }
    } catch (error) {
      if (status) status.textContent = "Copy blocked. The score summary is open below.";
      if (manual) {
        manual.value = text;
        manual.hidden = false;
        manual.focus();
        manual.select();
      }
    }

    clearTimeout(scoreCopyTimer);
    scoreCopyTimer = setTimeout(() => {
      if (status) status.textContent = "";
    }, 3600);
  }

  function decisionAnswers() {
    const answers = {};
    $$("[data-decision-question]:checked").forEach((input) => {
      answers[input.dataset.decisionQuestion] = input.value;
    });
    return answers;
  }

  function decisionRoute() {
    const answers = decisionAnswers();
    const answered = Object.keys(answers).length;
    const activeDemand = answers.demand === "active";
    const visibleGap = answers.gap === "yes";
    const unclearGap = answers.gap === "unsure";
    const biggerSpend = answers.spend === "yes";
    const soon = answers.timeline === "soon";
    const messy = answers.complexity === "messy";
    const wantsProof = answers.proof === "yes";
    const auditScore = [
      activeDemand,
      visibleGap,
      biggerSpend,
      soon
    ].filter(Boolean).length + (visibleGap ? 1 : 0);

    if (answered < 3) {
      return {
        key: "neutral",
        kicker: "Decision route",
        title: "Answer a few checks to get the lowest-friction next step.",
        body: "The quiz routes you to the free scorecard, sample report, fit call, or paid audit based on what is already clear.",
        primaryText: "Run free scorecard",
        primaryHref: publicUrl("scorecard.html"),
        secondaryText: "View sample",
        secondaryHref: publicUrl("sample-audit.html"),
        tertiaryText: "Buy audit",
        tertiaryHref: ctaHref(),
        reason: "Not enough answers yet."
      };
    }

    if (messy && (unclearGap || !visibleGap)) {
      return {
        key: "call",
        kicker: "Best route",
        title: "Book a fit call before paying.",
        body: "The buyer path sounds too complex to route from a quick quiz alone. Use a short call to decide whether the fixed audit is the right first move.",
        primaryText: config.bookingLink ? "Book a call" : "Email to book",
        primaryHref: config.bookingLink || ctaHref(),
        secondaryText: "Run free scorecard",
        secondaryHref: publicUrl("scorecard.html"),
        tertiaryText: "View method",
        tertiaryHref: publicUrl("lexington-local-growth-audit-method.html"),
        reason: "Multiple services, locations, or unclear gaps need a fit check before checkout."
      };
    }

    if (auditScore >= 4) {
      return {
        key: "buy",
        kicker: "Best route",
        title: "Buy the fixed-scope audit.",
        body: "You already have demand and a visible buyer-path problem. The audit is the lowest-commitment way to rank fixes before a larger spend.",
        primaryText: `Buy audit ${currency(config.auditPrice)}`,
        primaryHref: ctaHref(),
        secondaryText: "View sample",
        secondaryHref: publicUrl("sample-audit.html"),
        tertiaryText: "Start intake after payment",
        tertiaryHref: publicUrl("audit-intake.html"),
        reason: "Demand, visible friction, timing, and bigger-spend risk are all present."
      };
    }

    if (wantsProof) {
      return {
        key: "sample",
        kicker: "Best route",
        title: "Inspect the sample report first.",
        body: "If the audit sounds useful but the deliverable is not clear yet, inspect the sample before deciding whether the paid review is worth it.",
        primaryText: "View sample",
        primaryHref: publicUrl("sample-audit.html"),
        secondaryText: "See method",
        secondaryHref: publicUrl("lexington-local-growth-audit-method.html"),
        tertiaryText: "Buy audit",
        tertiaryHref: ctaHref(),
        reason: "The next concern is confidence in the deliverable."
      };
    }

    if (activeDemand || unclearGap || visibleGap) {
      return {
        key: "scorecard",
        kicker: "Best route",
        title: "Run the free scorecard and copy the result link.",
        body: "There may be a useful audit case, but the visible gaps need sharper definition first. The scorecard gives the next reply a concrete starting point.",
        primaryText: "Run free scorecard",
        primaryHref: publicUrl("scorecard.html"),
        secondaryText: "Check audit fit",
        secondaryHref: publicUrl("lexington-local-growth-audit-fit-check.html"),
        tertiaryText: "View one-sheet",
        tertiaryHref: publicUrl("lexington-local-growth-audit-one-sheet.html"),
        reason: "The buyer-path gap is not specific enough yet for a confident paid-audit decision."
      };
    }

    return {
      key: "wait",
      kicker: "Best route",
      title: "Use free resources before buying.",
      body: "The paid audit is strongest when there is already traffic, calls, bookings, quotes, or a visible buyer-path leak to diagnose.",
      primaryText: "Open resource directory",
      primaryHref: publicUrl("lexington-growth-scorecards.html"),
      secondaryText: "Run free scorecard",
      secondaryHref: publicUrl("scorecard.html"),
      tertiaryText: "View one-sheet",
      tertiaryHref: publicUrl("lexington-local-growth-audit-one-sheet.html"),
      reason: "Current answers do not show enough buyer-path friction for the paid audit to be the first step."
    };
  }

  function decisionSummary(route = decisionRoute()) {
    const answers = decisionAnswers();
    const lines = [
      "Local Growth Audit decision quiz",
      "",
      `Recommendation: ${route.title}`,
      `Reason: ${route.reason}`,
      "",
      "Answers:",
      `Existing demand: ${answers.demand || "Not answered"}`,
      `Visible buyer-path gap: ${answers.gap || "Not answered"}`,
      `Considering bigger spend: ${answers.spend || "Not answered"}`,
      `Timeline: ${answers.timeline || "Not answered"}`,
      `Buyer path complexity: ${answers.complexity || "Not answered"}`,
      `Need proof first: ${answers.proof || "Not answered"}`,
      "",
      "Next links:",
      `${route.primaryText}: ${route.primaryHref}`,
      `${route.secondaryText}: ${route.secondaryHref}`,
      `${route.tertiaryText}: ${route.tertiaryHref}`,
      "",
      "This is a routing guide, not a revenue guarantee."
    ];
    return lines.join("\n");
  }

  function updateDecisionQuiz() {
    const result = $("[data-decision-result]");
    if (!result) return;

    const route = decisionRoute();
    const kicker = $("[data-decision-kicker]", result);
    const title = $("[data-decision-title]", result);
    const body = $("[data-decision-body]", result);
    const reason = $("[data-decision-reason]", result);
    const primary = $("[data-decision-primary]", result);
    const secondary = $("[data-decision-secondary]", result);
    const tertiary = $("[data-decision-tertiary]", result);

    result.dataset.decisionState = route.key;
    if (kicker) kicker.textContent = route.kicker;
    if (title) title.textContent = route.title;
    if (body) body.textContent = route.body;
    if (reason) reason.textContent = route.reason;
    if (primary) {
      primary.textContent = route.primaryText;
      primary.href = route.primaryHref;
    }
    if (secondary) {
      secondary.textContent = route.secondaryText;
      secondary.href = route.secondaryHref;
    }
    if (tertiary) {
      tertiary.textContent = route.tertiaryText;
      tertiary.href = route.tertiaryHref;
    }
  }

  async function copyDecisionSummary() {
    const status = $("[data-decision-copy-status]");
    const manual = $("[data-decision-manual]");
    const text = decisionSummary();

    try {
      const copied = await copyTextWithFallback(text);
      if (!copied) throw new Error("Copy failed.");
      if (status) status.textContent = "Decision summary copied.";
      if (manual) {
        manual.hidden = true;
        manual.value = "";
      }
    } catch (error) {
      if (status) status.textContent = "Copy blocked. The decision summary is open below.";
      if (manual) {
        manual.value = text;
        manual.hidden = false;
        manual.focus();
        manual.select();
      }
    }

    clearTimeout(decisionCopyTimer);
    decisionCopyTimer = setTimeout(() => {
      if (status) status.textContent = "";
    }, 3600);
  }

  function updateScorecard() {
    const state = homepageScoreState({ neutral: true });
    const label = $("[data-score-label]");
    const result = $("[data-score-result]");
    const note = $("[data-score-note]");

    if (!label || !result || !note) return;

    label.textContent = state.isScored ? `${state.gaps} ${state.gaps === 1 ? "gap" : "gaps"} found` : "Not scored yet";
    result.textContent = state.result;
    note.textContent = state.note;
    updateHomepageScoreActions(state);
  }

  function valueMathState() {
    const inputs = {
      customerValue: $("[data-value-input='customerValue']"),
      missedInquiries: $("[data-value-input='missedInquiries']"),
      closeRate: $("[data-value-input='closeRate']")
    };
    if (!inputs.customerValue || !inputs.missedInquiries || !inputs.closeRate) return null;

    const customerValue = Number(inputs.customerValue.value) || 0;
    const missedInquiries = Number(inputs.missedInquiries.value) || 0;
    const closeRate = Number(inputs.closeRate.value) || 0;
    const monthlyValue = Math.round(customerValue * missedInquiries * (closeRate / 100));
    const auditPrice = Math.max(Number(config.auditPrice) || 399, 1);
    const payback = monthlyValue / auditPrice;

    return {
      customerValue,
      missedInquiries,
      closeRate,
      monthlyValue,
      auditPrice,
      payback
    };
  }

  function updateValueMath() {
    const state = valueMathState();
    if (!state) return;

    const outputCustomerValue = $("[data-value-output='customerValue']");
    const outputMissedInquiries = $("[data-value-output='missedInquiries']");
    const outputCloseRate = $("[data-value-output='closeRate']");
    const outputMonthlyValue = $("[data-value-output='monthlyValue']");
    const outputPaybackNote = $("[data-value-output='paybackNote']");

    if (outputCustomerValue) outputCustomerValue.textContent = currency(state.customerValue);
    if (outputMissedInquiries) outputMissedInquiries.textContent = String(state.missedInquiries);
    if (outputCloseRate) outputCloseRate.textContent = `${state.closeRate}%`;
    if (outputMonthlyValue) outputMonthlyValue.textContent = `${currency(state.monthlyValue)}/mo`;
    if (outputPaybackNote) {
      outputPaybackNote.textContent = state.payback >= 1
        ? `At ${currency(state.auditPrice)}, this is about ${state.payback.toFixed(1)}x the audit price in one month if the recovered path converts as estimated.`
        : `At ${currency(state.auditPrice)}, this shows why the audit should focus only on fixes with a realistic path to payback.`;
    }
  }

  function valueMathSummary(state = valueMathState()) {
    if (!state) return "";

    const bookingLine = config.bookingLink ? `Book a call: ${config.bookingLink}\n` : "";
    const paidAuditLine = config.paymentLink ? config.paymentLink : publicUrl("");
    const paybackLine = state.payback >= 1
      ? `The one-month planning estimate is about ${state.payback.toFixed(1)}x the audit price if the recovered path converts as estimated.`
      : "The one-month planning estimate is below the audit price, so the first step should be free scoring or a fit check before buying.";
    const recommendedRoute = state.payback >= 1
      ? "If the business already has demand and the buyer-path gap is visible, buy the fixed-scope audit or book a fit call."
      : "Start with the free scorecard or decision quiz before buying.";

    return `Local Growth Audit value calculator

Planning inputs
Average booked customer value: ${currency(state.customerValue)}
Missed qualified inquiries per month: ${state.missedInquiries}
Likely close rate on recovered inquiries: ${state.closeRate}%

Planning estimate
Estimated recoverable opportunity: ${currency(state.monthlyValue)}/mo
Audit price: ${currency(state.auditPrice)}
${paybackLine}

Recommended next step
${recommendedRoute}

This is planning math, not a revenue guarantee.

Paid audit: ${paidAuditLine}
${bookingLine}Decision quiz: ${publicUrl("lexington-local-growth-audit-decision-quiz.html")}
Free scorecard: ${publicUrl("scorecard.html")}
Sample audit: ${publicUrl("sample-audit.html")}`;
  }

  async function copyValueMathSummary() {
    const status = $("[data-value-copy-status]");
    const manual = $("[data-value-manual]");
    const text = valueMathSummary();

    try {
      const copied = await copyTextWithFallback(text);
      if (!copied) throw new Error("Copy failed.");
      if (status) status.textContent = "Calculator summary copied.";
      if (manual) {
        manual.hidden = true;
        manual.value = "";
      }
    } catch (error) {
      if (status) status.textContent = "Copy blocked. The calculator summary is open below.";
      if (manual) {
        manual.value = text;
        manual.hidden = false;
        manual.focus();
        manual.select();
      }
    }

    clearTimeout(valueCopyTimer);
    valueCopyTimer = setTimeout(() => {
      if (status) status.textContent = "";
    }, 3600);
  }

  function render() {
    if (initialTitle === "Local Growth Audit") document.title = config.serviceName;
    $$("[data-offer]").forEach((node) => {
      const key = node.dataset.offer;
      if (key === "auditPrice") node.textContent = currency(config.auditPrice);
      else if (key === "implementationPrice") node.textContent = `${currency(config.implementationPrice)} sprint`;
      else if (key === "contactLine") node.textContent = `Questions go to ${config.contactEmail}.`;
      else if (key === "included") renderCards(node, config.included);
      else if (key === "proofPoints") renderCards(node, config.proofPoints);
      else node.textContent = config[key] || "";
    });

    $$("[data-offer-link='cta']").forEach((link) => {
      link.href = ctaHref();
      link.textContent = config.paymentLink ? `Buy audit ${currency(config.auditPrice)}` : "Book audit";
    });

    $$("[data-offer-link='booking']").forEach((link) => {
      link.href = config.bookingLink || ctaHref();
      link.textContent = config.bookingLink ? "Book a call" : "Email to book";
    });

    $$("[data-offer-link='intake-email']").forEach((link) => {
      link.href = intakeMailto();
    });

    $$("[data-intake-copy]").forEach((button) => {
      button.addEventListener("click", copyIntakeTemplate);
    });

    $$("[data-referral-copy]").forEach((button) => {
      button.addEventListener("click", copyReferralText);
    });
    $$("[data-referral-builder]").forEach((field) => {
      field.addEventListener("input", updateReferralBuilder);
      field.addEventListener("change", updateReferralBuilder);
    });
    $$("[data-referral-builder-copy]").forEach((button) => {
      button.addEventListener("click", copyReferralBuilderText);
    });
    updateReferralBuilder();

    $$("[data-sample-copy]").forEach((button) => {
      button.addEventListener("click", copySampleOrderBrief);
    });

    $$("[data-score-item]").forEach((item) => {
      item.addEventListener("change", () => {
        homepageScoreTouched = true;
        updateScorecard();
      });
    });
    $$("[data-score-lead]").forEach((item) => {
      item.addEventListener("input", () => updateHomepageScoreActions(homepageScoreState({ neutral: true })));
    });
    $$("[data-score-copy]").forEach((button) => {
      button.addEventListener("click", copyHomepageScoreSummary);
    });
    updateScorecard();

    $$("[data-decision-question]").forEach((input) => {
      input.addEventListener("change", updateDecisionQuiz);
    });
    $$("[data-decision-copy]").forEach((button) => {
      button.addEventListener("click", copyDecisionSummary);
    });
    updateDecisionQuiz();

    $$("[data-value-input]").forEach((item) => {
      item.addEventListener("input", updateValueMath);
    });
    $$("[data-value-copy]").forEach((button) => {
      button.addEventListener("click", copyValueMathSummary);
    });
    updateValueMath();
    setupPurchaseBar();
  }

  render();
})();
