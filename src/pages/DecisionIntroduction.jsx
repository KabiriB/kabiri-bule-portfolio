import "./DecisionIntroduction.css";

const stages = [
  {
    number: "01",
    title: "Demand arrives",
    detail: "Requests enter each fictional district in successive reporting periods."
  },
  {
    number: "02",
    title: "Offices resolve what they can",
    detail: "Available capacity limits the number of cases completed in each period."
  },
  {
    number: "03",
    title: "The queue carries forward",
    detail: "Any unfinished requests become the opening backlog next period."
  }
];

export default function DecisionIntroduction({onStart, onScenario}) {
  return <section className="ex-introduction" aria-labelledby="decision-introduction-title">
    <div className="ex-introduction-lead">
      <div className="ex-introduction-story">
        <span className="ex-label">The case / Start here</span>
        <h2 id="decision-introduction-title">Six districts. A growing queue. <em>What would you do?</em></h2>
        <p className="ex-introduction-opening">Imagine you're asked to advise a city service team. Residents submit requests across six district offices. Every period, some cases are completed; others remain unresolved. Leadership wants to know where pressure is accumulating—and whether additional capacity would make a meaningful difference.</p>
        <p>This is a <strong>fictional, deliberately simplified service system.</strong> It could resemble a customer-service queue or an administrative requests process, but it represents no actual city, department, residents or programme.</p>
        <div className="ex-introduction-actions">
          <button type="button" className="ex-introduction-primary" onClick={onStart}>Start with the reference case <span aria-hidden="true">↓</span></button>
          <button type="button" className="ex-introduction-secondary" onClick={onScenario}>Try 10% more capacity <span aria-hidden="true">↘</span></button>
        </div>
      </div>
      <aside className="ex-introduction-mandate">
        <span>YOUR ANALYTICAL BRIEF</span>
        <h3>What would you tell the decision-maker?</h3>
        <p>Is the problem increasing demand, insufficient resolution capacity, or different conditions across districts? Which evidence helps distinguish them—and what would you still need to know?</p>
        <div><strong>Not the objective</strong><span>Produce the most impressive number.</span></div>
        <div><strong>The objective</strong><span>Diagnose the pressure, test a plausible intervention, explain the limits.</span></div>
      </aside>
    </div>
    <div className="ex-introduction-flow" aria-label="The model's three-stage process">
      {stages.map((stage, i) => <div key={stage.number} className="ex-introduction-stage">
        <span>{stage.number}</span>
        <h3>{stage.title}</h3>
        <p>{stage.detail}</p>
        {i < 2 && <b aria-hidden="true">→</b>}
      </div>)}
    </div>
    <div className="ex-introduction-reading">
      <div>
        <span className="ex-label">How to explore</span>
        <p><strong>Read</strong> the baseline → <strong>change</strong> demand or capacity → <strong>compare</strong> the scenario → <strong>inspect</strong> the district differences.</p>
      </div>
      <details>
        <summary>What assumptions make this work?</summary>
        <p>Each district begins with a fictional backlog, demand rate, nominal completion capacity and service parameter. Twelve synthetic reporting periods introduce small deterministic variation. New arrivals and unfinished cases are available for resolution; completed requests are limited by capacity. Remaining cases carry forward exactly. The timeliness calculation is an illustrative function of operating pressure, not a measured service-standard outcome. The model has no staffing costs, population weights, geographic movement, fairness estimate or causal identification strategy.</p>
      </details>
    </div>
  </section>;
}
