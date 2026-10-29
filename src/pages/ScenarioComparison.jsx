import { fmt, pct } from "../data/syntheticService";
import "./ScenarioComparison.css";

function changeLabel(current, reference, percent = false) {
  const change = percent ? (current - reference) * 100 : current - reference;
  if (Math.abs(change) < 0.0001) return percent ? "No change (0.0 pp)" : "No change (0)";
  const magnitude = percent ? Math.abs(change).toFixed(1) + " pp" : fmt(Math.abs(change)) + " cases";
  return (change > 0 ? "+" : "−") + magnitude;
}

export default function ScenarioComparison({
  baseline, scenario, capacityShift, demandShift, windowSize, scope
}) {
  const active = capacityShift !== 0 || demandShift !== 0;
  const backlogDifference = scenario.backlog - baseline.backlog;
  const reconciles = scenario.startingBacklog + scenario.incoming - scenario.resolved === scenario.backlog;
  const metrics = [
    { id: "backlog", label: "Closing unresolved cases", note: "Cases still in the queue after the final period", baseline: baseline.backlog, current: scenario.backlog },
    { id: "resolved", label: "Resolved during window", note: "Completed work across the selected reporting periods", baseline: baseline.resolved, current: scenario.resolved },
    { id: "onTime", label: "On time among resolved", note: "A changing denominator: completed cases only", baseline: baseline.onTime, current: scenario.onTime, percent: true }
  ];
  const render = (value, percentage) => percentage ? pct(value, 1) : fmt(value);
  return (
    <section className="ex-impact" aria-labelledby="ex-impact-heading">
      <div className="ex-impact-heading">
        <div>
          <span className="ex-label">03 / Scenario comparison</span>
          <h2 id="ex-impact-heading">What changes against the reference?</h2>
          <p>Both runs use the same fictional district assumptions and {windowSize} periods. Only the sliders change demand and resolution capacity.</p>
        </div>
        <div className="ex-impact-assumptions">
          <span>Scenario inputs</span>
          <strong>Capacity {capacityShift > 0 ? "+" : ""}{capacityShift}%</strong>
          <strong>Demand {demandShift > 0 ? "+" : ""}{demandShift}%</strong>
          <small>{scope}</small>
        </div>
      </div>
      <div className="ex-impact-grid">
        {metrics.map((metric) => {
          const max = Math.max(metric.baseline, metric.current, 0.000001);
          return (
            <div className="ex-impact-metric" key={metric.id}>
              <div className="ex-impact-metric-header">
                <h3>{metric.label}</h3>
                <span>{changeLabel(metric.current, metric.baseline, metric.percent)}</span>
              </div>
              <p>{metric.note}</p>
              <div className="ex-impact-bar-row">
                <span>Reference</span>
                <div className="ex-impact-track"><i className="reference" style={{ width: metric.baseline / max * 100 + "%" }} /></div>
                <strong>{render(metric.baseline, metric.percent)}</strong>
              </div>
              <div className="ex-impact-bar-row">
                <span>Scenario</span>
                <div className="ex-impact-track"><i className="scenario" style={{ width: metric.current / max * 100 + "%" }} /></div>
                <strong>{render(metric.current, metric.percent)}</strong>
              </div>
            </div>
          );
        })}
      </div>
      <div className="ex-impact-brief">
        <div className="ex-impact-reading">
          <span className="ex-label">Decision reading</span>
          <h3>{!active ? "The reference and scenario are identical." : backlogDifference > 0 ? "The adjusted scenario carries a larger unresolved stock." : backlogDifference < 0 ? "The adjusted scenario carries a smaller unresolved stock." : "The adjusted scenario ends with the same unresolved stock."}</h3>
          <p>{!active
            ? "Change a scenario slider to make a direct, like-for-like comparison. This reference is a deterministic model run—not a prediction of an actual service."
            : "The closing backlog differs by " + changeLabel(scenario.backlog, baseline.backlog) + " from the unchanged reference. That is an in-model sensitivity result, not a measured programme effect. Before acting, verify actual case mix, response quality, cost, staffing feasibility and who benefits."}</p>
        </div>
        <div className="ex-impact-accounting">
          <span>Stock-flow check / current scenario</span>
          <div><small>Opening unresolved</small><strong>{fmt(scenario.startingBacklog)}</strong></div>
          <div><small>+ New requests</small><strong>{fmt(scenario.incoming)}</strong></div>
          <div><small>− Resolved requests</small><strong>{fmt(scenario.resolved)}</strong></div>
          <div className="ex-impact-total"><small>= Closing unresolved</small><strong>{fmt(scenario.backlog)}</strong></div>
          <p>{reconciles ? "✓ Accounting identity reconciles exactly." : "⚠ Reconciliation failed; model requires review."}</p>
        </div>
      </div>
      <p className="ex-impact-limit">Model interpretation: descriptive comparison between two deterministic simulated runs, not a causal estimate, service target, forecast interval or optimisation recommendation.</p>
    </section>
  );
}
