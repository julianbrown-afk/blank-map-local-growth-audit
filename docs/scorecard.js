(function () {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

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

  function updateFreeScorecard() {
    const items = $$("[data-free-score-item]");
    if (!items.length) return;

    const checked = items.filter((item) => item.checked);
    const missing = items.filter((item) => !item.checked);
    const gaps = missing.length;
    const score = Math.max(0, Math.round((checked.length / items.length) * 100));

    const customerValue = toNumber($("[data-free-score-input='customerValue']")?.value, 650);
    const missedInquiries = toNumber($("[data-free-score-input='missedInquiries']")?.value, 3);
    const closeRate = toNumber($("[data-free-score-input='closeRate']")?.value, 35);
    const monthlyValue = Math.round(customerValue * missedInquiries * (closeRate / 100));

    let priority = "Lower immediate priority";
    let note = "Your visible buyer path looks comparatively sound. Use the audit if you want outside validation before bigger work.";
    if (gaps >= 4) {
      priority = "High-priority audit";
      note = "Several buyer-path basics are missing. Start with a focused audit before paying for more traffic or a larger redesign.";
    } else if (gaps >= 2) {
      priority = "Useful audit candidate";
      note = "There are enough gaps to justify a short outside-in review and a prioritized 30-day action plan.";
    }

    setText("[data-free-score-output='score']", `${score}/100`);
    setText("[data-free-score-output='gaps']", `${gaps} ${gaps === 1 ? "gap" : "gaps"}`);
    setText("[data-free-score-output='priority']", priority);
    setText("[data-free-score-output='note']", note);
    setText("[data-free-score-output='monthlyValue']", `${currency(monthlyValue)}/mo`);
    setText("[data-free-score-output='customerValue']", currency(customerValue));
    setText("[data-free-score-output='missedInquiries']", String(missedInquiries));
    setText("[data-free-score-output='closeRate']", `${closeRate}%`);

    const missingList = $("[data-free-score-output='missingList']");
    if (missingList) {
      const missingLabels = missing.map((item) => item.dataset.freeScoreLabel || item.value || item.closest("label")?.innerText || "Buyer-path gap");
      missingList.innerHTML = missingLabels.length
        ? missingLabels.slice(0, 4).map((label) => `<li>${escapeHtml(label)}</li>`).join("")
        : "<li>No urgent gap from this quick pass.</li>";
    }
  }

  function bindFreeScorecard() {
    $$("[data-free-score-item]").forEach((item) => {
      item.addEventListener("change", updateFreeScorecard);
    });
    $$("[data-free-score-input]").forEach((item) => {
      item.addEventListener("input", updateFreeScorecard);
    });
    updateFreeScorecard();
  }

  bindFreeScorecard();
})();
