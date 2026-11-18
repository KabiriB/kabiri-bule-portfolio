"use strict";
const STOP=new Set(("a an and are as at be been by can do does for from had has have how i if in into is it its of on or our should so than that the their there these this to under use used using was were what when where which who why will with would you your ai artificial intelligence system systems organisation organizations organisation organizations guidance recommend recommendations framework frameworks about according says").split(" "));
const SYN={hallucination:["confabulation","fabricated"],hallucinations:["confabulation","fabricated"],recruitment:["employment","hiring"],hiring:["employment"],staff:["workers"],staffing:["workforce"],worker:["labour"],workers:["labour"],people:["stakeholders","communities"],accountable:["accountability"],regulation:["legal","law"],rules:["requirements"],assess:["assessment","measure"],assessment:["impact","measure"],audit:["documentation","traceability"],risks:["risk"],rights:["human"],model:["ai"],models:["ai"],validate:["evaluation","testing"],validation:["evaluation"],test:["testing","evaluation"],testing:["evaluation"],launch:["deployment"],bias:["fairness","discrimination"],monitoring:["monitor"],monitor:["monitoring"],duties:["obligations"],protect:["safeguards"],explain:["explainability","transparency"],explanations:["explainability"],privacy:["data"],green:["environment"],climate:["environment"],environmental:["environment"],human:["oversight","rights"],impact:["assessment"],operations:["manage"],mitigation:["manage","risk"],prevention:["safety","risk"],four:["core"],functions:["core"]};
function stem(w){if(w.length>7&&w.endsWith("ies"))return w.slice(0,-3)+"y";if(w.length>7&&w.endsWith("ing"))return w.slice(0,-3);if(w.length>7&&w.endsWith("ed"))return w.slice(0,-2);if(w.length>6&&w.endsWith("s")&&!w.endsWith("ss"))return w.slice(0,-1);return w;}
function tok(s){return String(s||"").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g," ").split(/\s+/).map(stem).filter(x=>x.length>2&&!STOP.has(x));}
function terms(question){const original=[...new Set(tok(question))];const extra=original.flatMap(x=>SYN[x]||[]).map(stem).filter(x=>!STOP.has(x));return {original,all:[...new Set(original.concat(extra))]};}
function escapeHTML(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");}
let store=null,docs=[],idf={},avg=1,activeFilter="all";
function prepare(payload){
 store=payload;docs=payload.entries.map(e=>{
 const source=payload.sources.find(s=>s.id===e.source);
 const words=tok((e.title+" ").repeat(4)+(e.keywords+" ").repeat(3)+e.text+" "+source.short+" "+source.name);
 const tf=new Map();words.forEach(w=>tf.set(w,(tf.get(w)||0)+1));
 return {...e,sourceMeta:source,tf,len:words.length,unique:new Set(words)};
 });
 avg=docs.reduce((s,e)=>s+e.len,0)/docs.length;
 idf={};const universe=new Set(docs.flatMap(e=>[...e.unique]));
 universe.forEach(t=>{const df=docs.filter(e=>e.unique.has(t)).length;idf[t]=Math.log(1+(docs.length-df+0.5)/(df+0.5));});
}
function retrieve(question,filter="all",k=3){
 const q=terms(question);if(q.original.length===0)return {abstain:true,reason:"Please ask a specific question about the indexed evidence.",results:[],terms:q.original};
 const ranked=docs.filter(d=>filter==="all"||d.source===filter).map(d=>{
 let score=0, matched=[],important=0;
 for(const t of q.all){const f=d.tf.get(t)||0;if(f){const weight=idf[t]||0;const normalized=f*2.2/(f+1.2*(0.25+0.75*d.len/avg));score+=weight*normalized*(q.original.includes(t)?1:0.45);if(q.original.includes(t)){matched.push(t);important=Math.max(important,weight);}}}
 const coverage=matched.length/Math.max(1,q.original.length);
 score*=1+0.22*coverage;
 return {...d,score,matched,important};
 }).sort((a,b)=>b.score-a.score);
 const best=ranked[0],enough=best&&best.score>=2.3&&(best.matched.length>=2||(best.matched.length===1&&best.important>=2.35&&best.score>=2.7));
 return {abstain:!enough,reason:!best||!enough?"I cannot support a reliable answer from this small indexed corpus. Try a more specific question, choose a source, or consult the primary documents.":null,results:enough?ranked.filter(d=>d.score>=1.2).slice(0,k):[],terms:q.original};
}
function resultHTML(q,response){
 if(response.abstain)return '<div class="answer-warning"><span class="answer-label">No supported answer</span><h3>Insufficient evidence in this indexed collection</h3><p>'+escapeHTML(response.reason)+'</p><p class="meta">The system deliberately abstains rather than inventing a citation. This is a curated mini-corpus, not a web-wide search.</p></div>';
 const ranks=response.results.map((d,i)=>{
 const u=escapeHTML(d.sourceMeta.url);
 return '<article class="evidence-card"><div class="evidence-head"><span class="badge-light">Evidence '+(i+1)+'</span><span class="source-name">'+escapeHTML(d.sourceMeta.short)+'</span></div><h4>'+escapeHTML(d.title)+'</h4><p>'+escapeHTML(d.text)+'</p><div class="evidence-foot"><span>Curated paraphrase · '+escapeHTML(d.topic)+'</span><a target="_blank" rel="noopener noreferrer" href="'+u+'">Check official source ↗</a></div></article>';
 }).join("");
 return '<div class="answer-success"><span class="answer-label">Retrieved evidence · citations attached</span><h3>What the indexed documents support</h3><p>These are ranked, source-linked analytical paraphrases relevant to your question. Read the evidence below; this tool does not generate a free-form answer or infer beyond the passages.</p></div><div class="evidence-grid">'+ranks+'</div><p class="meta">Relevance is determined by auditable lexical matching. Rank is not a probability of truth; primary-source verification is necessary for policy or legal decisions.</p>';
}
function display(question,scroll=true){
 const input=document.getElementById("question");input.value=question;
 const r=retrieve(question,activeFilter,3);document.getElementById("answer").innerHTML=resultHTML(question,r);
 document.getElementById("answer-count").textContent=r.abstain?"Abstained":r.results.length+" cited passages";
 if(scroll)document.getElementById("answer").scrollIntoView({behavior:"smooth",block:"nearest"});
}
function metrics(){
 const positive=store.evaluation.positives.map(t=>{const r=retrieve(t.q,"all",3);return {...t,pass:!r.abstain&&r.results.some(x=>x.id===t.gold),top:r.results.map(x=>x.id)};});
 const negative=store.evaluation.negatives.map(q=>{const r=retrieve(q,"all",3);return {q,pass:r.abstain,top:r.results.map(x=>x.id)};});
 const p=positive.filter(x=>x.pass).length,n=negative.filter(x=>x.pass).length;
 return {p,n,positives:positive,negatives:negative};
}
function showMetrics(){
 const m=metrics(),all=m.positives.concat(m.negatives),failed=all.filter(x=>!x.pass);
 const list=all.map((x,i)=>'<tr><td>'+(i+1)+'</td><td>'+escapeHTML(x.q)+'</td><td>'+(x.pass?'PASS':'FAIL')+'</td><td>'+escapeHTML(x.gold||"Should abstain")+'</td><td>'+escapeHTML(x.top.join(", ")||"Abstain")+'</td></tr>').join("");
 document.getElementById("evaluation").innerHTML='<div class="eval-stat"><strong>'+m.p+' / '+m.positives.length+'</strong><span>Relevant passage found in top 3</span></div><div class="eval-stat"><strong>'+m.n+' / '+m.negatives.length+'</strong><span>Out-of-scope queries correctly refused</span></div><div class="eval-stat"><strong>'+failed.length+'</strong><span>Test cases needing review</span></div><details class="eval-detail"><summary>Inspect every test and result</summary><div class="table-wrap"><table><thead><tr><th>#</th><th>Question</th><th>Status</th><th>Expected</th><th>Retrieved IDs</th></tr></thead><tbody>'+list+'</tbody></table></div></details>';
 document.getElementById("eval-description").textContent="Tested "+all.length+" predefined queries against this in-browser retrieval engine. Results are a small curated benchmark, not a general accuracy or hallucination rate.";
 window.__AI_EVIDENCE_EVAL__=m;
}
async function init(){
 try{
 const response=await fetch("./ai-evidence-data.json",{cache:"no-store"});
 if(!response.ok)throw Error("Corpus HTTP "+response.status);
 const payload=await response.json();prepare(payload);
 const select=document.getElementById("source-filter");
 payload.sources.forEach(s=>{const o=document.createElement("option");o.value=s.id;o.textContent=s.short;select.appendChild(o);});
 select.addEventListener("change",()=>{activeFilter=select.value;const q=document.getElementById("question").value.trim();if(q)display(q,false);});
 document.getElementById("search-form").addEventListener("submit",e=>{e.preventDefault();display(document.getElementById("question").value.trim());});
 document.querySelectorAll("[data-question]").forEach(b=>b.addEventListener("click",()=>display(b.getAttribute("data-question"))));
 document.getElementById("run-tests").addEventListener("click",showMetrics);
 document.getElementById("corpus-count").textContent=payload.entries.length;
 document.getElementById("source-count").textContent=payload.sources.length;
 document.getElementById("test-count").textContent=payload.evaluation.positives.length+payload.evaluation.negatives.length;
 document.getElementById("source-list").innerHTML=payload.sources.map(s=>'<article><h4>'+escapeHTML(s.name)+'</h4><p>'+escapeHTML(s.note)+' · '+escapeHTML(s.year)+'</p><a href="'+escapeHTML(s.url)+'" target="_blank" rel="noopener noreferrer">Read original ↗</a></article>').join("");
 document.getElementById("loading").hidden=true;
 document.getElementById("app").hidden=false;
 display("What are NIST's four AI risk functions?",false);
 window.__AI_EVIDENCE_READY__=true;
 window.__AI_EVIDENCE_API__={retrieve,metrics};
 }catch(e){document.getElementById("loading").textContent="Could not load the evidence index: "+e.message;}
}
document.addEventListener("DOMContentLoaded",init);
