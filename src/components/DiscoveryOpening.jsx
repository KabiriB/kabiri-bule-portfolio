import { useState } from "react";
import { musinaEvidence, musinaMetrics, musinaSampleN } from "../data/musinaEvidence";
import { musinaWardPaths } from "../data/musinaGeography";
import "./DiscoveryOpening.css";

const evidenceQuestions = [
  { key: "crossedYearly", short: "How often do people cross?", detail: "Cross-border movement" },
  { key: "bornZimbabwe", short: "Where did people begin?", detail: "Birthplace" },
  { key: "permanent", short: "Who reports staying?", detail: "Residence" }
];

function shapeColor(pct) {
  const factor = Math.max(0, Math.min(1, (pct - 20) / 70));
  return "hsl(" + (180 - factor * 10) + " 38% " + (22 + factor * 23) + "%)";
}

function WardShape({ feature, metric, ward, setWard, detail = false }) {
  const datum = musinaEvidence.find(item => item.ward === feature.ward);
  const picked = ward === feature.ward;
  const d = detail ? feature.detail : feature.region;
  if (!d) return null;
  return (
    <path
      d={d}
      fill={picked ? "#d99a67" : shapeColor(datum[metric].pct)}
      stroke={picked ? "#ffe1b7" : "#b5d3c4"}
      strokeWidth={picked ? (detail ? 2.5 : 2) : (detail ? 1.4 : 1)}
      strokeLinejoin="round"
      strokeOpacity={picked ? 1 : .82}
      role="button"
      tabIndex={0}
      aria-label={"Select Ward " + feature.ward + ": " + datum[metric].pct.toFixed(1) + "% for " + musinaMetrics[metric].label.toLowerCase()}
      onClick={() => setWard(feature.ward)}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault(); setWard(feature.ward);
        }
      }}
      style={{cursor:"pointer", outlineOffset:3}}
    >
      <title>{"Ward " + feature.ward + ": " + datum[metric].pct.toFixed(1) + "% · n=" + datum[metric].valid}</title>
    </path>
  );
}

function MusinaEvidenceMap({ metric, ward, setWard }) {
  const region = musinaWardPaths;
  return (
    <div className="dx-map-wrap">
      <div className="dx-map-heading">
        <span>27–31°E / LIMPOPO, SOUTH AFRICA</span>
        <span>OFFICIAL WARD GEOMETRY · PUBLIC-SAFE SURVEY</span>
      </div>
      <svg viewBox="0 0 860 645" className="dx-ward-map" role="group" aria-label="Interactive choropleth of six Musina study wards based on respondent survey percentages, with a larger inset for the four town-area wards. Select a ward to inspect its results.">
        <defs>
          <pattern id="dx-grid" width="47" height="47" patternUnits="userSpaceOnUse">
            <path d="M 47 0 L 0 0 0 47" stroke="#749797" strokeWidth=".7" strokeOpacity=".15" fill="none"/>
          </pattern>
          <linearGradient id="dx-maplight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#103b44"/>
            <stop offset="100%" stopColor="#06252e"/>
          </linearGradient>
        </defs>
        <rect width="860" height="645" fill="url(#dx-maplight)"/>
        <rect width="860" height="645" fill="url(#dx-grid)"/>
        <text x="57" y="42" fill="#aec7c1" fontSize="13" fontWeight="700" letterSpacing="2.2">MUSINA MUNICIPAL STUDY GEOGRAPHY</text>
        <g className="dx-map-region">
          {region.map(f => <WardShape key={f.ward} feature={f} metric={metric} ward={ward} setWard={setWard}/>)}
        </g>
        <rect x="500" y="382" width="339" height="245" fill="#092d36" stroke="#769d9e" strokeOpacity=".9"/>
        <text x="521" y="400" fill="#e7bd8f" fontSize="12" letterSpacing="1.1">TOWN-AREA DETAIL / ENLARGED</text>
        <g className="dx-map-detail">
          {region.map(f => <WardShape key={f.ward} feature={f} metric={metric} ward={ward} setWard={setWard} detail/>)}
        </g>
        <text x="75" y="460" fill="#a7c4c0" fontSize="12" letterSpacing="1.5">SIX WARDS · TWO MAP SCALES</text>
        <text x="75" y="481" fill="#92b3b1" fontSize="11">Ward 3–6 polygons are too small to read</text>
        <text x="75" y="500" fill="#92b3b1" fontSize="11">at the regional scale; see enlarged inset.</text>
        <text x="75" y="585" fill="#e0b88c" fontSize="12" fontWeight="800">N ↑</text>
      </svg>
      <div className="dx-map-bottom">
        <div><span className="dx-swatch" /> <span>{musinaMetrics[metric].label} · higher share in lighter teal</span></div>
        <div>Not a population map · no household locations</div>
      </div>
    </div>
  );
}

export default function DiscoveryOpening() {
  const [metric,setMetric] = useState("crossedYearly");
  const [ward,setWard] = useState(2);
  const point = musinaEvidence.find(w => w.ward === ward);
  const active = point[metric];
  const detail = musinaMetrics[metric];
  return <section className="dx-opening" aria-labelledby="dx-hero-title">
    <div className="dx-upper">
      <div className="dx-eyebrow"><span className="dx-led" /> FIELD ATLAS / MUSINA IN MOTION <span>2026 / RESEARCH EXPERIENCE 01</span></div>
      <div className="dx-lead">
        <div className="dx-story">
          <span className="dx-chapter">KABIRI BULE / RESEARCH, DATA & TECHNOLOGY</span>
          <h1 id="dx-hero-title">A border is not the <em>end of a life.</em></h1>
          <p className="dx-story-lede">What does everyday movement look like in a border town? Explore the patterns in a real six-ward survey, then follow the questions beyond the map.</p>
          <div className="dx-insight" aria-live="polite" aria-atomic="true">
            <div className="dx-insight-head">WARD {ward} / {detail.label.toUpperCase()}</div>
            <div className="dx-insight-number">{active.pct.toFixed(1)}<span>%</span></div>
            <p>{detail.subtitle} in Ward {ward}.</p>
            <div className="dx-insight-base">{active.count} of {active.valid} valid responses · Ward {ward}</div>
          </div>
          <p className="dx-story-note">{detail.note} Percentages describe this study's respondents, not the ward's entire population.</p>
          <a className="dx-primary" href="https://kabirib.github.io/musina-in-motion/">Explore the full research atlas <span aria-hidden="true">↗</span></a>
        </div>
        <div className="dx-visual">
          <MusinaEvidenceMap metric={metric} ward={ward} setWard={setWard}/>
          <div className="dx-ward-pills" role="group" aria-label="Select a Musina ward">
            {musinaEvidence.map(item=><button type="button" key={item.ward} className={ward===item.ward?"dx-ward-active":""} aria-pressed={ward===item.ward} onClick={()=>setWard(item.ward)}><span>WARD {item.ward}</span><strong>{item[metric].pct.toFixed(1)}%</strong></button>)}
          </div>
        </div>
      </div>
    </div>
    <div className="dx-discovery-rail">
      <div className="dx-discovery-title"><span>EXPLORE THE EVIDENCE</span><p>Three questions. One field study. Different ways of reading what respondents told us.</p></div>
      <div className="dx-question-buttons" role="group" aria-label="Change the ward map's survey indicator">
        {evidenceQuestions.map((item,i)=><button type="button" key={item.key} className={metric===item.key?"dx-question-selected":""} aria-pressed={metric===item.key} onClick={()=>setMetric(item.key)}><span>0{i+1} / {item.detail}</span><strong>{item.short}</strong><span aria-hidden="true">↗</span></button>)}
      </div>
    </div>
    <div className="dx-bridge">
      <div><span className="dx-micro">ABOUT THIS EVIDENCE</span><p>{musinaSampleN} eligible survey respondents across six study wards. Ward boundaries come from the public Musina atlas. Select a ward or question to change the display. <a href="https://github.com/KabiriB/musina-in-motion/blob/main/public/data/musina_ward_summary_app_v1.json">Inspect the underlying ward-level summaries ↗</a></p></div>
      <div className="dx-next"><a href="#work">How was this atlas built? <span aria-hidden="true">↓</span></a><a href="#decision-environments">What happens when we test assumptions? <span aria-hidden="true">↓</span></a></div>
    </div>
  </section>;
