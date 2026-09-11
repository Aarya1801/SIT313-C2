function TutorialCard({ tutorial }) {
  return (
    <article className="content-card">
      <img className="card-image" src={tutorial.image} alt={tutorial.imageAlt} />
      <div className="card-body">
        <p className="card-type">TUTORIAL</p>
        <h3>{tutorial.title}</h3>
        <p className="card-description">{tutorial.description}</p>
        <div className="card-meta">
          <span className="rating" aria-label={`${tutorial.rating} out of 5 stars`}>
            ★ {tutorial.rating}
          </span>
          <span>@{tutorial.author}</span>
        </div>
      </div>
    </article>
  )
}

export default TutorialCard
