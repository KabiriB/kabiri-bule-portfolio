import { useMemo, useState } from "react";
import ExecutiveSignalRoom from "./components/ExecutiveSignalRoom";
import GovernancePressureObservatory from "./components/GovernancePressureObservatory";
import ResourceConversionLab from "./components/ResourceConversionLab";
import RetailStrainSimulator from "./components/RetailStrainSimulator";
import "./App.css";
import "./PortfolioLab.css";

const base = import.meta.env.BASE_URL;
const projectUrl = "https://kabirib.github.io/";
const repoUrl = "https://github.com/KabiriB/";

const collection = [
  { id: "musina", type: "Atlas", state: "Published", title: "Musina in Motion", line: "Survey geography, mobility, settlement, services and narrated journeys in a South African border town.", href: projectUrl + "musina-in-motion/", action: "Explore atlas" },
  { id: "elsewheres", type: "Visual essay", state: "Published", title: "The City Does Not Contain the Life", line: "Photography, writing and an atlas of relationships reaching beyond Accra, Johannesburg and Nairobi.", href: projectUrl + "urban-temporalities-visual-essay/", action: "Read the essay" },
  { id: "signals", type: "Writing & analysis", state: "Published site", title: "Signals & Structure", line: "Research-informed writing, spatial analysis and analytical visualisation.", href: projectUrl + "Signals-and-Structure/", action: "Visit publication" },
  { id: "evaluation", type: "AI experiment", state: "Working prototype", title: "Before the Model Goes Live", line: "A synthetic exercise in thresholds, error types, workload and deployment judgement.", href: base + "ai-evaluation/index.html", action: "Open evaluation lab" },
  { id: "onelife", type: "Research software", state: "Repository", title: "One Life, Many Geographies", line: "An exploratory project in mobility and the spatial reach of a life. See the repository for its current state.", href: repoUrl + "one-life-many-geographies", action: "Inspect source" },
  { id: "study", type: "Spatial software", state: "Repository", title: "Study Geography Atlas", line: "Mapping experiments in the geography and presentation of comparative urban research.", href: repoUrl + "study-geography-atlas", action: "Inspect source" },
  { id: "explorer", type: "Spatial software", state: "Repository", title: "Urban Mobility Explorer", line: "A repository exploring ways of representing urban mobility through software.", href: repoUrl + "urban-mobility-explorer", action: "Inspect source" },
  { id: "uncertainty", type: "Analytical prototype", state: "Repository", title: "Atlas of Uncertainty & Trust", line: "An experiment in making uncertainty and institutional trust legible. Functionality is not independently validated here.", href: repoUrl + "atlas-uncertainty-trust-feature", action: "Inspect source" },
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
  const [lens, setLens] = useState("geography");
  const [filter, setFilter] = useState("All");
  const [activeStudio, setActiveStudio] = useState("governance");
  const [showStudio, setShowStudio] = useState(false);
  const visible = collection.filter((p) => filter === "All" || (filter === "Research" ? ["Atlas", "Visual essay", "Writing & analysis"].includes(p.type) : filter === "Code" ? ["Research software", "Spatial software", "Analytical prototype", "AI & computing"].includes(p.type) : p.type === "AI experiment"));
  const studio = studioOptions.find((item) => item.id === activeStudio) ?? studioOptions[0];
  const StudioComponent = studio.component;
  const lenses = {
    geography: { title: "The geography of a study", body: "The six study wards provide a spatial frame for asking where different patterns of settlement and mobility appear. These are real ward outlines, not respondent locations.", footer: "Evidence shown: geographic boundaries only" },
    journeys: { title: "The life that crosses the map", body: "The published atlas also brings selected pseudonymised narratives into conversation with aggregate survey evidence. A journey is a sequence of decisions and relationships, not simply a line on a map.", footer: "Explore the atlas for the narrated journeys" },
    limits: { title: "What the map cannot tell us", body: "A ward boundary does not reveal why someone moved, what a service encounter felt like, or where an individual lives. The atlas distinguishes aggregate patterns from interpreted qualitative accounts.", footer: "No respondent coordinates are shown" }
  };
  return <div className="kb-site" id="top">
    <a className="kb-skip" href="#main">Skip to content</a>
    <header className="kb-header">
      <a href="#top" className="kb-identity" aria-label="Kabiri Bule, home"><span className="kb-logo">KB<span>.</span></span><span className="kb-id-text">Kabiri Bule<small>Independent research · data · technology</small></span></a>
      <nav aria-label="Primary navigation"><a href="#work">Selected work</a><a href="#collection">Collection</a><a href="#laboratory">Laboratory</a><a href="#writing">Writing</a><a href="#about">About</a><a className="kb-nav-contact" href="#contact">Contact <span aria-hidden="true">↗</span></a></nav>
    </header>

    <main id="main">
      <section className="kb-hero" aria-labelledby="kb-hero-title">
        <div className="kb-hero-top"><Label>Issue 01 / An atlas of questions</Label><span>Research, mathematics, software and the life between them</span></div>
        <div className="kb-hero-grid">
          <div className="kb-hero-copy"><p className="kb-overline">From the field to the model</p><h1 id="kb-hero-title">What does the evidence <em>let us see?</em></h1><p className="kb-hero-lede">I study cities, movement and institutions. I also build maps, statistical tools and software to test what our explanations can—and cannot—support.</p><p className="kb-hero-support">This is a working collection of research, visual stories, analytical experiments and unfinished questions. You can read it, explore it, or examine the code.</p><div className="kb-hero-actions"><a className="kb-solid-link" href="#work">Enter the work <span aria-hidden="true">↘</span></a><a className="kb-under-link" href="#threshold-lab">Try an experiment ↗</a></div></div>
          <div className="kb-hero-figure">
            <div className="kb-figure-top"><span>Field note / Musina, South Africa</span><span>01 — 03</span></div>
            <img src={base + "assets/musina-study-geography.svg"} width="640" height="480" alt="Actual outlines of six study wards in Musina, South Africa; no individual locations are depicted." />
            <div className="kb-figure-bottom"><span>Survey geography / ward outlines</span><span>Not individual addresses or routes</span></div>
          </div>
        </div>
        <div className="kb-hero-bottom"><span><i /> Current inquiry</span><p>How can we connect patterns visible in data with the lives and mechanisms that produce them?</p><a href="#work" aria-label="Continue to selected research">↓</a></div>
      </section>

      <section className="kb-feature kb-musina" id="work">
        <SectionIntro number="01" eyebrow="Featured research" title={<>A border town is not simply <em>a point on a map.</em></>} description="Musina in Motion is an interactive atlas built from survey geography and selected narrated journeys. Explore what spatial patterns can show—and what they leave unanswered." />
        <div className="kb-musina-grid">
          <div className="kb-lens"><div className="kb-lens-select" role="group" aria-label="Three ways to read Musina">{[["geography","01 / Place"],["journeys","02 / Journey"],["limits","03 / Limit"]].map(([key, label]) => <button type="button" className={lens === key ? "kb-on" : ""} key={key} aria-pressed={lens === key} onClick={() => setLens(key)}>{label}</button>)}</div><div className="kb-lens-copy" aria-live="polite"><Label>Reading the evidence</Label><h3>{lenses[lens].title}</h3><p>{lenses[lens].body}</p><span>{lenses[lens].footer}</span></div><div className="kb-feature-actions"><ArrowLink href={projectUrl + "musina-in-motion/"}>Enter the published atlas</ArrowLink><a href={projectUrl + "musina-in-motion/acknowledgements.html"}>Research team & acknowledgements ↗</a></div></div>
          <figure className="kb-musina-figure"><img src={base + "assets/musina-study-geography.svg"} width="640" height="480" loading="lazy" alt="Six study ward polygons in the Musina area. The image contains no household points." /><figcaption>Study geography adapted from the public Musina atlas. No respondent locations or survey values are plotted. <a href="https://github.com/KabiriB/musina-in-motion/blob/efda79657f49e94702ff72ba5d8fc7f8f26c727e/public/data/musina_wards_1_6_official_app_ready_v3_QA_PATCHED.geojson">View source geometry ↗</a></figcaption></figure>
        </div>
      </section>

      <section className="kb-essay" aria-labelledby="kb-essay-title">
        <figure><img src={base + "assets/visual-essay-detail.jpg"} width="1000" height="526" loading="lazy" alt="Street scene from the published visual essay, showing people beside a parked car." /><figcaption>Accra street photograph: Loren Landau. Reproduced from the published visual essay.</figcaption></figure><div className="kb-essay-text"><Label>02 / Visual scholarship</Label><h2 id="kb-essay-title">The city does not contain <em>the life.</em></h2><p className="kb-serif-line">A life rarely fits inside one city's boundaries.</p><p>Across Accra, Johannesburg and Nairobi, this visual essay follows relationships, memories and commitments that extend beyond the places people inhabit. The publication pairs photography, interpretive writing and an Atlas of Urban Elsewheres.</p><ArrowLink href={projectUrl + "urban-temporalities-visual-essay/"}>Read the visual essay</ArrowLink><span className="kb-marginalia">Published visual essay / Kabiri N. Bule</span></div>
      </section>

      <section className="kb-lab-section" id="laboratory">
        <div className="kb-lab-intro"><div><Label light>03 / Statistical & AI laboratory</Label><h2>Before the model <em>goes live.</em></h2></div><p>A model's reported accuracy is rarely the end of the story. Try this smaller calculation, then enter the larger evaluation case study for a more demanding set of questions.</p></div>
        <Workbench />
        <div className="kb-lab-outro"><div><h3>The larger case study</h3><p>Inspect a separate 2,600-case fictional claims experiment with threshold changes, subgroup comparisons, workload assumptions and deployment cautions.</p></div><ArrowLink href={base + "ai-evaluation/index.html"}>Enter the full evaluation laboratory</ArrowLink></div>
      </section>

      <section className="kb-collection" id="collection">
        <SectionIntro number="04" eyebrow="Research & technology collection" title={<>Work at different stages <em>of becoming.</em></>} description="Published experiences are distinguished from repositories and working prototypes. Open the actual work; source links are provided where a finished public interface is not claimed." />
        <div className="kb-collection-toolbar"><div className="kb-filter-buttons" role="group" aria-label="Filter projects">{["All","Research","Code","AI experiment"].map((value) => <button key={value} type="button" aria-pressed={filter === value} className={filter === value ? "kb-filter-active" : ""} onClick={() => setFilter(value)}>{value === "All" ? "All work" : value}</button>)}</div><span>{visible.length} entries</span></div>
        <div className="kb-project-list">{visible.map((item, i) => <article className="kb-project" key={item.id}><span className="kb-project-no">{String(i + 1).padStart(2, "0")}</span><div className="kb-project-main"><span className="kb-project-type">{item.type} <span>·</span> {item.state}</span><h3>{item.title}</h3><p>{item.line}</p></div><a className="kb-project-go" href={item.href} aria-label={item.action + ": " + item.title}><span>{item.action}</span><span aria-hidden="true">↗</span></a></article>)}</div>
      </section>

      <section className="kb-studios" id="experiments">
        <SectionIntro number="05" eyebrow="Working prototypes" title={<>A laboratory for <em>asking better questions.</em></>} description="Four preserved React experiments with fictional inputs. These are exploratory interfaces—not deployed decision systems or estimates of actual institutions." />
        <div className="kb-studio-top"><div className="kb-studio-tabs" role="group" aria-label="Select experiment">{studioOptions.map((item) => <button type="button" key={item.id} className={activeStudio === item.id ? "kb-tab-active" : ""} aria-pressed={activeStudio === item.id} onClick={() => { setActiveStudio(item.id); setShowStudio(false); }}>{item.title}</button>)}</div><div className="kb-studio-read"><span>Selected prototype</span><h3>{studio.title}</h3><p>{studio.note}</p><button className="kb-solid-link" type="button" onClick={() => setShowStudio((prev) => !prev)} aria-expanded={showStudio} aria-controls="kb-studio-panel">{showStudio ? "Close experiment ↑" : "Open experiment ↘"}</button></div></div>
        {showStudio && <div id="kb-studio-panel" className="kb-studio-shell" key={studio.id}><StudioComponent /></div>}
        <p className="kb-studio-caption">These existing studios are retained from the previous React implementation. Their controls manipulate simulated scenarios; their maps, indicators and scores should not be interpreted as empirical claims.</p>
      </section>

      <section className="kb-writing" id="writing"><div className="kb-writing-head"><Label>06 / Notes, writing & publications</Label><h2>Arguments have lives <em>beyond the chart.</em></h2><p>Some questions are best answered with a model. Others require a fieldnote, a photograph, or a careful paragraph about what the evidence cannot settle.</p></div><div className="kb-writing-columns"><a href={projectUrl + "Signals-and-Structure/"}><span>Online collection / published site</span><h3>Signals & Structure</h3><p>Research-informed writing, spatial analysis and analytical visualisation.</p><b>Browse writing ↗</b></a><a href={projectUrl + "urban-temporalities-visual-essay/"}><span>Published visual scholarship</span><h3>The City Does Not Contain the Life</h3><p>An authored encounter with the spatial limits of urban life and belonging.</p><b>Read publication ↗</b></a><a href={repoUrl + "kabiri-bule-portfolio"}><span>Open code / selected repositories</span><h3>The methods behind the surfaces</h3><p>Explore how research questions are translated into interfaces, simulations and software.</p><b>Browse GitHub ↗</b></a></div></section>

      <section className="kb-about" id="about"><div><Label light>07 / About this practice</Label><h2>Researcher by training. <em>Builder by curiosity.</em></h2></div><div><p>I am Kabiri Bule, an urban researcher working with statistical reasoning, spatial analysis, computational methods and visual scholarship. I care about the social life behind a measurement: how people move, where institutions fail to see them, and what good evidence can responsibly tell us.</p><p>My technical interests extend into mathematics, data science, analytical software and AI evaluation. I enjoy the whole chain—from deciding what ought to be measured to building something another person can explore and challenge.</p><div className="kb-method-tags"><span>Quantitative research</span><span>Survey methods</span><span>Spatial analysis</span><span>Statistical computing</span><span>React & visualisation</span><span>AI evaluation experiments</span></div></div></section>
      <footer className="kb-footer" id="contact"><div><Label light>08 / Contact</Label><h2>Have a difficult question <em>worth working on?</em></h2><p>Research collaborations, analytical work, technical experiments and thoughtful conversations are welcome.</p><a className="kb-footer-email" href="mailto:kabiri.bule@gmail.com">kabiri.bule@gmail.com <span aria-hidden="true">↗</span></a></div><div className="kb-footer-bottom"><span>© {new Date().getFullYear()} Kabiri Bule</span><span>Made to be explored, not merely scrolled.</span><a href={repoUrl + "kabiri-bule-portfolio"}>Source / GitHub ↗</a><a href="#top">Back to top ↑</a></div></footer>
    </main>
  </div>;
}