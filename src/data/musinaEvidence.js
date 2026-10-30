// Audited public ward-level fields from Musina in Motion; 2026 GEMMS survey (n=629).
// Source: https://github.com/KabiriB/musina-in-motion/blob/main/public/data/musina_ward_summary_app_v1.json
// Geography is maintained separately in ./musinaGeography.js.
// Shares are descriptive among eligible survey respondents, not population estimates.
export const musinaSampleN = 629;
export const musinaEvidence = [
  {
    "ward": 1,
    "n": 106,
    "crossedYearly": {
      "count": 68,
      "valid": 104,
      "pct": 65.4
    },
    "bornZimbabwe": {
      "count": 86,
      "valid": 106,
      "pct": 81.1
    },
    "permanent": {
      "count": 52,
      "valid": 104,
      "pct": 50
    }
  },
  {
    "ward": 2,
    "n": 107,
    "crossedYearly": {
      "count": 87,
      "valid": 107,
      "pct": 81.3
    },
    "bornZimbabwe": {
      "count": 90,
      "valid": 107,
      "pct": 84.1
    },
    "permanent": {
      "count": 38,
      "valid": 107,
      "pct": 35.5
    }
  },
  {
    "ward": 3,
    "n": 100,
    "crossedYearly": {
      "count": 49,
      "valid": 100,
      "pct": 49
    },
    "bornZimbabwe": {
      "count": 66,
      "valid": 100,
      "pct": 66
    },
    "permanent": {
      "count": 56,
      "valid": 100,
      "pct": 56
    }
  },
  {
    "ward": 4,
    "n": 113,
    "crossedYearly": {
      "count": 70,
      "valid": 112,
      "pct": 62.5
    },
    "bornZimbabwe": {
      "count": 84,
      "valid": 113,
      "pct": 74.3
    },
    "permanent": {
      "count": 51,
      "valid": 112,
      "pct": 45.5
    }
  },
  {
    "ward": 5,
    "n": 101,
    "crossedYearly": {
      "count": 50,
      "valid": 101,
      "pct": 49.5
    },
    "bornZimbabwe": {
      "count": 73,
      "valid": 101,
      "pct": 72.3
    },
    "permanent": {
      "count": 53,
      "valid": 101,
      "pct": 52.5
    }
  },
  {
    "ward": 6,
    "n": 102,
    "crossedYearly": {
      "count": 49,
      "valid": 102,
      "pct": 48
    },
    "bornZimbabwe": {
      "count": 76,
      "valid": 102,
      "pct": 74.5
    },
    "permanent": {
      "count": 56,
      "valid": 102,
      "pct": 54.9
    }
  }
];
export const musinaMetrics = {
 crossedYearly:{label:"Crossed at least yearly",question:"How often does the border feature in everyday life?",subtitle:"Share reporting an international border crossing at least once a year",note:"Ward-level survey frequency, valid responses only; not a count of border crossings."},
 bornZimbabwe:{label:"Born in Zimbabwe",question:"Where did people begin their lives?",subtitle:"Share of surveyed respondents born in Zimbabwe",note:"Birthplace does not identify current citizenship or legal status."},
 permanent:{label:"Permanent residence",question:"Who reports staying permanently?",subtitle:"Share reporting permanent residence in their current Musina settlement",note:"Self-reported residential status, not a measure of belonging or intention to remain."}
};
