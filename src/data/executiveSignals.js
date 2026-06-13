export const executiveSignals = [
  {
    id: "people",
    label: "People",
    score: 72,
    status: "Drifting",
    trend: "Soft decline",
    direction: "down",
    summary:
      "The people signal remains functional, but early strain is visible in workload pressure, slower internal response times, and reduced discretionary energy.",
    whyItMatters:
      "People systems often weaken before formal performance indicators move. When morale, capacity, or confidence begins to drift, execution risk rises quietly.",
    leaderQuestions: [
      "Where are teams absorbing pressure that is not yet visible in formal reporting?",
      "Which roles or units are carrying the most coordination burden?",
      "What would staff stop doing first if pressure increased further?",
    ],
    metrics: [
      { label: "Workload pressure", value: 68 },
      { label: "Retention confidence", value: 74 },
      { label: "Internal responsiveness", value: 61 },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    score: 81,
    status: "Stable",
    trend: "Holding",
    direction: "flat",
    summary:
      "Core operations are stable. Delivery routines are functioning, but the system depends on a small number of strong process owners.",
    whyItMatters:
      "Stable operations can hide concentration risk. If performance depends on a few individuals rather than resilient systems, reliability may weaken under disruption.",
    leaderQuestions: [
      "Which operational routines depend too heavily on specific people?",
      "Where would a small disruption create a large delay?",
      "Which processes need clearer ownership or documentation?",
    ],
    metrics: [
      { label: "Process reliability", value: 84 },
      { label: "Delivery consistency", value: 79 },
      { label: "Coordination resilience", value: 66 },
    ],
  },
  {
    id: "experience",
    label: "Experience",
    score: 58,
    status: "Under strain",
    trend: "Deteriorating",
    direction: "down",
    summary:
      "Customer or citizen experience is under strain. Friction is rising around responsiveness, clarity, and the effort required to resolve problems.",
    whyItMatters:
      "Experience is where internal system strain becomes visible externally. When users struggle to get clear answers or timely responses, trust begins to erode.",
    leaderQuestions: [
      "Where are users experiencing the highest friction?",
      "Which complaints are symptoms of deeper system design problems?",
      "What would reduce effort for the user without overloading staff?",
    ],
    metrics: [
      { label: "Response clarity", value: 55 },
      { label: "Resolution effort", value: 49 },
      { label: "Trust in follow-through", value: 62 },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    score: 64,
    status: "Requires attention",
    trend: "Volatile",
    direction: "warning",
    summary:
      "The finance signal shows moderate risk. Revenue or budget performance is not collapsing, but volatility and uneven conversion into outcomes require attention.",
    whyItMatters:
      "Financial health is not only about the size of resources. Leaders need to know whether resources are predictable, usable, and converting into meaningful outcomes.",
    leaderQuestions: [
      "Where is financial pressure affecting delivery choices?",
      "Which costs are rising without improving outcomes?",
      "Are resources being converted into performance, or simply absorbed?",
    ],
    metrics: [
      { label: "Budget predictability", value: 63 },
      { label: "Cost pressure", value: 57 },
      { label: "Outcome conversion", value: 60 },
    ],
  },
];
