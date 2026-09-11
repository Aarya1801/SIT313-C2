import { useState } from 'react'
import ArticleForm from '../components/post/ArticleForm'
import QuestionForm from '../components/post/QuestionForm'

function PostPage() {
  const [postType, setPostType] = useState('question')
  const [isPostReceived, setIsPostReceived] = useState(false)

  function handlePostTypeChange(event) {
    setPostType(event.target.value)
    setIsPostReceived(false)
  }

  return (
    <section className="post-page">
      <div className="post-panel">
        <div className="post-heading">
          <p className="kicker">SHARE WITH THE COMMUNITY</p>
          <h1>NEW POST</h1>
        </div>

        <fieldset className="post-type-selector">
          <legend>Select Post Type:</legend>
          <div className="post-type-options">
            <label>
              <input
                type="radio"
                name="postType"
                value="question"
                checked={postType === 'question'}
                onChange={handlePostTypeChange}
              />
              <span>Question</span>
            </label>
            <label>
              <input
                type="radio"
                name="postType"
                value="article"
                checked={postType === 'article'}
                onChange={handlePostTypeChange}
              />
              <span>Article</span>
            </label>
          </div>
        </fieldset>

        {isPostReceived && (
          <div className="post-success" role="status" aria-live="polite">
            <strong>Post Received</strong>
            <span>Your post passed validation and is ready for the next step.</span>
          </div>
        )}

        {postType === 'question'
          ? (
            <QuestionForm
              onSuccess={() => setIsPostReceived(true)}
              onEdit={() => setIsPostReceived(false)}
            />
            )
          : (
            <ArticleForm
              onSuccess={() => setIsPostReceived(true)}
              onEdit={() => setIsPostReceived(false)}
            />
            )}
      </div>
    </section>
  )
}

export default PostPage
