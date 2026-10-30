# Experimental editorial opening

Baseline and rollback reference: commit 79ea7507e8475b83966118af7edd0eb48b901ec6.
The original Header, Hero, studio components and studio datasets are retained.
Only the homepage composition replaces the old Header/Hero.

## Material provenance

- Musina wording checked against the public atlas README at repository revision
  efda79657f49e94702ff72ba5d8fc7f8f26c727e.
- musina-study-geography.svg is a static outline adapted from that revision's
  public/data/musina_wards_1_6_official_app_ready_v3_QA_PATCHED.geojson.
  Only polygon coordinates were retained. No survey attributes or respondent
  locations were copied. This is not a screenshot of the interactive atlas.
- visual-essay-detail.jpg is the approved local crop in the October ZIP.
  The source essay identifies the opening Accra street photograph as Loren
  Landau's and the essay author as Kabiri N. Bule.
- ai-evaluation/index.html comes from the ZIP. Local changes keep return links
  relative, wrap its narrow navigation, initialise the reduced-motion control
  correctly, disclose cloud sampling and add keyboard claim-number inspection.
  The dataset generation and evaluation calculations are unchanged.
- Teaser figures describe baseline cutoff 0.18 only: 2,600 cases; TP 15,
  FP 61, FN 92, TN 2,432; accuracy 94.1%; warranted reviews 107.

## Review

Run npm run dev or npm run preview after npm run build. Vite uses the existing
/kabiri-bule-portfolio/ base. No deployment or Pages configuration is changed.
Source lint: npx eslint src. Repository-wide lint still includes the pre-existing
generated docs/assets bundle and reports 108 errors.

Chromium checks: opening and lab at 320, 375, 768, 1024 and 1440px; no horizontal
document overflow. Local images load; no pageerror events. Lab threshold and
scenario controls, relative return navigation, keyboard claim inspection and
all four studio selectors were exercised. CSS zoom at 200% passed layout checks;
browser chrome zoom and a full screen-reader audit were not performed.

The standalone lab retains optional Google Fonts loading with system fallbacks.
Published external site availability was not independently checked in-browser.
