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
        <p className="eyebrow">About</p>
        <h2>Research-grounded, interface-oriented, decision-useful.</h2>
        <p>
          My work sits at the intersection of urban research, data science, and
          strategic communication. I design tools that help people make sense of
          complex systems: where pressure is building, where evidence is noisy,
          where institutions are struggling to respond, and where better
          questions can lead to better decisions.
        </p>
      </section>

      <section className="site-section contact-section" id="contact">
        <p className="eyebrow">Contact</p>
        <h2>
          For collaborations, advisory work, research partnerships, and
          analytical prototypes.
        </h2>
        <a className="primary-button" href="mailto:kabiri.bule@gmail.com">
          Email Kabiri
        </a>
      </section>
    </main>
  );
}

export default App;
