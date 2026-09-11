import articles from '../data/articles'
import ArticleCard from './ArticleCard'

function FeaturedArticles() {
  return (
    <section className="featured-section" id="articles">
      <div className="section-heading">
        <div>
          <p className="kicker">FRESH IDEAS</p>
          <h2>Featured Articles</h2>
        </div>
        <p>Ideas and perspectives to help student developers build with confidence.</p>
      </div>

      <div className="card-grid">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      <div className="section-action">
        <button className="outline-button" type="button">See all articles</button>
      </div>
    </section>
  )
}

export default FeaturedArticles
