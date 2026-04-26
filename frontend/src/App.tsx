import './App.css'
import { FeedbackForm } from './components/FeedbackForm'
import { FeedbackList } from './components/FeedbackList'
import { useFeedback } from './hooks/useFeedback'

function App() {
  const {
    entries,
    loadStatus,
    loadError,
    submitStatus,
    submitError,
    handleSubmit,
  } = useFeedback()

  return (
    <main>
      <h1>Cafe Review</h1>
      <p>Share your experience at our cafe</p>

      {submitStatus === 'success' && (
        <div className="alert alert-success" role="status">
          Thank you! Your feedback has been submitted.
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="alert alert-error" role="alert">
          Failed to submit feedback. {submitError}
        </div>
      )}

      <FeedbackForm
        submitStatus={submitStatus}
        onSubmit={handleSubmit}
      />

      <FeedbackList
        entries={entries}
        status={loadStatus}
        error={loadError}
      />
    </main>
  )
}

export default App
