import styles from "./EditorialOpening.module.css";

export default function EvaluationTeaser() {
  return <section className={styles.evaluation} id="evaluation" aria-labelledby="evaluation-title">
    <div>
      <p className={styles.kicker}>03 / Before the Model Goes Live</p>
      <h2 id="evaluation-title">How can a model appear accurate while missing most of the cases that matter?</h2>
      <p>Move the score threshold. Inspect the errors, review workload and subgroup performance. Then change the synthetic population and ask the question again.</p>
      <a className={styles.primary} href={`${import.meta.env.BASE_URL}ai-evaluation/index.html`}>Enter the evaluation laboratory <span aria-hidden="true">→</span></a>
      <p className={styles.note}>A synthetic evaluation demonstrator, not a validated healthcare AI system. Its scores, cases and cost assumptions are illustrative.</p>
    </div>
    <figure className={styles.metrics}>
      <p className={styles.kicker}>Baseline / score cutoff 0.18</p>
      <dl><div><dt>Overall accuracy</dt><dd>94.1<span>%</span></dd></div><div><dt>Warranted reviews found</dt><dd>15 <span>/ 107</span></dd></div></dl>
      <figcaption>Calculated from 2,600 fictional claims in the packaged experiment. At this cutoff, 92 warranted reviews are missed. These are fixed baseline figures; change the threshold inside the lab.</figcaption>
    </figure>
  </section>;
}
