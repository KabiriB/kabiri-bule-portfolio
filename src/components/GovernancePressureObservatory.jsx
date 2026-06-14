import { useMemo, useState } from "react";
import {
  governanceLayers,
  governancePlaces,
  pressureCells,
} from "../data/governancePlaces";

function getLayerScore(place, layerId) {
  return place.scores[layerId] ?? 0;
}

function getCellOpacity(value) {
  if (value >= 85) return "pressure-cell pressure-cell-high";
  if (value >= 70) return "pressure-cell pressure-cell-raised";
  if (value >= 55) return "pressure-cell pressure-cell-moderate";
  return "pressure-cell pressure-cell-low";
}

function GovernancePressureObservatory() {
  const [activePlaceId, setActivePlaceId] = useState("informal-edge");
  const [activeLayerId, setActiveLayerId] = useState("pressure");

  const activePlace = useMemo(
    () =>
      governancePlaces.find((place) => place.id === activePlaceId) ??
      governancePlaces[0],
    [activePlaceId],
  );

  const activeLayer = useMemo(
    () =>
      governanceLayers.find((layer) => layer.id === activeLayerId) ??
      governanceLayers[0],
    [activeLayerId],
  );

  const activeScore = getLayerScore(activePlace, activeLayerId);

  return (
    <section
      className="site-section governance-section"
      id="governance-pressure-observatory"
    >
      <div className="section-heading studio-heading">
        <div>
          <p className="eyebrow">Studio 02 · Governance Pressure Observatory</p>
          <h2>Read urban pressure before it becomes institutional failure.</h2>
          <p className="section-kicker">
            A place-based diagnostic prototype for interpreting pressure, voice,
            service strain, response gaps, and institutional visibility across
            urban space.
          </p>
        </div>

        <div className="prototype-note">
          <span>Simulated place data</span>
          <p>
            This prototype uses illustrative places and scores. The structure is
            designed so real ward, neighbourhood, or pressure-cluster data can
            be connected later.
          </p>
        </div>
      </div>

      <div className="governance-observatory card">
        <div className="studio-reading-guide">
          <span>How to read this studio</span>
          <p>
            Select a place, choose a diagnostic layer, then read how pressure,
            visibility, and response combine into a governance problem.
          </p>
        </div>

        <div className="governance-layout">
          <aside className="place-panel">
            <p className="eyebrow">Places</p>

            <div className="place-list">
              {governancePlaces.map((place) => (
                <button
                  key={place.id}
                  type="button"
                  className={
                    place.id === activePlaceId
                      ? "place-button place-button-active"
                      : "place-button"
                  }
                  onClick={() => setActivePlaceId(place.id)}
                >
                  <span>{place.name}</span>
                  <small>{place.type}</small>
                </button>
              ))}
            </div>
          </aside>

          <div className="pressure-map-panel">
            <div className="layer-controls">
              <span>Diagnostic layer</span>

              <div>
                {governanceLayers.map((layer) => (
                  <button
                    key={layer.id}
                    type="button"
                    className={
                      layer.id === activeLayerId
                        ? "layer-button layer-button-active"
                        : "layer-button"
                    }
                    onClick={() => setActiveLayerId(layer.id)}
                  >
                    {layer.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="map-and-score">
              <div className="stylised-map" aria-label="Stylised pressure map">
                {pressureCells.map((cell) => (
                  <button
                    key={cell.id}
                    type="button"
                    className={`${getCellOpacity(cell.intensity)} ${
                      cell.placeId === activePlaceId
                        ? "pressure-cell-active"
                        : ""
                    }`}
                    onClick={() => setActivePlaceId(cell.placeId)}
                    aria-label={`Select ${cell.placeId}`}
                  >
                    <span>{cell.intensity}</span>
                  </button>
                ))}
              </div>

              <div className="layer-score-card">
                <span className="pill">{activeLayer.label}</span>
                <strong>{activeScore}</strong>
                <small>{activePlace.name}</small>
                <p>{activeLayer.description}</p>
              </div>
            </div>
          </div>

          <aside className="governance-reading">
            <p className="eyebrow">Governance Reading</p>

            <h3>{activePlace.name}</h3>
            <span>{activePlace.type}</span>

            <div>
              <h4>What this place is showing</h4>
              <p>{activePlace.reading}</p>
            </div>

            <div>
              <h4>Why it matters</h4>
              <p>{activePlace.whyItMatters}</p>
            </div>

            <div>
              <h4>What government should ask next</h4>
              <ul>
                {activePlace.questions.map((question) => (
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

export default GovernancePressureObservatory;
