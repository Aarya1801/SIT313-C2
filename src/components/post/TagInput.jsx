import { useState } from 'react'

const MAX_TAGS = 3

function TagInput({ id, value, onChange, error }) {
  const [draftTag, setDraftTag] = useState('')
  const [inputError, setInputError] = useState('')
  const isAtLimit = value.length >= MAX_TAGS
  const displayedError = inputError || error
  const errorId = `${id}-error`
  const hintId = `${id}-hint`

  function addTag() {
    const newTag = draftTag.trim()

    if (!newTag) {
      setInputError('Enter a tag before adding it.')
      return
    }

    if (isAtLimit) {
      setInputError('You can add a maximum of 3 tags.')
      return
    }

    if (value.some((tag) => tag.toLowerCase() === newTag.toLowerCase())) {
      setInputError('That tag has already been added.')
      return
    }

    onChange([...value, newTag])
    setDraftTag('')
    setInputError('')
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault()
      addTag()
    }
  }

  function removeTag(tagToRemove) {
    onChange(value.filter((tag) => tag !== tagToRemove))
    setInputError('')
  }

  return (
    <div className="post-field tag-input">
      <label htmlFor={id}>Tags</label>

      <div className="tag-entry-row">
        <input
          id={id}
          type="text"
          value={draftTag}
          onChange={(event) => {
            setDraftTag(event.target.value)
            setInputError('')
          }}
          onKeyDown={handleKeyDown}
          maxLength={30}
          placeholder={isAtLimit ? 'Maximum tags reached' : 'Add a tag and press Enter'}
          disabled={isAtLimit}
          aria-invalid={Boolean(displayedError)}
          aria-describedby={`${hintId}${displayedError ? ` ${errorId}` : ''}`}
        />
        <button type="button" onClick={addTag} disabled={isAtLimit}>
          Add tag
        </button>
      </div>

      <div className="tag-meta" id={hintId}>
        <span>Use short, relevant keywords.</span>
        <span>{value.length} / {MAX_TAGS} tags</span>
      </div>

      {value.length > 0 && (
        <ul className="tag-list" aria-label="Added tags">
          {value.map((tag) => (
            <li className="tag-chip" key={tag.toLowerCase()}>
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                aria-label={`Remove ${tag} tag`}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}

      {displayedError && <p className="field-error" id={errorId}>{displayedError}</p>}
    </div>
  )
}

export default TagInput
