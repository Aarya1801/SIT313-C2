import tutorials from '../data/tutorials'
import TutorialCard from './TutorialCard'

function FeaturedTutorials() {
  return (
    <section className="featured-section" id="tutorials">
      <div className="section-heading">
        <div>
          <p className="kicker">LEARN BY DOING</p>
          <h2>Featured Tutorials</h2>
        </div>
        <p>Clear, practical walkthroughs for skills you can use in your next project.</p>
      </div>

      <div className="card-grid">
        {tutorials.map((tutorial) => (
          <TutorialCard key={tutorial.id} tutorial={tutorial} />
        ))}
      </div>

      <div className="section-action">
        <button className="outline-button" type="button">See all tutorials</button>
      </div>
    </section>
  )
}

export default FeaturedTutorials
