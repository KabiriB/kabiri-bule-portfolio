import { useMemo, useState } from "react";
import { resourceSystems } from "../data/resourceSystems";

function ResourceConversionLab() {
  const [activeSystemId, setActiveSystemId] = useState(
    "high-resource-low-conversion",
  );

  const activeSystem = useMemo(
    () =>
      resourceSystems.find((system) => system.id === activeSystemId) ??
      resourceSystems[0],
    [activeSystemId],
  );

  return (
    <section
      className="site-section resource-lab-section"
      id="resource-conversion-lab"
    >
      <div className="section-heading studio-heading">
        <div>
          <p className="eyebrow">Studio 03 · Resource Conversion Lab</p>
          <h2>Show why resources do not automatically become outcomes.</h2>
          <p className="section-kicker">
            A comparative prototype for reading how systems convert income,
            budgets, assets, or capacity into wellbeing, capability, and
            institutional performance.
          </p>
        </div>

        <div className="prototype-note">
          <span>Simulated comparison data</span>
          <p>
            The cases are illustrative. The studio demonstrates how resource
            levels, institutional design, and delivery capacity shape outcome
            conversion.
          </p>
        </div>
      </div>

      <div className="resource-lab card">
        <div className="studio-reading-guide">
          <span>How to read this studio</span>
          <p>
            Select a system profile, then compare inputs, outcomes, and
            conversion capacity. The gap is the diagnostic.
          </p>
        </div>

        <div className="resource-layout">
          <aside className="resource-profile-list">
            <p className="eyebrow">System profiles</p>

            {resourceSystems.map((system) => (
              <button
                key={system.id}
                type="button"
                className={
                  system.id === activeSystemId
                    ? "resource-profile resource-profile-active"
                    : "resource-profile"
                }
                onClick={() => setActiveSystemId(system.id)}
              >
                <span>{system.name}</span>
                <small>{system.systemType}</small>
              </button>
            ))}
          </aside>

          <div className="conversion-console">
            <div className="conversion-summary">
              <span className="pill">{activeSystem.systemType}</span>
              <h3>{activeSystem.name}</h3>
              <p>{activeSystem.reading}</p>
            </div>

            <div className="conversion-bars">
              {activeSystem.indicators.map((indicator) => (
                <div className="conversion-bar-row" key={indicator.label}>
                  <div>
                    <span>{indicator.label}</span>
                    <strong>{indicator.value}</strong>
                  </div>
                  <div className="conversion-track" aria-hidden="true">
                    <div
                      className="conversion-fill"
                      style={{ width: `${indicator.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="conversion-equation">
              <div>
                <span>Input</span>
                <strong>{activeSystem.inputScore}</strong>
              </div>
              <span className="equation-arrow">→</span>
              <div>
                <span>Conversion</span>
                <strong>{activeSystem.conversionScore}</strong>
              </div>
              <span className="equation-arrow">→</span>
              <div>
                <span>Outcome</span>
                <strong>{activeSystem.outcomeScore}</strong>
              </div>
            </div>
          </div>

          <aside className="conversion-reading">
            <p className="eyebrow">Decision Reading</p>

            <div>
              <h4>What the pattern says</h4>
              <p>{activeSystem.reading}</p>
            </div>

            <div>
              <h4>Why it matters</h4>
              <p>{activeSystem.whyItMatters}</p>
            </div>

            <div>
              <h4>What a leader should ask next</h4>
              <ul>
                {activeSystem.questions.map((question) => (
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

export default ResourceConversionLab;
