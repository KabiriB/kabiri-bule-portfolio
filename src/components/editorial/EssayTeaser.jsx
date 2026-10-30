import styles from "./EditorialOpening.module.css";

export default function EssayTeaser() {
  return <section className={styles.essay} id="visual-essay" aria-labelledby="essay-title">
    <figure>
      <img src={`${import.meta.env.BASE_URL}assets/visual-essay-detail.jpg`} width="1000" height="526" loading="lazy" alt="People beside a parked car, reproduced from The City Does Not Contain the Life visual essay." />
      <figcaption>Accra street, detail from the visual essay. Photograph: Loren Landau.</figcaption>
    </figure>
    <div className={styles.essayCopy}>
      <p className={styles.kicker}>02 / Visual scholarship · Accra / Johannesburg / Nairobi</p>
      <h2 id="essay-title">The City Does Not<br />Contain the Life</h2>
      <p className={styles.intro}>Where does the city end?</p>
      <p>An investigation by Kabiri N. Bule of urban life across three African cities, read through photography, interpretive writing and an Atlas of Urban Elsewheres. The places that sustain a life reach beyond the place where it is lived.</p>
      <a className={styles.textLink} href="https://kabirib.github.io/urban-temporalities-visual-essay/">Read the published visual essay →</a>
    </div>
  </section>;
}
