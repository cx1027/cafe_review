import { useState, useEffect } from 'react'
import type { FeedbackFormData, FeedbackErrors } from '../types/feedback'
import type { SubmitStatus } from '../hooks/useFeedback'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const RATING_OPTIONS = [1, 2, 3, 4, 5] as const
const ASPECT_OPTIONS = ['Food', 'Coffee', 'Service', 'Atmosphere'] as const

interface FeedbackFormProps {
  submitStatus: SubmitStatus
  onSubmit: (data: FeedbackFormData) => void
}

function validate(data: FeedbackFormData): FeedbackErrors {
  const errors: FeedbackErrors = {}

  if (!data.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!EMAIL_REGEX.test(data.email)) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!data.comment.trim()) {
    errors.comment = 'Comment is required.'
  }

  if (data.rating === '') {
    errors.rating = 'Rating is required.'
  }

  if (!data.favorite_aspect) {
    errors.favorite_aspect = 'Favorite aspect is required.'
  }

  return errors
}

export function FeedbackForm({ submitStatus, onSubmit }: FeedbackFormProps) {
  const [formData, setFormData] = useState<FeedbackFormData>({
    email: '',
    comment: '',
    rating: '',
    favorite_aspect: '',
  })

  const [errors, setErrors] = useState<FeedbackErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (submitStatus === 'success') {
      setFormData({ email: '', comment: '', rating: '', favorite_aspect: '' })
      setErrors({})
      setTouched({})
    }
  }, [submitStatus])

  const handleChange = (field: keyof FeedbackFormData, value: string | number) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value }
      if (touched[field]) {
        const newErrors = validate(next)
        setErrors((prevErrors) => ({ ...prevErrors, [field]: newErrors[field] }))
      }
      return next
    })
  }

  const handleBlur = (field: keyof FeedbackFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const newErrors = validate(formData)
    setErrors((prev) => ({ ...prev, [field]: newErrors[field] }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const allTouched = { email: true, comment: true, rating: true, favorite_aspect: true }
    setTouched(allTouched)
    const newErrors = validate(formData)
    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData)
    }
  }

  const isSubmitting = submitStatus === 'loading'

  return (
    <form onSubmit={handleSubmit} noValidate data-testid="feedback-form" className="feedback-form">
      <div className={`form-group${errors.email && touched.email ? ' has-error' : ''}`}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          disabled={isSubmitting}
        />
        {errors.email && touched.email && (
          <span role="alert" className="field-error">{errors.email}</span>
        )}
      </div>

      <div className={`form-group${errors.comment && touched.comment ? ' has-error' : ''}`}>
        <label htmlFor="comment">Comment</label>
        <textarea
          id="comment"
          value={formData.comment}
          onChange={(e) => handleChange('comment', e.target.value)}
          onBlur={() => handleBlur('comment')}
          disabled={isSubmitting}
        />
        {errors.comment && touched.comment && (
          <span role="alert" className="field-error">{errors.comment}</span>
        )}
      </div>

      <div className={`radio-group${errors.rating ? ' has-error' : ''}`}>
        <span className="form-group-label">Rating</span>
        <div className="radio-row">
          {RATING_OPTIONS.map((r) => (
            <label key={r} className="radio-row">
              <input
                type="radio"
                name="rating"
                value={r}
                checked={formData.rating === r}
                onChange={() => handleChange('rating', r)}
                onBlur={() => handleBlur('rating')}
                disabled={isSubmitting}
              />
              <span>{r}</span>
            </label>
          ))}
        </div>
        {errors.rating && (
          <span role="alert" className="field-error">{errors.rating}</span>
        )}
      </div>

      <div className={`radio-group${errors.favorite_aspect ? ' has-error' : ''}`}>
        <span className="form-group-label">Favorite Aspect</span>
        <div className="radio-row">
          {ASPECT_OPTIONS.map((aspect) => (
            <label key={aspect} className="radio-row">
              <input
                type="radio"
                name="favorite_aspect"
                value={aspect}
                checked={formData.favorite_aspect === aspect}
                onChange={() => handleChange('favorite_aspect', aspect)}
                onBlur={() => handleBlur('favorite_aspect')}
                disabled={isSubmitting}
              />
              <span>{aspect}</span>
            </label>
          ))}
        </div>
        {errors.favorite_aspect && (
          <span role="alert" className="field-error">{errors.favorite_aspect}</span>
        )}
      </div>

      <button
        type="submit"
        className="submit-button"
        disabled={isSubmitting}
        data-testid="submit-button"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  )
}
