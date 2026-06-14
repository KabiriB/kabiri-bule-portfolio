import { useMemo, useState } from "react";
import { retailBranches } from "../data/retailBranches";

function RetailStrainSimulator() {
  const [activeBranchId, setActiveBranchId] = useState("sandton-flagship");

  const activeBranch = useMemo(
    () =>
      retailBranches.find((branch) => branch.id === activeBranchId) ??
      retailBranches[0],
    [activeBranchId],
  );

  const indicators = [
    { label: "Revenue", value: activeBranch.revenue },
    { label: "Satisfaction", value: activeBranch.satisfaction },
    { label: "Queue pressure", value: activeBranch.queuePressure },
    { label: "Stock reliability", value: activeBranch.stockReliability },
    { label: "Staffing strain", value: activeBranch.staffingStrain },
  ];

  return (
    <section
      className="site-section retail-section"
      id="retail-strain-simulator"
    >
      <div className="section-heading studio-heading">
        <div>
          <p className="eyebrow">Studio 04 · Retail Strain Simulator</p>
          <h2>
            Diagnose branch performance before revenue tells the whole story.
          </h2>
          <p className="section-kicker">
            A private-sector diagnostic prototype for reading revenue, customer
            friction, queue pressure, stock reliability, and staffing strain
            together.
          </p>
        </div>

        <div className="prototype-note">
          <span>Simulated branch data</span>
          <p>
            The branches are illustrative. The studio shows how commercial
            performance can be interpreted alongside service strain and customer
            experience.
          </p>
        </div>
      </div>

      <div className="retail-simulator card">
        <div className="studio-reading-guide">
          <span>How to read this studio</span>
          <p>
            Select a branch profile, then compare revenue with friction. The
            classification explains whether performance is healthy, strained, or
            under-leveraged.
          </p>
        </div>

        <div className="retail-layout">
          <aside className="branch-list">
            <p className="eyebrow">Branch profiles</p>

            {retailBranches.map((branch) => (
              <button
                key={branch.id}
                type="button"
                className={
                  branch.id === activeBranchId
                    ? "branch-button branch-button-active"
                    : "branch-button"
                }
                onClick={() => setActiveBranchId(branch.id)}
              >
                <span>{branch.name}</span>
                <small>{branch.type}</small>
              </button>
            ))}
          </aside>

          <div className="retail-console">
            <div className="retail-classification">
              <span className="pill">{activeBranch.classification}</span>
              <h3>{activeBranch.name}</h3>
              <p>{activeBranch.reading}</p>
            </div>

            <div className="retail-quadrant">
              <div className="quadrant-label top-left">High friction</div>
              <div className="quadrant-label top-right">High revenue</div>
              <div className="quadrant-grid">
                <div>High revenue / high friction</div>
                <div>High revenue / low friction</div>
                <div>Low revenue / high friction</div>
                <div>Low revenue / low friction</div>
              </div>
            </div>

            <div className="retail-indicators">
              {indicators.map((indicator) => (
                <div className="retail-indicator-row" key={indicator.label}>
                  <div>
                    <span>{indicator.label}</span>
                    <strong>{indicator.value}</strong>
                  </div>
                  <div className="retail-track" aria-hidden="true">
                    <div
                      className="retail-fill"
                      style={{ width: `${indicator.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="retail-reading">
            <p className="eyebrow">Decision Reading</p>

            <div>
              <h4>What the branch pattern says</h4>
              <p>{activeBranch.reading}</p>
            </div>

            <div>
              <h4>Why it matters</h4>
              <p>{activeBranch.whyItMatters}</p>
            </div>

            <div>
              <h4>What leadership should ask next</h4>
              <ul>
                {activeBranch.questions.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default RetailStrainSimulator;
