import {useMemo,useState} from "react";
import {simulateServices, summarizeServices, aggregateByPeriod, fmt} from "../data/syntheticService";
import "./IndependentOpening.css";

const reference = simulateServices();
const baseline = summarizeServices(reference);
const baselineTrend = aggregateByPeriod(reference,12);
const zones = [{id:"north",name:"North"},{id:"central",name:"Central"},{id:"west",name:"West"},{id:"east",name:"East"},{id:"river",name:"River"},{id:"south",name:"South"}];

function TrendChart({rows,referenceRows}) {
 const limits=Math.max(...rows.flatMap(x=>[x.incoming,x.resolved]),...referenceRows.flatMap(x=>[x.incoming,x.resolved]))*1.1;
 const line=(values,key)=>values.map((item,i)=>{
   const x=28+(i/(values.length-1))*674;
   const y=206-(item[key]/limits)*168;
   return (i?"L":"M")+x.toFixed(1)+","+y.toFixed(1);
 }).join(" ");
 return <div className="iv-chart-frame">
   <div className="iv-chart-head"><span>FIG 01 / SYSTEM LOAD</span><span>12 SYNTHETIC REPORTING PERIODS</span></div>
   <svg viewBox="0 0 735 253" role="img" aria-label="Interactive line chart showing simulated service demand and completed cases for twelve periods. It recalculates when capacity changes.">
     {[0,1,2,3].map(i=><line key={i} x1="28" x2="704" y1={38+i*56} y2={38+i*56} stroke="#ccd7df" opacity=".15" strokeDasharray="3 7"/>)}
     <path d={line(referenceRows,"resolved")} fill="none" stroke="#c6d2c6" opacity=".52" strokeWidth="2.3" strokeDasharray="7 7"/>
     <path d={line(rows,"incoming")} fill="none" stroke="#e3fa91" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
     <path d={line(rows,"resolved")} fill="none" stroke="#ff826e" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
     <text x="28" y="239" fill="#b3c8c9" fontSize="12">P01</text>
     <text x="704" y="239" fill="#b3c8c9" fontSize="12" textAnchor="end">P12</text>
   </svg>
   <div className="iv-chart-legend"><span><i style={{background:"#e3fa91"}}/>Arriving cases</span><span><i style={{background:"#ff826e"}}/>Resolved cases</span><span><i className="iv-dashed"/>Baseline resolved</span></div>
 </div>;
}
export default function IndependentOpening() {
 const [capacity,setCapacity]=useState(0);
 const [selected,setSelected]=useState("all");
 const [view,setView]=useState("backlog");
 const simulation=useMemo(()=>simulateServices({capacityShift:capacity}),[capacity]);
 const current=selected==="all"?simulation:simulation.filter(z=>z.id===selected);
 const original=selected==="all"?reference:reference.filter(z=>z.id===selected);
 const summary=summarizeServices(current);
 const baselineSummary=summarizeServices(original);
 const series=aggregateByPeriod(current,12);
 const baselineSeries=aggregateByPeriod(original,12);
 const stockDiff=summary.backlog-baselineSummary.backlog;
 const signed=n=>n<0?"−"+fmt(-n):n>0?"+"+fmt(n):"0";
 const scenarioStatus=capacity===0?"Unchanged reference":capacity>0?"Greater assumed resolution capacity":"Reduced assumed resolution capacity";
 return <section className="iv-hero" aria-labelledby="iv-title">
   <div className="iv-kicker"><span><i/> AN INDEPENDENT RESEARCH & TECHNOLOGY LABORATORY</span><span>ISSUE 01 / THE QUESTION IS THE INTERFACE</span></div>
   <div className="iv-hero-content">
     <div className="iv-editorial">
       <span className="iv-overline">A WORKING DECISION EXPERIMENT / SYNTHETIC DATA</span>
       <h1 id="iv-title">When a system <em>falls behind,</em> where does the pressure go?</h1>
       <p className="iv-deck">Six fictional service districts. Twelve reporting periods. Requests keep arriving, but resources are finite. Explore how a small change in capacity alters the unfinished work.</p>
       <div className="iv-hero-number" aria-live="polite" aria-atomic="true">
          <span>UNRESOLVED CASES / {selected==="all"?"ALL DISTRICTS":zones.find(z=>z.id===selected).name.toUpperCase()}</span>
          <div>{fmt(summary.backlog)}</div>
          <p>{capacity===0?"The model's unchanged reference run.":signed(stockDiff)+" versus the unchanged reference."}</p>
       </div>
       <div className="iv-hero-actions"><a href="#/dashboard" className="iv-button-primary">Enter the full investigation <span>↗</span></a><a href="#work" className="iv-secondary-link">Discover the other experiments ↓</a></div>
     </div>
     <div className="iv-instrument">
       <div className="iv-instrument-top"><span>THE FIELD IN NUMBERS / LIVE MODEL</span><span className="iv-running"><i/> RECALCULATED IN YOUR BROWSER</span></div>
       <div className="iv-instrument-metrics">
         <div><span>01 / INCOMING</span><strong>{fmt(summary.incoming)}</strong><small>requests over 12 periods</small></div>
         <div><span>02 / RESOLVED</span><strong>{fmt(summary.resolved)}</strong><small>completed in model</small></div>
         <div><span>03 / REMAINING</span><strong>{fmt(summary.backlog)}</strong><small>closing backlog</small></div>
       </div>
       <TrendChart rows={series} referenceRows={baselineSeries}/>
       <div className="iv-control">
         <div className="iv-control-head"><div><span>TEST AN ASSUMPTION</span><strong>Resolution capacity</strong></div><output htmlFor="iv-capacity">{capacity>0?"+":""}{capacity}%</output></div>
         <input id="iv-capacity" type="range" min="-20" max="30" step="5" value={capacity} onChange={e=>setCapacity(Number(e.target.value))}/>
         <div className="iv-control-footer"><span>−20% capacity</span><span>{scenarioStatus}</span><span>+30% capacity</span></div>
       </div>
       <div className="iv-zone-head"><span>SELECT A DISTRICT TO ISOLATE ITS PRESSURE</span><button type="button" onClick={()=>{setCapacity(0);setSelected("all");setView("backlog")}}>↺ Reset</button></div>
       <div className="iv-zones">
         <button className={selected==="all"?"selected":""} aria-pressed={selected==="all"} onClick={()=>setSelected("all")}>All<span>06</span></button>
         {zones.map(z=>{
            const d=simulation.find(v=>v.id===z.id),base=reference.find(v=>v.id===z.id);
            const cur=summarizeServices([d]),ref=summarizeServices([base]);
            return <button key={z.id} className={selected===z.id?"selected":""} aria-pressed={selected===z.id} onClick={()=>setSelected(z.id)}>{z.name}<span>{view==="backlog"?fmt(cur.backlog):signed(cur.backlog-ref.backlog)}</span></button>;
         })}
       </div>
       <div className="iv-instrument-caption"><span><i className="iv-caption-pin"/> {capacity===0?"BASELINE ACTIVE":"SCENARIO ACTIVE"}</span><span>Deterministic teaching model · not real service data or a forecast</span></div>
     </div>
   </div>
   <div className="iv-bottom"><div><strong>THE QUESTION</strong><span>What happens when demand and capacity diverge?</span></div><div><strong>THE METHOD</strong><span>A transparent stock-and-flow simulation.</span></div><div><strong>THE LIMIT</strong><span>No causal claims, operational validation or real districts.</span></div></div>
 </section>;
}
