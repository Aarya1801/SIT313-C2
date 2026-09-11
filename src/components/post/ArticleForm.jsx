import { useState } from 'react'
import { articlePostSchema } from '../../validation/postSchemas'
import TagInput from './TagInput'

const initialForm = {
  title: '',
  abstract: '',
  articleText: '',
  tags: [],
}

function ArticleForm({ onSuccess, onEdit }) {
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState({})

  function updateField(field, value) {
    setFormData((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }))
    onEdit()
  }

  function handleSubmit(event) {
    event.preventDefault()

    const validation = articlePostSchema.safeParse(formData)

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors

      setErrors(Object.fromEntries(
        Object.entries(fieldErrors).map(([field, messages]) => [field, messages[0]]),
      ))
      return
    }

    setErrors({})
    onSuccess()
  }

  return (
    <form className="post-form" onSubmit={handleSubmit} noValidate>
      <h2>What do you want to ask or share</h2>

      <div className="post-field">
        <div className="post-label-row">
          <label htmlFor="article-title">Title</label>
          <span>{formData.title.length} / 120</span>
        </div>
        <input
          id="article-title"
          type="text"
          value={formData.title}
          onChange={(event) => updateField('title', event.target.value)}
          maxLength={120}
          placeholder="Enter a descriptive title"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'article-title-error' : undefined}
        />
        {errors.title && <p className="field-error" id="article-title-error">{errors.title}</p>}
      </div>

      <div className="post-field">
        <div className="post-label-row">
          <label htmlFor="article-abstract">Abstract</label>
          <span>{formData.abstract.length} / 500</span>
        </div>
        <textarea
          id="article-abstract"
          value={formData.abstract}
          onChange={(event) => updateField('abstract', event.target.value)}
          maxLength={500}
          rows={4}
          placeholder="Summarise your article"
          aria-invalid={Boolean(errors.abstract)}
          aria-describedby={errors.abstract ? 'article-abstract-error' : undefined}
        />
        {errors.abstract && <p className="field-error" id="article-abstract-error">{errors.abstract}</p>}
      </div>

      <div className="post-field">
        <div className="post-label-row">
          <label htmlFor="article-text">Article Text</label>
          <span>{formData.articleText.length} / 5000</span>
        </div>
        <textarea
          id="article-text"
          value={formData.articleText}
          onChange={(event) => updateField('articleText', event.target.value)}
          maxLength={5000}
          rows={12}
          placeholder="Write your article"
          aria-invalid={Boolean(errors.articleText)}
          aria-describedby={errors.articleText ? 'article-text-error' : undefined}
        />
        {errors.articleText && (
          <p className="field-error" id="article-text-error">{errors.articleText}</p>
        )}
      </div>

      <TagInput
        id="article-tags"
        value={formData.tags}
        onChange={(tags) => updateField('tags', tags)}
        error={errors.tags}
      />

      <button className="post-submit" type="submit">Post</button>
    </form>
  )
}

export default ArticleForm
