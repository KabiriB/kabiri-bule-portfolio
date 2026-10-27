import { useMemo, useState } from "react";
import { ExperienceFrame, SmallLabel, Note } from "./ExperienceFrame";
import "./Experiences.css";

const balance = (highShare, uplift) => {
  const high = highShare / 100;
  return (.3 + .4 * high + uplift / 100);
};
const asPercent = n => (n * 100).toFixed(1) + "%";
function CompareBars({items,max=1}) {return <div className="ex-comparison-bars">{items.map(item=><div className="ex-comparison" key={item.label}><div><span>{item.label}</span><strong>{asPercent(item.value)}</strong></div><div className="ex-comparison-track"><i className={item.tone||""} style={{width:Math.max(0,Math.min(100,item.value/max*100))+"%"}} /></div><small>{item.description}</small></div>)}</div>;}
export default function MethodExperiment() {
  const [treatedHigh, setTreatedHigh] = useState(20);
  const [comparisonHigh, setComparisonHigh] = useState(80);
  const [improvement, setImprovement] = useState(8);
  const [standardShare,setStandardShare]=useState(50);
  const treated=balance(treatedHigh,improvement), comparison=balance(comparisonHigh,0);
  const highT = .7+improvement/100,lowT=.3+improvement/100;
  const diff = treated-comparison;
  const standardized=balance(standardShare,improvement)-balance(standardShare,0);
  const flipped = diff < 0 && improvement > 0;
  const reset=()=>{setTreatedHigh(20);setComparisonHigh(80);setImprovement(8);setStandardShare(50)};
  const table=useMemo(()=>[
    {group:"Group A / low baseline",control:.3,treated:lowT},
    {group:"Group B / high baseline",control:.7,treated:highT},
    {group:"Everyone / mixed composition",control:comparison,treated:treated}
  ],[lowT,highT,comparison,treated]);
  return <ExperienceFrame kind="Statistical experiment / Composition & inference" title={<>When the average <em>gets the story wrong.</em></>} subtitle="Build a statistical reversal with your own hands. Two groups can improve individually while the pooled comparison suggests the opposite." tag="Simpson's paradox · deterministic thought experiment">
    <div className="ex-alert"><span className="ex-green-indicator" /> MATHEMATICAL THOUGHT EXPERIMENT <span>Illustrative rates only. This is not a result from a survey, evaluation or observational study.</span></div>
    <div className="ex-experiment-grid">
      <section className="ex-experiment-controls"><SmallLabel>01 / Construct the data</SmallLabel><h2>Change who is in each group.</h2><p>Group A starts with a 30% outcome rate. Group B starts at 70%. The intervention improves outcomes within both groups by the same amount.</p>
        <div className="ex-slider-control light"><div><label htmlFor="sim-treated">High-baseline share / intervention</label><output htmlFor="sim-treated">{treatedHigh}%</output></div><input type="range" id="sim-treated" min="0" max="100" step="5" value={treatedHigh} onChange={e=>setTreatedHigh(Number(e.target.value))}/><span>Mostly Group A <b>Intervention composition</b> Mostly Group B</span></div>
        <div className="ex-slider-control light"><div><label htmlFor="sim-comparison">High-baseline share / comparison</label><output htmlFor="sim-comparison">{comparisonHigh}%</output></div><input type="range" id="sim-comparison" min="0" max="100" step="5" value={comparisonHigh} onChange={e=>setComparisonHigh(Number(e.target.value))}/><span>Mostly Group A <b>Comparison composition</b> Mostly Group B</span></div>
        <div className="ex-slider-control light"><div><label htmlFor="sim-improvement">Improvement within both groups</label><output htmlFor="sim-improvement">+{improvement} pp</output></div><input type="range" id="sim-improvement" min="0" max="25" step="1" value={improvement} onChange={e=>setImprovement(Number(e.target.value))}/><span>0 pp <b>Within-group difference</b> +25 pp</span></div>
        <button type="button" className="ex-reset" onClick={reset}>↺ Restore paradox example</button>
      </section>
      <section className="ex-experiment-results" aria-live="polite"><SmallLabel>02 / What the pooled figures suggest</SmallLabel><h2>{flipped?"Both groups do better. The average says worse.":improvement===0?"No within-group uplift is assumed.":"The pooled comparison has changed."}</h2>
        <CompareBars items={[{label:"Intervention / pooled rate",value:treated,tone:"teal",description:"Mix of groups determined by the first slider"},{label:"Comparison / pooled rate",value:comparison,tone:"copper",description:"Mix of groups determined by the second slider"}]}/>
        <div className={"ex-delta "+(diff<0?"negative":"positive")}><span>Difference in pooled outcomes</span><strong>{diff>0?"+":""}{(diff*100).toFixed(1)} <small>percentage points</small></strong></div>
        <p>Moving the composition sliders changes the overall comparison, even though the within-group starting rates stay fixed. This is a weighted-average calculation—not a random sample.</p>
      </section>
    </div>
    <section className="ex-method-table-wrap"><div className="ex-card-head"><div><SmallLabel>03 / Open the arithmetic</SmallLabel><h2>Compare like with like.</h2></div><span className="ex-small-meta">All rates recalculated live</span></div>
      <div className="ex-method-table"><div className="ex-method-head"><span>Population</span><span>Comparison</span><span>Intervention</span><span>Difference</span></div>{table.map((row,i)=><div key={row.group}><span>{row.group}</span><strong>{asPercent(row.control)}</strong><strong>{asPercent(row.treated)}</strong><strong className={i===2&&diff<0?"ex-negative":""}>{(row.treated-row.control)>0?"+":""}{((row.treated-row.control)*100).toFixed(1)} pp</strong></div>)}</div>
      <div className="ex-method-annotation">Within Group A and within Group B, the intervention rate is never lower than the comparison rate. The pooled row can reverse because the two arms contain different proportions of high-baseline participants.</div>
    </section>
    <section className="ex-standardization"><div><SmallLabel>04 / The corrective comparison</SmallLabel><h2>Hold composition constant.</h2><p>Choose a common population mix and compare both conditions under that same mix. This is direct standardization; it removes this particular composition difference from the descriptive comparison.</p><div className="ex-slider-control light"><div><label htmlFor="sim-standard">High-baseline share in reference population</label><output htmlFor="sim-standard">{standardShare}%</output></div><input type="range" id="sim-standard" min="0" max="100" step="5" value={standardShare} onChange={e=>setStandardShare(Number(e.target.value))}/></div></div>
      <div className="ex-standard-result"><span>Standardized difference</span><strong>+{(standardized*100).toFixed(1)} pp</strong><p>Using the same group composition on both sides recovers the assumed within-group improvement. That is not yet proof of a causal effect in real data.</p></div>
    </section>
    <Note title="The decision-intelligence lesson">Before comparing averages, ask who was counted, how groups were formed and whether the populations are comparable. Standardization solves the composition arithmetic shown here. In actual programme or policy evaluation, selection, unmeasured confounding, interference and measurement error still require explicit identification and design.</Note>
    <p className="ex-endnote">Method: weighted means. Pooled outcome = (low-baseline share × low-baseline rate) + (high-baseline share × high-baseline rate). All values are calculated in React from slider inputs; no sampling or statistical significance claims are made.</p>
  </ExperienceFrame>;
}