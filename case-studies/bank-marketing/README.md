# Project 01 · Bank Campaign Intelligence

**Type:** reproducible model-development case, public historical data (not a bank client engagement)  
**Interface:** [Interactive decision simulator](https://kabirib.github.io/kabiri-bule-portfolio/analytics.html#simulator)  
**Source:** [UCI Bank Marketing](https://archive.ics.uci.edu/dataset/222/bank+marketing), Moro, Cortez & Rita (2014), *Decision Support Systems*, DOI: 10.1016/j.dss.2014.03.001.

## Business question

Given an outreach capacity limit and an unequal likelihood of responding, how can a bank use previous campaigns to rank *historically contacted* opportunities? Can those probabilities support an illustrative allocation decision?

The answer is **associational**. It does not establish what would happen if a different person were called, nor does it establish incremental campaign effectiveness.

## Data and unit

41,188 historical contact records from Portuguese banking campaigns (2008–2010), including 4,640 positive term-deposit subscriptions (11.3%). These are **contact records, not necessarily unique customers**; the data do not expose a stable customer identifier.

Target: `y == 'yes'`. Predictors include demographics, contact channel, prior outcomes and macroeconomic context.

Important excluded pre-call features include `duration` (known only once a call occurs), `campaign` (contains current-campaign activity), and contact-time indicators `month`, `day_of_week`. Not all remaining variables are guaranteed available for real-time operational scoring and would require validation before deployment.

## Analytical workflow

1. Clean known `unknown` categories and handle missingness; recode `pdays == 999`.
2. Stratified, disjoint partitions: training 24,712; validation 6,178; calibration 4,119; untouched test 6,179.
3. Fit logistic regression (transparent baseline) and histogram gradient boosting with categorical one-hot encoding and appropriate numeric preprocessing.
4. Select on validation average precision (PR-AUC), **not** the untouched test.
5. Apply sigmoid/Platt calibration on the separate calibration sample; compare calibrated and uncalibrated predictions.
6. Evaluate discrimination, precision among top-ranked contacts, Brier score, calibration and subgroup descriptives.
7. Run a separate chronological stress test: earliest 70% training, next 10% calibration, final 20% test.

## Findings — random holdout

| Metric | Logistic regression | Gradient boosting |
|---|---:|---:|
| Test ROC-AUC | 0.791 | 0.813 |
| Test average precision | 0.451 | 0.479 |
| Test Brier score | 0.0781 | 0.0751 |

Boosting was selected based on validation average precision. Sigmoid calibration did **not** improve Brier score on the untouched test (raw 0.0751; calibrated 0.0755).

At 20% test-sample capacity (1,236 records), ranking captured 66.8% of the observed 696 subscriptions, with a 37.6% observed response rate in that selected group. This is retrospective selection *within contacted records*, not causal lift relative to no contact.

## Critical stress test

The selected algorithm fitted to earlier records and tested on a later contiguous period achieved only **0.520 ROC-AUC**, with a later-period response prevalence of 30.8%. This sharp deterioration is central to the interpretation: a promising random holdout does **not** justify a prospective deployment claim.

The later-period model is retrained on earlier data and is not identical to the randomly split fitted model.

## Economic illustration

The web simulator allows users to vary maximum contact capacity, hypothetical gross contribution per observed subscription, and contact cost. It contrasts retrospectively selected records with uniform-random selection based on historical prevalence.

**Not an ROI estimate:** The dataset contains neither a randomised untreated group nor actual marginal campaign costs/profits. A prospective trial or causal uplift design is necessary to establish incremental value.

## Governance

Review model stability, disparate treatment or impacts, privacy, permitted use of demographic and credit attributes, regulatory obligations, operational availability of predictors, retraining, drift monitoring and human accountability. A descriptive subgroup table does not constitute fairness certification.

## Reproduction status

The full executable Python pipeline, notebook, source archive and saved model were built and tested locally for this analytical case. The repo currently publishes the methodology and an aggregate demonstration dashboard, **not the full training pipeline**. The source is being prepared for a separate public-code release. Model claims above are drawn from the local run and should be independently rechecked before any production adaptation.
