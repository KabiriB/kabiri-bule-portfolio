import "./App.css";

import Header from "./components/Header";
import Hero from "./components/Hero";
import StudioCard from "./components/StudioCard";
import ExecutiveSignalRoom from "./components/ExecutiveSignalRoom";
import GovernancePressureObservatory from "./components/GovernancePressureObservatory";
import ResourceConversionLab from "./components/ResourceConversionLab";
import RetailStrainSimulator from "./components/RetailStrainSimulator";
import InsightCard from "./components/InsightCard";
import { writingNotes } from "./data/writingNotes";
import { researchItems } from "./data/researchItems";
import { studios } from "./data/studios";

function App() {
  return (
    <main className="app-shell">
      <Header />
      <Hero />

      <section className="site-section studios-section" id="studios">
        <div className="section-heading">
          <p className="eyebrow">Decision Studios</p>
          <h2>Prototype environments for reading complex systems.</h2>
          <p className="section-kicker">
            Each studio is designed as a custom decision environment: part
            analytical interface, part briefing room, part interpretive tool.
          </p>
        </div>

        <div className="studios-grid">
          {studios.map((studio) => (
            <StudioCard key={studio.id} studio={studio} />
          ))}
        </div>
      </section>

      <ExecutiveSignalRoom />
      <GovernancePressureObservatory />
      <ResourceConversionLab />
      <RetailStrainSimulator />

      <section className="site-section insights-section" id="writing">
        <div className="section-heading">
          <p className="eyebrow">Writing / Briefing Notes</p>
          <h2>
            Clear thinking for public, organisational, and urban problems.
          </h2>
          <p className="section-kicker">
            Briefing notes, essays, and interpretive pieces that translate
            research and analysis into usable strategic language for
            collaborators, employers, public-sector partners, and senior
            decision-makers.
          </p>
        </div>

        <div className="insights-grid">
          {writingNotes.map((item) => (
            <InsightCard key={item.title} item={item} />
          ))}
        </div>
      </section>

      <section className="site-section insights-section" id="research">
        <div className="section-heading">
          <p className="eyebrow">Research & Publications</p>
          <h2>Urban governance, migration, trust, and institutional life.</h2>
          <p className="section-kicker">
            Selected research lanes connecting African cities, civic life,
            institutional experience, spatial transformation, and
            evidence-informed governance.
          </p>
        </div>

        <div className="insights-grid">
          {researchItems.map((item) => (
            <InsightCard key={item.title} item={item} />
          ))}
        </div>
      </section>

      <section className="site-section about-section card" id="about">
        <div className="about-grid">
          <div>
            <p className="eyebrow">About</p>
            <h2>Research-grounded, interface-oriented, decision-useful.</h2>
          </div>

          <div className="about-copy">
            <p>
              I work at the intersection of urban research, data science, and
              strategic communication. My focus is not simply on producing
              charts or dashboards, but on designing analytical environments
              that help people interpret complexity and make better decisions.
            </p>

            <p>
              Across public-sector, organisational, and private-sector contexts,
              I am interested in how evidence becomes usable: how leaders read
              pressure, diagnose institutional strain, compare systems, and ask
              sharper questions before decisions harden.
            </p>

            <div className="about-capabilities">
              <span>Urban diagnostics</span>
              <span>Decision intelligence</span>
              <span>Research translation</span>
              <span>Spatial and survey analysis</span>
              <span>Analytical interface design</span>
            </div>
          </div>
        </div>
      </section>

      <section className="site-section contact-section card" id="contact">
        <div>
          <p className="eyebrow">Contact</p>
          <h2>
            Let’s connect around research, analytics, and decision intelligence.
          </h2>
          <p>
            I am open to analytical roles, research partnerships, advisory work,
            and prototype projects where evidence needs to become clearer, more
            usable, and more decision-relevant.
          </p>
        </div>

        <div className="contact-actions">
          <a className="primary-button" href="mailto:kabiri.bule@gmail.com">
            Email Kabiri
          </a>
          <span>CV and detailed project notes available on request.</span>
        </div>
      </section>
    </main>
  );
}

export default App;
