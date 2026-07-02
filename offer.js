(function () {
  "use strict";

  const baseConfig = window.MONEY_MAKER_CONFIG || {};
  const params = new URLSearchParams(window.location.search);
  const config = {
    ...baseConfig,
    serviceName: params.get("service") || baseConfig.serviceName || "Local Growth Audit",
    marketCity: params.get("city") || baseConfig.marketCity || "Your City",
    businessName: params.get("business") || baseConfig.businessName || "Your Growth Studio",
    contactEmail: params.get("email") || baseConfig.contactEmail || "you@example.com",
    paymentLink: params.get("pay") || baseConfig.paymentLink || "",
    bookingLink: params.get("booking") || baseConfig.bookingLink || "",
    auditPrice: Number(params.get("audit") || baseConfig.auditPrice || 399),
    implementationPrice: Number(params.get("sprint") || baseConfig.implementationPrice || 1500),
    guaranteeLine: baseConfig.guaranteeLine || "A clear 30-day action plan, built from observable fixes.",
    included: Array.isArray(baseConfig.included) ? baseConfig.included : [],
    proofPoints: Array.isArray(baseConfig.proofPoints) ? baseConfig.proofPoints : []
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const initialTitle = document.title;

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

  function intakeMailto() {
    const subject = encodeURIComponent(`${config.serviceName} intake`);
    const body = encodeURIComponent([
      `Hi ${config.businessName},`,
      "",
      "I purchased or booked the audit and want to start intake.",
      "",
      "Business name:",
      "Website:",
      "Service area:",
      "Highest-value service or offer:",
      "Current booking/contact path:",
      "Competitors or priority notes:",
      "",
      "Payment name or email used at checkout:",
      ""
    ].join("\n"));
    return `mailto:${config.contactEmail}?subject=${subject}&body=${body}`;
  }

  function renderCards(target, items) {
    target.innerHTML = items.map((item, index) => `
      <article>
        <strong>${String(index + 1).padStart(2, "0")}</strong>
        <p>${item}</p>
      </article>
    `).join("");
  }

  function updateScorecard() {
    const items = $$("[data-score-item]");
    const checked = items.filter((item) => item.checked).length;
    const gaps = Math.max(items.length - checked, 0);
    const label = $("[data-score-label]");
    const result = $("[data-score-result]");
    const note = $("[data-score-note]");

    if (!label || !result || !note) return;

    label.textContent = `${gaps} ${gaps === 1 ? "gap" : "gaps"} found`;
    if (gaps >= 3) {
      result.textContent = "High audit priority";
      note.textContent = "Start with an audit before committing to implementation work.";
    } else if (gaps >= 1) {
      result.textContent = "Useful audit candidate";
      note.textContent = "A short audit can clarify which fixes are worth doing first.";
    } else {
      result.textContent = "Lower audit priority";
      note.textContent = "You may still use an audit for validation, but urgent gaps are not obvious from this quick check.";
    }
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

    $$("[data-score-item]").forEach((item) => {
      item.addEventListener("change", updateScorecard);
    });
    updateScorecard();

    $$("[data-value-input]").forEach((item) => {
      item.addEventListener("input", updateValueMath);
    });
    updateValueMath();
  }

  render();
})();
