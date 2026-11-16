# Kabiri Bule · Analytics & Decision Intelligence

Public portfolio: **https://kabirib.github.io/kabiri-bule-portfolio/**  
Evidence-backed analytics case studies: **https://kabirib.github.io/kabiri-bule-portfolio/analytics.html**

A React/Vite portfolio combining decision-support interface prototypes with applied quantitative research, spatial analysis, and commercial analytics demonstrations.

## How to assess the work

The main site contains four interactive decision studios: Executive Signal Room, Governance Pressure Observatory, Resource Conversion Lab, and Retail Strain Simulator. Some use clearly labelled simulated data, illustrating decision logic and user experience rather than estimates for an actual client.

The **Analytics & Decision Products** page adds a public-data commercial case using the UCI Bank Marketing dataset. It reports held-out predictive scores, retrospective capacity ranking, limitations from temporal stress testing, and a working *hypothetical* cost/contribution scenario calculator.

- [Explore analytics case studies](https://kabirib.github.io/kabiri-bule-portfolio/analytics.html)
- [Bank Marketing methodology and evaluation](case-studies/bank-marketing/README.md)
- [Reproducible Bank Marketing Python code](case-studies/bank-marketing/src/train.py)
- [UCI source dataset](https://archive.ics.uci.edu/dataset/222/bank+marketing)

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