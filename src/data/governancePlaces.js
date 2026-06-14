export const governanceLayers = [
  {
    id: "pressure",
    label: "Pressure",
    description:
      "Where social, infrastructural, and institutional stress are accumulating.",
  },
  {
    id: "voice",
    label: "Voice",
    description:
      "Where residents are expressing claims, complaints, participation, or protest.",
  },
  {
    id: "serviceStrain",
    label: "Service strain",
    description:
      "Where everyday service systems are unreliable, interrupted, or overburdened.",
  },
  {
    id: "responseGap",
    label: "Response gap",
    description:
      "Where institutional response is slower, thinner, or misaligned with need.",
  },
  {
    id: "visibility",
    label: "Institutional visibility",
    description:
      "Where the state or organisation can clearly see and interpret local conditions.",
  },
];

export const governancePlaces = [
  {
    id: "inner-core",
    name: "Inner core",
    type: "Dense urban core",
    profile:
      "High visibility and high activity, but also concentrated demand, ageing infrastructure, and intense competition over public space.",
    scores: {
      pressure: 74,
      voice: 82,
      serviceStrain: 61,
      responseGap: 48,
      visibility: 86,
    },
    reading:
      "The inner core is visible to institutions, but visibility does not automatically mean governability. The key issue is coordinating response across overlapping demands.",
    whyItMatters:
      "Dense urban cores often generate clear signals, but those signals can be noisy. Leaders need to distinguish everyday intensity from emerging breakdown.",
    questions: [
      "Which forms of pressure are routine, and which are becoming systemic?",
      "Where is high visibility producing response, and where is it only producing monitoring?",
      "Which agencies need to coordinate before small frictions become public crises?",
    ],
  },
  {
    id: "peripheral-township",
    name: "Peripheral township",
    type: "Peripheral settlement",
    profile:
      "High social need, long travel burdens, uneven service reliability, and periodic claim-making around infrastructure, housing, and local opportunity.",
    scores: {
      pressure: 83,
      voice: 68,
      serviceStrain: 79,
      responseGap: 72,
      visibility: 54,
    },
    reading:
      "The peripheral township shows strong pressure and service strain, but institutional visibility is weaker. This creates a risk that needs are recognised late or only after conflict becomes visible.",
    whyItMatters:
      "Peripheral places often experience pressure before institutions fully register it. The governance problem is not only delivery, but delayed recognition.",
    questions: [
      "Which pressures are visible only through complaint, protest, or crisis escalation?",
      "Where are residents adapting privately to public-system gaps?",
      "What would earlier institutional visibility change about the response?",
    ],
  },
  {
    id: "informal-edge",
    name: "Informal settlement edge",
    type: "Informal / transitional space",
    profile:
      "Rapid change, insecure tenure, fragile infrastructure, and limited institutional legibility, often with residents relying on mixed formal and informal systems.",
    scores: {
      pressure: 88,
      voice: 57,
      serviceStrain: 86,
      responseGap: 81,
      visibility: 39,
    },
    reading:
      "The informal edge is the highest-risk profile: high pressure, high service strain, and low institutional visibility. This is where urban change can outrun official categories.",
    whyItMatters:
      "When fast-changing places remain poorly seen, policy response becomes reactive. Leaders need ways to detect pressure before it appears as emergency demand.",
    questions: [
      "What is changing faster than official systems can classify?",
      "Which risks are being absorbed informally by residents?",
      "Where would better spatial intelligence improve prioritisation?",
    ],
  },
  {
    id: "secondary-corridor",
    name: "Secondary city corridor",
    type: "Growth corridor",
    profile:
      "Moderate pressure, emerging investment, uneven transport access, and mixed institutional attention as growth moves ahead of coordination.",
    scores: {
      pressure: 62,
      voice: 51,
      serviceStrain: 58,
      responseGap: 55,
      visibility: 67,
    },
    reading:
      "The secondary corridor is not in crisis, but it is drifting. Growth is creating new coordination demands before institutions have fully aligned around the corridor’s role.",
    whyItMatters:
      "Corridors often look promising in strategy documents while producing uneven lived outcomes. Leaders need to track whether growth is becoming capability or simply expansion.",
    questions: [
      "Is growth improving access, or only extending the footprint?",
      "Which institutions need to coordinate around corridor change?",
      "Where are early service pressures likely to appear next?",
    ],
  },
];

export const pressureCells = [
  { id: 1, placeId: "inner-core", intensity: 72 },
  { id: 2, placeId: "inner-core", intensity: 81 },
  { id: 3, placeId: "peripheral-township", intensity: 76 },
  { id: 4, placeId: "informal-edge", intensity: 90 },
  { id: 5, placeId: "inner-core", intensity: 67 },
  { id: 6, placeId: "secondary-corridor", intensity: 58 },
  { id: 7, placeId: "peripheral-township", intensity: 84 },
  { id: 8, placeId: "informal-edge", intensity: 88 },
  { id: 9, placeId: "secondary-corridor", intensity: 61 },
  { id: 10, placeId: "peripheral-township", intensity: 79 },
  { id: 11, placeId: "informal-edge", intensity: 92 },
  { id: 12, placeId: "secondary-corridor", intensity: 54 },
];
