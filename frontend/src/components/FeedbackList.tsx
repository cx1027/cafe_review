import type { FeedbackResponse } from '../types/feedback'

interface FeedbackListProps {
  entries: FeedbackResponse[]
  status: 'loading' | 'error' | 'success'
  error: string
}

function formatDate(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function FeedbackCard({ entry }: { entry: FeedbackResponse }) {
  return (
    <article className="feedback-card">
      <header className="card-header">
        <span className="card-email">{entry.email}</span>
        <span className="card-rating" aria-label={`Rating: ${entry.rating} out of 5`}>
          {'★'.repeat(entry.rating)}
          {'☆'.repeat(5 - entry.rating)}
        </span>
      </header>
      <p className="card-comment">{entry.comment}</p>
      <footer className="card-footer">
        <span className="card-aspect">Favorite: {entry.favorite_aspect}</span>
        <time className="card-date" dateTime={entry.created_at}>
          {formatDate(entry.created_at)}
        </time>
      </footer>
    </article>
  )
}

export function FeedbackList({ entries, status, error }: FeedbackListProps) {
  if (status === 'loading') {
    return (
      <section className="feedback-list">
        <h2>Recent Feedback</h2>
        <p className="list-loading">Loading feedback...</p>
      </section>
    )
  }

  if (status === 'error') {
    return (
      <section className="feedback-list">
        <h2>Recent Feedback</h2>
        <p className="list-error" role="alert">
          Failed to load feedback. {error}
        </p>
      </section>
    )
  }

  return (
    <section className="feedback-list">
      <h2>Recent Feedback</h2>
      {entries.length === 0 ? (
        <p className="list-empty">No feedback yet. Be the first to share your experience!</p>
      ) : (
        <ul className="list-items">
          {entries.map((entry) => (
            <li key={entry.id}>
              <FeedbackCard entry={entry} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
