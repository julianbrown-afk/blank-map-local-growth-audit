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
  let scoreCopyTimer = 0;

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

  function intakeText() {
    return [
      `Hi ${config.businessName},`,
      "",
      "I purchased or booked the audit and want to start intake.",
      "",
      "Business name:",
      "Website:",
      "Service area:",
      "Highest-value service or offer:",
      "Current booking/contact path:",
      "Goal for this audit:",
      "Competitors or priority notes:",
      "Known booking, review, tracking, or follow-up bottlenecks:",
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

  function homepageScoreState() {
    const items = $$("[data-score-item]");
    const checked = items.filter((item) => item.checked).length;
    const gaps = Math.max(items.length - checked, 0);
    const missingLabels = items
      .filter((item) => !item.checked)
      .map((item) => {
        const label = item.closest("label");
        return label?.querySelector("span")?.textContent.trim() || "Unchecked buyer-path item";
      });
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
      checked,
      gaps,
      missingLabels,
      note,
      result,
      total: items.length
    };
  }

  function buildHomepageScoreSummary(state = homepageScoreState(), details = scoreLeadDetails()) {
    const missingList = state.missingLabels.length
      ? state.missingLabels.map((label, index) => `${index + 1}. ${label}`).join("\n")
      : "No urgent gap from this quick pass.";
    const businessLine = details.businessName ? `Business: ${details.businessName}\n` : "";
    const websiteLine = details.website ? `Website: ${details.website}\n` : "";
    const contactLine = details.contactEmail ? `Contact email: ${details.contactEmail}\n` : "";
    const bookingLine = config.bookingLink ? `Book a call: ${config.bookingLink}\n` : "";
    const paidAuditLine = config.paymentLink ? config.paymentLink : publicUrl("");

    return `Local Growth Audit quick self-check

${businessLine}${websiteLine}${contactLine}Result: ${state.result}
Gaps found: ${state.gaps} of ${state.total}
Recommendation: ${state.note}

Missing buyer-path basics
${missingList}

Useful next step
If these gaps match what is happening in calls, bookings, quote requests, or follow-up, the paid audit turns the visible issues into ranked fixes, tracking notes, and a 30-day action plan.

This is planning input, not a revenue guarantee.

Paid audit: ${paidAuditLine}
${bookingLine}Full scorecard: ${publicUrl("scorecard.html")}
Sample audit: ${publicUrl("sample-audit.html")}`;
  }

  function updateHomepageScoreActions(state = homepageScoreState()) {
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
    const text = buildHomepageScoreSummary();

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

  function updateScorecard() {
    const state = homepageScoreState();
    const label = $("[data-score-label]");
    const result = $("[data-score-result]");
    const note = $("[data-score-note]");

    if (!label || !result || !note) return;

    label.textContent = `${state.gaps} ${state.gaps === 1 ? "gap" : "gaps"} found`;
    result.textContent = state.result;
    note.textContent = state.note;
    updateHomepageScoreActions(state);
  }

  function updateValueMath() {
    const inputs = {
      customerValue: $("[data-value-input='customerValue']"),
      missedInquiries: $("[data-value-input='missedInquiries']"),
      closeRate: $("[data-value-input='closeRate']")
    };
    if (!inputs.customerValue || !inputs.missedInquiries || !inputs.closeRate) return;

    const customerValue = Number(inputs.customerValue.value) || 0;
    const missedInquiries = Number(inputs.missedInquiries.value) || 0;
    const closeRate = Number(inputs.closeRate.value) || 0;
    const monthlyValue = Math.round(customerValue * missedInquiries * (closeRate / 100));
    const auditPrice = Math.max(Number(config.auditPrice) || 399, 1);
    const payback = monthlyValue / auditPrice;

    const outputCustomerValue = $("[data-value-output='customerValue']");
    const outputMissedInquiries = $("[data-value-output='missedInquiries']");
    const outputCloseRate = $("[data-value-output='closeRate']");
    const outputMonthlyValue = $("[data-value-output='monthlyValue']");
    const outputPaybackNote = $("[data-value-output='paybackNote']");

    if (outputCustomerValue) outputCustomerValue.textContent = currency(customerValue);
    if (outputMissedInquiries) outputMissedInquiries.textContent = String(missedInquiries);
    if (outputCloseRate) outputCloseRate.textContent = `${closeRate}%`;
    if (outputMonthlyValue) outputMonthlyValue.textContent = `${currency(monthlyValue)}/mo`;
    if (outputPaybackNote) {
      outputPaybackNote.textContent = payback >= 1
        ? `At ${currency(auditPrice)}, this is about ${payback.toFixed(1)}x the audit price in one month if the recovered path converts as estimated.`
        : `At ${currency(auditPrice)}, this shows why the audit should focus only on fixes with a realistic path to payback.`;
    }
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

    $$("[data-score-item]").forEach((item) => {
      item.addEventListener("change", updateScorecard);
    });
    $$("[data-score-lead]").forEach((item) => {
      item.addEventListener("input", () => updateHomepageScoreActions());
    });
    $$("[data-score-copy]").forEach((button) => {
      button.addEventListener("click", copyHomepageScoreSummary);
    });
    updateScorecard();

    $$("[data-value-input]").forEach((item) => {
      item.addEventListener("input", updateValueMath);
    });
    updateValueMath();
    setupPurchaseBar();
  }

  render();
})();
