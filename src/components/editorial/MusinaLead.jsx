import styles from "./EditorialOpening.module.css";

export default function MusinaLead() {
  return <section className={styles.lead} id="musina" aria-labelledby="musina-question">
    <p className={styles.kicker}>01 / Musina in Motion · GEMMS research atlas</p>
    <h1 id="musina-question">What can a map explain about a borderland<span>—and what needs a narrated journey?</span></h1>
    <div className={styles.leadGrid}>
      <div className={styles.leadCopy}>
        <p className={styles.intro}>One border town. Two ways of reading movement.</p>
        <p>The Musina atlas brings aggregate survey geography into conversation with selected, pseudonymised interview journeys. Patterns show distribution; narrated journeys make sequence and experience legible.</p>
        <a className={styles.primary} href="https://kabirib.github.io/musina-in-motion/">Explore Musina in Motion <span aria-hidden="true">→</span></a>
        <p className={styles.note}>Survey anchors are not household locations. Journey lines are interpretive sequences, not GPS traces or exact routes.</p>
        <a className={styles.textLink} href="https://kabirib.github.io/musina-in-motion/acknowledgements.html">Research team & acknowledgements →</a>
      </div>
      <figure className={styles.mapFigure}>
        <div className={styles.figureLabel}><span>Study geography</span><span>Musina / South Africa</span></div>
        <img src={`${import.meta.env.BASE_URL}assets/musina-study-geography.svg`} width="640" height="480" alt="Outline of the six study wards in Musina, showing their differing geographic extents." />
        <figcaption>Ward outlines from the public GEMMS Musina atlas. Geography only: no respondent locations, survey values or journey routes. <a href="https://github.com/KabiriB/musina-in-motion/blob/efda79657f49e94702ff72ba5d8fc7f8f26c727e/public/data/musina_wards_1_6_official_app_ready_v3_QA_PATCHED.geojson">Source geometry →</a></figcaption>
      </figure>
    </div>
  </section>;
}
