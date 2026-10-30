import EditorialHeader from "./EditorialHeader";
import MusinaLead from "./MusinaLead";
import EssayTeaser from "./EssayTeaser";
import EvaluationTeaser from "./EvaluationTeaser";
import styles from "./EditorialOpening.module.css";

export default function EditorialOpening() {
  return <div className={styles.opening}>
    <EditorialHeader />
    <MusinaLead />
    <EssayTeaser />
    <EvaluationTeaser />
    <aside className={styles.continue} aria-label="More published work">
      <span>Continue the inquiry</span>
      <a href="https://kabirib.github.io/Signals-and-Structure/">Signals & Structure · essays and analytical storytelling →</a>
    </aside>
  </div>;
}
