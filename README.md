# Kabiri Bule — Research, Data & Technology

An evidence-led React/Vite portfolio of published research, real public-safe survey geography, visual scholarship, interactive analytical experiences and exploratory software.

## The interactive opening: Musina evidence atlas

The home page opens with **real, public-safe ward-level evidence** from [Musina in Motion](https://github.com/KabiriB/musina-in-motion). Visitors can select any of six study wards and switch between three indicators: international border crossing at least yearly, Zimbabwe-born respondents, and self-reported permanent residence. Each rate is displayed with its original numerator and valid denominator.

Default: **Ward 2, 87/107 = 81.3%** crossing at least yearly. The entire eligible study sample is **n=629**; this is a fieldwork sample, not a representative municipal population estimate. The map uses the official QA-patched public ward polygons, simplified only for SVG display. Wards 3–6 also appear in an enlarged inset because they are too small at the regional scale. No household locations or GPS tracks are displayed.

Source paths: `src/data/musinaEvidence.js` and `src/data/musinaGeography.js`. Source evidence: `musina_ward_summary_app_v1.json` and `musina_wards_1_6_official_app_ready_v3_QA_PATCHED.geojson` in the public Musina repo. Assertions on sample sums, denominators and map availability run in `scripts/musina-hero-evidence-test.mjs`.

## The website

Home: `/` (under the configured GitHub Pages base `/kabiri-bule-portfolio/`).

The complete React experiences have shareable, static-host-compatible hash routes:

| Route | Experience | Evidence |
| --- | --- | --- |
| `#/dashboard` | The System Signals Room | Deterministic **synthetic** service-system data; connected time series, stock-flow accounting and district drilldowns |
| `#/experiment` | When the Average Gets the Story Wrong | Mathematical **thought experiment** demonstrating compositional reversals and direct standardization |
| `#/monitoring` | From Activity to Credible Evidence | **Illustrative** programme conversions and monitoring-versus-evaluation reasoning |
| `ai-evaluation/index.html` | Before the Model Goes Live | Separate, preserved synthetic AI assurance experiment |

The website links out to authentic published research projects and public repositories. "Published", "working prototype" and "repository" are deliberately differentiated. Do not represent synthetic values as observations.

## Run locally

Requires Node.js 22 or newer.

```bash
npm ci
npm run dev
```

Open the address Vite prints. The base path is set in `vite.config.js`; for local manual review use `http://localhost:5173/kabiri-bule-portfolio/` when that is the reported path.

```bash
npm run build
npx eslint src
npm run preview
```

## Testing

The development GitHub Actions workflow installs dependencies, builds the Vite bundle, lints authored React/JS sources, captures desktop/mobile/full-page Chromium images, and executes `scripts/portfolio-browser-test.mjs`.

Browser checks cover the real Musina ward and indicator selections, as well as actual interactions: classifier threshold and subgroup, project filtering, the existing studios, the new dashboard's capacity assumption and linked district selection, Simpson's paradox sliders, M&E conversion controls and evaluation-design selection, direct deep-link reload, and mobile horizontal overflow. This is **not** a substitute for full accessibility, editorial or external-link audits.

## Content integrity

- Immersive opening: geographically grounded **Musina ward choropleth** representing rates among surveyed respondents. It does not display population estimates, migration routes or individual-level observations. The opening's data and geometry are traceable to the public GEMMS atlas. The historical Africa locator remains an asset but is not the V3 homepage opening.
- Musina ward geography asset: preserved from the earlier experimental branch, adapted from public atlas geometry; **not** individual locations.
- Visual-essay image: retained approved local crop; the original essay credits photographer Loren Landau. Confirm publication permissions for any future redistribution beyond the original context.
- The dashboard uses fictional districts, assumptions and synthetic periods. It is not a real service or municipal monitoring system.
- The Simpson's paradox exercise uses fixed baseline group rates and user-controlled mixtures; it is not empirical evidence of a treatment effect.
- The M&E exercise illustrates a results chain and possible evaluation designs, without identifying causal impact.
- Original published projects remain hosted separately; links should be checked before distribution.

## Releasing safely

**Production is currently unchanged.** The V3 release-candidate branch is `chatgpt/portfolio-discovery-v3`. Its dedicated staging workflow builds and commits the full static Vite output to **that branch's** `docs/` directory only. It does not publish anything.

1. Review the generated browser screenshots and interact with the React build locally.
2. Confirm links, names, ownership, image permissions, responsive layout and all disclaimers.
3. Approve the release explicitly. Only then merge the release PR into `main`.
4. If GitHub Pages is configured to serve `main/docs`, its standard publication process can pick up the newly built static files. Confirm the Pages source settings; neither the build nor this README independently verifies them.
5. Open the public site and the three deep links in an incognito browser; verify that assets load, tab controls function and Open Graph sharing looks appropriate.

### Rollback

Preserve the previous `main` SHA before merging. If the release is defective, revert the release merge on `main` and allow Pages to republish its prior `docs/` state; do not overwrite the research repositories.

The website is an evidence-led portfolio, **not** a consultancy brochure or an assertion of production validation.
