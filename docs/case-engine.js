/* Dedicated case explorers — illustrative scenario data from the existing portfolio.
   No model fitting, causal inference, or real-location estimates are performed in-browser. */
(function () {
  "use strict";
  const mount = document.getElementById("case-explorer");
  const payload = document.getElementById("case-data");
  if (!mount || !payload) return;
  let cfg;
  try { cfg = JSON.parse(payload.textContent); }
  catch (e) { mount.textContent = "The case explorer could not load."; return; }
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  const bounded = v => Math.max(0,Math.min(100,Number(v)||0));
  const state = { item:cfg.defaultItem, layer:cfg.defaultLayer || "pressure", scenario:"pressure" };
  const find = id => cfg.items.find(item => item.id === id) || cfg.items[0];
  const heading = (label, title) => '<span class="label">'+esc(label)+'</span><h3>'+esc(title)+'</h3>';
  const bars = values => '<div class="bars">' + values.map(x => '<div class="barline"><div class="barlabel"><span>'+esc(x.label)+'</span><strong>'+esc(x.value)+'/100</strong></div><div class="track"><div class="fill" style="width:'+bounded(x.value)+'%"></div></div></div>').join("") + "</div>";
  const actions = questions => '<h4>Questions for further investigation</h4><ul>'+questions.map(q => '<li>'+esc(q)+'</li>').join("")+'</ul>';
  const options = (items, key, selected) => '<div class="controls" aria-label="Compare profiles">'+items.map(x=>'<button type="button" data-'+key+'="'+esc(x.id)+'" aria-pressed="'+(x.id===selected)+'" class="'+(x.id===selected?'active':'')+'">'+esc(x.name||x.label)+'</button>').join("")+"</div>";
  const nav = '<div class="stepnav"><a href="#overview">↑ Case introduction</a><a href="#interpretation">Read interpretation ↓</a><a href="./analytics.html#work">← All case studies</a></div>';
  function governance(item) {
    const layer = cfg.layers.find(l=>l.id===state.layer)||cfg.layers[0];
    const max = Math.max(...cfg.cells.map(c=>c.intensity));
    const tiles = cfg.cells.map(cell=>{
      const intensity=bounded(cell.intensity);
      const alpha=.15+.62*intensity/100;
      return '<button type="button" class="'+(cell.placeId===item.id?'selected':'')+'" data-item="'+esc(cell.placeId)+'" style="background:rgba(82,159,154,'+alpha.toFixed(2)+')" aria-label="Illustrative pressure cell '+cell.id+'; select '+esc(find(cell.placeId).name)+'" title="'+esc(find(cell.placeId).name)+' · Pressure '+intensity+'">'+intensity+'</button>';
    }).join("");
    const layerBars=cfg.layers.map(l=>({label:l.label,value:item.scores[l.id]}));
    return options(cfg.layers,"layer",state.layer) + options(cfg.items,"item",item.id) +
    '<div class="lab-grid"><div class="panel">'+heading("Selected area archetype",item.name)+
    '<p>'+esc(item.profile)+'</p><span class="label">Selected lens · '+esc(layer.label)+'</span><div class="score">'+esc(item.scores[layer.id])+'<span class="substat"> / 100</span></div><p class="definition">'+esc(layer.description)+'</p>'+bars(layerBars)+
    '<h4>Illustrative pressure cells</h4><div class="matrix">'+tiles+'</div><div class="matrix-note">The 12 cells represent a conceptual pressure field, not coordinates or observed neighbourhood measurements. Select a cell to change the area profile. Maximum illustrative intensity: '+max+'.</div></div>'+
    '<aside class="panel">'+heading("Interpretation",item.type)+'<p>'+esc(item.reading)+'</p><h4>Why this pattern matters</h4><p>'+esc(item.whyItMatters)+'</p>'+actions(item.questions)+'</aside></div>'+nav;
  }
  const scenarioModes=[
    {id:"normal",label:"Normal watch",description:"Use the signal to maintain visibility, protect strengths, and notice early drift before it becomes operational pressure.",nextMove:"Keep the signal under routine review, but ask one sharper question about where quiet strain may be accumulating."},
    {id:"pressure",label:"Pressure rising",description:"Treat the signal as an early warning. Look for connected effects across teams, users, budgets, and delivery routines.",nextMove:"Identify the two pressure points most likely to spread across the system, then assign ownership for closer monitoring."},
    {id:"crisis",label:"Crisis watch",description:"Read the signal as a potential failure pathway. Focus on containment, decision rights, communication, and the minimum viable response.",nextMove:"Clarify who decides, what must be protected first, and which trade-offs leadership is willing to make in the next 72 hours."}
  ];
  function executive(item) {
    const scenario=scenarioModes.find(x=>x.id===state.scenario)||scenarioModes[1];
    return options(cfg.items,"item",item.id)+options(scenarioModes,"scenario",state.scenario)+
    '<div class="lab-grid"><div class="panel">'+heading("Organisational signal",item.label)+
    '<div class="score">'+esc(item.score)+'<span class="substat"> / 100</span></div><p><strong>'+esc(item.status)+'</strong> · '+esc(item.trend)+'</p><p>'+esc(item.summary)+'</p>'+bars(item.metrics)+
    '<div class="quotation"><strong>'+esc(scenario.label)+': </strong>'+esc(scenario.description)+'</div></div>'+
    '<aside class="panel">'+heading("Decision reading","Management implications")+'<p>'+esc(item.whyItMatters)+'</p>'+
    '<h4>Illustrative next action</h4><p>'+esc(scenario.nextMove)+'</p>'+actions(item.leaderQuestions)+
    '<p class="definition">Changing the scenario changes the response narrative, not the underlying illustrative scores.</p></aside></div>'+nav;
  }
  function retail(item) {
    const vals=[{label:"Revenue index",value:item.revenue},{label:"Customer satisfaction",value:item.satisfaction},{label:"Queue pressure",value:item.queuePressure},{label:"Stock reliability",value:item.stockReliability},{label:"Staffing strain",value:item.staffingStrain}];
    const comparison=cfg.items.map(x=>'<div class="mini-tile"><span>'+esc(x.name)+'</span><strong>'+x.revenue+' <small style="font-size:12px;color:#bed1dd">revenue</small></strong><span>'+x.satisfaction+'/100 satisfaction · '+x.queuePressure+'/100 queue pressure</span></div>').join("");
    return options(cfg.items,"item",item.id)+
    '<div class="lab-grid"><div class="panel">'+heading("Branch profile",item.name)+'<p><strong>'+esc(item.classification)+'</strong> · '+esc(item.type)+'</p>'+bars(vals)+
    '<h4>Comparison across four illustrative branches</h4><div class="profile-grid">'+comparison+'</div></div>'+
    '<aside class="panel">'+heading("Decision reading","Performance beyond revenue")+'<p>'+esc(item.reading)+'</p><h4>Why it matters</h4><p>'+esc(item.whyItMatters)+'</p>'+actions(item.questions)+
    '<p class="definition">All five indices are illustrative scores, not rand amounts, branch observations or audited KPIs. High queue and staffing pressure indicate more strain.</p></aside></div>'+nav;
  }
  function resource(item) {
    const vals=[{label:"Resource input score",value:item.inputScore},{label:"Conversion score",value:item.conversionScore},{label:"Outcome score",value:item.outcomeScore},...item.indicators.filter(x=>x.label==="Delivery capacity")];
    const comparison=cfg.items.map(x=>'<div class="mini-tile"><span>'+esc(x.name)+'</span><strong>'+x.inputScore+' <small style="font-size:11px;color:#bed1dd">input</small> / '+x.outcomeScore+' <small style="font-size:11px;color:#bed1dd">outcome</small></strong><span>'+esc(x.systemType)+'</span></div>').join("");
    return options(cfg.items,"item",item.id)+
    '<div class="lab-grid"><div class="panel">'+heading("System profile",item.name)+'<p><strong>'+esc(item.systemType)+'</strong> · Friction: '+esc(item.friction)+'</p>'+bars(vals)+
    '<h4>Comparison of input and outcome indices</h4><div class="profile-grid">'+comparison+'</div></div>'+
    '<aside class="panel">'+heading("Decision reading","From resources to outcomes")+'<p>'+esc(item.reading)+'</p><h4>Why it matters</h4><p>'+esc(item.whyItMatters)+'</p>'+actions(item.questions)+
    '<p class="definition">Illustrative scores have no common monetary denominator. The “conversion score” is a scenario input, not a statistically estimated efficiency ratio or causal effect.</p></aside></div>'+nav;
  }
  function render(){
    const item=find(state.item);
    if(cfg.kind==="governance")mount.innerHTML=governance(item);
    else if(cfg.kind==="executive")mount.innerHTML=executive(item);
    else if(cfg.kind==="retail")mount.innerHTML=retail(item);
    else if(cfg.kind==="resource")mount.innerHTML=resource(item);
    else mount.innerHTML="<p>Case explorer unavailable.</p>";
  }
  mount.addEventListener("click",event=>{
    const button=event.target.closest("button");
    if(!button || !mount.contains(button))return;
    if(button.dataset.item){state.item=button.dataset.item;render();}
    if(button.dataset.layer){state.layer=button.dataset.layer;render();}
    if(button.dataset.scenario){state.scenario=button.dataset.scenario;render();}
  });
  render();
})();