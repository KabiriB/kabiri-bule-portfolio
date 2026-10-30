import styles from "./EditorialOpening.module.css";

export default function EditorialHeader() {
  return <header className={styles.header} id="top">
    <a className={styles.skip} href="#musina">Skip to the research</a>
    <a className={styles.name} href="#top">Kabiri Bule<span>An Atlas of Questions</span></a>
    <nav aria-label="Main navigation">
      <a href="#musina">Research</a>
      <a href="#evaluation">Laboratory</a>
      <a href="#studios">Experiments</a>
      <a href="#contact">Contact</a>
    </nav>
  </header>;
}
