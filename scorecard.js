(function () {
  "use strict";

  const config = window.MONEY_MAKER_CONFIG || {};
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  let copyTimer = 0;

  function currency(value) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(Math.round(Number(value) || 0));
  }

  function toNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function setText(selector, value) {
    $$(selector).forEach((node) => {
      node.textContent = value;
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function offerUrl(path = "") {
    const configured = String(config.offerBaseUrl || "https://julianbrown-afk.github.io/blank-map-local-growth-audit/").trim();
    const base = configured.endsWith("/") ? configured : `${configured}/`;
    return new URL(path, base).toString();
  }

  function scorecardState() {
    const items = $$("[data-free-score-item]");
    const checked = items.filter((item) => item.checked);
    const missing = items.filter((item) => !item.checked);
    const gaps = missing.length;
    const score = Math.max(0, Math.round((checked.length / items.length) * 100));

    const customerValue = toNumber($("[data-free-score-input='customerValue']")?.value, 650);
    const missedInquiries = toNumber($("[data-free-score-input='missedInquiries']")?.value, 3);
    const closeRate = toNumber($("[data-free-score-input='closeRate']")?.value, 35);
    const monthlyValue = Math.round(customerValue * missedInquiries * (closeRate / 100));
    const missingLabels = missing.map((item) => item.dataset.freeScoreLabel || item.value || item.closest("label")?.innerText || "Buyer-path gap");

    let priority = "Lower immediate priority";
    let note = "Your visible buyer path looks comparatively sound. Use the audit if you want outside validation before bigger work.";
    if (gaps >= 4) {
      priority = "High-priority audit";
      note = "Several buyer-path basics are missing. Start with a focused audit before paying for more traffic or a larger redesign.";
    } else if (gaps >= 2) {
      priority = "Useful audit candidate";
      note = "There are enough gaps to justify a short outside-in review and a prioritized 30-day action plan.";
    }

    return {
      score,
      gaps,
      priority,
      note,
      customerValue,
      missedInquiries,
      closeRate,
      monthlyValue,
      missingLabels
    };
  }

  function buildScoreSummary(state) {
    const topGaps = state.missingLabels.length
      ? state.missingLabels.slice(0, 4).map((label, index) => `${index + 1}. ${label}`).join("\n")
      : "No urgent gap from this quick pass.";

    return `Free Local Growth Scorecard result

Score: ${state.score}/100
Priority: ${state.priority}
Gaps found: ${state.gaps}
Estimated recoverable opportunity: ${currency(state.monthlyValue)}/mo

Planning inputs
Average booked customer value: ${currency(state.customerValue)}
Missed qualified inquiries per month: ${state.missedInquiries}
Likely close rate on recovered inquiries: ${state.closeRate}%

Top gaps
${topGaps}

This is planning math, not a revenue guarantee.

Scorecard: ${offerUrl("scorecard.html")}
Paid audit: ${offerUrl("")}
Sample audit: ${offerUrl("sample-audit.html")}`;
  }

  function updateScorecardActions(state) {
    const summary = buildScoreSummary(state);
    const emailLink = $("[data-free-score-email]");
    if (emailLink) {
      const subject = encodeURIComponent(`Local Growth Scorecard result: ${state.score}/100`);
      const body = encodeURIComponent(`${summary}\n\nI would like to understand what to fix first.`);
      emailLink.href = `mailto:${config.contactEmail || "JulianBrown@blankmapgroup.com"}?subject=${subject}&body=${body}`;
    }
  }

  function updateFreeScorecard() {
    const items = $$("[data-free-score-item]");
    if (!items.length) return;

    const state = scorecardState();

    setText("[data-free-score-output='score']", `${state.score}/100`);
    setText("[data-free-score-output='gaps']", `${state.gaps} ${state.gaps === 1 ? "gap" : "gaps"}`);
    setText("[data-free-score-output='priority']", state.priority);
    setText("[data-free-score-output='note']", state.note);
    setText("[data-free-score-output='monthlyValue']", `${currency(state.monthlyValue)}/mo`);
    setText("[data-free-score-output='customerValue']", currency(state.customerValue));
    setText("[data-free-score-output='missedInquiries']", String(state.missedInquiries));
    setText("[data-free-score-output='closeRate']", `${state.closeRate}%`);

    const missingList = $("[data-free-score-output='missingList']");
    if (missingList) {
      missingList.innerHTML = state.missingLabels.length
        ? state.missingLabels.slice(0, 4).map((label) => `<li>${escapeHtml(label)}</li>`).join("")
        : "<li>No urgent gap from this quick pass.</li>";
    }

    updateScorecardActions(state);
  }

  async function copyScoreSummary() {
    const status = $("[data-free-score-copy-status]");
    const manual = $("[data-free-score-manual]");
    const summary = buildScoreSummary(scorecardState());
    try {
      let copied = false;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(summary);
        copied = true;
      }

      if (!copied) {
        const area = document.createElement("textarea");
        area.value = summary;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.left = "-999px";
        document.body.appendChild(area);
        area.focus();
        area.select();
        copied = document.execCommand("copy");
        area.remove();
      }

      if (!copied) throw new Error("Copy failed.");
      if (status) status.textContent = "Score summary copied.";
      if (manual) {
        manual.hidden = true;
        manual.value = "";
      }
    } catch (error) {
      if (status) status.textContent = "Copy blocked. The score summary is open below.";
      if (manual) {
        manual.value = summary;
        manual.hidden = false;
        manual.focus();
        manual.select();
      }
    }

    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      if (status) status.textContent = "";
    }, 3200);
  }

  function bindFreeScorecard() {
    $$("[data-free-score-item]").forEach((item) => {
      item.addEventListener("change", updateFreeScorecard);
    });
    $$("[data-free-score-input]").forEach((item) => {
      item.addEventListener("input", updateFreeScorecard);
    });
    $$("[data-free-score-copy]").forEach((item) => {
      item.addEventListener("click", copyScoreSummary);
    });
    updateFreeScorecard();
  }

  bindFreeScorecard();
})();
