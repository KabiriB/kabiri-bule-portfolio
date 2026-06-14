export const retailBranches = [
  {
    id: "sandton-flagship",
    name: "Sandton flagship",
    type: "High revenue / high friction",
    revenue: 88,
    satisfaction: 54,
    queuePressure: 76,
    stockReliability: 69,
    staffingStrain: 72,
    classification: "Revenue masking friction",
    reading:
      "This branch is commercially strong, but customer friction is high. Revenue performance may be hiding operational strain.",
    whyItMatters:
      "High-performing branches can still damage loyalty if queues, stock gaps, and staff pressure remain unresolved.",
    questions: [
      "Which friction points are customers tolerating only because the location is convenient?",
      "Where is revenue performance hiding operational weakness?",
      "What would protect revenue while reducing customer effort?",
    ],
  },
  {
    id: "rosebank-premium",
    name: "Rosebank premium",
    type: "High revenue / low friction",
    revenue: 82,
    satisfaction: 81,
    queuePressure: 38,
    stockReliability: 86,
    staffingStrain: 42,
    classification: "Strong branch model",
    reading:
      "This branch is converting demand into revenue with relatively low friction. It is a useful benchmark for service design.",
    whyItMatters:
      "Strong branches show which operating routines, staffing models, and customer journeys should be protected or replicated.",
    questions: [
      "Which practices from this branch can transfer elsewhere?",
      "Where is performance system-driven rather than person-dependent?",
      "What conditions must be protected to maintain the branch model?",
    ],
  },
  {
    id: "southgate-pressure",
    name: "Southgate pressure node",
    type: "Low revenue / high friction",
    revenue: 43,
    satisfaction: 41,
    queuePressure: 81,
    stockReliability: 48,
    staffingStrain: 78,
    classification: "Strain without return",
    reading:
      "This branch is under strain without generating enough revenue to justify the current operating pressure.",
    whyItMatters:
      "Low revenue and high friction together suggest a structural problem: poor demand fit, weak operations, or misaligned staffing.",
    questions: [
      "Is the branch problem demand, operations, or catchment fit?",
      "Which friction is suppressing revenue?",
      "Should leadership repair, reposition, or reduce exposure?",
    ],
  },
  {
    id: "midrand-steady",
    name: "Midrand steady branch",
    type: "Low revenue / low friction",
    revenue: 49,
    satisfaction: 74,
    queuePressure: 34,
    stockReliability: 77,
    staffingStrain: 39,
    classification: "Quiet but under-leveraged",
    reading:
      "This branch is not under major strain, but it is also not converting enough into revenue. The issue may be growth, visibility, or local demand.",
    whyItMatters:
      "Low-friction branches can become growth opportunities if they have spare capacity and a clearer demand strategy.",
    questions: [
      "Is this branch underperforming or simply underutilised?",
      "What local demand is not being captured?",
      "Can the branch grow without creating new friction?",
    ],
  },
];
