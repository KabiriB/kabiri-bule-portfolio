import { useState } from "react";
import { ExperienceFrame, SmallLabel, Note } from "./ExperienceFrame";
import { fmt, pct } from "../data/syntheticService";
import "./Experiences.css";

function FunnelStage({ label, value, max, note, variant }) {return <div className="ex-funnel-stage"><div><span>{label}</span><strong>{fmt(value)}</strong></div><div className="ex-funnel-track"><span className={variant || ""} style={{width:(max?Math.min(100,value/max*100):0)+"%"}} /></div><small>{note}</small></div>}
const designs={
  before:{ title:"Before–after tracking", claim:"Change over time among participants", gap:"Secular trends, regression to the mean, selection and external shocks can explain observed changes. No credible counterfactual is established by two time points alone." },
  matched:{ title:"Matched comparison", claim:"Differences between similar observed participants and non-participants", gap:"Matching can address recorded differences when assumptions hold, but does not remove unmeasured confounding. Diagnostics and common support matter." },
  random:{ title:"Randomized allocation", claim:"A design-based average assignment effect, if implemented and analysed appropriately", gap:"Non-compliance, attrition, spillovers, low power and ethical constraints still matter. Random assignment must actually occur; selecting this option does not perform it." }
};
export default function MonitoringLab() {
  const [budget,setBudget]=useState(1200000);
  const [cost,setCost]=useState(1500);
  const [completion,setCompletion]=useState(72);
  const [uptake,setUptake]=useState(58);
  const [reference,setReference]=useState(38);
  const [design,setDesign]=useState("before");
  const targeted=Math.floor(budget/cost);
  const completed=Math.round(targeted*completion/100);
  const adopted=Math.round(completed*uptake/100);
  const nominalCoverage=budget>0?targeted:0;
  const spendPerAdoption=adopted?budget/adopted:null;
  const observedGap=uptake-reference;
  const reset=()=>{setBudget(1200000);setCost(1500);setCompletion(72);setUptake(58);setReference(38);setDesign("before")};
  return <ExperienceFrame kind="Monitoring, evaluation & learning" title={<>From activity to <em>credible evidence.</em></>} subtitle="Build a results chain, stress-test delivery assumptions and examine which claims an evaluation design can actually support." tag="M&E learning prototype · entirely fictional programme">
    <div className="ex-alert"><span className="ex-green-indicator"/> INTERACTIVE PROGRAMME MODEL <span>Fictional training programme. These quantities are scenario assumptions, not observed results or causal impact estimates.</span></div>
    <section className="ex-mel-layout">
      <div className="ex-mel-controls"><SmallLabel>01 / Set the programme</SmallLabel><h2>What will the resources deliver?</h2><p>Adjust the inputs and follow what can plausibly be counted. This is a transparent accounting model, not an outcome-prediction algorithm.</p>
        <div className="ex-slider-control light"><div><label htmlFor="mel-budget">Programme budget</label><output htmlFor="mel-budget">R{fmt(budget)}</output></div><input id="mel-budget" type="range" min="300000" max="3000000" step="100000" value={budget} onChange={e=>setBudget(Number(e.target.value))}/></div>
        <div className="ex-slider-control light"><div><label htmlFor="mel-cost">Cost per enrolment</label><output htmlFor="mel-cost">R{fmt(cost)}</output></div><input id="mel-cost" type="range" min="750" max="3000" step="250" value={cost} onChange={e=>setCost(Number(e.target.value))}/></div>
        <div className="ex-slider-control light"><div><label htmlFor="mel-completion">Programme completion</label><output htmlFor="mel-completion">{completion}%</output></div><input id="mel-completion" type="range" min="25" max="100" step="1" value={completion} onChange={e=>setCompletion(Number(e.target.value))}/></div>
        <div className="ex-slider-control light"><div><label htmlFor="mel-uptake">Post-programme adoption among completers</label><output htmlFor="mel-uptake">{uptake}%</output></div><input id="mel-uptake" type="range" min="10" max="95" step="1" value={uptake} onChange={e=>setUptake(Number(e.target.value))}/></div>
        <button type="button" className="ex-reset" onClick={reset}>↺ Restore starting scenario</button>
      </div>
      <div className="ex-mel-funnel"><SmallLabel>02 / Results chain in numbers</SmallLabel><h2>A programme is a sequence of losses and conversions.</h2><p>Each stage uses the selected assumption, so changing enrolment cost or completion changes downstream quantities.</p>
        <FunnelStage label="Input / available budget converted to places" value={nominalCoverage} max={Math.max(1,targeted)} note="Places affordable = floor(budget ÷ cost per enrolment)" variant="mint"/>
        <FunnelStage label="Output / programme completers" value={completed} max={Math.max(1,targeted)} note="Completed = enrolled × assumed completion rate" variant="copper"/>
        <FunnelStage label="Short-term outcome proxy / adoption" value={adopted} max={Math.max(1,targeted)} note="Adopters = completed × assumed post-programme adoption rate" variant="mint"/>
        <div className="ex-mel-kpis"><div><span>Completion among enrolled</span><strong>{pct(targeted?completed/targeted:0,1)}</strong></div><div><span>Spend per assumed adopter</span><strong>{spendPerAdoption?"R"+fmt(spendPerAdoption):"—"}</strong></div></div><small className="ex-funnel-caution">Cost per assumed adopter is a planning ratio. It is not cost-effectiveness or cost per attributable impact.</small>
      </div>
    </section>
    <section className="ex-mel-evidence"><div><SmallLabel>03 / Measure the counterfactual problem</SmallLabel><h2>What changed—and compared with what?</h2><p>The model assumes {uptake}% adoption among programme completers. Enter an illustrative reference rate for another group or period. A difference appears, but its meaning depends entirely on the design.</p>
      <div className="ex-slider-control light"><div><label htmlFor="mel-reference">Reference adoption rate</label><output htmlFor="mel-reference">{reference}%</output></div><input id="mel-reference" type="range" min="0" max="95" step="1" value={reference} onChange={e=>setReference(Number(e.target.value))}/></div>
      <div className="ex-mel-gap"><span>Descriptive gap</span><strong>{observedGap>0?"+":""}{observedGap} pp</strong><small>NOT an attributable programme effect</small></div></div>
      <div><SmallLabel>04 / Select an evaluation design</SmallLabel><h2>What claim can the design support?</h2><div className="ex-design-choices" role="group" aria-label="Evaluation design">{Object.entries(designs).map(([id,item])=><button type="button" key={id} aria-pressed={id===design} className={id===design?"active":""} onClick={()=>setDesign(id)}>{item.title}</button>)}</div>
        <div className="ex-evaluation-reading" aria-live="polite"><strong>Potential estimand / {designs[design].title}</strong><p>{designs[design].claim}</p><strong>What remains uncertain</strong><p>{designs[design].gap}</p></div></div>
    </section>
    <section className="ex-mel-theory"><SmallLabel>05 / Theory of change</SmallLabel><h2>Four questions before reporting success.</h2><div className="ex-mel-theory-grid"><div><b>Inputs</b><p>Were resources available, sufficient and correctly allocated?</p></div><div><b>Activities</b><p>What was actually delivered, to whom and with what fidelity?</p></div><div><b>Outputs</b><p>How many completed the programme, and who was left out?</p></div><div><b>Outcomes</b><p>Did behaviour or conditions change, and is the change attributable?</p></div></div></section>
    <Note title="Monitoring is not impact evaluation">A credible M&E system needs denominators, disaggregation, missing-data protocols, repeatable indicator definitions, data quality checks, programme theory and a feasible identification strategy. This lab illustrates conversion arithmetic and evaluation choices; it does not create an impact estimate.</Note>
    <p className="ex-endnote">Model assumptions: fixed budget, uniform cost per enrolment, no implementation overheads, no repeated enrolment and no programme effect inferred. Figures are integer-rounded at stage boundaries. All values are generated in the browser.</p>
  </ExperienceFrame>;
}