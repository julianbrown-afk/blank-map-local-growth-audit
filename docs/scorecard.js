(function () {
  "use strict";

  const config = window.MONEY_MAKER_CONFIG || {};
  const params = new URLSearchParams(window.location.search);
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  let copyTimer = 0;
  let scorecardTouched = false;

  const TRACK_DATA = {
    dentist: {
      label: "Dentist",
      audience: "Lexington dental offices",
      audienceNoun: "new patients",
      title: "Free Lexington Dentist Growth Scorecard",
      offerPath: "lexington-dentist-growth-audit.html",
      averageValue: 650,
      placeholder: "Dental office",
      buyerPath: "new-patient booking, review trust, and follow-up",
      actionHandled: "New patients get one obvious appointment request or call action on mobile.",
      actionMissing: "New patients do not get one obvious appointment request or call action on mobile",
      pageHandled: "High-value treatment and service pages explain fit, proof, process, and next step.",
      pageMissing: "High-value treatment and service pages do not explain fit, proof, process, and next step"
    },
    orthodontist: {
      label: "Orthodontist",
      audience: "Lexington orthodontic practices",
      audienceNoun: "new patients",
      title: "Free Lexington Orthodontist Growth Scorecard",
      offerPath: "lexington-orthodontist-growth-audit.html",
      averageValue: 5500,
      placeholder: "Orthodontic practice",
      buyerPath: "consultation requests, treatment proof, and follow-up",
      actionHandled: "New patients get one obvious consultation request or call action on mobile.",
      actionMissing: "New patients do not get one obvious consultation request or call action on mobile",
      pageHandled: "Braces, Invisalign, and treatment pages explain fit, proof, process, and next step.",
      pageMissing: "Braces, Invisalign, or treatment pages do not explain fit, proof, process, and next step"
    },
    "med-spa": {
      label: "Med spa",
      audience: "Lexington med spas",
      audienceNoun: "new clients",
      title: "Free Lexington Med Spa Growth Scorecard",
      offerPath: "lexington-med-spa-growth-audit.html",
      averageValue: 500,
      placeholder: "Med spa",
      buyerPath: "treatment-page clarity, consultation booking, proof, and follow-up",
      actionHandled: "New clients get one obvious consultation or booking action on mobile.",
      actionMissing: "New clients do not get one obvious consultation or booking action on mobile",
      pageHandled: "Treatment pages explain fit, proof, process, pricing cues, and next step.",
      pageMissing: "Treatment pages do not explain fit, proof, process, pricing cues, and next step"
    },
    roofing: {
      label: "Roofing",
      audience: "Lexington roofing companies",
      audienceNoun: "homeowners",
      title: "Free Lexington Roofing Growth Scorecard",
      offerPath: "lexington-roofing-growth-audit.html",
      averageValue: 4500,
      placeholder: "Roofing company",
      buyerPath: "inspection requests, quote clarity, warranty proof, and follow-up",
      actionHandled: "Homeowners get one obvious inspection, repair, or quote action on mobile.",
      actionMissing: "Homeowners do not get one obvious inspection, repair, or quote action on mobile",
      pageHandled: "Repair, replacement, storm, and financing pages explain fit, proof, process, and next step.",
      pageMissing: "Repair, replacement, storm, or financing pages do not explain fit, proof, process, and next step"
    },
    remodeling: {
      label: "Remodeling",
      audience: "Lexington remodelers and contractors",
      audienceNoun: "project buyers",
      title: "Free Lexington Remodeling Growth Scorecard",
      offerPath: "lexington-remodeling-growth-audit.html",
      averageValue: 8000,
      placeholder: "Remodeling company",
      buyerPath: "project-fit clarity, galleries, estimate flow, and follow-up",
      actionHandled: "Project buyers get one obvious consultation or estimate action on mobile.",
      actionMissing: "Project buyers do not get one obvious consultation or estimate action on mobile",
      pageHandled: "Project, gallery, and service pages explain fit, proof, process, and next step.",
      pageMissing: "Project, gallery, or service pages do not explain fit, proof, process, and next step"
    },
    hvac: {
      label: "HVAC",
      audience: "Lexington HVAC companies",
      audienceNoun: "homeowners",
      title: "Free Lexington HVAC Growth Scorecard",
      offerPath: "lexington-hvac-growth-audit.html",
      averageValue: 5500,
      placeholder: "HVAC company",
      buyerPath: "repair booking, replacement quotes, maintenance offers, and follow-up",
      actionHandled: "Homeowners get one obvious repair, replacement, or maintenance action on mobile.",
      actionMissing: "Homeowners do not get one obvious repair, replacement, or maintenance action on mobile",
      pageHandled: "Repair, replacement, maintenance, and financing pages explain fit, proof, process, and next step.",
      pageMissing: "Repair, replacement, maintenance, or financing pages do not explain fit, proof, process, and next step"
    },
    "hvac-plumbing": {
      label: "Home service",
      audience: "Lexington multi-trade home service companies",
      audienceNoun: "homeowners",
      title: "Free Lexington Home Service Growth Scorecard",
      offerPath: "lexington-hvac-plumbing-growth-audit.html",
      averageValue: 5500,
      placeholder: "HVAC, plumbing, or electrical company",
      buyerPath: "service-call booking, quote clarity, proof, and follow-up",
      actionHandled: "Homeowners get one obvious service-call, emergency, or quote action on mobile.",
      actionMissing: "Homeowners do not get one obvious service-call, emergency, or quote action on mobile",
      pageHandled: "HVAC, plumbing, electrical, and emergency pages explain fit, proof, process, and next step.",
      pageMissing: "HVAC, plumbing, electrical, or emergency pages do not explain fit, proof, process, and next step"
    },
    plumbing: {
      label: "Plumbing",
      audience: "Lexington plumbing companies",
      audienceNoun: "homeowners",
      title: "Free Lexington Plumbing Growth Scorecard",
      offerPath: "lexington-plumbing-growth-audit.html",
      averageValue: 1500,
      placeholder: "Plumbing company",
      buyerPath: "emergency calls, repair booking, drain service paths, and follow-up",
      actionHandled: "Homeowners get one obvious emergency, repair, or drain service action on mobile.",
      actionMissing: "Homeowners do not get one obvious emergency, repair, or drain service action on mobile",
      pageHandled: "Leak, drain, emergency, repair, and replacement pages explain fit, proof, process, and next step.",
      pageMissing: "Leak, drain, emergency, repair, or replacement pages do not explain fit, proof, process, and next step"
    },
    "personal-injury-law": {
      label: "Personal injury law",
      audience: "Lexington personal injury law firms",
      audienceNoun: "potential clients",
      title: "Free Lexington Personal Injury Law Growth Scorecard",
      offerPath: "lexington-personal-injury-law-growth-audit.html",
      averageValue: 7500,
      placeholder: "Personal injury law firm",
      buyerPath: "consultation clarity, practice-area proof, trust, and intake follow-up",
      actionHandled: "Potential clients get one obvious consultation or case-review action on mobile.",
      actionMissing: "Potential clients do not get one obvious consultation or case-review action on mobile",
      pageHandled: "Practice-area and case-type pages explain fit, proof, process, and next step.",
      pageMissing: "Practice-area or case-type pages do not explain fit, proof, process, and next step"
    },
    chiropractor: {
      label: "Chiropractor",
      audience: "Lexington chiropractic clinics",
      audienceNoun: "new patients",
      title: "Free Lexington Chiropractor Growth Scorecard",
      offerPath: "lexington-chiropractor-growth-audit.html",
      averageValue: 850,
      placeholder: "Chiropractic clinic",
      buyerPath: "new-patient appointment clarity, condition-page proof, review trust, and follow-up",
      actionHandled: "New patients get one obvious first-visit, consultation, or call action on mobile.",
      actionMissing: "New patients do not get one obvious first-visit, consultation, or call action on mobile",
      pageHandled: "Condition, pain, injury, family, and wellness pages explain fit, proof, process, and next step.",
      pageMissing: "Condition, pain, injury, family, or wellness pages do not explain fit, proof, process, and next step"
    },
    veterinary: {
      label: "Veterinary",
      audience: "Lexington veterinary clinics",
      audienceNoun: "pet owners",
      title: "Free Lexington Veterinary Growth Scorecard",
      offerPath: "lexington-veterinary-growth-audit.html",
      averageValue: 500,
      placeholder: "Veterinary clinic",
      buyerPath: "appointment clarity, service routing, pet-owner trust, and follow-up",
      actionHandled: "Pet owners get one obvious appointment, urgent care, or call action on mobile.",
      actionMissing: "Pet owners do not get one obvious appointment, urgent care, or call action on mobile",
      pageHandled: "Wellness, dental, urgent, emergency, and specialty pages explain fit, proof, process, and next step.",
      pageMissing: "Wellness, dental, urgent, emergency, or specialty pages do not explain fit, proof, process, and next step"
    },
    "pest-control": {
      label: "Pest control",
      audience: "Lexington pest control companies",
      audienceNoun: "property owners",
      title: "Free Lexington Pest Control Growth Scorecard",
      offerPath: "lexington-pest-control-growth-audit.html",
      averageValue: 1200,
      placeholder: "Pest control company",
      buyerPath: "inspection requests, plan clarity, pest-specific pages, and trust proof",
      actionHandled: "Property owners get one obvious inspection, quote, or urgent-call action on mobile.",
      actionMissing: "Property owners do not get one obvious inspection, quote, or urgent-call action on mobile",
      pageHandled: "Termite, bed bug, rodent, ant, and recurring-plan pages explain fit, proof, process, and next step.",
      pageMissing: "Termite, bed bug, rodent, ant, or recurring-plan pages do not explain fit, proof, process, and next step"
    },
    "garage-door": {
      label: "Garage door",
      audience: "Lexington garage door companies",
      audienceNoun: "homeowners",
      title: "Free Lexington Garage Door Growth Scorecard",
      offerPath: "lexington-garage-door-growth-audit.html",
      averageValue: 1200,
      placeholder: "Garage door company",
      buyerPath: "repair booking, emergency calls, replacement quotes, and review trust",
      actionHandled: "Homeowners get one obvious repair, emergency, or replacement quote action on mobile.",
      actionMissing: "Homeowners do not get one obvious repair, emergency, or replacement quote action on mobile",
      pageHandled: "Repair, spring, opener, installation, and commercial pages explain fit, proof, process, and next step.",
      pageMissing: "Repair, spring, opener, installation, or commercial pages do not explain fit, proof, process, and next step"
    },
    "tree-service": {
      label: "Tree service",
      audience: "Lexington tree service companies",
      audienceNoun: "property owners",
      title: "Free Lexington Tree Service Growth Scorecard",
      offerPath: "lexington-tree-service-growth-audit.html",
      averageValue: 1800,
      placeholder: "Tree service company",
      buyerPath: "tree removal quote paths, emergency calls, arborist proof, and service-area clarity",
      actionHandled: "Property owners get one obvious removal, trimming, emergency, or estimate action on mobile.",
      actionMissing: "Property owners do not get one obvious removal, trimming, emergency, or estimate action on mobile",
      pageHandled: "Removal, trimming, pruning, emergency, and stump pages explain fit, proof, process, and next step.",
      pageMissing: "Removal, trimming, pruning, emergency, or stump pages do not explain fit, proof, process, and next step"
    },
    landscaping: {
      label: "Landscaping",
      audience: "Lexington landscaping and lawn care companies",
      audienceNoun: "property owners",
      title: "Free Lexington Landscaping Growth Scorecard",
      offerPath: "lexington-landscaping-growth-audit.html",
      averageValue: 3500,
      placeholder: "Landscaping or lawn care company",
      buyerPath: "estimate requests, project proof, maintenance plan clarity, and quote follow-up",
      actionHandled: "Property owners get one obvious estimate, consultation, or maintenance-plan action on mobile.",
      actionMissing: "Property owners do not get one obvious estimate, consultation, or maintenance-plan action on mobile",
      pageHandled: "Design-build, lawn care, irrigation, maintenance, and gallery pages explain fit, proof, process, and next step.",
      pageMissing: "Design-build, lawn care, irrigation, maintenance, or gallery pages do not explain fit, proof, process, and next step"
    },
    restoration: {
      label: "Restoration",
      audience: "Lexington restoration companies",
      audienceNoun: "emergency buyers",
      title: "Free Lexington Restoration Growth Scorecard",
      offerPath: "lexington-restoration-growth-audit.html",
      averageValue: 5000,
      placeholder: "Restoration company",
      buyerPath: "24/7 emergency calls, insurance proof, service routing, and response confidence",
      actionHandled: "Emergency buyers get one obvious 24/7 phone, dispatch, or request-help action on mobile.",
      actionMissing: "Emergency buyers do not get one obvious 24/7 phone, dispatch, or request-help action on mobile",
      pageHandled: "Water, fire, mold, storm, and emergency pages explain fit, proof, process, and next step.",
      pageMissing: "Water, fire, mold, storm, or emergency pages do not explain fit, proof, process, and next step"
    },
    "physical-therapy": {
      label: "Physical therapy",
      audience: "Lexington physical therapy clinics",
      audienceNoun: "patients",
      title: "Free Lexington Physical Therapy Growth Scorecard",
      offerPath: "lexington-physical-therapy-growth-audit.html",
      averageValue: 700,
      placeholder: "Physical therapy clinic",
      buyerPath: "appointment requests, condition-page proof, location routing, and patient trust",
      actionHandled: "Patients get one obvious appointment, call, or request-care action on mobile.",
      actionMissing: "Patients do not get one obvious appointment, call, or request-care action on mobile",
      pageHandled: "Pain, injury, rehab, specialty, and location pages explain fit, proof, process, and next step.",
      pageMissing: "Pain, injury, rehab, specialty, or location pages do not explain fit, proof, process, and next step"
    },
    "home-improvement": {
      label: "Home improvement",
      audience: "Lexington home improvement companies",
      audienceNoun: "project buyers",
      title: "Free Lexington Home Improvement Growth Scorecard",
      offerPath: "lexington-home-improvement-growth-audit.html",
      averageValue: 4500,
      placeholder: "Fence, window, flooring, or home improvement company",
      buyerPath: "free-estimate flow, product segmentation, project proof, and quote follow-up",
      actionHandled: "Project buyers get one obvious free-estimate, consultation, or quote action on mobile.",
      actionMissing: "Project buyers do not get one obvious free-estimate, consultation, or quote action on mobile",
      pageHandled: "Product, repair, installation, gallery, and warranty pages explain fit, proof, process, and next step.",
      pageMissing: "Product, repair, installation, gallery, or warranty pages do not explain fit, proof, process, and next step"
    }
  };

  const TRACK_ALIASES = {
    dental: "dentist",
    dentist: "dentist",
    orthodontics: "orthodontist",
    orthodontist: "orthodontist",
    medspa: "med-spa",
    "med-spa": "med-spa",
    "med spa": "med-spa",
    roofing: "roofing",
    roofers: "roofing",
    remodeling: "remodeling",
    remodeler: "remodeling",
    contractor: "remodeling",
    hvac: "hvac",
    "hvac-plumbing": "hvac-plumbing",
    plumbing: "plumbing",
    plumber: "plumbing",
    law: "personal-injury-law",
    "personal-injury": "personal-injury-law",
    "personal-injury-law": "personal-injury-law",
    chiropractor: "chiropractor",
    chiropractic: "chiropractor",
    vet: "veterinary",
    veterinary: "veterinary",
    "pest-control": "pest-control",
    pest: "pest-control",
    "garage-door": "garage-door",
    garage: "garage-door",
    "tree-service": "tree-service",
    tree: "tree-service",
    landscaping: "landscaping",
    lawn: "landscaping",
    restoration: "restoration",
    "physical-therapy": "physical-therapy",
    physiotherapy: "physical-therapy",
    "home-improvement": "home-improvement",
    flooring: "home-improvement",
    fence: "home-improvement",
    windows: "home-improvement"
  };

  function makeTrackProfile(slug, data) {
    return {
      ...data,
      slug,
      kicker: data.audience,
      headline: `Tuned for ${data.buyerPath}`,
      heroCopy: `Check the visible ${data.buyerPath} before you buy an audit. This scorecard uses the same buyer-path logic with wording for ${data.audience.toLowerCase()}.`,
      options: {
        primaryAction: {
          checked: data.actionHandled,
          missing: data.actionMissing
        },
        googleProfile: {
          checked: `Google Business Profile has current services, photos, Q&A, and conversion cues for ${data.audienceNoun}.`,
          missing: `The Google Business Profile needs current services, photos, Q&A, or conversion cues for ${data.audienceNoun}`
        },
        reviews: {
          checked: `Reviews are recent, visible, and connected to the next step for ${data.audienceNoun}.`,
          missing: `Reviews are not recent, visible, or connected to the next step for ${data.audienceNoun}`
        },
        tracking: {
          checked: "Calls, forms, booking clicks, quote requests, and source are tracked.",
          missing: "Calls, forms, booking clicks, quote requests, or source are not tracked"
        },
        followUp: {
          checked: `Unbooked ${data.audienceNoun} get a reliable follow-up within 24 hours.`,
          missing: `Unbooked ${data.audienceNoun} do not get a reliable follow-up within 24 hours`
        },
        servicePages: {
          checked: data.pageHandled,
          missing: data.pageMissing
        }
      }
    };
  }

  const TRACK_PROFILES = Object.fromEntries(
    Object.entries(TRACK_DATA).map(([slug, data]) => [slug, makeTrackProfile(slug, data)])
  );

  function activeTrackProfile() {
    const raw = String(params.get("track") || params.get("category") || "").trim().toLowerCase();
    const slug = TRACK_ALIASES[raw] || raw;
    return TRACK_PROFILES[slug] || null;
  }

  const activeTrack = activeTrackProfile();

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
    const configured = String(config.offerBaseUrl || "").trim();
    const currentBase = new URL(".", window.location.href).toString();
    let base = configured || currentBase;

    try {
      const currentUrl = new URL(currentBase);
      const configuredUrl = new URL(base);
      const isLocal = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
      if (window.location.protocol.startsWith("http") && !isLocal && configuredUrl.hostname !== currentUrl.hostname) {
        base = currentBase;
      }
    } catch (error) {
      base = currentBase;
    }

    base = base.endsWith("/") ? base : `${base}/`;
    return new URL(path, base).toString();
  }

  function scorecardPath(slug = activeTrack?.slug || "") {
    const nextParams = new URLSearchParams(params.toString());
    nextParams.delete("category");
    if (slug) {
      nextParams.set("track", slug);
    } else {
      nextParams.delete("track");
    }
    const query = nextParams.toString();
    return query ? `scorecard.html?${query}` : "scorecard.html";
  }

  function paidAuditPath() {
    return activeTrack?.offerPath || "";
  }

  function boundedParamNumber(name, fallback, min, max) {
    const value = toNumber(params.get(name), fallback);
    return Math.min(Math.max(value, min), max);
  }

  function setInputValue(selector, value) {
    const input = $(selector);
    if (!input || value === null || value === undefined || value === "") return;
    input.value = String(value);
  }

  function applyTrackProfile() {
    if (!activeTrack) return;

    document.title = activeTrack.title;
    setText("[data-score-track-output='kicker']", activeTrack.kicker);
    setText("[data-score-track-output='title']", activeTrack.title);
    setText("[data-score-track-output='heroCopy']", activeTrack.heroCopy);
    setText("[data-score-track-output='trackLabel']", `${activeTrack.label} scorecard`);
    setText("[data-score-track-output='trackHeadline']", activeTrack.headline);
    setText("[data-score-track-output='trackFocus']", `Audit focus: ${activeTrack.buyerPath}.`);

    const context = $("[data-score-track-context]");
    if (context) context.hidden = false;

    Object.entries(activeTrack.options).forEach(([key, option]) => {
      const input = $(`[data-score-option='${key}']`);
      if (!input) return;
      input.dataset.freeScoreLabel = option.missing;
      const text = input.closest("label")?.querySelector("span");
      if (text) text.textContent = option.checked;
    });

    const customerValue = $("[data-free-score-input='customerValue']");
    if (customerValue) customerValue.value = String(activeTrack.averageValue);

    const businessType = $("[data-free-lead='businessType']");
    if (businessType) businessType.placeholder = activeTrack.placeholder;

    $$("[data-score-paid-link]").forEach((link) => {
      link.href = offerUrl(paidAuditPath());
    });
  }

  function applyQueryPrefill() {
    setInputValue("[data-free-lead='businessName']", params.get("lead") || params.get("prospect"));
    setInputValue("[data-free-lead='website']", params.get("site") || params.get("website"));
    setInputValue("[data-free-lead='businessType']", params.get("type"));
    setInputValue("[data-free-lead='contactEmail']", params.get("leadEmail") || params.get("contact"));

    if (params.has("value")) {
      setInputValue("[data-free-score-input='customerValue']", boundedParamNumber("value", 650, 100, 5000));
    }
    if (params.has("missed")) {
      setInputValue("[data-free-score-input='missedInquiries']", boundedParamNumber("missed", 3, 1, 20));
    }
    if (params.has("close")) {
      setInputValue("[data-free-score-input='closeRate']", boundedParamNumber("close", 35, 5, 80));
    }

    const handledParam = params.get("handled") || params.get("checks");
    const missingParam = params.get("gaps") || params.get("missing");
    if (handledParam || missingParam || params.get("result") === "1") {
      const handled = new Set(String(handledParam || "").split(",").map((item) => item.trim()).filter(Boolean));
      const missing = new Set(String(missingParam || "").split(",").map((item) => item.trim()).filter(Boolean));
      $$("[data-free-score-item]").forEach((item) => {
        const key = item.dataset.scoreOption;
        if (!key) return;
        if (handledParam) item.checked = handled.has(key);
        else if (missingParam) item.checked = !missing.has(key);
      });
      scorecardTouched = true;
    }
  }

  function renderTrackPicker() {
    const grid = $("[data-score-track-grid]");
    if (!grid) return;

    const generalCard = {
      slug: "",
      label: "General",
      title: "Local service business",
      buyerPath: "booking, reviews, tracking, and follow-up"
    };
    const cards = [
      generalCard,
      ...Object.values(TRACK_PROFILES).sort((a, b) => a.label.localeCompare(b.label))
    ];

    grid.innerHTML = cards.map((track) => {
      const isActive = track.slug ? activeTrack?.slug === track.slug : !activeTrack;
      const activeClass = isActive ? " active" : "";
      const current = isActive ? ` aria-current="page"` : "";
      const label = track.slug ? `${track.label} scorecard` : "Broad scorecard";
      return `
        <a class="scorecard-track-card${activeClass}" href="${escapeHtml(scorecardPath(track.slug))}"${current}>
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(track.title)}</strong>
          <p>${escapeHtml(track.buyerPath)}</p>
        </a>
      `;
    }).join("");
  }

  function leadDetails() {
    const details = {};
    $$("[data-free-lead]").forEach((input) => {
      details[input.dataset.freeLead] = String(input.value || "").trim();
    });
    return details;
  }

  function buildLeadBlock(details) {
    const lines = [
      ["Business name", details.businessName],
      ["Website", details.website],
      ["Business type", details.businessType],
      ["Visitor email", details.contactEmail]
    ].filter(([, value]) => value);

    return lines.length
      ? `Business details\n${lines.map(([label, value]) => `${label}: ${value}`).join("\n")}\n\n`
      : "";
  }

  function boundedInputValue(selector, fallback, min, max) {
    const input = $(selector);
    const value = toNumber(input?.value, fallback);
    return Math.min(Math.max(value, min), max);
  }

  function checkedScoreOptions() {
    return $$("[data-free-score-item]")
      .filter((item) => item.checked)
      .map((item) => item.dataset.scoreOption)
      .filter(Boolean);
  }

  function scorecardResultPath(details = leadDetails()) {
    const resultParams = new URLSearchParams();
    if (activeTrack?.slug) resultParams.set("track", activeTrack.slug);
    if (details.businessName) resultParams.set("lead", details.businessName);
    if (details.website) resultParams.set("site", details.website);
    if (details.businessType) resultParams.set("type", details.businessType);

    resultParams.set("value", String(Math.round(boundedInputValue("[data-free-score-input='customerValue']", 650, 100, 5000))));
    resultParams.set("missed", String(Math.round(boundedInputValue("[data-free-score-input='missedInquiries']", 3, 1, 20))));
    resultParams.set("close", String(Math.round(boundedInputValue("[data-free-score-input='closeRate']", 35, 5, 80))));

    const handled = checkedScoreOptions();
    if (handled.length) resultParams.set("handled", handled.join(","));
    if (scorecardTouched || handled.length) resultParams.set("result", "1");

    const query = resultParams.toString();
    return query ? `scorecard.html?${query}#scorecard-result` : "scorecard.html#scorecard-result";
  }

  function scorecardIntakePath(details = leadDetails()) {
    const resultPath = scorecardResultPath(details);
    const resultUrl = new URL(resultPath, window.location.href);
    return `audit-intake.html${resultUrl.search}`;
  }

  function scorecardResultUrl(details = leadDetails()) {
    return offerUrl(scorecardResultPath(details));
  }

  function scorecardIntakeUrl(details = leadDetails()) {
    return offerUrl(scorecardIntakePath(details));
  }

  function unscoredState(base) {
    return {
      ...base,
      isScored: false,
      score: null,
      gaps: null,
      priority: "Answer the six checks first",
      note: "Select what is already handled. Anything left unchecked becomes a visible gap to review.",
      missingLabels: [],
      decision: {
        title: "Start with the visible buyer path",
        body: "Answer the six checks first, then use the result to decide whether a paid audit has a clear job to do."
      },
      recommendation: {
        kicker: "Recommended next move",
        title: "Score the visible buyer path",
        body: "Use the result to decide whether the paid audit should rank fixes before larger marketing spend.",
        focus: "Start by checking the six visible buyer-path basics."
      },
      checkout: scorecardCheckoutBrief({
        ...base,
        isScored: false,
        missingLabels: []
      })
    };
  }

  function scorecardState(options = {}) {
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
    const base = { customerValue, missedInquiries, closeRate, monthlyValue };

    if (options.neutral && !scorecardTouched) {
      return unscoredState(base);
    }

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
      isScored: true,
      score,
      gaps,
      priority,
      note,
      customerValue,
      missedInquiries,
      closeRate,
      monthlyValue,
      missingLabels,
      decision: scorecardDecision(score),
      recommendation: scorecardRecommendation({ gaps, missingLabels, monthlyValue }),
      checkout: scorecardCheckoutBrief({
        isScored: true,
        gaps,
        monthlyValue,
        missingLabels
      })
    };
  }

  function scorecardDecision(score) {
    if (score <= 39) {
      return {
        title: "Buy before more traffic",
        body: "The current result shows enough visible friction to justify a fixed-scope audit before larger spend."
      };
    }
    if (score <= 74) {
      return {
        title: "Rank the fixes",
        body: "The current result has enough gaps to make prioritization useful before changing the site, ads, or follow-up process."
      };
    }
    return {
      title: "Validate the spend",
      body: "The obvious gaps are lighter. Use the paid audit when outside validation would protect a bigger marketing or implementation decision."
    };
  }

  function scorecardRecommendation(state) {
    const firstGap = state.missingLabels[0] || activeTrack?.buyerPath || "outside validation of the visible buyer path";
    if (state.gaps >= 4) {
      return {
        kicker: "Recommended next move",
        title: "Buy the audit before spending on more traffic",
        body: "The scorecard found enough buyer-path gaps to justify a fixed-scope review before a larger redesign, ad campaign, or retainer.",
        focus: `Audit focus: ${firstGap}.`
      };
    }
    if (state.gaps >= 2) {
      return {
        kicker: "Recommended next move",
        title: "Use the audit to rank the fixes",
        body: "There are enough gaps to make prioritization useful. The audit should clarify which fix comes first, what to track, and what can wait.",
        focus: `First review focus: ${firstGap}.`
      };
    }
    if (state.gaps === 1) {
      return {
        kicker: "Recommended next move",
        title: "Fix the visible gap or use the audit for validation",
        body: "One gap may be simple enough to address internally. Use the paid audit if you want an outside review before committing budget.",
        focus: `Visible gap: ${firstGap}.`
      };
    }
    return {
      kicker: "Recommended next move",
      title: "Keep the score and validate before bigger work",
      body: "No urgent gap showed up in this quick pass. The audit is still useful if you want a second set of eyes before a bigger marketing spend.",
      focus: "Audit focus: confirm the highest-value service path, tracking, and follow-up process."
    };
  }

  function scorecardCheckoutBrief(state) {
    const auditPrice = Math.max(Number(config.auditPrice) || 399, 1);
    const firstGap = state.missingLabels?.[0] || activeTrack?.buyerPath || "visible buyer-path friction";
    const opportunity = state.isScored ? `${currency(state.monthlyValue)}/mo` : "After scoring";
    const payback = state.isScored && state.monthlyValue > 0 ? state.monthlyValue / auditPrice : 0;
    const paybackLine = payback >= 1
      ? `That is about ${payback.toFixed(1)}x the audit price in one month if the recovered path converts as estimated.`
      : "Use the audit only when the score shows a practical fix path, not as a revenue guarantee.";

    if (!state.isScored) {
      return {
        kicker: "Checkout brief",
        title: "Score first, then choose the paid audit if the gap is clear.",
        body: "The audit uses the score, top gaps, and planning math as the starting context for a 48-hour review.",
        opportunity,
        focus: "Visible buyer path",
        assurance: "No passwords, ad accounts, or analytics access are needed for the first report."
      };
    }

    if (state.gaps >= 4) {
      return {
        kicker: "Checkout-ready",
        title: "This score has enough friction to justify the fixed-scope audit.",
        body: `Buy before spending on more traffic or a redesign. ${paybackLine}`,
        opportunity,
        focus: firstGap,
        assurance: "The report starts from public pages, visible trust cues, booking paths, tracking cues, and follow-up gaps."
      };
    }

    if (state.gaps >= 2) {
      return {
        kicker: "Good audit candidate",
        title: "Use the audit to rank what gets fixed first.",
        body: `The score shows multiple fix paths, so the main value is prioritization. ${paybackLine}`,
        opportunity,
        focus: firstGap,
        assurance: "The audit delivers ranked findings, tracking notes, and a 30-day action plan without a retainer."
      };
    }

    return {
      kicker: "Validation path",
      title: "Use the audit when outside validation would protect a bigger decision.",
      body: "The score is not urgent, but a paid review can still validate tracking, proof placement, and the highest-value service path before larger spend.",
      opportunity,
      focus: firstGap,
      assurance: "This is planning input from observable fixes, not a promise of revenue."
    };
  }

  function buildScoreSummary(state, details = leadDetails()) {
    if (!state.isScored) {
      const leadBlock = buildLeadBlock(details);
      const bookingLine = config.bookingLink ? `Book a call: ${config.bookingLink}\n` : "";
      const trackBlock = activeTrack
        ? `Track: ${activeTrack.label}\nFocus: ${activeTrack.buyerPath}\n\n`
        : "";

      return `Free Lexington Local Growth Scorecard

${leadBlock}${trackBlock}Score: Not scored yet
Result path: Start with the visible buyer path

Next step
Answer the six visible buyer-path checks first. The scorecard will then show the top gaps, planning math, and whether a paid audit has a clear job to do.

Planning inputs
Average booked customer value: ${currency(state.customerValue)}
Missed qualified inquiries per month: ${state.missedInquiries}
Likely close rate on recovered inquiries: ${state.closeRate}%

This is planning math, not a revenue guarantee.

Scorecard: ${offerUrl(scorecardPath())}
Result link: ${scorecardResultUrl(details)}
Audit intake: ${scorecardIntakeUrl(details)}
Paid audit: ${offerUrl(paidAuditPath())}
${bookingLine}Sample audit: ${offerUrl("sample-audit.html")}`;
    }

    const topGaps = state.missingLabels.length
      ? state.missingLabels.slice(0, 4).map((label, index) => `${index + 1}. ${label}`).join("\n")
      : "No urgent gap from this quick pass.";
    const leadBlock = buildLeadBlock(details);
    const bookingLine = config.bookingLink ? `Book a call: ${config.bookingLink}\n` : "";
    const trackBlock = activeTrack
      ? `Track: ${activeTrack.label}\nFocus: ${activeTrack.buyerPath}\n\n`
      : "";

    return `Free Lexington Local Growth Scorecard result

${leadBlock}${trackBlock}Score: ${state.score}/100
Priority: ${state.priority}
Gaps found: ${state.gaps}
Estimated recoverable opportunity: ${currency(state.monthlyValue)}/mo
Result path: ${state.decision.title}

Recommended next move
${state.recommendation.title}
${state.recommendation.body}
${state.recommendation.focus}

Planning inputs
Average booked customer value: ${currency(state.customerValue)}
Missed qualified inquiries per month: ${state.missedInquiries}
Likely close rate on recovered inquiries: ${state.closeRate}%

Top gaps
${topGaps}

This is planning math, not a revenue guarantee.

Scorecard: ${offerUrl(scorecardPath())}
Result link: ${scorecardResultUrl(details)}
Audit intake: ${scorecardIntakeUrl(details)}
Paid audit: ${offerUrl(paidAuditPath())}
${bookingLine}Sample audit: ${offerUrl("sample-audit.html")}`;
  }

  function buildAuditBrief(state = scorecardState({ neutral: true }), details = leadDetails()) {
    const leadBlock = buildLeadBlock(details);
    const bookingLine = config.bookingLink ? `Book a call: ${config.bookingLink}\n` : "";
    const topGaps = state.isScored && state.missingLabels.length
      ? state.missingLabels.slice(0, 3).map((label, index) => `${index + 1}. ${label}`).join("\n")
      : state.isScored
      ? "No urgent gap from this quick pass."
      : "Answer the scorecard before buying so the audit starts with the right context.";
    const scoreLine = state.isScored
      ? `Score: ${state.score}/100 (${state.priority})`
      : "Score: Not scored yet";
    const valueLine = state.isScored
      ? `Estimated recoverable opportunity: ${currency(state.monthlyValue)}/mo`
      : "Estimated recoverable opportunity: not calculated yet";
    const routeLine = state.isScored
      ? `${state.recommendation.title}\n${state.recommendation.body}\n${state.recommendation.focus}`
      : "Run the scorecard first. If the result shows clear buyer-path friction, use the paid audit to rank what to fix before larger marketing spend.";

    return `Local Growth Audit checkout brief

${leadBlock}${scoreLine}
${valueLine}

Why buy the audit
${routeLine}

Top audit focus
${topGaps}

Next links
Buy audit: ${offerUrl(paidAuditPath())}
Audit intake after payment: ${scorecardIntakeUrl(details)}
Score result link: ${scorecardResultUrl(details)}
${bookingLine}Sample audit: ${offerUrl("sample-audit.html")}

This is planning input, not a revenue guarantee.`;
  }

  function updateScorecardActions(state) {
    const details = leadDetails();
    const summary = buildScoreSummary(state, details);
    const emailLink = $("[data-free-score-email]");
    if (emailLink) {
      const subjectLead = details.businessName ? `${details.businessName}: ` : "";
      const subjectText = state.isScored
        ? `${subjectLead}Local Growth Scorecard result: ${state.score}/100`
        : `${subjectLead}Local Growth Scorecard question`;
      const subject = encodeURIComponent(subjectText);
      const body = encodeURIComponent(`${summary}\n\nI would like to understand what to fix first.`);
      emailLink.href = `mailto:${config.contactEmail || "JulianBrown@blankmapgroup.com"}?subject=${subject}&body=${body}`;
    }

    $$("[data-score-intake-link]").forEach((link) => {
      link.href = scorecardIntakeUrl(details);
    });
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

  function updateFreeScorecard() {
    const items = $$("[data-free-score-item]");
    if (!items.length) return;

    const state = scorecardState({ neutral: true });

    setText("[data-free-score-output='scoreLabel']", state.isScored ? "Current score" : "Score after answers");
    setText("[data-free-score-output='score']", state.isScored ? `${state.score}/100` : "Start here");
    setText("[data-free-score-output='gaps']", state.isScored ? `${state.gaps} ${state.gaps === 1 ? "gap" : "gaps"}` : "Not scored yet");
    setText("[data-free-score-output='priority']", state.priority);
    setText("[data-free-score-output='note']", state.note);
    setText("[data-free-score-output='monthlyValue']", state.isScored ? `${currency(state.monthlyValue)}/mo` : "Estimate after scoring");
    setText("[data-free-score-output='recommendationKicker']", state.recommendation.kicker);
    setText("[data-free-score-output='recommendationTitle']", state.recommendation.title);
    setText("[data-free-score-output='recommendationBody']", state.recommendation.body);
    setText("[data-free-score-output='recommendationFocus']", state.recommendation.focus);
    setText("[data-free-score-output='checkoutKicker']", state.checkout.kicker);
    setText("[data-free-score-output='checkoutTitle']", state.checkout.title);
    setText("[data-free-score-output='checkoutBody']", state.checkout.body);
    setText("[data-free-score-output='checkoutOpportunity']", state.checkout.opportunity);
    setText("[data-free-score-output='checkoutFocus']", state.checkout.focus);
    setText("[data-free-score-output='checkoutAssurance']", state.checkout.assurance);
    setText("[data-free-score-output='decisionTitle']", state.decision.title);
    setText("[data-free-score-output='decisionBody']", state.decision.body);
    setText("[data-free-score-output='customerValue']", currency(state.customerValue));
    setText("[data-free-score-output='missedInquiries']", String(state.missedInquiries));
    setText("[data-free-score-output='closeRate']", `${state.closeRate}%`);

    const missingList = $("[data-free-score-output='missingList']");
    if (missingList) {
      missingList.innerHTML = !state.isScored
        ? "<li>Answer the scorecard to see top gaps.</li>"
        : state.missingLabels.length
        ? state.missingLabels.slice(0, 4).map((label) => `<li>${escapeHtml(label)}</li>`).join("")
        : "<li>No urgent gap from this quick pass.</li>";
    }

    updateScorecardActions(state);
  }

  async function copyScoreSummary() {
    const status = $("[data-free-score-copy-status]");
    const manual = $("[data-free-score-manual]");
    const summary = buildScoreSummary(scorecardState({ neutral: true }));
    try {
      const copied = await copyTextWithFallback(summary);
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

  async function copyAuditBrief() {
    const status = $("[data-free-score-copy-status]");
    const manual = $("[data-free-score-manual]");
    const brief = buildAuditBrief(scorecardState({ neutral: true }));
    try {
      const copied = await copyTextWithFallback(brief);
      if (!copied) throw new Error("Copy failed.");
      if (status) status.textContent = "Audit brief copied.";
      if (manual) {
        manual.hidden = true;
        manual.value = "";
      }
    } catch (error) {
      if (status) status.textContent = "Copy blocked. The audit brief is open below.";
      if (manual) {
        manual.value = brief;
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

  async function copyScoreResultLink() {
    const status = $("[data-free-score-copy-status]");
    const manual = $("[data-free-score-manual]");
    const url = scorecardResultUrl();
    try {
      const copied = await copyTextWithFallback(url);
      if (!copied) throw new Error("Copy failed.");
      if (status) status.textContent = "Score result link copied.";
      if (manual) {
        manual.hidden = true;
        manual.value = "";
      }
    } catch (error) {
      if (status) status.textContent = "Copy blocked. The score result link is open below.";
      if (manual) {
        manual.value = url;
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
      item.addEventListener("change", () => {
        scorecardTouched = true;
        updateFreeScorecard();
      });
    });
    $$("[data-free-score-input]").forEach((item) => {
      item.addEventListener("input", updateFreeScorecard);
    });
    $$("[data-free-lead]").forEach((item) => {
      item.addEventListener("input", updateFreeScorecard);
    });
    $$("[data-free-score-copy]").forEach((item) => {
      item.addEventListener("click", copyScoreSummary);
    });
    $$("[data-free-score-copy-brief]").forEach((item) => {
      item.addEventListener("click", copyAuditBrief);
    });
    $$("[data-free-score-copy-link]").forEach((item) => {
      item.addEventListener("click", copyScoreResultLink);
    });
    updateFreeScorecard();
  }

  renderTrackPicker();
  applyTrackProfile();
  applyQueryPrefill();
  bindFreeScorecard();
})();
