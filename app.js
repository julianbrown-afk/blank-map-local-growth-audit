(function () {
  "use strict";

  const CONFIG = window.MONEY_MAKER_CONFIG || {};
  const STORAGE_KEY = "local-audit-cashflow-kit:v1";
  const CONFIG_SIGNATURE = JSON.stringify({
    ownerName: CONFIG.ownerName,
    businessName: CONFIG.businessName,
    contactEmail: CONFIG.contactEmail,
    mailingAddress: CONFIG.mailingAddress,
    marketCity: CONFIG.marketCity,
    serviceName: CONFIG.serviceName,
    auditPrice: CONFIG.auditPrice,
    implementationPrice: CONFIG.implementationPrice,
    offerBaseUrl: CONFIG.offerBaseUrl,
    paymentLink: CONFIG.paymentLink,
    bookingLink: CONFIG.bookingLink
  });
  const STATUS_OPTIONS = ["Research only", "Lead", "Contacted", "Followed up", "Paid audit", "Implementation", "Won", "Lost"];

  const STARTER_PROSPECTS = [
    {
      businessName: "Park Hills Family Dentistry",
      businessType: "Dentist",
      website: "https://parkhillsfamilydentistry.com/",
      city: "Lexington",
      avgCustomerValue: 650,
      leadsNeeded: 8,
      reviewAngle: "Booking path, new-patient flow, review presentation, mobile clarity"
    },
    {
      businessName: "Cooper Family Dentistry",
      businessType: "Dentist",
      website: "https://www.cooperfamilydental.com/",
      city: "Lexington",
      avgCustomerValue: 650,
      leadsNeeded: 8,
      reviewAngle: "Review proof, service pages, call-to-action structure"
    },
    {
      businessName: "Tates Creek Dental",
      businessType: "Dentist",
      website: "https://www.tatescreekdental.com/reviews",
      city: "Lexington",
      avgCustomerValue: 650,
      leadsNeeded: 8,
      reviewAngle: "Review request flow, new-patient action, review-to-booking path"
    },
    {
      businessName: "AMS Dental",
      businessType: "Dentist",
      website: "https://amsdentalcare.com/",
      city: "Lexington",
      avgCustomerValue: 650,
      leadsNeeded: 8,
      reviewAngle: "Request appointment flow, patient proof, service clarity"
    },
    {
      businessName: "Complete Dentistry for All Ages",
      businessType: "Dentist",
      website: "https://www.completedentistrylexington.com/",
      city: "Lexington",
      avgCustomerValue: 650,
      leadsNeeded: 8,
      reviewAngle: "Testimonial proof, appointment action, mobile first-screen clarity"
    },
    {
      businessName: "Williams Family Dentistry",
      businessType: "Dentist",
      website: "https://jewilliamsdmd.com/",
      city: "Lexington",
      avgCustomerValue: 650,
      leadsNeeded: 8,
      reviewAngle: "Testimonial visibility, booking action, local search confidence signals"
    },
    {
      businessName: "Luxe Lounge Medspa",
      businessType: "Med spa",
      website: "https://www.luxeloungemedspa.com/",
      city: "Lexington",
      avgCustomerValue: 500,
      leadsNeeded: 10,
      reviewAngle: "Treatment pages, consultation CTA, social proof, booking friction"
    },
    {
      businessName: "Belle Vie Aesthetic Medicine",
      businessType: "Med spa",
      website: "https://bellevietoday.com/",
      city: "Lexington",
      avgCustomerValue: 500,
      leadsNeeded: 10,
      reviewAngle: "Treatment proof, booking action, service-area clarity"
    },
    {
      businessName: "Lexington Prime Aesthetics & Wellness",
      businessType: "Med spa",
      website: "https://lexprimeaesthetics.com/",
      city: "Lexington",
      avgCustomerValue: 500,
      leadsNeeded: 10,
      reviewAngle: "Testimonial proof, treatment-page conversion, booking flow"
    },
    {
      businessName: "Beautiful You Medical Spa",
      businessType: "Med spa",
      website: "https://beautifulyoumedspa.com/",
      city: "Lexington",
      avgCustomerValue: 500,
      leadsNeeded: 10,
      reviewAngle: "Review proof, specials capture, appointment CTA"
    },
    {
      businessName: "Prive Medical Spa",
      businessType: "Med spa",
      website: "https://privemedicalspa.com/",
      city: "Lexington",
      avgCustomerValue: 500,
      leadsNeeded: 10,
      reviewAngle: "Premium positioning, consultation path, proof structure"
    },
    {
      businessName: "Hourglass Aesthetics & Wellness",
      businessType: "Med spa",
      website: "https://hourglassmedspa.com/",
      city: "Lexington",
      avgCustomerValue: 500,
      leadsNeeded: 10,
      reviewAngle: "Treatment menu clarity, consultation booking, proof and membership path"
    },
    {
      businessName: "The Spa at Marshall",
      businessType: "Med spa",
      website: "https://www.thespaatmarshall.com/",
      city: "Lexington",
      avgCustomerValue: 500,
      leadsNeeded: 10,
      reviewAngle: "Multi-location booking path, treatment proof, consultation CTA clarity"
    },
    {
      businessName: "Big Blue Roofing",
      businessType: "Roofing",
      website: "https://bigblueroofing.com/",
      city: "Lexington",
      avgCustomerValue: 4500,
      leadsNeeded: 2,
      reviewAngle: "Quote flow, trust proof, review presentation, urgency handling"
    },
    {
      businessName: "Big League Roofers",
      businessType: "Roofing",
      website: "https://bigleagueroofers.com/",
      city: "Lexington",
      avgCustomerValue: 4500,
      leadsNeeded: 2,
      reviewAngle: "Quote CTA, insurance-claim messaging, proof structure"
    },
    {
      businessName: "Reliable Residential Roofing",
      businessType: "Roofing",
      website: "https://www.reliableresidentialroofing.com/",
      city: "Lexington",
      avgCustomerValue: 4500,
      leadsNeeded: 2,
      reviewAngle: "Quote path, warranty/trust presentation, mobile CTA clarity"
    },
    {
      businessName: "Barrier Roofs",
      businessType: "Roofing",
      website: "https://barrierroofs.com/",
      city: "Lexington",
      avgCustomerValue: 4500,
      leadsNeeded: 2,
      reviewAngle: "Inspection request path, warranty proof, financing and trust signals"
    },
    {
      businessName: "Mighty Dog Roofing Lexington",
      businessType: "Roofing",
      website: "https://www.mightydogroofing.com/lexington-ky/",
      city: "Lexington",
      avgCustomerValue: 4500,
      leadsNeeded: 2,
      reviewAngle: "Roof inspection CTA, repair versus replacement clarity, service proof"
    },
    {
      businessName: "BACK Construction",
      businessType: "Remodeling",
      website: "https://backconstruction.com/",
      city: "Lexington",
      avgCustomerValue: 8000,
      leadsNeeded: 1,
      reviewAngle: "Consultation path, project categories, proof, estimate flow"
    },
    {
      businessName: "Right Angle Home Services",
      businessType: "Remodeling",
      website: "https://www.rightangleky.com/",
      city: "Lexington",
      avgCustomerValue: 8000,
      leadsNeeded: 1,
      reviewAngle: "Service pages, testimonial proof, quote action"
    },
    {
      businessName: "Handy Manny's",
      businessType: "General contractor",
      website: "https://handymannysky.com/",
      city: "Lexington",
      avgCustomerValue: 6000,
      leadsNeeded: 2,
      reviewAngle: "Free-estimate flow, service segmentation, mobile first-screen clarity"
    },
    {
      businessName: "Moore Custom Remodeling",
      businessType: "Remodeling",
      website: "https://www.moorebuildersky.com/reviews",
      city: "Lexington",
      avgCustomerValue: 8000,
      leadsNeeded: 1,
      reviewAngle: "Review proof, project gallery path, quote action"
    },
    {
      businessName: "ASB Remodeling",
      businessType: "Remodeling",
      website: "https://asbuildersllc.com/reviews/",
      city: "Lexington",
      avgCustomerValue: 8000,
      leadsNeeded: 1,
      reviewAngle: "Review proof, service conversion, lead capture"
    },
    {
      businessName: "J&R Construction Services",
      businessType: "Remodeling",
      website: "https://jrcsi.com/",
      city: "Lexington",
      avgCustomerValue: 8000,
      leadsNeeded: 1,
      reviewAngle: "Remodeling service pages, estimate request path, project proof"
    },
    {
      businessName: "Gulley Remodeling and Home Improvement",
      businessType: "Remodeling",
      website: "https://sites.google.com/view/gulleyremodeling/home",
      city: "Lexington",
      avgCustomerValue: 8000,
      leadsNeeded: 1,
      reviewAngle: "Residential remodeling positioning, service segmentation, quote path"
    },
    {
      businessName: "Improveit Home Remodeling Lexington",
      businessType: "Remodeling",
      website: "https://www.improveitusa.com/locations/lexington/",
      city: "Lexington",
      avgCustomerValue: 8000,
      leadsNeeded: 1,
      reviewAngle: "Bath and window offer clarity, consultation path, trust proof"
    },
    {
      businessName: "Air Control Company",
      businessType: "HVAC",
      website: "https://www.aircontrolco.com/",
      city: "Lexington",
      avgCustomerValue: 5500,
      leadsNeeded: 2,
      reviewAngle: "Service booking path, repair versus replacement clarity, trust proof"
    },
    {
      businessName: "Fayette Heating & Air",
      businessType: "HVAC, plumbing, and electrical",
      website: "https://fayetteheating.com/",
      city: "Lexington",
      avgCustomerValue: 5500,
      leadsNeeded: 2,
      reviewAngle: "Online scheduling, membership offer clarity, service-page conversion"
    },
    {
      businessName: "Comfort Heating & Air",
      businessType: "HVAC",
      website: "https://callthecomfortman.com/",
      city: "Lexington",
      avgCustomerValue: 5500,
      leadsNeeded: 2,
      reviewAngle: "Emergency service path, repair booking, review and proof structure"
    },
    {
      businessName: "Donnie Rowe Heating & Air Conditioning",
      businessType: "HVAC",
      website: "https://www.donnierowe.com/",
      city: "Lexington",
      avgCustomerValue: 5500,
      leadsNeeded: 2,
      reviewAngle: "Replacement financing clarity, service-area proof, mobile call path"
    },
    {
      businessName: "Synergy Home HVAC",
      businessType: "HVAC",
      website: "https://www.mysynergyhome.com/",
      city: "Lexington",
      avgCustomerValue: 5500,
      leadsNeeded: 2,
      reviewAngle: "Home-efficiency offer clarity, consultation path, proof structure"
    },
    {
      businessName: "Comfort Technologies Heating and Cooling",
      businessType: "HVAC",
      website: "https://www.mycomforttechnologies.com/",
      city: "Lexington",
      avgCustomerValue: 5500,
      leadsNeeded: 2,
      reviewAngle: "Repair and maintenance path, trust proof, service-call conversion"
    },
    {
      businessName: "PROfetick Plumbing",
      businessType: "Plumbing",
      website: "https://www.pro-fetick.com/",
      city: "Lexington",
      avgCustomerValue: 1500,
      leadsNeeded: 4,
      reviewAngle: "Repair request path, service category clarity, mobile call action"
    },
    {
      businessName: "Pipe Surgeon Plumbing",
      businessType: "Plumbing",
      website: "https://pipesurgeonplumbing.com/",
      city: "Lexington",
      avgCustomerValue: 1500,
      leadsNeeded: 4,
      reviewAngle: "Leak repair CTA, emergency intent, review and trust proof"
    },
    {
      businessName: "Mr. Rooter Plumbing of Greater Lexington",
      businessType: "Plumbing",
      website: "https://www.mrrooter.com/greater-lexington/",
      city: "Lexington",
      avgCustomerValue: 1500,
      leadsNeeded: 4,
      reviewAngle: "Service menu path, online booking, emergency-call clarity"
    },
    {
      businessName: "Roto-Rooter Lexington",
      businessType: "Plumbing",
      website: "https://www.rotorooter.com/lexington/",
      city: "Lexington",
      avgCustomerValue: 1500,
      leadsNeeded: 4,
      reviewAngle: "24/7 service path, drain service segmentation, conversion tracking"
    },
    {
      businessName: "Plumbing Systems Inc.",
      businessType: "Plumbing",
      website: "https://plumbingsystemslex.net/index.html",
      city: "Lexington",
      avgCustomerValue: 1500,
      leadsNeeded: 4,
      reviewAngle: "Repair scheduling path, drain service clarity, financing and trust proof"
    },
    {
      businessName: "Peterman Brothers",
      businessType: "HVAC plumbing electrical",
      website: "https://petermanhvac.com/lexington/plumbing-services/plumbing-repair/",
      city: "Lexington",
      avgCustomerValue: 5500,
      leadsNeeded: 2,
      reviewAngle: "Plumbing repair page path, cross-service booking, membership and trust proof"
    },
    {
      businessName: "KWC Orthodontics",
      businessType: "Orthodontist",
      website: "https://www.kwcorthodontics.com/",
      city: "Lexington",
      avgCustomerValue: 5500,
      leadsNeeded: 2,
      reviewAngle: "Consultation request path, treatment proof, Invisalign and braces pages"
    },
    {
      businessName: "Buchart + Wachs Orthodontics",
      businessType: "Orthodontist",
      website: "https://buchartwachs.com/",
      city: "Lexington",
      avgCustomerValue: 5500,
      leadsNeeded: 2,
      reviewAngle: "Appointment request path, doctor proof, treatment-page conversion"
    },
    {
      businessName: "GLO Orthodontics",
      businessType: "Orthodontist",
      website: "https://glo-ortho.com/",
      city: "Lexington",
      avgCustomerValue: 5500,
      leadsNeeded: 2,
      reviewAngle: "Consultation CTA, smile proof, patient journey clarity"
    },
    {
      businessName: "White Greer & Maggard Orthodontics",
      businessType: "Orthodontist",
      website: "https://wgmortho.com/",
      city: "Lexington",
      avgCustomerValue: 5500,
      leadsNeeded: 2,
      reviewAngle: "Location path, braces and Invisalign offer clarity, review proof"
    },
    {
      businessName: "Webster Orthodontics",
      businessType: "Orthodontist",
      website: "https://bracesbywebster.com/",
      city: "Lexington",
      avgCustomerValue: 5500,
      leadsNeeded: 2,
      reviewAngle: "New-patient path, treatment proof, mobile appointment clarity"
    },
    {
      businessName: "Spencer Law Group",
      businessType: "Personal injury law",
      website: "https://www.spencerlawgroup.com/",
      city: "Lexington",
      avgCustomerValue: 7500,
      leadsNeeded: 2,
      reviewAngle: "Consultation path, practice-area clarity, trust proof and intake follow-up"
    },
    {
      businessName: "Hicks & Funfsinn PLLC",
      businessType: "Personal injury law",
      website: "https://www.hfkylawyers.com/",
      city: "Lexington",
      avgCustomerValue: 7500,
      leadsNeeded: 2,
      reviewAngle: "Free consultation CTA, attorney proof, case-type page clarity"
    },
    {
      businessName: "Rosenbaum & Thompson",
      businessType: "Personal injury law",
      website: "https://www.lexingtonkylawyers.com/",
      city: "Lexington",
      avgCustomerValue: 7500,
      leadsNeeded: 2,
      reviewAngle: "Contact path, practice-area segmentation, trust proof"
    },
    {
      businessName: "Peterson Law Office",
      businessType: "Personal injury law",
      website: "https://www.justinpetersonlaw.com/",
      city: "Lexington",
      avgCustomerValue: 7500,
      leadsNeeded: 2,
      reviewAngle: "Practice-area pages, consultation request, proof and follow-up cues"
    },
    {
      businessName: "Ross Mann Law",
      businessType: "Personal injury law",
      website: "https://www.rossmannlaw.com/",
      city: "Lexington",
      avgCustomerValue: 7500,
      leadsNeeded: 2,
      reviewAngle: "Medical negligence positioning, consultation flow, client review proof"
    },
    {
      businessName: "Minner Vines Injury Lawyers",
      businessType: "Personal injury law",
      website: "https://www.mvmlaw.com/",
      city: "Lexington",
      avgCustomerValue: 7500,
      leadsNeeded: 2,
      reviewAngle: "Injury claim category path, consultation CTA, trust proof"
    },
    {
      businessName: "Hughes & Coleman Injury Lawyers",
      businessType: "Personal injury law",
      website: "https://www.hughesandcoleman.com/locations/kentucky/lexington/",
      city: "Lexington",
      avgCustomerValue: 7500,
      leadsNeeded: 2,
      reviewAngle: "Local office page path, free consultation CTA, trust proof"
    }
  ];

  const ISSUE_LIBRARY = {
    noBooking: {
      label: "No online booking",
      weight: 14,
      fix: "Add a visible booking path above the fold and repeat it near proof sections.",
      impact: "Reduces call friction for ready buyers."
    },
    unclearCTA: {
      label: "Unclear call to action",
      weight: 11,
      fix: "Use one primary action for the highest-value service and remove competing buttons.",
      impact: "Makes the next step obvious on mobile and desktop."
    },
    weakReviews: {
      label: "Review gap",
      weight: 13,
      fix: "Install a review request workflow after every completed job.",
      impact: "Improves trust before the first call."
    },
    slowSite: {
      label: "Slow or dated site",
      weight: 10,
      fix: "Compress images, simplify the first screen, and remove slow third-party scripts.",
      impact: "Protects traffic from bouncing before buyers see the offer."
    },
    missingProfile: {
      label: "Thin Google profile",
      weight: 12,
      fix: "Refresh categories, services, photos, Q&A, and weekly posts.",
      impact: "Gives local searchers more reasons to choose the business."
    },
    noTracking: {
      label: "No lead tracking",
      weight: 9,
      fix: "Track calls, forms, booking clicks, and source campaigns in one sheet.",
      impact: "Shows which channels create paid jobs."
    },
    noFollowup: {
      label: "No follow-up system",
      weight: 12,
      fix: "Add a two-step SMS or email follow-up for unbooked inquiries.",
      impact: "Recovers leads that would otherwise go quiet."
    },
    weakOffer: {
      label: "Weak offer clarity",
      weight: 10,
      fix: "Package the best service with a clear outcome, price anchor, and proof.",
      impact: "Turns comparison shoppers into specific buyers."
    }
  };

  const DEFAULT_STATE = {
    settings: {
      ownerName: CONFIG.ownerName || "Your Name",
      businessName: CONFIG.businessName || "Your Growth Studio",
      contactEmail: CONFIG.contactEmail || "you@example.com",
      mailingAddress: CONFIG.mailingAddress || "",
      marketCity: CONFIG.marketCity || "Your City",
      serviceName: CONFIG.serviceName || "Local Growth Audit",
      auditPrice: Number(CONFIG.auditPrice) || 399,
      implementationPrice: Number(CONFIG.implementationPrice) || 1500,
      offerBaseUrl: CONFIG.offerBaseUrl || "https://julianbrown-afk.github.io/blank-map-local-growth-audit/",
      paymentLink: CONFIG.paymentLink || "",
      bookingLink: CONFIG.bookingLink || "",
      guaranteeLine: CONFIG.guaranteeLine || "A clear 30-day action plan, built from observable fixes.",
      included: Array.isArray(CONFIG.included) ? CONFIG.included : [],
      proofPoints: Array.isArray(CONFIG.proofPoints) ? CONFIG.proofPoints : []
    },
    prospect: {
      businessName: "Oak Street Dental",
      businessType: "dental clinic",
      city: "Raleigh",
      website: "https://example.com",
      rating: 3.8,
      reviewCount: 22,
      avgCustomerValue: 650,
      leadsNeeded: 8,
      issues: ["noBooking", "unclearCTA", "weakReviews", "noFollowup"]
    },
    calculator: {
      prospectsPerDay: 12,
      workdays: 20,
      closeRate: 8,
      implementationRate: 30
    },
    prospects: []
  };

  let state = loadState();
  let toastTimer = 0;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      const shouldUseConfigSettings = saved.configSignature !== CONFIG_SIGNATURE;
      return {
        configSignature: CONFIG_SIGNATURE,
        settings: shouldUseConfigSettings ? DEFAULT_STATE.settings : { ...DEFAULT_STATE.settings, ...(saved.settings || {}) },
        prospect: { ...DEFAULT_STATE.prospect, ...(saved.prospect || {}) },
        calculator: { ...DEFAULT_STATE.calculator, ...(saved.calculator || {}) },
        prospects: Array.isArray(saved.prospects) ? saved.prospects : []
      };
    } catch (error) {
      return structuredClone(DEFAULT_STATE);
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, configSignature: CONFIG_SIGNATURE }));
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function toNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function currency(value) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(Math.round(toNumber(value)));
  }

  function plainUrl(value) {
    return String(value || "").trim();
  }

  function prospectIdentity(prospect) {
    return [
      prospect.businessName,
      prospect.website || prospect.city,
      prospect.businessType
    ].map((value) => String(value || "").trim().toLowerCase()).join("|");
  }

  function estimateStarterValue(prospect) {
    const rawValue = toNumber(prospect.avgCustomerValue) * toNumber(prospect.leadsNeeded) * 0.35;
    return Math.round(rawValue / 10) * 10;
  }

  function displayHost(value) {
    try {
      return new URL(value).hostname.replace(/^www\./, "");
    } catch (error) {
      return plainUrl(value);
    }
  }

  function safeExternalUrl(value) {
    const url = plainUrl(value);
    return /^https?:\/\//i.test(url) ? url : "";
  }

  function formatScore(prospect) {
    const score = toNumber(prospect.score, NaN);
    return Number.isFinite(score) && score > 0 ? `${Math.round(score)}/100` : "Research";
  }

  function renderIssueControls() {
    const container = $("[data-issue-list]");
    container.innerHTML = Object.entries(ISSUE_LIBRARY).map(([key, issue]) => {
      const checked = state.prospect.issues.includes(key) ? "checked" : "";
      return `
        <label class="check-pill">
          <input type="checkbox" data-issue="${key}" ${checked}>
          <span>${issue.label}</span>
        </label>
      `;
    }).join("");
  }

  function syncInputs() {
    $$("[data-setting]").forEach((input) => {
      const key = input.dataset.setting;
      input.value = state.settings[key] ?? "";
    });
    $$("[data-prospect]").forEach((input) => {
      const key = input.dataset.prospect;
      input.value = state.prospect[key] ?? "";
    });
    $$("[data-calc]").forEach((input) => {
      const key = input.dataset.calc;
      input.value = state.calculator[key] ?? "";
    });
  }

  function getAnalysis() {
    const prospect = state.prospect;
    const issues = state.prospect.issues
      .map((key) => ({ key, ...ISSUE_LIBRARY[key] }))
      .filter((issue) => issue.label);

    const rating = toNumber(prospect.rating, 0);
    const reviews = toNumber(prospect.reviewCount, 0);
    const averageValue = toNumber(prospect.avgCustomerValue, 0);
    const leadsNeeded = toNumber(prospect.leadsNeeded, 1);

    const issueScore = issues.reduce((total, issue) => total + issue.weight, 0);
    const ratingGap = rating > 0 ? clamp(Math.round((4.5 - rating) * 9), 0, 18) : 8;
    const reviewGap = reviews < 50 ? Math.round((50 - reviews) * 0.24) : 0;
    const score = clamp(18 + issueScore + ratingGap + reviewGap, 12, 96);
    const conversionFactor = clamp(0.22 + score / 260, 0.24, 0.58);
    const monthlyUpside = Math.round((averageValue * leadsNeeded * conversionFactor) / 10) * 10;
    const priority = score >= 78 ? "High" : score >= 50 ? "Medium" : "Low";

    const findings = issues.length ? issues.slice(0, 5) : [{
      label: "Baseline check",
      fix: "Validate the booking path, search listing, reviews, and lead tracking before quoting implementation.",
      impact: "Creates a clean starting point for paid work."
    }];

    return { score, monthlyUpside, priority, findings };
  }

  function buildReport() {
    const { score, monthlyUpside, priority, findings } = getAnalysis();
    const prospect = state.prospect;
    const settings = state.settings;
    const issueLines = findings.map((finding, index) => {
      return `${index + 1}. ${finding.label}\n   Fix: ${finding.fix}\n   Why it matters: ${finding.impact}`;
    }).join("\n\n");

    const weekOne = findings[0]?.fix || "Confirm the highest-value service and make the primary call to action obvious.";
    const weekTwo = findings[1]?.fix || "Tighten Google Business Profile services, photos, and review prompts.";
    const weekThree = findings[2]?.fix || "Install simple tracking for calls, forms, and booking clicks.";

    return `${settings.serviceName.toUpperCase()}\nPrepared for: ${prospect.businessName}\nMarket: ${prospect.city} ${prospect.businessType}\nWebsite: ${prospect.website || "Not provided"}\nPrepared by: ${settings.businessName} (${settings.contactEmail})\n\nOpportunity score: ${score}/100 (${priority})\nEstimated monthly upside: ${currency(monthlyUpside)}\n\nThis estimate is for planning. It is not a promise of revenue.\n\nKey findings\n${issueLines}\n\n30-day sprint\nWeek 1: ${weekOne}\nWeek 2: ${weekTwo}\nWeek 3: ${weekThree}\nWeek 4: Review tracked leads, tighten the offer, and quote the next sprint.\n\nRecommended paid path\nAudit: ${currency(settings.auditPrice)}\nImplementation sprint: ${currency(settings.implementationPrice)}\n\nNext step\nApprove the audit, then ${settings.businessName} will turn these notes into a prioritized implementation plan.`;
  }

  function buildEmail() {
    const { score, monthlyUpside, findings } = getAnalysis();
    const settings = state.settings;
    const prospect = state.prospect;
    const primaryFinding = findings[0]?.label.toLowerCase() || "a few local growth gaps";
    const subject = `Subject: ${prospect.businessName} local growth audit`;
    const mailingAddress = String(settings.mailingAddress || "").trim();
    const complianceLine = mailingAddress
      ? mailingAddress
      : "[Add a valid physical mailing address before sending commercial outreach.]";
    const payLine = settings.paymentLink
      ? `The paid audit is ${currency(settings.auditPrice)}: ${settings.paymentLink}`
      : `The paid audit is ${currency(settings.auditPrice)}. I can send an invoice or payment link if you want it.`;

    return `${subject}\n\nHi ${prospect.businessName} team,\n\nI was reviewing ${prospect.businessType} options around ${prospect.city} and noticed ${primaryFinding}. There may be a practical upside of about ${currency(monthlyUpside)} per month if the highest-friction items are fixed. The score I calculated was ${score}/100.\n\nI can prepare a concise ${settings.serviceName} with the fixes, tracking plan, and a 30-day implementation quote.\n\n${payLine}\n\nIf useful, reply with the best contact and I will send the next step.\n\n${settings.ownerName}\n${settings.businessName}\n${settings.contactEmail}\n${complianceLine}\n\nIf this is not relevant, reply \"no\" and I will not contact you again.`;
  }

  function buildDm() {
    const { findings } = getAnalysis();
    const settings = state.settings;
    const prospect = state.prospect;
    const issue = findings[0]?.label.toLowerCase() || "a few conversion gaps";
    return `Hi ${prospect.businessName}, I noticed ${issue} while checking ${prospect.businessType} options in ${prospect.city}. I sell a short ${settings.serviceName} for ${currency(settings.auditPrice)} with a 30-day action plan. Should I send the details?`;
  }

  function buildScorecardPost() {
    const settings = state.settings;
    const scorecardUrl = getPublicUrl("scorecard.html");
    const offerUrl = getPublicUrl();

    return `${settings.marketCity} local service owners: I made a free scorecard for checking the buyer-path basics that often get missed before people spend more on ads or redesigns.

It looks at mobile call-to-action clarity, Google profile basics, review trust, tracking, service-page clarity, and follow-up gaps.

Free scorecard:
${scorecardUrl}

If the scorecard surfaces enough gaps, the paid ${settings.serviceName} turns that into a prioritized 30-day action plan for ${currency(settings.auditPrice)}.

Paid audit details:
${offerUrl}

This is planning math, not a revenue guarantee.`;
  }

  function buildWarmReferralNote() {
    const settings = state.settings;
    const scorecardUrl = getPublicUrl("scorecard.html");
    const offerUrl = getPublicUrl();

    return `Quick ask: do you know any ${settings.marketCity} service business owners who rely on calls, bookings, appointments, or quote requests?

I built a free Local Growth Scorecard they can use to check whether their website, Google profile, reviews, tracking, and follow-up path have obvious buyer leaks:
${scorecardUrl}

If it shows enough gaps, I also offer a fixed-scope ${settings.serviceName} for ${currency(settings.auditPrice)}:
${offerUrl}

No retainer pitch. The audit produces a prioritized 30-day action plan and an optional implementation quote.`;
  }

  function buildCommunityReply() {
    const settings = state.settings;
    const scorecardUrl = getPublicUrl("scorecard.html");

    return `A practical first step is to check the buyer path before buying more traffic.

I made a free scorecard for ${settings.marketCity} service businesses that checks:
- mobile call or booking clarity
- Google Business Profile basics
- review trust
- call/form/booking tracking
- follow-up for unbooked inquiries
- high-value service page clarity

You can run it here:
${scorecardUrl}

It will not guarantee revenue, but it can show whether a focused audit is worth doing before a bigger marketing spend.`;
  }

  function buildScoreLeadReply(prospect = state.prospect, analysis = prospect === state.prospect ? getAnalysis() : null) {
    const settings = state.settings;
    const businessName = prospect.businessName || "your business";
    const track = getProspectTrack(prospect);
    const offerUrl = getProspectOfferUrl(prospect);
    const scorecardUrl = getOfferUrl("scorecard.html");
    const sampleUrl = getOfferUrl("sample-audit.html");
    const paymentUrl = settings.paymentLink || offerUrl;
    const bookingUrl = settings.bookingLink || offerUrl;
    const prospectScore = toNumber(prospect.score, NaN);
    const score = analysis?.score || (Number.isFinite(prospectScore) && prospectScore > 0 ? Math.round(prospectScore) : null);
    const scoreLine = score ? `\nScorecard signal: ${score}/100.` : "";
    const findingLine = analysis?.findings?.[0]
      ? `\nPrimary visible gap: ${analysis.findings[0].label} - ${analysis.findings[0].fix}`
      : prospect.reviewAngle
        ? `\nReview angle: ${prospect.reviewAngle}`
        : "";
    const upsideLine = analysis?.monthlyUpside
      ? `Planning upside estimate: ${currency(analysis.monthlyUpside)} per month. This is not a revenue guarantee.`
      : "The scorecard is planning input, not a revenue guarantee.";

    return `Subject: Re: ${businessName} Local Growth Scorecard

Hi ${businessName} team,

Thanks for sending over the scorecard details. Based on the gaps it surfaced, I would not jump straight into a redesign, ad spend, or a retainer.

The useful next step is the fixed-scope ${settings.serviceName}. I review the visible buyer path for ${businessName}, especially ${track.focus}, then send back a prioritized 30-day action plan and an optional implementation quote.${scoreLine}${findingLine}

Paid audit (${currency(settings.auditPrice)}): ${paymentUrl}
Book a call: ${bookingUrl}
Relevant audit page: ${offerUrl}
Free scorecard: ${scorecardUrl}
Sample report: ${sampleUrl}

If you want me to do the review, use the audit link or book a call and I will confirm the intake details.

${settings.ownerName}
${settings.businessName}
${settings.contactEmail}

${upsideLine}`;
  }

  function buildScoreLeadCallOutline(prospect = state.prospect) {
    const settings = state.settings;
    const businessName = prospect.businessName || "the business";
    const category = prospect.businessType || "local service business";
    const city = prospect.city || settings.marketCity;
    const track = getProspectTrack(prospect);
    const analysis = prospect === state.prospect ? getAnalysis() : null;
    const offerUrl = getProspectOfferUrl(prospect);
    const intakeUrl = getOfferUrl("audit-intake.html");
    const sampleUrl = getOfferUrl("sample-audit.html");
    const paymentUrl = settings.paymentLink || offerUrl;
    const bookingUrl = settings.bookingLink || offerUrl;
    const scoreLine = analysis ? `Current dashboard score: ${analysis.score}/100 (${analysis.priority}).` : "Use the scorecard details they sent as the starting point.";
    const findingLine = analysis?.findings?.[0]
      ? `First gap to discuss: ${analysis.findings[0].label} - ${analysis.findings[0].impact}`
      : prospect.reviewAngle
        ? `First gap to discuss: ${prospect.reviewAngle}`
        : `First gap to discuss: ${track.focus}.`;

    return `Scorecard lead call outline: ${businessName}

Goal: decide whether a ${currency(settings.auditPrice)} ${settings.serviceName} is warranted. Do not promise revenue.

1. Confirm context
- Category: ${category}
- Market: ${city}
- Website: ${prospect.website || "[ask for website]"}
- Highest-value service, case, appointment, or job type: [ask]

2. Anchor the scorecard
- ${scoreLine}
- ${findingLine}
- Ask which gap already matches what they see in their leads, bookings, calls, or quote requests.

3. Explain the paid audit
- Fixed scope: visible buyer path, ${track.focus}.
- Output: prioritized 30-day plan, tracking notes, and an implementation quote only after the fixes are clear.
- Price: ${currency(settings.auditPrice)}.

4. Close the next step
- Paid audit: ${paymentUrl}
- Book a call: ${bookingUrl}
- Intake page after payment: ${intakeUrl}
- Relevant audit page: ${offerUrl}
- Sample report: ${sampleUrl}

Use this line if they ask about results: the audit is planning work based on observable fixes, not a revenue guarantee.`;
  }

  function getProspectTrack(prospect = {}) {
    const text = `${prospect.businessType || ""} ${prospect.businessName || ""}`.toLowerCase();
    const hasPlumbing = text.includes("plumb");
    const hasElectrical = text.includes("electric");
    const hasHvac = text.includes("hvac") || text.includes("heating") || text.includes("air conditioning") || text.includes("cooling");
    if (text.includes("law") || text.includes("attorney") || text.includes("injury") || text.includes("legal")) {
      return {
        label: "Personal injury law track",
        path: "lexington-personal-injury-law-growth-audit.html",
        focus: "consultation clarity, trust proof, practice-area pages, and intake follow-up friction"
      };
    }
    if (hasPlumbing && !hasHvac && !hasElectrical) {
      return {
        label: "Plumbing track",
        path: "lexington-plumbing-growth-audit.html",
        focus: "emergency-call clarity, repair booking, trust proof, service-page conversion, and follow-up gaps"
      };
    }
    if (hasHvac && !hasPlumbing && !hasElectrical) {
      return {
        label: "HVAC track",
        path: "lexington-hvac-growth-audit.html",
        focus: "repair booking, replacement quote clarity, maintenance offers, trust proof, and follow-up gaps"
      };
    }
    if (hasHvac || hasPlumbing || hasElectrical) {
      return {
        label: "HVAC/plumbing track",
        path: "lexington-hvac-plumbing-growth-audit.html",
        focus: "service-call booking, quote clarity, trust proof, and follow-up gaps"
      };
    }
    if (text.includes("orthodont")) {
      return {
        label: "Orthodontist track",
        path: "lexington-orthodontist-growth-audit.html",
        focus: "consultation requests, braces and Invisalign proof, review trust, and follow-up friction"
      };
    }
    if (text.includes("dent")) {
      return {
        label: "Dentist track",
        path: "lexington-dentist-growth-audit.html",
        focus: "new-patient booking, review trust, and follow-up friction"
      };
    }
    if (text.includes("med spa") || text.includes("medspa") || text.includes("aesthetic")) {
      return {
        label: "Med spa track",
        path: "lexington-med-spa-growth-audit.html",
        focus: "treatment-page clarity, consultation booking, proof, and follow-up friction"
      };
    }
    if (text.includes("roof")) {
      return {
        label: "Roofing track",
        path: "lexington-roofing-growth-audit.html",
        focus: "inspection requests, repair and replacement quote clarity, warranty proof, financing cues, and follow-up gaps"
      };
    }
    if (text.includes("remodel") || text.includes("contractor") || text.includes("construction")) {
      return {
        label: "Remodeling track",
        path: "lexington-remodeling-growth-audit.html",
        focus: "project-fit clarity, galleries and proof, estimate flow, and follow-up gaps"
      };
    }
    return {
      label: "General offer",
      path: "offer.html",
      focus: "booking, review, website, and follow-up gaps"
    };
  }

  function buildConfigText() {
    const publicConfig = {
      ...state.settings,
      auditPrice: toNumber(state.settings.auditPrice),
      implementationPrice: toNumber(state.settings.implementationPrice)
    };
    return `window.MONEY_MAKER_CONFIG = ${JSON.stringify(publicConfig, null, 2)};\n`;
  }

  function getOfferBaseUrl() {
    const configured = plainUrl(state.settings.offerBaseUrl || CONFIG.offerBaseUrl);
    if (configured) return configured.endsWith("/") ? configured : `${configured}/`;
    return new URL("./", window.location.href).toString();
  }

  function getOfferUrl(path = "offer.html") {
    const offerPath = path === "offer.html" ? "" : path;
    const url = new URL(offerPath, getOfferBaseUrl());
    const settings = state.settings;
    const params = {
      service: settings.serviceName,
      city: settings.marketCity,
      business: settings.businessName,
      email: settings.contactEmail,
      pay: settings.paymentLink,
      booking: settings.bookingLink,
      audit: settings.auditPrice,
      sprint: settings.implementationPrice
    };
    Object.entries(params).forEach(([key, value]) => {
      if (plainUrl(value)) url.searchParams.set(key, value);
    });
    return url.toString();
  }

  function getPublicUrl(path = "offer.html") {
    const publicPath = path === "offer.html" ? "" : path;
    return new URL(publicPath, getOfferBaseUrl()).toString();
  }

  function getProspectOfferUrl(prospect) {
    return getOfferUrl(getProspectTrack(prospect).path);
  }

  function buildProspectIntro(prospect) {
    const settings = state.settings;
    const track = getProspectTrack(prospect);
    const offerUrl = getProspectOfferUrl(prospect);
    const scorecardUrl = getOfferUrl("scorecard.html");
    const businessType = prospect.businessType || "local service business";
    const city = prospect.city || settings.marketCity;
    const mailingAddress = String(settings.mailingAddress || "").trim();
    const complianceLine = mailingAddress
      ? mailingAddress
      : "[Add a valid physical mailing address before sending as commercial email.]";
    const reviewAngle = prospect.reviewAngle
      ? ` The review angle I would start with is ${prospect.reviewAngle.toLowerCase()}.`
      : "";

    return `Hi ${prospect.businessName || "there"} team,\n\nI found your business while reviewing ${businessType} options around ${city}. I sell a fixed-scope ${settings.serviceName} for ${currency(settings.auditPrice)} that turns the visible buyer path into a prioritized 30-day action plan.\n\nThe most relevant page for your category is here:\n${offerUrl}\n\nIf you want to sanity-check the basics first, the free scorecard is here:\n${scorecardUrl}\n\nIt covers ${track.focus}, includes a sample report, and gives the option to buy the audit or book a call.${reviewAngle}\n\nIf useful, the page has the next step. If this is not relevant, reply \"no\" and I will not contact you again.\n\n${settings.ownerName}\n${settings.businessName}\n${settings.contactEmail}\n${complianceLine}`;
  }

  function buildProspectFollowUp(prospect) {
    const settings = state.settings;
    const track = getProspectTrack(prospect);
    const offerUrl = getProspectOfferUrl(prospect);
    const mailingAddress = String(settings.mailingAddress || "").trim();
    const complianceLine = mailingAddress
      ? mailingAddress
      : "[Add a valid physical mailing address before sending as commercial email.]";

    return `Hi ${prospect.businessName || "there"} team,\n\nQuick follow-up on the ${settings.serviceName} page I sent over. The ${track.label.toLowerCase()} is here if you want to review it:\n${offerUrl}\n\nThe audit is fixed-scope at ${currency(settings.auditPrice)} and is meant to give you a clear 30-day plan before any bigger implementation work is discussed.\n\nIf this is useful, the page has the buy and booking options. If not, reply \"no\" and I will not contact you again.\n\n${settings.ownerName}\n${settings.businessName}\n${settings.contactEmail}\n${complianceLine}`;
  }

  function buildIntakeEmail(prospect = state.prospect) {
    const settings = state.settings;
    const businessName = prospect.businessName || "your business";
    const website = prospect.website || "[website]";
    const serviceArea = prospect.city || settings.marketCity || "[service area]";
    const category = prospect.businessType || "local service business";
    const intakeUrl = getOfferUrl("audit-intake.html");
    const bookingLine = settings.bookingLink
      ? `Call booking link: ${settings.bookingLink}`
      : "Call booking link: [add booking link if needed]";

    return `Subject: ${settings.serviceName} intake for ${businessName}

Hi ${businessName} team,

Thanks for purchasing or booking the ${settings.serviceName}. To start the audit, please reply with the details below. No website passwords or account logins are needed for the first review.

1. Business name: ${businessName}
2. Website: ${website}
3. Service area: ${serviceArea}
4. Business category: ${category}
5. Highest-value service, offer, treatment, job type, or appointment:
6. Current best contact path: phone, form, booking page, or quote request:
7. Competitors or priority notes:
8. Payment name or email used at checkout:

Intake page: ${intakeUrl}
${bookingLine}

Once I have those details, I will review the visible buyer path and prepare the prioritized 30-day action plan.

${settings.ownerName}
${settings.businessName}
${settings.contactEmail}`;
  }

  function csvCell(value) {
    const text = String(value ?? "");
    return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  }

  function buildOutreachCsv() {
    const headers = [
      "business_name",
      "category",
      "city",
      "website",
      "offer_track",
      "offer_url",
      "scorecard_url",
      "status",
      "estimated_monthly_value",
      "review_angle",
      "intro_copy",
      "follow_up_copy",
      "compliance_note"
    ];
    const mailingAddress = String(state.settings.mailingAddress || "").trim();
    const complianceNote = mailingAddress
      ? "Commercial email footer has a physical mailing address."
      : "Do not send as cold commercial email until a valid physical mailing address is added.";
    const rows = state.prospects.map((prospect) => {
      const track = getProspectTrack(prospect);
      return [
        prospect.businessName || "",
        prospect.businessType || "",
        prospect.city || state.settings.marketCity,
        prospect.website || "",
        track.label,
        getProspectOfferUrl(prospect),
        getOfferUrl("scorecard.html"),
        prospect.status || "Lead",
        toNumber(prospect.value) > 0 ? Math.round(toNumber(prospect.value)) : "",
        prospect.reviewAngle || "",
        buildProspectIntro(prospect),
        buildProspectFollowUp(prospect),
        complianceNote
      ].map(csvCell).join(",");
    });
    return [headers.join(","), ...rows].join("\n");
  }

  function getActionableProspects() {
    const activeStatuses = new Set(["Research only", "Lead", "Contacted", "Followed up"]);
    return state.prospects
      .filter((prospect) => activeStatuses.has(prospect.status || "Lead"))
      .sort((a, b) => toNumber(b.value) - toNumber(a.value));
  }

  function getFollowUpProspects() {
    return state.prospects
      .filter((prospect) => prospect.status === "Contacted")
      .sort((a, b) => toNumber(b.value) - toNumber(a.value));
  }

  function buildDailyBatchText(limit = 10) {
    const prospects = getActionableProspects().slice(0, limit);
    const mailingAddress = String(state.settings.mailingAddress || "").trim();
    const complianceNote = mailingAddress
      ? "Commercial email footer has a physical mailing address."
      : "Do not send as cold commercial email until a valid physical mailing address is added.";

    if (!prospects.length) {
      return "No actionable prospects are currently in Research only, Lead, or Contacted status.";
    }

    const lines = [
      `${state.settings.serviceName} daily outreach batch`,
      `Prepared for ${state.settings.businessName}`,
      `Prospects: ${prospects.length}`,
      `Free scorecard: ${getOfferUrl("scorecard.html")}`,
      `Compliance: ${complianceNote}`,
      ""
    ];

    prospects.forEach((prospect, index) => {
      const track = getProspectTrack(prospect);
      lines.push(
        `${index + 1}. ${prospect.businessName || "Unnamed prospect"} (${prospect.businessType || "Local business"} - ${prospect.city || state.settings.marketCity})`,
        `Status: ${prospect.status || "Lead"}`,
        `Estimated monthly value: ${toNumber(prospect.value) > 0 ? currency(prospect.value) : "Estimate pending"}`,
        `Website: ${prospect.website || "Not listed"}`,
        `Offer track: ${track.label}`,
        `Offer URL: ${getProspectOfferUrl(prospect)}`,
        `Scorecard URL: ${getOfferUrl("scorecard.html")}`,
        `Review angle: ${prospect.reviewAngle || "Inspect website, local proof, booking path, and follow-up cues."}`,
        "",
        buildProspectIntro(prospect),
        "",
        "---",
        ""
      );
    });

    return lines.join("\n");
  }

  function buildFollowUpBatchText(limit = 10) {
    const prospects = getFollowUpProspects().slice(0, limit);
    const mailingAddress = String(state.settings.mailingAddress || "").trim();
    const complianceNote = mailingAddress
      ? "Commercial email footer has a physical mailing address."
      : "Do not send as cold commercial email until a valid physical mailing address is added.";

    if (!prospects.length) {
      return "No prospects are currently marked Contacted. Change a prospect status to Contacted before building a follow-up batch.";
    }

    const lines = [
      `${state.settings.serviceName} follow-up batch`,
      `Prepared for ${state.settings.businessName}`,
      `Prospects: ${prospects.length}`,
      `Compliance: ${complianceNote}`,
      ""
    ];

    prospects.forEach((prospect, index) => {
      const track = getProspectTrack(prospect);
      lines.push(
        `${index + 1}. ${prospect.businessName || "Unnamed prospect"} (${prospect.businessType || "Local business"} - ${prospect.city || state.settings.marketCity})`,
        `Estimated monthly value: ${toNumber(prospect.value) > 0 ? currency(prospect.value) : "Estimate pending"}`,
        `Offer track: ${track.label}`,
        `Offer URL: ${getProspectOfferUrl(prospect)}`,
        "",
        buildProspectFollowUp(prospect),
        "",
        "---",
        ""
      );
    });

    return lines.join("\n");
  }

  function renderFindings(findings) {
    const list = $("[data-output='findings']");
    list.innerHTML = findings.map((finding) => `
      <li>
        <strong>${finding.label}</strong>
        <span>${finding.fix}</span>
      </li>
    `).join("");
  }

  function renderPipelineSummary() {
    const container = $("[data-output='pipelineSummary']");
    if (!container) return;

    const prospects = state.prospects;
    const actionable = getActionableProspects();
    const estimatedValue = actionable.reduce((sum, prospect) => sum + toNumber(prospect.value), 0);
    const contacted = prospects.filter((prospect) => prospect.status === "Contacted").length;
    const followedUp = prospects.filter((prospect) => prospect.status === "Followed up").length;
    const paid = prospects.filter((prospect) => prospect.status === "Paid audit" || prospect.status === "Implementation" || prospect.status === "Won").length;
    const tracks = new Set(prospects.map((prospect) => getProspectTrack(prospect).label));

    if (!prospects.length) {
      container.innerHTML = `
        <div>
          <span>Queue</span>
          <strong>Empty</strong>
          <p>Load the starter list or add prospects from the audit form.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div>
        <span>Total prospects</span>
        <strong>${prospects.length}</strong>
        <p>${tracks.size} matched offer ${tracks.size === 1 ? "track" : "tracks"}</p>
      </div>
      <div>
        <span>Actionable</span>
        <strong>${actionable.length}</strong>
        <p>Research, lead, contacted, and followed-up statuses</p>
      </div>
      <div>
        <span>Open value</span>
        <strong>${currency(estimatedValue)}</strong>
        <p>Estimated from active prospects</p>
      </div>
      <div>
        <span>Progress</span>
        <strong>${contacted}/${followedUp}/${paid}</strong>
        <p>Contacted / followed up / paid</p>
      </div>
    `;
  }

  function renderPipeline() {
    const body = $("[data-output='pipelineRows']");
    if (!state.prospects.length) {
      body.innerHTML = `<tr><td class="empty-row" colspan="6">No prospects saved yet.</td></tr>`;
      return;
    }

    body.innerHTML = state.prospects.map((prospect) => {
      const currentStatus = prospect.status || "Lead";
      const statusOptions = STATUS_OPTIONS.includes(currentStatus) ? STATUS_OPTIONS : [currentStatus, ...STATUS_OPTIONS];
      const options = statusOptions.map((status) => {
        const selected = status === currentStatus ? "selected" : "";
        return `<option value="${escapeHtml(status)}" ${selected}>${escapeHtml(status)}</option>`;
      }).join("");
      const website = safeExternalUrl(prospect.website);
      const websiteLine = website
        ? `<br><a class="pipeline-link" href="${escapeHtml(website)}" target="_blank" rel="noreferrer">${escapeHtml(displayHost(website))}</a>`
        : "";
      const angleLine = prospect.reviewAngle
        ? `<small class="pipeline-note">${escapeHtml(prospect.reviewAngle)}</small>`
        : "";
      const track = getProspectTrack(prospect);
      const offerUrl = getProspectOfferUrl(prospect);
      const trackLine = `<small class="pipeline-note">Offer: <a class="pipeline-link" href="${escapeHtml(offerUrl)}" target="_blank" rel="noreferrer">${escapeHtml(track.label)}</a></small>`;
      const valueLabel = toNumber(prospect.value) > 0 ? `${currency(prospect.value)} est.` : "Estimate pending";

      return `
        <tr>
          <td>
            <strong>${escapeHtml(prospect.businessName || "Unnamed prospect")}</strong>
            <br><span>${escapeHtml(prospect.businessType || "Local business")}</span>${websiteLine}${trackLine}${angleLine}
          </td>
          <td>${escapeHtml(prospect.city || state.settings.marketCity)}</td>
          <td>${formatScore(prospect)}</td>
          <td>${valueLabel}</td>
          <td><select data-pipeline-status="${escapeHtml(prospect.id)}">${options}</select></td>
          <td>
            <div class="pipeline-actions">
              <button class="ghost-button" type="button" data-copy-prospect-intro="${escapeHtml(prospect.id)}">Copy intro</button>
              <button class="ghost-button" type="button" data-copy-prospect-follow-up="${escapeHtml(prospect.id)}">Copy follow-up</button>
              <button class="ghost-button" type="button" data-copy-score-lead-reply="${escapeHtml(prospect.id)}">Copy score reply</button>
              <button class="ghost-button" type="button" data-copy-prospect-intake="${escapeHtml(prospect.id)}">Copy intake</button>
              <button class="ghost-button" type="button" data-copy-prospect-offer="${escapeHtml(prospect.id)}">Copy link</button>
              <button class="ghost-button" type="button" data-open-prospect-offer="${escapeHtml(prospect.id)}">Open</button>
              <button class="ghost-button" type="button" data-remove-prospect="${escapeHtml(prospect.id)}">Remove</button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  function render() {
    const analysis = getAnalysis();
    const calc = state.calculator;
    const settings = state.settings;
    const messages = toNumber(calc.prospectsPerDay) * toNumber(calc.workdays);
    const monthlyAudits = messages * (toNumber(calc.closeRate) / 100);
    const auditRevenue = monthlyAudits * toNumber(settings.auditPrice);
    const implementationDeals = monthlyAudits * (toNumber(calc.implementationRate) / 100);
    const implementationRevenue = implementationDeals * toNumber(settings.implementationPrice);
    const projectedRevenue = auditRevenue + implementationRevenue;
    const messagesPerAudit = Math.ceil(100 / clamp(toNumber(calc.closeRate), 1, 100));

    $("[data-output='auditPrice']").textContent = currency(settings.auditPrice);
    $("[data-output='monthlyAudits']").textContent = monthlyAudits.toFixed(1);
    $("[data-output='projectedRevenue']").textContent = currency(projectedRevenue);
    $("[data-output='nextTarget']").textContent = `Send ${messagesPerAudit} messages`;
    $("[data-output='auditRevenue']").textContent = currency(auditRevenue);
    $("[data-output='implementationRevenue']").textContent = currency(implementationRevenue);
    $("[data-output='messagesPerAudit']").textContent = messagesPerAudit;
    $("[data-output='score']").textContent = `${analysis.score}/100`;
    $("[data-output='monthlyUpside']").textContent = currency(analysis.monthlyUpside);
    $("[data-output='priority']").textContent = analysis.priority;
    $("[data-output='reportText']").textContent = buildReport();
    $("[data-output='emailText']").textContent = buildEmail();
    $("[data-output='dmText']").textContent = buildDm();
    $("[data-output='intakeText']").textContent = buildIntakeEmail();
    $("[data-output='scorecardPostText']").textContent = buildScorecardPost();
    $("[data-output='scoreLeadReplyText']").textContent = buildScoreLeadReply();
    $("[data-output='scoreLeadCallText']").textContent = buildScoreLeadCallOutline();
    $("[data-output='warmReferralText']").textContent = buildWarmReferralNote();
    $("[data-output='communityReplyText']").textContent = buildCommunityReply();
    renderFindings(analysis.findings);
    renderPipelineSummary();
    renderPipeline();
  }

  function showToast(message) {
    const toast = $("[data-output='toast']");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  function showManualCopy(text) {
    const panel = $("[data-output='manualCopy']");
    const textarea = $("[data-output='manualCopyText']");
    if (!panel || !textarea) return;
    textarea.value = text;
    panel.hidden = false;
    textarea.focus();
    textarea.select();
  }

  async function copyText(text, message) {
    try {
      let copied = false;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(text);
          copied = true;
        } catch (error) {
          copied = false;
        }
      }

      if (!copied) {
        const area = document.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.left = "-999px";
        document.body.appendChild(area);
        area.focus();
        area.select();
        area.setSelectionRange(0, area.value.length);
        copied = document.execCommand("copy");
        area.remove();
      }

      if (!copied) throw new Error("Copy command failed.");
      showToast(message);
    } catch (error) {
      showManualCopy(text);
      showToast("Copy blocked. Text opened below.");
    }
  }

  function downloadFile(filename, contents, type = "text/plain") {
    const blob = new Blob([contents], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function addProspect() {
    const analysis = getAnalysis();
    state.prospects.unshift({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      businessName: state.prospect.businessName,
      businessType: state.prospect.businessType,
      city: state.prospect.city,
      website: state.prospect.website,
      score: analysis.score,
      value: analysis.monthlyUpside,
      status: "Lead"
    });
    saveState();
    render();
    showToast("Prospect added");
  }

  function slugify(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function loadSeedProspects() {
    const existing = new Set(state.prospects.map(prospectIdentity));
    const additions = STARTER_PROSPECTS
      .filter((prospect) => !existing.has(prospectIdentity(prospect)))
      .map((prospect) => ({
        id: `starter-${slugify(prospect.businessName)}`,
        businessName: prospect.businessName,
        businessType: prospect.businessType,
        city: prospect.city,
        website: prospect.website,
        reviewAngle: prospect.reviewAngle,
        avgCustomerValue: prospect.avgCustomerValue,
        leadsNeeded: prospect.leadsNeeded,
        score: null,
        value: estimateStarterValue(prospect),
        status: "Research only"
      }));

    if (!additions.length) {
      showToast("Starter list already loaded");
      return;
    }

    state.prospects = [...additions, ...state.prospects];
    saveState();
    render();
    showToast(`Loaded ${additions.length} starter prospects`);
  }

  function handleAction(action) {
    const report = buildReport();
    if (action === "copy-report") copyText(report, "Report copied");
    if (action === "download-report") downloadFile(`${state.prospect.businessName}-audit.txt`, report);
    if (action === "print-report") {
      $("#printView").innerHTML = `<h1>${state.settings.serviceName}</h1><pre>${escapeHtml(report)}</pre>`;
      window.print();
    }
    if (action === "copy-email") copyText(buildEmail(), "Email copied");
    if (action === "copy-dm") copyText(buildDm(), "DM copied");
    if (action === "copy-intake-email") copyText(buildIntakeEmail(), "Intake email copied");
    if (action === "copy-scorecard-post") copyText(buildScorecardPost(), "Scorecard post copied");
    if (action === "copy-score-lead-reply") copyText(buildScoreLeadReply(), "Score lead reply copied");
    if (action === "copy-score-lead-call") copyText(buildScoreLeadCallOutline(), "Score lead call copied");
    if (action === "copy-warm-referral") copyText(buildWarmReferralNote(), "Warm referral copied");
    if (action === "copy-community-reply") copyText(buildCommunityReply(), "Community reply copied");
    if (action === "copy-offer-link") copyText(getOfferUrl(), "Offer link copied");
    if (action === "copy-scorecard-link") copyText(getOfferUrl("scorecard.html"), "Scorecard link copied");
    if (action === "open-offer") window.open(getOfferUrl(), "_blank", "noopener,noreferrer");
    if (action === "download-config") downloadFile("config.js", buildConfigText(), "text/javascript");
    if (action === "copy-config") copyText(buildConfigText(), "Config copied");
    if (action === "add-prospect") addProspect();
    if (action === "load-seed-prospects") loadSeedProspects();
    if (action === "copy-daily-batch") {
      const actionable = getActionableProspects();
      if (!actionable.length) {
        showToast("No actionable prospects");
      } else {
        copyText(buildDailyBatchText(10), "Daily batch copied");
      }
    }
    if (action === "copy-follow-up-batch") {
      const followUps = getFollowUpProspects();
      if (!followUps.length) {
        showToast("No contacted prospects");
      } else {
        copyText(buildFollowUpBatchText(10), "Follow-up batch copied");
      }
    }
    if (action === "download-outreach-csv") {
      if (!state.prospects.length) {
        showToast("Load or add prospects first");
      } else {
        downloadFile("local-growth-audit-outreach.csv", buildOutreachCsv(), "text/csv");
        showToast("Outreach CSV downloaded");
      }
    }
    if (action === "copy-outreach-csv") {
      if (!state.prospects.length) {
        showToast("Load or add prospects first");
      } else {
        copyText(buildOutreachCsv(), "Outreach CSV copied");
      }
    }
    if (action === "clear-pipeline") {
      state.prospects = [];
      saveState();
      render();
      showToast("Pipeline cleared");
    }
    if (action === "reset-demo" && window.confirm("Reset local edits and sample pipeline?")) {
      localStorage.removeItem(STORAGE_KEY);
      state = loadState();
      renderIssueControls();
      syncInputs();
      render();
      showToast("Demo reset");
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function updatePipelineStatus(target) {
    const id = target.dataset.pipelineStatus;
    const prospect = state.prospects.find((item) => item.id === id);
    if (!prospect) return;
    prospect.status = target.value;
    saveState();
    renderPipelineSummary();
    renderPipeline();
  }

  function bindEvents() {
    document.addEventListener("input", (event) => {
      const target = event.target;
      if (target.matches("[data-setting]")) {
        const key = target.dataset.setting;
        state.settings[key] = target.type === "number" ? toNumber(target.value) : target.value;
        saveState();
        render();
      }
      if (target.matches("[data-prospect]")) {
        const key = target.dataset.prospect;
        state.prospect[key] = target.type === "number" ? toNumber(target.value) : target.value;
        saveState();
        render();
      }
      if (target.matches("[data-calc]")) {
        const key = target.dataset.calc;
        state.calculator[key] = toNumber(target.value);
        saveState();
        render();
      }
      if (target.matches("[data-issue]")) {
        const selected = $$("[data-issue]:checked").map((input) => input.dataset.issue);
        state.prospect.issues = selected;
        saveState();
        render();
      }
      if (target.matches("[data-pipeline-status]")) {
        updatePipelineStatus(target);
      }
    });

    document.addEventListener("change", (event) => {
      const target = event.target;
      if (target.matches("[data-pipeline-status]")) {
        updatePipelineStatus(target);
      }
    });

    document.addEventListener("click", (event) => {
      const actionButton = event.target.closest("[data-action]");
      if (actionButton) {
        event.preventDefault();
        handleAction(actionButton.dataset.action);
      }

      const removeButton = event.target.closest("[data-remove-prospect]");
      if (removeButton) {
        const id = removeButton.dataset.removeProspect;
        state.prospects = state.prospects.filter((item) => item.id !== id);
        saveState();
        render();
        showToast("Prospect removed");
      }

      const copyIntroButton = event.target.closest("[data-copy-prospect-intro]");
      if (copyIntroButton) {
        const prospect = state.prospects.find((item) => item.id === copyIntroButton.dataset.copyProspectIntro);
        if (prospect) copyText(buildProspectIntro(prospect), "Intro copied");
      }

      const copyFollowUpButton = event.target.closest("[data-copy-prospect-follow-up]");
      if (copyFollowUpButton) {
        const prospect = state.prospects.find((item) => item.id === copyFollowUpButton.dataset.copyProspectFollowUp);
        if (prospect) copyText(buildProspectFollowUp(prospect), "Follow-up copied");
      }

      const copyScoreLeadReplyButton = event.target.closest("[data-copy-score-lead-reply]");
      if (copyScoreLeadReplyButton) {
        const prospect = state.prospects.find((item) => item.id === copyScoreLeadReplyButton.dataset.copyScoreLeadReply);
        if (prospect) copyText(buildScoreLeadReply(prospect), "Score lead reply copied");
      }

      const copyIntakeButton = event.target.closest("[data-copy-prospect-intake]");
      if (copyIntakeButton) {
        const prospect = state.prospects.find((item) => item.id === copyIntakeButton.dataset.copyProspectIntake);
        if (prospect) copyText(buildIntakeEmail(prospect), "Intake email copied");
      }

      const copyOfferButton = event.target.closest("[data-copy-prospect-offer]");
      if (copyOfferButton) {
        const prospect = state.prospects.find((item) => item.id === copyOfferButton.dataset.copyProspectOffer);
        if (prospect) copyText(getProspectOfferUrl(prospect), "Offer link copied");
      }

      const openOfferButton = event.target.closest("[data-open-prospect-offer]");
      if (openOfferButton) {
        const prospect = state.prospects.find((item) => item.id === openOfferButton.dataset.openProspectOffer);
        if (prospect) window.open(getProspectOfferUrl(prospect), "_blank", "noopener,noreferrer");
      }

      const closeManualCopyButton = event.target.closest("[data-close-manual-copy]");
      if (closeManualCopyButton) {
        const panel = $("[data-output='manualCopy']");
        if (panel) panel.hidden = true;
      }
    });
  }

  renderIssueControls();
  syncInputs();
  bindEvents();
  render();
})();
