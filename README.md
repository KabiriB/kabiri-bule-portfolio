# Kabiri Bule
### Applied Analytics · Decision Intelligence · Quantitative & Spatial Research

**Turning complex evidence into clearer decisions.**

I develop research-grounded analytical products that help organisations understand performance, investigate risk, compare options and direct limited resources. This portfolio brings together statistical analysis, commercial intelligence, spatial research and interactive decision-support design.

**[Explore the live portfolio](https://kabirib.github.io/kabiri-bule-portfolio/)** · **[View all analytical case studies](https://kabirib.github.io/kabiri-bule-portfolio/analytics.html)** · **[Contact](mailto:kabiri.bule@gmail.com)**

---

## Selected analytical work

Each case begins with an organisational question and shows how evidence and analytical design can inform decisions. The cases are labelled by evidence status: **two use real historical public data**, **four are illustrative decision prototypes**, and **one is a working evidence-retrieval prototype** (without an LLM).

| Case | Decision question | Analytical approach | Live demonstration |
|---|---|---|---|
| **01 · Bank Campaign Intelligence** | How might limited outreach capacity be prioritised? | **Real public data.** Logistic regression, gradient boosting, out-of-sample evaluation and a hypothetical capacity scenario. | [Explore banking case](https://kabirib.github.io/kabiri-bule-portfolio/bank-campaign.html) |
| **02 · Spatial & Governance Intelligence** | Where do different combinations of service pressure and institutional response emerge? | **Illustrative prototype.** Place-based indicator comparisons and interactive area archetypes. | [Explore spatial case](https://kabirib.github.io/kabiri-bule-portfolio/governance-pressure.html) |
| **03 · Executive & Operational Intelligence** | What warning signals deserve attention beyond headline performance? | **Illustrative prototype.** Connected people, operations, experience and finance indicators with management scenarios. | [Explore executive case](https://kabirib.github.io/kabiri-bule-portfolio/executive-signals.html) |
| **04 · Retail Performance Intelligence** | Can strong revenue conceal poor operational performance? | **Illustrative prototype.** Branch-level KPI comparison across service friction, stock, staffing and revenue. | [Explore retail operations](https://kabirib.github.io/kabiri-bule-portfolio/retail-operations.html) |
| **05 · Resource & Investment Intelligence** | Why can comparable resources produce different outcomes? | **Illustrative prototype.** Comparative input, delivery and outcome profiles. | [Explore resource conversion](https://kabirib.github.io/kabiri-bule-portfolio/resource-conversion.html) |
| **06 · Retail Customer & Revenue Intelligence** | Which customers purchase repeatedly, when does demand concentrate, and where is recorded sales value generated? | **Real public data.** Transaction cleaning, customer grouping, time-series summaries, geographic/product concentration and scenario sensitivity. | [Explore retail customer case](https://kabirib.github.io/kabiri-bule-portfolio/retail-customer.html) |
| **07 · AI Evidence Intelligence** | Can a research team retrieve source-backed evidence while declining unsupported requests? | **Working retrieval prototype.** Browser-side lexical ranking over 27 curated source-linked passages, citations, explicit abstention and a 22-query evaluation console; no language model. | [Explore evidence intelligence](https://kabirib.github.io/kabiri-bule-portfolio/ai-evidence.html) |

## Two empirical cases worth examining first

### 01 — Bank Campaign Intelligence

A historical Portuguese banking campaign provides **41,188 contact records** and a concrete decision problem: how should a bank investigate the allocation of limited outreach capacity?

The analysis compares an interpretable logistic regression baseline with a more flexible gradient-boosting model. The latter achieved **0.813 ROC-AUC** on a random holdout and captured **66.8% of observed subscriptions** in the highest-ranked 20% of that test sample. But performance declined sharply in a later-period test (**0.520 ROC-AUC**). That limitation is essential to the interpretation: historical ranking ability does not establish dependable future performance or the incremental benefit of making a call.

[Interactive case](https://kabirib.github.io/kabiri-bule-portfolio/bank-campaign.html) · [Methodology and reproduction guide](case-studies/bank-marketing/README.md) · [Python model-training pipeline](case-studies/bank-marketing/src/train.py)

### 06 — Retail Customer & Revenue Intelligence

The UCI Online Retail II dataset provides historical transaction records across two annual worksheets. The **2010–2011 worksheet contains 541,910 invoice lines** and approximately **£10.67 million in qualifying positive-line sales value**.

The analysis reconstructs transaction-level aggregates, describes purchasing activity across months and markets, and groups identifiable customers by frequency and recency of purchasing. It explicitly distinguishes invoice lines from invoices and customers. About **24.9% of the later worksheet's raw lines lack customer identifiers**, restricting customer-level analysis.

**Positive-line sales value is not net revenue or profit:** cancellations and returns are not matched and deducted. The two annual worksheets overlap in December 2010 and must not be simply added together.

[Interactive case](https://kabirib.github.io/kabiri-bule-portfolio/retail-customer.html) · [Data audit and reproducibility](case-studies/retail-intelligence/README.md) · [Python aggregation pipeline](case-studies/retail-intelligence/retail_aggregate.py)

---

## How the work is approached

**Problem formulation → Data assessment → Method selection → Analysis and validation → Interactive communication → Decision implications and limits.**

The aim is not simply to produce a model or dashboard. It is to make the underlying question clearer, use evidence appropriately and communicate what can be concluded without overstating certainty.

- **Quantitative and commercial analytics:** descriptive statistics, customer behaviour analysis, logistic regression, gradient boosting, model validation and scenario sensitivity.
- **Spatial and institutional intelligence:** geographic comparison, survey-informed diagnostics, multi-indicator reasoning and research translation.
- **Decision-product engineering:** Python analytical scripts, React/Vite interfaces, standalone HTML/CSS/JavaScript explorers, and GitHub Pages deployment.
- **Responsible interpretation:** units of analysis, missingness, leakage, temporal validity, descriptive versus causal claims, and privacy-aware publication.

The four conceptual prototypes demonstrate **interface and diagnostic design**, not measured outcomes for real clients. Case 07 demonstrates browser-side evidence retrieval and testing, **not a deployed LLM or complete document-grounded RAG system**. The banking study is predictive but **not a validated causal uplift model**. The retail transaction case is descriptive, **not a churn-prediction or sales-forecasting system**. No demonstration here is presented as a live client production installation.

## Repository guide

| Path | What it contains |
|---|---|
| [`docs/`](docs/) | GitHub Pages website and standalone interactive case pages |
| [`src/`](src/) | React components and source data definitions for the main portfolio |
| [`case-studies/bank-marketing/`](case-studies/bank-marketing/) | Model methodology, training code and package requirements |
| [`case-studies/retail-intelligence/`](case-studies/retail-intelligence/) | Retail data audit, aggregation scripts and reproduction instructions |
| [`case-studies/ai-evidence/`](case-studies/ai-evidence/) | AI evidence retrieval case, evaluation protocol, scope limitations and primary sources |
| [`vite.config.js`](vite.config.js) | Main portfolio build configuration |

### Run the React portfolio locally

```bash
npm install
npm run dev
```

For a conventional local production build, use `npm run build`. The published GitHub Pages directory (`docs/`) also contains **hand-maintained standalone analytical pages and shared assets**. Do not overwrite it with a fresh React build without preserving those files and checking every published case link.

### Reproduce the data analyses

The banking and retail folders each have their own source-data and execution instructions:

- [Bank model reproduction](case-studies/bank-marketing/README.md#reproduce-the-analysis)
- [Retail aggregation reproduction](case-studies/retail-intelligence/README.md#reproduction)

Raw source datasets and customer-level records are not published in this repository. The retail website uses precomputed aggregates; the public banking page reports evaluated model summaries and an illustrative decision calculator.

## Current scope

Seven case pages are published: two real-data studies, four conceptual simulations and one working AI evidence-retrieval demonstration. Future work includes full-text document ingestion, semantic retrieval, grounded language-model generation, independent evaluation and operational governance; these have **not** yet been deployed.

---

**Kabiri Bule, PhD**  
Applied research · Data analytics · Decision intelligence · Spatial and institutional systems  
[Explore the portfolio](https://kabirib.github.io/kabiri-bule-portfolio/) · [Email](mailto:kabiri.bule@gmail.com)
