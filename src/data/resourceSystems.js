export const resourceSystems = [
  {
    id: "high-resource-low-conversion",
    name: "High resource / low conversion",
    systemType: "Institutional bottleneck",
    inputScore: 84,
    outcomeScore: 52,
    conversionScore: 41,
    friction: "High",
    reading:
      "This system has resources, but too much value is lost through weak coordination, delivery gaps, or institutional blockage.",
    whyItMatters:
      "High inputs can create a false sense of capacity. The real question is whether resources are being converted into capability, wellbeing, or performance.",
    questions: [
      "Where are resources getting absorbed without producing outcomes?",
      "Which institutional steps are slowing conversion?",
      "What would improve the conversion pathway without simply adding more money?",
    ],
    indicators: [
      { label: "Resource availability", value: 84 },
      { label: "Delivery capacity", value: 49 },
      { label: "Outcome conversion", value: 41 },
    ],
  },
  {
    id: "low-resource-high-conversion",
    name: "Low resource / high conversion",
    systemType: "Efficient adaptation",
    inputScore: 46,
    outcomeScore: 68,
    conversionScore: 76,
    friction: "Moderate",
    reading:
      "This system is converting limited resources relatively well, often through strong coordination, local knowledge, or adaptive routines.",
    whyItMatters:
      "Lower-resource systems can still perform when institutions are well-aligned and delivery pathways are clear.",
    questions: [
      "What practices are helping this system convert limited resources well?",
      "Can these routines scale without losing effectiveness?",
      "Which hidden forms of labour or adaptation are sustaining performance?",
    ],
    indicators: [
      { label: "Resource availability", value: 46 },
      { label: "Delivery capacity", value: 71 },
      { label: "Outcome conversion", value: 76 },
    ],
  },
  {
    id: "high-resource-high-conversion",
    name: "High resource / high conversion",
    systemType: "Strong conversion system",
    inputScore: 82,
    outcomeScore: 79,
    conversionScore: 81,
    friction: "Low",
    reading:
      "This system has both resources and the institutional capacity to translate them into outcomes.",
    whyItMatters:
      "Strong conversion systems show that performance is not only about funding, but also about design, governance, and execution.",
    questions: [
      "Which design features make this system work?",
      "Where is performance resilient, and where is it person-dependent?",
      "What should be protected if pressure rises?",
    ],
    indicators: [
      { label: "Resource availability", value: 82 },
      { label: "Delivery capacity", value: 80 },
      { label: "Outcome conversion", value: 81 },
    ],
  },
  {
    id: "low-resource-low-conversion",
    name: "Low resource / low conversion",
    systemType: "Capability trap",
    inputScore: 39,
    outcomeScore: 34,
    conversionScore: 31,
    friction: "Severe",
    reading:
      "This system faces both resource scarcity and weak conversion capacity. Adding resources may help, but only if the conversion pathway is repaired.",
    whyItMatters:
      "When scarcity and weak institutions reinforce each other, systems can remain trapped despite repeated interventions.",
    questions: [
      "Which constraints are resource-related, and which are design-related?",
      "Where would a small institutional repair unlock better outcomes?",
      "What should be sequenced first: funding, capacity, coordination, or accountability?",
    ],
    indicators: [
      { label: "Resource availability", value: 39 },
      { label: "Delivery capacity", value: 35 },
      { label: "Outcome conversion", value: 31 },
    ],
  },
];
