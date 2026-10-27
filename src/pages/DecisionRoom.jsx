import { useMemo, useState } from "react";
import { serviceZones, simulateServices, summarizeServices, aggregateByPeriod, fmt, pct } from "../data/syntheticService";
import { ExperienceFrame, Note, SmallLabel } from "./ExperienceFrame";
import "./Experiences.css";

const PLOT_W = 920, PLOT_H = 265, LEFT = 50, RIGHT = 20, TOP = 20, BOTTOM = 38;
const AXIS_W = PLOT_W - LEFT - RIGHT, AXIS_H = PLOT_H - TOP - BOTTOM;
const linePath = (rows, key, max, min = 0) => rows.map((d, i) => {
  const x = LEFT + i * AXIS_W / Math.max(1, rows.length - 1);
  const y = TOP + AXIS_H * (1 - (d[key] - min) / Math.max(.001, max - min));
  return (i ? "L" : "M") + x.toFixed(2) + " " + y.toFixed(2);
}).join(" ");

function ServiceChart({ rows, mode }) {
  const max = mode === "backlog" ? Math.max(1, ...rows.map(d => d.backlog)) * 1.12 : mode === "volume" ? Math.max(1, ...rows.map(d => d.incoming), ...rows.map(d => d.resolved)) * 1.13 : 1;
  const keys = mode === "volume" ? ["incoming", "resolved"] : mode === "backlog" ? ["backlog"] : ["onTime"];
  const colors = { incoming: "#ddb08a", resolved: "#9fc4c4", backlog: "#e2aa78", onTime: "#a6d7c8" };
  const labels = { incoming: "Requests arrived", resolved: "Requests resolved", backlog: "Unresolved at end", onTime: "On-time share among resolved" };
  return <div className="ex-chart" role="img" aria-label={"Synthetic time series showing " + keys.map(k => labels[k]).join(" and ")}>
    <svg viewBox={"0 0 " + PLOT_W + " " + PLOT_H} preserveAspectRatio="xMidYMid meet">
      {[0, .25, .5, .75, 1].map((ratio) => <g key={ratio}><line x1={LEFT} x2={PLOT_W - RIGHT} y1={TOP + AXIS_H * ratio} y2={TOP + AXIS_H * ratio} stroke="#65848b" strokeDasharray="2 6" opacity=".44"/><text x={LEFT - 12} y={TOP + AXIS_H * ratio + 4} fill="#a5c0c3" textAnchor="end" fontSize="12">{mode === "timeliness" ? Math.round((1 - ratio) * 100) + "%" : fmt(max * (1 - ratio))}</text></g>)}
      {keys.map(key => <path key={key} d={linePath(rows, key, max)} fill="none" stroke={colors[key]} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>)}
      {rows.map((r, i) => <g key={r.period}><text x={LEFT + i * AXIS_W / Math.max(1, rows.length - 1)} y={PLOT_H - 7} textAnchor="middle" fill="#a5c0c3" fontSize="12">{r.period}</text>{keys.map(key => <circle key={key} cx={LEFT + i * AXIS_W / Math.max(1, rows.length - 1)} cy={TOP + AXIS_H * (1 - r[key] / max)} r="3.8" fill={colors[key]} stroke="#133b44" strokeWidth="2"/>)}</g>)}
    </svg>
    <div className="ex-chart-legend">{keys.map(k => <span key={k}><i style={{background:colors[k]}} />{labels[k]}</span>)}</div>
  </div>;
}
function RatioBar({ value }) {
  return <span className="ex-ratio-track" aria-hidden="true"><i className="ex-ratio-fill" style={{ width: Math.max(0, Math.min(100, value * 100)) + "%" }}/></span>;
}
const modes = [
  { id: "timeliness", title: "On-time performance", note: "Timely completions divided by resolved requests—not by requests received." },
  { id: "volume", title: "Flow through the system", note: "New requests versus completed requests in each model period." },
  { id: "backlog", title: "Unresolved stock", note: "Cases carried over when arrivals exceed completion capacity." }
];

function PressureField({ zoneSummaries, focus, onSelect, windowSize }) {
  const w = 930, h = 370, left = 75, right = 38, top = 50, bottom = 67;
  const x0 = left, x1 = w - right, y0 = top, y1 = h - bottom;
  const px = (v) => x0 + Math.min(2.5, Math.max(0, v)) / 2.5 * (x1 - x0);
  const py = (v) => y1 - (Math.max(.5, Math.min(1, v)) - .5) / .5 * (y1 - y0);
  const spots = zoneSummaries.map(z => {
    const averageInflow = z.summary.incoming / windowSize;
    return {...z, pressure: averageInflow ? z.summary.backlog / averageInflow : 0};
  });
  return <section className="ex-pressure-panel" aria-labelledby="pressure-field-heading">
    <div className="ex-card-head"><div><SmallLabel>03 / Diagnostic field</SmallLabel><h2 id="pressure-field-heading">Pressure and delivery are not the same thing.</h2><p>Two service indicators, considered together. Select a labelled point to focus the time series and diagnostic above.</p></div><span className="ex-small-meta">Fictional districts / linked selection</span></div>
    <div className="ex-pressure-grid">
      <svg viewBox={"0 0 " + w + " " + h} role="group" aria-label="Interactive scatterplot: backlog relative to one period of incoming requests on the horizontal axis, timely completion rate on the vertical axis. Select a district point to filter the dashboard.">
        {[0,.5,1,1.5,2,2.5].map(x => <g key={x}><line x1={px(x)} x2={px(x)} y1={y0} y2={y1} stroke="#58828a" opacity=".3" strokeDasharray="4 7"/><text x={px(x)} y={y1+26} textAnchor="middle" fill="#b7cece" fontSize="12">{x.toFixed(1)}</text></g>)}
        {[.5,.6,.7,.8,.9,1].map(y => <g key={y}><line x1={x0} x2={x1} y1={py(y)} y2={py(y)} stroke="#58828a" opacity=".3" strokeDasharray="4 7"/><text x={x0-16} y={py(y)+4} textAnchor="end" fill="#b7cece" fontSize="12">{Math.round(y*100)}%</text></g>)}
        <line x1={px(1)} x2={px(1)} y1={y0} y2={y1} stroke="#e4b089" opacity=".66" strokeDasharray="6 7"/>
        <line x1={x0} x2={x1} y1={py(.85)} y2={py(.85)} stroke="#e4b089" opacity=".66" strokeDasharray="6 7"/>
        <text x={(x0+x1)/2} y={h-10} textAnchor="middle" fill="#bed3d1" fontSize="13">Closing backlog ÷ average arrivals per period →</text>
        <text x="21" y={(y0+y1)/2} transform={"rotate(-90 21 " + ((y0+y1)/2) + ")"} textAnchor="middle" fill="#bed3d1" fontSize="13">On-time among resolved →</text>
        {spots.map((z,i) => {
          const focused = focus === z.id, xx=px(z.pressure), yy=py(z.summary.onTime);
          return <g key={z.id} role="button" tabIndex={0} aria-label={"Inspect " + z.name + ": timely " + pct(z.summary.onTime,1) + ", backlog-to-inflow ratio " + z.pressure.toFixed(2)} onClick={()=>onSelect(focused?"all":z.id)} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();onSelect(focused?"all":z.id);}}} style={{cursor:"pointer"}}>
            <title>{z.code + " / " + z.name + ": " + pct(z.summary.onTime,1) + " timely, stock/inflow " + z.pressure.toFixed(2)}</title>
            <circle cx={xx} cy={yy} r={focused?17:13} fill={focused?"#f7cca3":"#a5d1c8"} stroke="#103944" strokeWidth="3"/>
            <text x={xx} y={yy+4} textAnchor="middle" fontSize="11" fontWeight="800" fill="#103944">{i+1}</text>
            <text x={xx+17} y={yy-17} fill={focused?"#f7cca3":"#ebf2eb"} fontSize="11" fontWeight="700">{z.code}</text>
          </g>;
        })}
      </svg>
      <div className="ex-pressure-reading"><span>HOW TO READ</span><h3>Look for combinations, not rankings.</h3><p>Points further right carry more unresolved cases relative to a typical period of new requests. Points higher up resolve a larger share of completed cases on time.</p><p>The crossed guide lines mark 1.0 period of inflow and 85% timely completion. They are <strong>illustrative reference lines, not operational standards.</strong></p><div><strong>{focus==="all"?"All six districts in view":"Selected / "+serviceZones.find(z=>z.id===focus)?.name}</strong><span>Click a point—or use the district table below—to link this plot with the history above.</span></div></div>
    </div>
  </section>;
}

export default function DecisionRoom() {
  const [focus, setFocus] = useState("all");
  const [windowSize, setWindowSize] = useState(12);
  const [mode, setMode] = useState("timeliness");
  const [capacityShift, setCapacityShift] = useState(0);
  const [demandShift, setDemandShift] = useState(0);
  const simulation = useMemo(() => simulateServices({ capacityShift, demandShift }), [capacityShift, demandShift]);
  const focused = focus === "all" ? simulation : simulation.filter(z => z.id === focus);
  const overview = summarizeServices(focused, windowSize);
  const rows = aggregateByPeriod(focused, windowSize);
  const zoneSummaries = simulation.map(z => ({...z, summary: summarizeServices([z], windowSize)}));
  const modeItem = modes.find(m => m.id === mode);
  const rise = overview.change > 0;
  const zone = serviceZones.find(x => x.id === focus);
  const reset = () => { setFocus("all"); setWindowSize(12); setMode("timeliness"); setCapacityShift(0); setDemandShift(0); };
  return <ExperienceFrame kind="Decision intelligence / Interactive systems" title={<>The System <em>Signals Room.</em></>} subtitle="Follow demand, delivery and accumulating pressure. Then change the assumptions and watch the consequences move across the entire synthetic system." tag="Working demonstrator · fictional service districts">
    <div className="ex-alert"><span className="ex-green-indicator" /> FUNCTIONING SCENARIO ENGINE <span>All numbers are generated from explicit fictional assumptions. Not a dashboard of actual Gauteng or municipal performance.</span></div>
    <div className="ex-controls-line">
      <div><SmallLabel>Reporting window</SmallLabel><div className="ex-segments">{[3,6,12].map(n => <button type="button" aria-pressed={windowSize===n} className={windowSize===n?"active":""} onClick={()=>setWindowSize(n)} key={n}>Last {n}</button>)}</div></div>
      <div><SmallLabel>District filter</SmallLabel><select aria-label="Select synthetic district" value={focus} onChange={e=>setFocus(e.target.value)}><option value="all">All six districts</option>{serviceZones.map(z=><option key={z.id} value={z.id}>{z.code} / {z.name}</option>)}</select></div>
      <button type="button" className="ex-reset" onClick={reset}>↺ Reset assumptions</button>
    </div>
    <div className="ex-kpi-grid">
      <div className="ex-kpi"><span>Demand / requests arriving</span><strong>{fmt(overview.incoming)}</strong><small>Across selected periods</small></div>
      <div className="ex-kpi"><span>Delivery / requests resolved</span><strong>{fmt(overview.resolved)}</strong><small>{pct(overview.clearance,1)} of arrivals · clearance ratio</small></div>
      <div className="ex-kpi"><span>On-time among resolved</span><strong>{pct(overview.onTime,1)}</strong><small>Timely completions ÷ completed requests</small></div>
      <div className="ex-kpi ex-kpi-accent"><span>Unresolved / closing stock</span><strong>{fmt(overview.backlog)}</strong><small>{rise ? "+" : ""}{fmt(overview.change)} change in selected window</small></div>
    </div>
    <div className="ex-main-grid">
      <section className="ex-chart-card" aria-labelledby="signals-history"><div className="ex-card-head"><div><SmallLabel>01 / Service history</SmallLabel><h2 id="signals-history">{modeItem.title}</h2><p>{modeItem.note}</p></div><span className="ex-small-meta">12-period simulation</span></div><div className="ex-segments ex-chart-switch">{modes.map(m=><button type="button" aria-pressed={m.id===mode} className={m.id===mode?"active":""} key={m.id} onClick={()=>setMode(m.id)}>{m.id==="timeliness"?"Timeliness":m.id==="volume"?"Flow":"Backlog"}</button>)}</div><ServiceChart rows={rows} mode={mode}/><p className="ex-chart-foot">Period labels are fictional time steps. Switching district or scenario recalculates the plotted values.</p></section>
      <aside className="ex-scenario" aria-labelledby="signals-scenario"><SmallLabel>02 / Intervention desk</SmallLabel><h2 id="signals-scenario">Change the conditions.</h2><p>These are scenario parameters, not forecasts. Capacity affects how many cases can be resolved. Demand changes how many enter the queue.</p>
        <div className="ex-slider-control"><div><label htmlFor="ex-capacity">Resolution capacity</label><output htmlFor="ex-capacity">{capacityShift>0?"+":""}{capacityShift}%</output></div><input type="range" id="ex-capacity" min="-25" max="35" step="5" value={capacityShift} onChange={e=>setCapacityShift(Number(e.target.value))}/><span>−25% <b>Operating capacity adjustment</b> +35%</span></div>
        <div className="ex-slider-control"><div><label htmlFor="ex-demand">Demand pressure</label><output htmlFor="ex-demand">{demandShift>0?"+":""}{demandShift}%</output></div><input type="range" id="ex-demand" min="-20" max="30" step="5" value={demandShift} onChange={e=>setDemandShift(Number(e.target.value))}/><span>−20% <b>Incoming requests adjustment</b> +30%</span></div>
        <div className="ex-decision"><SmallLabel>Diagnostic reading</SmallLabel><h3>{rise ? "Demand is accumulating faster than delivery." : "The queue is contracting in this window."}</h3><p>{rise ? "Closing stock exceeds opening stock. Check which districts account for the growth and what additional capacity would be needed before concluding that a single intervention is enough." : "The selected scenario reduces unresolved stock over the reporting window. This alone does not establish service quality or equity."}</p></div>
      </aside>
    </div>
    <PressureField zoneSummaries={zoneSummaries} focus={focus} onSelect={setFocus} windowSize={windowSize}/>
    <div className="ex-lower-grid">
      <section className="ex-zone-card" aria-labelledby="zone-heading"><div className="ex-card-head"><div><SmallLabel>04 / Place comparison</SmallLabel><h2 id="zone-heading">Where is pressure concentrating?</h2></div><span className="ex-small-meta">Select a district to investigate</span></div>
        <div className="ex-zone-table"><div className="ex-zone-table-head"><span>Fictional district</span><span>On-time among resolved</span><span>Closing backlog</span></div>{zoneSummaries.map(z=><button key={z.id} type="button" className={focus===z.id?"selected":""} onClick={()=>setFocus(focus===z.id?"all":z.id)} aria-pressed={focus===z.id}><span><b>{z.code}</b> {z.name}</span><span className="ex-zone-on-time"><span>{pct(z.summary.onTime,1)}</span><RatioBar value={z.summary.onTime}/></span><strong>{fmt(z.summary.backlog)}</strong></button>)}</div>
        <div className="ex-insight-tag">{zone ? "Focused on " + zone.name + ". Select it again to return to all districts." : "All districts are shown. Select any row to isolate its contribution to the system."}</div></section>
      <section className="ex-logic-card" aria-labelledby="logic-heading"><SmallLabel>05 / Model anatomy</SmallLabel><h2 id="logic-heading">A queue, not just a score.</h2><p>Each period starts with an unresolved stock. New requests arrive; limited capacity resolves some; the remainder carries forward.</p><div className="ex-formula"><span>Opening cases + new arrivals</span><b>−</b><span>Cases resolved</span><b>=</b><span>Closing backlog</span></div><p>Capacity is capped by available cases. The timely-completion share is an illustrative function of queue pressure and district assumptions. It is <strong>not</strong> an empirically estimated performance function.</p><Note title="What this can and cannot decide">The demonstration exposes system trade-offs and arithmetic consistency. It cannot diagnose real causes, guarantee queue reduction, justify resource allocation or estimate an intervention's causal effect without calibrated operational data and uncertainty analysis.</Note></section>
    </div>
    <div className="ex-endnote">Reproducibility: deterministic local data, six fictional districts, twelve periods, no API calls or personal information. Code: <a href="https://github.com/KabiriB/kabiri-bule-portfolio/tree/chatgpt/portfolio-lab-v2/src/data">scenario calculation module ↗</a>.</div>
  </ExperienceFrame>;
}
