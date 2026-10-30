import { useMemo, useState } from "react";
import ExecutiveSignalRoom from "./components/ExecutiveSignalRoom";
import GovernancePressureObservatory from "./components/GovernancePressureObservatory";
import ResourceConversionLab from "./components/ResourceConversionLab";
import RetailStrainSimulator from "./components/RetailStrainSimulator";
import DashboardPreview from "./components/DashboardPreview";
import IndependentOpening from "./components/IndependentOpening";
import "./IndependentTheme.css";
import "./App.css";
import "./PortfolioLab.css";

const base = import.meta.env.BASE_URL;
const repoUrl = "https://github.com/KabiriB/";

const collection = [
  { id: "signalsroom", type: "Analytical experiment", state: "Working React page", title: "The System Signals Room", line: "Interactive six-district service-system dashboard with capacity, demand, timeliness, queue flows and diagnostic drilldowns.", href: "#/dashboard", action: "Enter the dashboard" },
  { id: "averages", type: "Analytical experiment", state: "Working React page", title: "When the Average Gets the Story Wrong", line: "Manipulate group composition and watch Simpson's paradox emerge; compare pooled and standardized estimates.", href: "#/experiment", action: "Run the experiment" },
  { id: "mel", type: "Monitoring & evaluation", state: "Working React page", title: "From Activity to Credible Evidence", line: "Interactive results chain, resource conversion calculator and evaluation design cautions.", href: "#/monitoring", action: "Open the M&E lab" },

  { id: "evaluation", type: "AI experiment", state: "Working prototype", title: "Before the Model Goes Live", line: "A synthetic exercise in thresholds, error types, workload and deployment judgement.", href: base + "ai-evaluation/index.html", action: "Open evaluation lab" },
  { id: "vibecoding", type: "AI & computing", state: "Repository", title: "Vibecoding", line: "Practical explorations across software, data workflows and AI. Individual experiments have different levels of maturity.", href: repoUrl + "vibecoding", action: "Inspect source" }
];

const studioOptions = [
  { id: "governance", title: "Urban pressure", component: GovernancePressureObservatory, note: "Compare fictional neighbourhood pressures and institutional visibility." },
  { id: "resources", title: "Resource conversion", component: ResourceConversionLab, note: "Explore why equivalent resources need not produce equivalent outcomes." },
  { id: "executive", title: "Organisational signals", component: ExecutiveSignalRoom, note: "Inspect connected indicators under different leadership scenarios." },
  { id: "retail", title: "Retail strain", component: RetailStrainSimulator, note: "Compare simulated branch conditions, friction and performance." }
];

const fictionalCases = Array.from({ length: 240 }, (_, i) => {
  const group = i % 3 === 0 ? "B" : "A";
  const event = (i * 41 + 29) % 19 < (group === "B" ? 5 : 3);
  const variation = ((i * 73 + 17) % 101) / 100;
  const score = Math.max(0.01, Math.min(0.99, 0.1 + variation * 0.43 + (event ? 0.3 : 0) - (group === "B" ? 0.09 : 0)));
  return { id: i + 1, group, event, score };
});

function Label({ children, light = false }) {
  return <span className={"kb-label" + (light ? " kb-label-light" : "")}>{children}</span>;
}
function ArrowLink({ href, children, className = "" }) {
  return <a className={"kb-arrow-link " + className} href={href}>{children}<span aria-hidden="true">↗</span></a>;
}
function SectionIntro({ number, eyebrow, title, description }) {
  return <div className="kb-section-intro"><div><Label>{number} / {eyebrow}</Label><h2>{title}</h2></div><p>{description}</p></div>;
}
function Workbench() {
  const [threshold, setThreshold] = useState(0.5);
  const [group, setGroup] = useState("All");
  const data = useMemo(() => fictionalCases.filter((item) => group === "All" || item.group === group), [group]);
  const stats = useMemo(() => {
    const counts = { tp: 0, fp: 0, fn: 0, tn: 0 };
    data.forEach(({ event, score }) => {
      const selected = score >= threshold;
      if (selected && event) counts.tp += 1;
      else if (selected) counts.fp += 1;
      else if (event) counts.fn += 1;
      else counts.tn += 1;
    });
    const { tp, fp, fn, tn } = counts;
    return { ...counts, n: data.length, reviews: tp + fp, recall: tp + fn ? tp / (tp + fn) : 0, precision: tp + fp ? tp / (tp + fp) : 0, accuracy: data.length ? (tp + tn) / data.length : 0 };
  }, [data, threshold]);
  const bins = Array.from({ length: 10 }, (_, bin) => {
    const inBin = data.filter(({ score }) => Math.min(9, Math.floor(score * 10)) === bin);
    return { positive: inBin.filter((c) => c.event).length, negative: inBin.filter((c) => !c.event).length };
  });
  const maxBin = Math.max(1, ...bins.map((b) => b.positive + b.negative));
  const percent = (num) => Math.round(num * 100) + "%";
  return <div className="kb-workbench" id="threshold-lab">
    <div className="kb-workbench-head"><div><Label light>Live calculation / synthetic cases</Label><h3>Move the decision boundary.</h3><p>A score is not a decision. A threshold changes which cases receive attention—and which are missed.</p></div><span className="kb-live"><i aria-hidden="true" /> Interactive</span></div>
    <div className="kb-workbench-main">
      <div className="kb-workbench-plot">
        <div className="kb-plot-head"><span>Score distribution / {group === "All" ? "all fictional cases" : "fictional group " + group}</span><span>{stats.n} cases</span></div>
        <svg role="img" aria-label={"Histogram of synthetic model scores in ten score bands. Threshold " + threshold.toFixed(2)} viewBox="0 0 700 270" preserveAspectRatio="xMidYMid meet">
          {[0, 1, 2, 3, 4].map((t) => <line key={t} x1="36" x2="677" y1={217 - t * 43} y2={217 - t * 43} stroke="#547279" strokeOpacity=".38" strokeDasharray="3 6" />)}
          {bins.map((b, i) => {
            const barH1 = b.negative / maxBin * 170;
            const barH2 = b.positive / maxBin * 170;
            const x = 42 + i * 63.5;
            return <g key={i}><rect x={x} y={217 - barH1} width="43" height={barH1} fill="#80a8ad" /><rect x={x} y={217 - barH1 - barH2} width="43" height={barH2} fill="#e7ad7c" /><text x={x + 21.5} y="242" textAnchor="middle" fill="#afc8c9" fontSize="13">{(i / 10).toFixed(1)}</text></g>;
          })}
          <line x1={42 + threshold * 635} x2={42 + threshold * 635} y1="18" y2="218" stroke="#fff4dc" strokeWidth="2" strokeDasharray="5 5" />
          <text x={Math.min(633, Math.max(42, 42 + threshold * 635 - 36))} y="14" fill="#fff4dc" fontSize="12">Cutoff {threshold.toFixed(2)}</text>
        </svg>
        <div className="kb-legend"><span><i className="kb-dot kb-dot-negative" /> Fictional non-events</span><span><i className="kb-dot kb-dot-positive" /> Fictional events</span><span>Right of line → selected for review</span></div>
        <p className="kb-chart-note">A deterministic teaching dataset of 240 fictional cases, generated in the site. Bars count cases; they do not represent a trained or validated model.</p>
      </div>
      <div className="kb-workbench-controls">
        <div className="kb-control-top"><label htmlFor="kb-threshold">Review threshold</label><output htmlFor="kb-threshold">{threshold.toFixed(2)}</output></div>
        <input id="kb-threshold" aria-describedby="kb-threshold-help" type="range" min="0.2" max="0.8" step="0.05" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} />
        <div className="kb-range-ends"><span>Review more</span><span>Review fewer</span></div>
        <p id="kb-threshold-help" className="kb-control-explain">Cases with a score at or above this value are flagged. Moving right usually reduces workload, but may miss more real events.</p>
        <fieldset className="kb-group-field"><legend>Inspect subgroup</legend><div>{["All", "A", "B"].map((value) => <button type="button" key={value} className={group === value ? "kb-selected" : ""} aria-pressed={group === value} onClick={() => setGroup(value)}>{value === "All" ? "Everyone" : "Group " + value}</button>)}</div></fieldset>
        <div className="kb-metric-row"><div><span>Flagged for review</span><strong>{stats.reviews}<small> / {stats.n}</small></strong></div><div><span>Events recovered / recall</span><strong>{percent(stats.recall)}</strong></div></div>
        <div className="kb-metric-row"><div><span>Precision</span><strong>{percent(stats.precision)}</strong></div><div><span>Accuracy</span><strong>{percent(stats.accuracy)}</strong></div></div>
        <p className="kb-method-link">Not all good-looking metrics answer the same question. <a href={base + "ai-evaluation/index.html"}>Open the full AI evaluation study ↗</a></p>
      </div>
    </div>
    <div className="kb-confusion" aria-label="Confusion matrix">
      <div><span>Found events / TP</span><strong>{stats.tp}</strong></div><div><span>False alarms / FP</span><strong>{stats.fp}</strong></div><div><span>Missed events / FN</span><strong>{stats.fn}</strong></div><div><span>Correct non-events / TN</span><strong>{stats.tn}</strong></div>
    </div>
    <div className="kb-workbench-foot"><strong>What this experiment does not show</strong><p>The scores and event labels are constructed, not learned from real observations. These two fictional groups do not establish fairness or clinical safety. Real deployment requires representative data, calibration, error costs, drift monitoring and human accountability.</p></div>
  </div>;
}

export default function PortfolioLab() {
  const [filter, setFilter] = useState("All");
  const [activeStudio, setActiveStudio] = useState("governance");
  const [showStudio, setShowStudio] = useState(false);
  const visible = collection.filter((p) => filter === "All" || (filter === "Research" ? ["Atlas", "Visual essay", "Writing & analysis"].includes(p.type) : filter === "Code" ? ["Research software", "Spatial software", "Analytical prototype", "AI & computing"].includes(p.type) : ["AI experiment", "Analytical experiment", "Monitoring & evaluation"].includes(p.type)));
  const studio = studioOptions.find((item) => item.id === activeStudio) ?? studioOptions[0];
  const StudioComponent = studio.component;
  return <div className="kb-site kb-independent-site" id="top">
    <a className="kb-skip" href="#main">Skip to content</a>
    <header className="kb-header">
      <a href="#top" className="kb-identity" aria-label="Kabiri Bule, home"><span className="kb-logo">KB<span>.</span></span><span className="kb-id-text">Kabiri Bule<small>Independent research · data · technology</small></span></a>
      <nav aria-label="Primary navigation"><a href="#work">Experiences</a><a href="#collection">Collection</a><a href="#decision-environments">Laboratory</a><a href="#writing">Methods</a><a href="#about">About</a><a className="kb-nav-contact" href="#contact">Contact <span aria-hidden="true">↗</span></a></nav>
    </header>

    <main id="main">
      <IndependentOpening />

      <section className="kb-experience-entrances" id="work">
        <div className="kb-entrance-header"><Label>02 / Explore the lab</Label><h2>Three questions. <em>Three ways to investigate.</em></h2><p>Choose an analytical question and work through the reasoning. These are explicitly synthetic experiments, with calculations you can change, scrutinise and challenge.</p></div>
        <div className="kb-entrance-grid">
          <a href="#/dashboard" className="kb-entrance-feature"><span className="kb-entrance-id">01 / System Signals Room · Working dashboard</span><DashboardPreview /><div className="kb-entrance-content"><h3>The System <em>Signals Room.</em></h3><p>Explore six fictional districts, compare a scenario with its unchanged baseline, trace queue pressures and inspect the calculation behind every result.</p><span>Open the decision environment ↗</span></div></a>
          <a href="#/experiment" className="kb-entrance-side"><span>02 / Statistical experiment</span><div className="kb-entrance-symbol"><strong>+8 pp</strong><i>≠</i><strong>−16 pp</strong></div><h3>When the average gets the story wrong.</h3><p>Make Simpson's paradox appear by changing the composition of two comparison groups.</p><b>Run the experiment ↗</b></a>
          <a href="#/monitoring" className="kb-entrance-side"><span>03 / Monitoring, evaluation & learning</span><div className="kb-entrance-mel-steps"><span>Input</span><span>Output</span><span>Outcome</span></div><h3>From activity to credible evidence.</h3><p>Turn a fictional budget into a results chain, then ask what can actually be attributed.</p><b>Enter the M&E lab ↗</b></a>
        </div>
      </section>

      <section className="kb-lab-section" id="laboratory">
        <div className="kb-lab-intro"><div><Label light>03 / AI evaluation studio</Label><h2>Before the model <em>goes live.</em></h2></div><p>A model's reported accuracy is rarely the end of the story. Try this smaller calculation, then enter the larger evaluation case study for a more demanding set of questions.</p></div>
        <Workbench />
        <div className="kb-lab-outro"><div><h3>The larger case study</h3><p>Inspect a separate 2,600-case fictional claims experiment with threshold changes, subgroup comparisons, workload assumptions and deployment cautions.</p></div><ArrowLink href={base + "ai-evaluation/index.html"}>Enter the full evaluation laboratory</ArrowLink></div>
      </section>

      <section className="kb-collection" id="collection">
        <SectionIntro number="04" eyebrow="Independent technology collection" title={<>Built to be questioned. <em>Not merely admired.</em></>} description="Working synthetic laboratories and personal code experiments, clearly separated from collaborative institutional research. Each entry leads to software you can actually inspect." />
        <div className="kb-collection-toolbar"><div className="kb-filter-buttons" role="group" aria-label="Filter projects">{["All","Code","AI experiment"].map((value) => <button key={value} type="button" aria-pressed={filter === value} className={filter === value ? "kb-filter-active" : ""} onClick={() => setFilter(value)}>{value === "All" ? "All work" : value}</button>)}</div><span>{visible.length} entries</span></div>
        <div className="kb-project-list">{visible.map((item, i) => <article className="kb-project" key={item.id}><span className="kb-project-no">{String(i + 1).padStart(2, "0")}</span><div className="kb-project-main"><span className="kb-project-type">{item.type} <span>·</span> {item.state}</span><h3>{item.title}</h3><p>{item.line}</p></div><a className="kb-project-go" href={item.href} aria-label={item.action + ": " + item.title}><span>{item.action}</span><span aria-hidden="true">↗</span></a></article>)}</div>
      </section>

      <section className="kb-studios" id="experiments">
        <SectionIntro number="05" eyebrow="Working prototypes" title={<>A laboratory for <em>asking better questions.</em></>} description="Four preserved React experiments with fictional inputs. These are exploratory interfaces—not deployed decision systems or estimates of actual institutions." />
        <div className="kb-studio-top"><div className="kb-studio-tabs" role="group" aria-label="Select experiment">{studioOptions.map((item) => <button type="button" key={item.id} className={activeStudio === item.id ? "kb-tab-active" : ""} aria-pressed={activeStudio === item.id} onClick={() => { setActiveStudio(item.id); setShowStudio(false); }}>{item.title}</button>)}</div><div className="kb-studio-read"><span>Selected prototype</span><h3>{studio.title}</h3><p>{studio.note}</p><button className="kb-solid-link" type="button" onClick={() => setShowStudio((prev) => !prev)} aria-expanded={showStudio} aria-controls="kb-studio-panel">{showStudio ? "Close experiment ↑" : "Open experiment ↘"}</button></div></div>
        {showStudio && <div id="kb-studio-panel" className="kb-studio-shell" key={studio.id}><StudioComponent /></div>}
        <p className="kb-studio-caption">These existing studios are retained from the previous React implementation. Their controls manipulate simulated scenarios; their maps, indicators and scores should not be interpreted as empirical claims.</p>
      </section>

      <section className="kb-writing" id="writing"><div className="kb-writing-head"><Label>06 / Working notes</Label><h2>Behind every calculation, <em>a choice.</em></h2><p>The software is only part of the work. The interesting questions are what deserves measuring, what a model leaves out, and which conclusions survive critical scrutiny.</p></div><div className="kb-writing-columns">
        <a href="#/dashboard"><span>Method / simulation</span><h3>Why model a backlog?</h3><p>A transparent stock-and-flow model helps separate arriving work, completed work and unresolved cases. It is a teaching exercise, not a forecast.</p><b>Explore the model ↗</b></a>
        <a href="#/experiment"><span>Method / statistical reasoning</span><h3>When comparisons reverse.</h3><p>Inspect a numerical paradox that shows why pooled results can conflict with within-group patterns.</p><b>Try the comparison ↗</b></a>
        <a href="https://github.com/KabiriB/kabiri-bule-portfolio"><span>Open code / process</span><h3>How the work is made.</h3><p>Explore the React source, synthetic datasets, equations, test scripts and the evolving design decisions behind this laboratory.</p><b>See the repository ↗</b></a>
      </div><p className="kb-rights-note">Collaborative institutional projects and publications are intentionally not reproduced here while ownership, permission and attribution arrangements are being reviewed.</p></section>

      <section className="kb-about" id="about"><div><Label light>07 / About this practice</Label><h2>Serious questions. <em>Inventive methods.</em></h2></div><div><p>I am Kabiri Bule, an urban researcher working at the intersection of statistical reasoning, spatial analysis, decision intelligence and software. I care about the consequences of our analytical choices: what we measure, what we leave out, and how evidence enters a real decision.</p><p>This independent laboratory is a space to translate that thinking into inspectable software. The interactive examples are synthetic demonstrators, developed and tested through an AI-assisted engineering workflow. They are not institutionally commissioned deployments.</p><div className="kb-method-tags"><span>Quantitative research</span><span>Survey methods</span><span>Spatial analysis</span><span>Statistical computing</span><span>React & visualisation</span><span>AI evaluation experiments</span></div></div></section>
      <footer className="kb-footer" id="contact"><div><Label light>08 / Contact</Label><h2>Have a difficult question <em>worth working on?</em></h2><p>Research collaborations, analytical work, technical experiments and thoughtful conversations are welcome.</p><a className="kb-footer-email" href="mailto:kabiri.bule@gmail.com">kabiri.bule@gmail.com <span aria-hidden="true">↗</span></a></div><div className="kb-footer-bottom"><span>© {new Date().getFullYear()} Kabiri Bule</span><span>Made to be explored, not merely scrolled.</span><a href={repoUrl + "kabiri-bule-portfolio"}>Source / GitHub ↗</a><a href="#top">Back to top ↑</a></div></footer>
    </main>
  </div>;
}