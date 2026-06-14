function InsightCard({ item }) {
  return (
    <article className="insight-card card">
      <div className="insight-card-topline">
        <span>{item.type}</span>
        <span>{item.status}</span>
      </div>

      <h3>{item.title}</h3>
      <p>{item.description}</p>

      <div className="insight-tags">
        {item.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </article>
  );
}

export default InsightCard;
