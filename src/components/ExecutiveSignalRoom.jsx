import { useMemo, useState } from "react";
import { executiveSignals } from "../data/executiveSignals";

const scenarioModes = [
  {
    id: "normal",
    label: "Normal watch",
    description:
      "Use the signal to maintain visibility, protect strengths, and notice early drift before it becomes operational pressure.",
    nextMove:
      "Keep the signal under routine review, but ask one sharper question about where quiet strain may be accumulating.",
  },
  {
    id: "pressure",
    label: "Pressure rising",
    description:
      "Treat the signal as an early warning. Look for connected effects across teams, users, budgets, and delivery routines.",
    nextMove:
      "Identify the two pressure points most likely to spread across the system, then assign ownership for closer monitoring.",
  },
  {
    id: "crisis",
    label: "Crisis watch",
    description:
      "Read the signal as a potential failure pathway. Focus on containment, decision rights, communication, and the minimum viable response.",
    nextMove:
      "Clarify who decides, what must be protected first, and which trade-offs leadership is willing to make in the next 72 hours.",
  },
];

function ExecutiveSignalRoom() {
  const [activeSignalId, setActiveSignalId] = useState("experience");
  const [activeScenarioId, setActiveScenarioId] = useState("pressure");

  const activeSignal = useMemo(
    () =>
      executiveSignals.find((signal) => signal.id === activeSignalId) ??
      executiveSignals[0],
    [activeSignalId],
  );

  const activeScenario = useMemo(
    () =>
      scenarioModes.find((scenario) => scenario.id === activeScenarioId) ??
      scenarioModes[0],
    [activeScenarioId],
  );

  return (
    <section
      className="site-section executive-room-section"
      id="executive-signal-room"
    >
      <div className="section-heading studio-heading">
        <div>
          <p className="eyebrow">Studio 01 · Executive Signal Room</p>
          <h2>Read organisational health before problems become obvious.</h2>
          <p className="section-kicker">
            A leadership-facing prototype for interpreting people, operations,
            experience, and finance as connected signals rather than isolated
            metrics.
          </p>
        </div>

        <div className="prototype-note">
          <span>Simulated prototype data</span>
          <p>
            The figures are illustrative. The value is in the decision
            structure: how signals are classified, interpreted, and turned into
            better leadership questions.
          </p>
        </div>
      </div>

      <div className="executive-room card">
        <div className="studio-reading-guide">
          <span>How to read this studio</span>
          <p>
            Select a signal, choose a scenario mode, then read the diagnostic as
            a leadership briefing rather than a raw dashboard.
          </p>
        </div>

        <div className="scenario-strip" aria-label="Scenario mode selector">
          <span>Scenario mode</span>

          <div>
            {scenarioModes.map((scenario) => (
              <button
                key={scenario.id}
                type="button"
                className={
                  scenario.id === activeScenarioId
                    ? "scenario-button scenario-button-active"
                    : "scenario-button"
                }
                onClick={() => setActiveScenarioId(scenario.id)}
              >
                {scenario.label}
              </button>
            ))}
          </div>
        </div>

        <div className="signal-selector" aria-label="Executive signal selector">
          {executiveSignals.map((signal) => (
            <button
              key={signal.id}
              className={
                signal.id === activeSignalId
                  ? "signal-tab signal-tab-active"
                  : "signal-tab"
              }
              type="button"
              onClick={() => setActiveSignalId(signal.id)}
            >
              <span>{signal.label}</span>
              <strong>{signal.score}</strong>
              <small>{signal.status}</small>
            </button>
          ))}
        </div>

        <div className="signal-dashboard">
          <div className="signal-summary-panel">
            <div className="signal-score-block">
              <span className="pill">{activeSignal.status}</span>
              <strong>{activeSignal.score}</strong>
              <small>Signal score</small>
            </div>

            <div className="selected-signal-copy">
              <p className="eyebrow">Selected signal</p>
              <h3>{activeSignal.label}</h3>
              <p>{activeSignal.summary}</p>

              <div className="trend-row">
                <span>Trend</span>
                <strong>{activeSignal.trend}</strong>
              </div>
            </div>
          </div>

          <div className="metric-list">
            <p className="eyebrow">Supporting indicators</p>

            {activeSignal.metrics.map((metric) => (
              <div className="metric-row" key={metric.label}>
                <div className="metric-row-label">
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                </div>
                <div className="metric-track" aria-hidden="true">
                  <div
                    className="metric-fill"
                    style={{ width: `${metric.value}%` }}
                  />
                </div>
              </div>
            ))}

            <div className="scenario-note">
              <span>{activeScenario.label}</span>
              <p>{activeScenario.description}</p>
            </div>
          </div>

          <aside className="decision-reading">
            <p className="eyebrow">Decision Reading</p>

            <div>
              <h4>What the signal says</h4>
              <p>{activeSignal.summary}</p>
            </div>

            <div>
              <h4>Why it matters</h4>
              <p>{activeSignal.whyItMatters}</p>
            </div>

            <div>
              <h4>What a leader should ask next</h4>
              <ul>
                {activeSignal.leaderQuestions.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ul>
            </div>

            <div className="recommended-move">
              <h4>Recommended next move</h4>
              <p>{activeScenario.nextMove}</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default ExecutiveSignalRoom;
