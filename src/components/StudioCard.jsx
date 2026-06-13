function StudioCard({ studio }) {
  return (
    <article className="studio-card card">
      <div className="studio-card-topline">
        <span>{studio.number}</span>
        <span>{studio.tag}</span>
      </div>

      <h3>{studio.title}</h3>
      <p>{studio.description}</p>

      <div className="studio-signals">
        {studio.signals.map((signal) => (
          <span key={signal}>{signal}</span>
        ))}
      </div>

      <a href={`#${studio.id}`} className="studio-link">
        Enter studio
      </a>
    </article>
  );
}

export default StudioCard;
