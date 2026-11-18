# Case 07 — AI Evidence Intelligence: Retrieval and Verification Laboratory

**Status:** working public in-browser retrieval prototype; **not** a deployed LLM or full retrieval-augmented generation application.  
**Live case:** https://kabirib.github.io/kabiri-bule-portfolio/ai-evidence.html  
**Code:** `docs/ai-evidence.js`  
**Corpus and reproducible query set:** `docs/ai-evidence-data.json`

## Decision problem

A researcher, public-sector analyst or governance lead needs to locate support for a claim across official guidance. The challenge is not fluent prose alone: it is whether a question has relevant underlying evidence, whether the source can be inspected, and whether the system can say when it lacks support.

The demonstration focuses on the **retrieval and evidence-attribution stage** common to document-grounded AI systems.

## What is implemented

1. Five named primary-source families: NIST AI RMF 1.0 (2023), NIST Generative AI Profile (2024), OECD AI Principles (2019, updated 2024), UNESCO Recommendation on the Ethics of AI (2021) and the European Commission's AI Act overview.
2. Twenty-seven independently written **analyst paraphrases** tagged with stable IDs, topics, source metadata and original source links. These are **not** full-document text extracts or verbatim citations.
3. Fully client-side tokenisation, removal of generic terms, lightweight stemming, a small transparent synonym list, and a length-normalised term-frequency and inverse-document-frequency relevance function.
4. Ranked, source-linked evidence cards. A heuristic abstention check withholds retrieval claims for weak or out-of-scope questions.
5. Source filters and a visible evaluation console with **16 predefined evidence-retrieval questions** and **6 out-of-scope queries**. The positive check is hit@3 for a specified gold passage ID; the negative check is whether the system abstains.

## How to reproduce

Open the live page or serve the `docs/` folder locally using:

```bash
cd docs
python -m http.server 8000
```

Then visit `http://localhost:8000/ai-evidence.html`. Select **Run evaluation suite** to inspect each predefined question, expected source passage, retrieved IDs and pass/fail status. The evaluation set is in `docs/ai-evidence-data.json` so anyone can inspect the questions and answers. There is no required API key and no user data is uploaded.

## Analytical validity

The evaluation checks **retrieval relevance against a small authored test set**. It does not establish generalisable answer accuracy, legal accuracy, fairness, recall over complete primary documents, semantic retrieval quality, or downstream decision impact.

Because the corpus entries are paraphrases prepared for this demonstration, the system cannot be said to retrieve any given clause from the complete official text. Cited links enable independent inspection, but linking to the source home or overview page is not equivalent to verified pinpoint citation in a production document repository.

### Important scope boundaries

- **No language model** is invoked; this is lexical retrieval with an extractive display, not an LLM agent.
- **No PDF ingestion, vector embeddings, authentication, personal data, private documents or production database** have been implemented.
- Abstention is based on a heuristic relevance threshold; unexpected queries can still be misclassified.
- Real governance work requires additional verification of primary sources and current law.
- The EU AI Act implementation and transitional rules are time-sensitive; consult the current consolidated law and Commission guidance.

## Next engineering milestones

Add permission-aware full-text ingestion, document versioning and section/page-level citation provenance; compare BM25 with local embedding-based retrieval; introduce an optional LLM answer composer whose claims are checked against retrieved passages; expand evaluation to independent human-labelled questions; and add robust privacy, threat-model, monitoring and deployment practices.

**Design objective:** Make it possible to inspect not only what an analytical system returns, but what it used, what it did not find, and how the answer could be challenged.

## Primary sources

- [NIST AI RMF Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/)
- [NIST Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)
- [OECD AI Principles](https://www.oecd.org/en/topics/ai-principles.html)
- [UNESCO Recommendation](https://www.unesco.org/en/legal-affairs/recommendation-ethics-artificial-intelligence)
- [European Commission AI Act overview](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai)
