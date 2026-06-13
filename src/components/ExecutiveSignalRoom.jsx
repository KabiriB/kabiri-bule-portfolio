import { useMemo, useState } from "react";
import { executiveSignals } from "../data/executiveSignals";

function ExecutiveSignalRoom() {
  const [activeSignalId, setActiveSignalId] = useState("experience");

  const activeSignal = useMemo(
    () =>
      executiveSignals.find((signal) => signal.id === activeSignalId) ??
      executiveSignals[0],
    [activeSignalId],
  );

  return (
    <section
      className="site-section executive-room-section"
      id="executive-signal-room"
    >
      <div className="section-heading">
        <p className="eyebrow">Studio 01 · Executive Signal Room</p>
        <h2>Read organisational health before problems become obvious.</h2>
        <p className="section-kicker">
          A leadership-facing prototype for interpreting people, operations,
          experience, and finance as connected signals rather than isolated
          metrics.
        </p>
      </div>

      <div className="executive-room card">
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
          </aside>
        </div>
      </div>
    </section>
  );
}

export default ExecutiveSignalRoom;
