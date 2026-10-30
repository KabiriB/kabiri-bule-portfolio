# Kabiri Bule / Independent Research & Technology Laboratory

This V4 React/Vite release candidate introduces a new, independent visual identity and a working synthetic decision experiment at the centre of the site.

## V4 editorial identity

The site uses midnight ink, bone, persimmon, citrine and periwinkle instead of the previous institutional-looking ivory and petrol template. The opening is an original synthetic model titled **When a system falls behind, where does the pressure go?** It visualizes a six-district service queue over twelve fictional periods. Visitors can change resolution capacity and select a district; backlog, arrival and completion statistics update together.

The model imports **the same deterministic scenario engine** as the standalone [System Signals Room](#/dashboard), so the numbers aren't decorative. The design uses original CSS/SVG and standard accessible form controls.

## Institutional work deliberately set aside

Musina in Motion and the published collaborative visual essay are not rendered or linked from this independent edition while the creator clarifies attribution, ownership and portfolio reuse permissions. Earlier branch snapshots preserve previous experiments. The V4 branch also deletes their previously packaged map, survey data, photograph and opening components. A future, specifically permissioned research archive may document attributed contributions without implying sole authorship or unauthorized redistribution.

The synthetic demonstrations are **not** empirical municipal or business observations, validated deployments, forecasts, or evidence of causal programme effects.

## React experiences

| Route | Experience | Model |
| --- | --- | --- |
| `#/dashboard` | System Signals Room | Six fictional districts, demand/capacity scenarios and stock-flow accounting |
| `#/experiment` | When the Average Gets the Story Wrong | Synthetic Simpson's paradox and direct standardization |
| `#/monitoring` | From Activity to Credible Evidence | Fictional programme budget, conversion model and design interpretation |
| `ai-evaluation/index.html` | Before the Model Goes Live | Synthetic classification threshold, review workload and subgroup analysis |

The homepage also keeps the original four exploratory React studios in a clearly labelled prototype collection. Repositories are distinguished from finished working experiences.

## Run locally

Node.js 22 or later. From the extracted repository:

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite, including the configured `/kabiri-bule-portfolio/` base. To verify a release:

```bash
npm run build
node scripts/service-model-test.mjs
npx eslint src
```

The branch-only GitHub Actions workflow also runs real Chromium interactions, desktop and mobile screenshot captures, route checks and model accounting tests.

## Release process

**This branch is not publicly deployed.** Production `main` remains untouched until explicit approval. The branch-only staging workflow generates and commits a static `docs/` copy, including Open Graph artwork, to this development branch. Review the screenshots, the browser routes, GitHub Pages settings, user-facing content, attribution and any embedded asset rights before authorizing a merge.

The previous production commit should be retained as a rollback reference.

## Development integrity

The independent experiments were developed in an AI-assisted engineering workflow and reviewed against arithmetic identities and browser interactions. They should be described as working, inspectable learning prototypes—never independently validated decision services.
