# Case 06 — Retail Customer & Revenue Intelligence

[Interactive portfolio case](https://kabirib.github.io/kabiri-bule-portfolio/retail-customer.html)  
[Source: UCI Online Retail II](https://archive.ics.uci.edu/dataset/502/online+retail+ii)

## Analytical problem

Which customer groups purchase repeatedly? When is recorded sales-line value concentrated? How dependent is the observed business on particular geographic markets and merchandise codes? Can these observations support better questions about retention, merchandising and seasonal planning?

This is a real-data **descriptive analytics** product. It is not a production deployment, predictive churn model, causal retention estimate, audited financial statement or net-revenue calculation.

## Input and unit of analysis

The two original Excel worksheets are processed as separate period extracts:

- Year 2009–2010: 525,461 invoice lines, observation dates 2009-12-01 through 2010-12-09.
- Year 2010–2011: 541,910 invoice lines, observation dates 2010-12-01 through 2011-12-09.

The two extracts **overlap in December 2010**. Do **not** sum their totals or interpret the reported periods as nonoverlapping calendar years. Each record is an invoice line, not a distinct customer or order. Customer identifiers may be missing, and people are not deduplicated across worksheets.

## Eligibility and amounts

**Positive-line sales value** = Quantity × Price for lines satisfying all of:

1. Invoice identifier does not start with `C` (cancelled invoice prefix).
2. Quantity is positive.
3. Price is positive.

Excluded lines and cancellations are **not** matched to purchases or netted. The measure is neither net revenue nor profit. It can include unusual positive-value lines, discounts/charges if present with positive lines, and special business adjustments. Product rankings omit recognised service/charge codes but are sensitive to bulk purchases and code ambiguity.

## Selected verified statistics

| Indicator | Worksheet 2009–2010 | Worksheet 2010–2011 |
|---|---:|---:|
| Raw lines | 525,461 | 541,910 |
| Included positive lines | 511,565 | 530,105 |
| Excluded lines | 13,896 | 11,805 |
| Missing customer ID on raw lines | 107,927 | 135,080 |
| Positive-line value | £10,305,892.02 | £10,666,702.54 |
| Distinct positive-purchase invoice IDs | 20,951 | 19,960 |
| Identified customers with a positive purchase | 4,312 | 4,338 |

The missing-customer-ID rate in the later extract is 135,080 / 541,910 = 24.9%. Such lines can contribute to aggregate sales value, but not to customer segments.

For **Jan–Nov calendar months only**, positive-line value is £9,041,353.61 (2010) versus £9,204,145.72 (2011), a 1.8% difference. This does not control for changes in returns, prices or product mix and must not be interpreted as profit or causal growth.

## Customer grouping

For **identified customers only**, count distinct positive-purchase invoices and measure days since the last observed positive purchase relative to the worksheet's end date:

- **High-frequency active:** 5+ distinct invoices, recency ≤ 90 days.
- **Repeat active:** 2–4 invoices, recency ≤ 90 days.
- **Recent one-off:** 1 invoice, recency ≤ 90 days.
- **Lapsed repeat:** 2+ invoices, recency > 90 days.
- **Older one-off:** 1 invoice, recency > 90 days.

These thresholds are transparent business rules, **not** inferred clusters, churn scores, or trained machine-learning segments. In the later worksheet, 2,845 / 4,338 = 65.6% of identified customers appear on at least two qualifying purchasing invoices.

## Reproduction

No customer-level transaction rows or customer IDs are published in this repository. The interactive site embeds only precomputed aggregates. To reproduce from the original UCI ZIP archive, save `online+retail+ii.zip` locally and run:

```bash
python -m pip install lxml>=5.0
python retail_aggregate.py --source online+retail+ii.zip --only-sheet 2009-10 --output retail_2009_10.json
python retail_aggregate.py --source online+retail+ii.zip --only-sheet 2010-11 --output retail_2010_11.json
python merge_periods.py --first retail_2009_10.json --second retail_2010_11.json --output retail_data.json
```

The extraction uses XML streaming from the zipped XLSX workbook to avoid loading more than a million worksheet rows into memory. The output includes: source QA, period and monthly aggregates, UK versus international totals, country concentration, top merchandise code totals, and five transparent customer groups.

## Decision demonstration

The site's interactive scenario asks what positive-line value would be represented if some historically observed older one-off customers placed **one additional order** at an assumed value. This is arithmetic sensitivity analysis, not a forecast or uplift model. An intervention would require a prospective experiment and an appropriate comparison group to estimate any causal effect.

## Limitations and governance

- Customer IDs are missing on a substantial fraction of records.
- Period totals include different, overlapping windows; the final month of the second worksheet is incomplete.
- The invoice-line amount is a gross positive-line proxy; cancellations, returns and refunds are not netted.
- Currency is treated as GBP based on the source description; historical amounts are unadjusted for inflation.
- Distinct invoice count indicates recorded purchase events, not verified customer households.
- Segment labels are rule-based descriptive categories whose usefulness would need to be assessed for a specific business decision.
- No raw customer identifiers are exposed in the public demo, and no claimed client intervention outcomes are fabricated.