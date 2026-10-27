import "./Experiences.css";
export function SmallLabel({children}) { return <span className="ex-label">{children}</span>; }
export function Note({title,children}) { return <aside className="ex-note"><strong>{title}</strong><p>{children}</p></aside>; }
export function ExperienceFrame({kind,title,subtitle,tag,children}) {
  return <div className="ex-page">
    <a className="ex-skip" href="#ex-main">Skip to interactive content</a>
    <header className="ex-header">
      <a href="#top" className="ex-brand">KB<span>.</span><small>AN ATLAS OF QUESTIONS</small></a>
      <nav aria-label="Laboratory navigation"><a href="#top">Portfolio</a><a href="#/dashboard">Dashboard</a><a href="#/experiment">Statistical experiment</a><a href="#/monitoring">M&amp;E lab</a><a href="#/evaluation">AI evaluation</a></nav>
    </header>
    <main id="ex-main">
      <div className="ex-page-hero"><div className="ex-hero-top"><SmallLabel>{kind}</SmallLabel><span>{tag}</span></div><h1>{title}</h1><p>{subtitle}</p></div>
      <div className="ex-page-content">{children}</div>
    </main>
    <footer className="ex-footer"><span>Kabiri Bule / experimental methods & decision intelligence</span><span>All illustrative interfaces label synthetic data and methodological limits.</span><a href="#top">Return to portfolio ↗</a></footer>
  </div>;
}
