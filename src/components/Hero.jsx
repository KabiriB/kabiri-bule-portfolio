function Hero() {
  return (
    <section className="hero site-section" id="top">
      <div className="hero-copy">
        <p className="eyebrow">
          Kabiri Bule · Urban Research · Data Science · Decision Intelligence
        </p>

        <h1>Decision intelligence for complex systems.</h1>

        <p className="hero-lede">
          I design custom analytical interfaces, research diagnostics, and
          briefing tools that help leaders read organisational health, urban
          pressure, institutional strain, and strategic opportunity with clarity.
        </p>

        <div className="hero-actions">
          <a className="primary-button" href="#studios">
            Explore decision studios
          </a>
          <a className="secondary-button" href="#contact">
            Start a conversation
          </a>
        </div>
      </div>

      <aside className="hero-panel card" aria-label="Portfolio signal summary">
        <span className="pill">Portfolio thesis</span>
        <h2>Evidence becomes useful when it is organised for judgement.</h2>
        <p>
          These studios show how research, data, and interface design can help
          people interpret systems instead of merely observing metrics.
        </p>

        <div className="signal-list">
          <div>
            <strong>Read</strong>
            <span>patterns, pressure, friction</span>
          </div>
          <div>
            <strong>Interpret</strong>
            <span>causes, trade-offs, risk</span>
          </div>
          <div>
            <strong>Act</strong>
            <span>questions, choices, next moves</span>
          </div>
        </div>
      </aside>
    </section>
  );
}

export default Hero;
