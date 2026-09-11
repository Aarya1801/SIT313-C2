import { useState } from 'react'
import { questionPostSchema } from '../../validation/postSchemas'
import TagInput from './TagInput'

const initialForm = {
  title: '',
  description: '',
  tags: [],
}

function QuestionForm({ onSuccess, onEdit }) {
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

    const validation = questionPostSchema.safeParse(formData)

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
          <label htmlFor="question-title">Title</label>
          <span>{formData.title.length} / 120</span>
        </div>
        <input
          id="question-title"
          type="text"
          value={formData.title}
          onChange={(event) => updateField('title', event.target.value)}
          maxLength={120}
          placeholder="Start your question with how, what, why, etc."
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'question-title-error' : undefined}
        />
        {errors.title && <p className="field-error" id="question-title-error">{errors.title}</p>}
      </div>

      <div className="post-field">
        <div className="post-label-row">
          <label htmlFor="question-description">Describe your problem</label>
          <span>{formData.description.length} / 2000</span>
        </div>
        <textarea
          id="question-description"
          value={formData.description}
          onChange={(event) => updateField('description', event.target.value)}
          maxLength={2000}
          rows={9}
          placeholder="Include the details someone will need to understand and answer your question."
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? 'question-description-error' : undefined}
        />
        {errors.description && (
          <p className="field-error" id="question-description-error">{errors.description}</p>
        )}
      </div>

      <TagInput
        id="question-tags"
        value={formData.tags}
        onChange={(tags) => updateField('tags', tags)}
        error={errors.tags}
      />

      <button className="post-submit" type="submit">Post</button>
    </form>
  )
}

export default QuestionForm
