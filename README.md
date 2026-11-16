# Kabiri Bule · Analytics & Decision Intelligence

Public portfolio: **https://kabirib.github.io/kabiri-bule-portfolio/**  
Evidence-backed analytics case studies: **https://kabirib.github.io/kabiri-bule-portfolio/analytics.html**

A React/Vite portfolio combining decision-support interface prototypes with applied quantitative research, spatial analysis, and commercial analytics demonstrations.

## How to assess the work

The main site contains four interactive decision studios: Executive Signal Room, Governance Pressure Observatory, Resource Conversion Lab, and Retail Strain Simulator. Some use clearly labelled simulated data, illustrating decision logic and user experience rather than estimates for an actual client.

The **Analytics & Decision Products** page adds a public-data commercial case using the UCI Bank Marketing dataset. It reports held-out predictive scores, retrospective capacity ranking, limitations from temporal stress testing, and a working *hypothetical* cost/contribution scenario calculator.

- [Explore all analytics case studies](https://kabirib.github.io/kabiri-bule-portfolio/analytics.html)
- [01 · Bank Campaign Intelligence — real historical data, evaluated models](https://kabirib.github.io/kabiri-bule-portfolio/bank-campaign.html)
- [02 · Governance Pressure Observatory — simulated spatial archetypes](https://kabirib.github.io/kabiri-bule-portfolio/governance-pressure.html)
- [03 · Executive Signal Room — simulated organisational indicators](https://kabirib.github.io/kabiri-bule-portfolio/executive-signals.html)
- [04 · Retail Performance Intelligence — simulated branch profiles](https://kabirib.github.io/kabiri-bule-portfolio/retail-operations.html)
- [05 · Resource Conversion Lab — simulated system profiles](https://kabirib.github.io/kabiri-bule-portfolio/resource-conversion.html)
- [06 · Retail Customer & Revenue Intelligence — observed historical transactions](https://kabirib.github.io/kabiri-bule-portfolio/retail-customer.html)
- [Bank Marketing methods and reproducible Python modelling code](case-studies/bank-marketing/README.md)
- [Retail intelligence data audit and reproduction instructions](case-studies/retail-intelligence/README.md)
- [UCI source dataset](https://archive.ics.uci.edu/dataset/222/bank+marketing)

The four interactive conceptual studies are generated from the existing source definitions in `src/data/`, with their limitations displayed. They are **not observational research findings or production client deployments**. The real-data retail customer and revenue intelligence product has now been published, with its source aggregation scripts and documented reporting caveats. A separate document-grounded AI system remains in development.

## Source code and deployment

- `src/`: React components and data for the main portfolio.
- `docs/`: deployed GitHub Pages build and standalone analytics page.
- `case-studies/`: documented analytical methods, datasets, evaluations and limitations.
- `vite.config.js`: GitHub Pages base path.

Main site: `npm install`, then `npm run dev`. For a production build, `npm run build -- --outDir docs`, ensuring the output is published from `main` → `/docs` in GitHub Pages. The standalone `docs/analytics.html` is hand-maintained and must be preserved when rebuilding `docs`.

## Research and professional positioning

PhD-qualified applied research and analytics specialist working across business intelligence, spatial analysis, survey-based quantitative research, governance intelligence, and decision-oriented communication. Open to international analytics roles, research partnerships and consulting engagements.

Contact: kabiri.bule@gmail.com

**Methodological principle:** distinguish observed data, predictions, assumptions, simulated scenarios, causal effects, and implementation readiness. No portfolio prototype is presented as a deployed client production system.