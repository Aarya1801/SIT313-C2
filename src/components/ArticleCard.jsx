function ArticleCard({ article }) {
  return (
    <article className="content-card">
      <img className="card-image" src={article.image} alt={article.imageAlt} />
      <div className="card-body">
        <p className="card-type">ARTICLE</p>
        <h3>{article.title}</h3>
        <p className="card-description">{article.description}</p>
        <div className="card-meta">
          <span className="rating" aria-label={`${article.rating} out of 5 stars`}>
            ★ {article.rating}
          </span>
          <span>By {article.author}</span>
        </div>
      </div>
    </article>
  )
}

export default ArticleCard
