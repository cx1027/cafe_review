import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '../src/App'
import * as api from '../src/api/feedback'

const mockFeedbackApi = api as vi.Mocked<typeof api>

vi.mock('../src/api/feedback', () => ({
  submitFeedback: vi.fn(),
  fetchFeedbackList: vi.fn(),
}))

const stubEntry = (overrides = {}) => ({
  id: 1,
  email: 'test@example.com',
  comment: 'Great coffee!',
  rating: 5,
  favorite_aspect: 'Coffee',
  created_at: '2026-04-26T10:00:00Z',
  ...overrides,
})

describe('Feedback Integration - Submit Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows success message and resets form after successful submit', async () => {
    mockFeedbackApi.submitFeedback.mockResolvedValue(stubEntry())
    mockFeedbackApi.fetchFeedbackList.mockResolvedValue([])

    render(<App />)

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'visitor@cafe.com' } })
    fireEvent.change(screen.getByLabelText(/comment/i), { target: { value: 'Loved the espresso!' } })
    fireEvent.click(screen.getByRole('radio', { name: '5' }))
    fireEvent.click(screen.getByRole('radio', { name: /coffee/i }))

    fireEvent.click(screen.getByRole('button', { name: /submit feedback/i }))

    await waitFor(() => {
      expect(screen.getByText(/thank you/i)).toBeInTheDocument()
    })

    await waitFor(() => {
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
      expect(emailInput.value).toBe('')
      const commentInput = screen.getByLabelText(/comment/i) as HTMLTextAreaElement
      expect(commentInput.value).toBe('')
    })
  })

  it('shows error message when submit fails', async () => {
    mockFeedbackApi.submitFeedback.mockRejectedValue(new Error('Server error'))
    mockFeedbackApi.fetchFeedbackList.mockResolvedValue([])

    render(<App />)

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } })
    fireEvent.change(screen.getByLabelText(/comment/i), { target: { value: 'Nice place.' } })
    fireEvent.click(screen.getByRole('radio', { name: '3' }))
    fireEvent.click(screen.getByRole('radio', { name: /service/i }))

    fireEvent.click(screen.getByRole('button', { name: /submit feedback/i }))

    await waitFor(() => {
      expect(screen.getByText(/failed to submit/i)).toBeInTheDocument()
    })
  })
})

describe('Feedback Integration - Loading State', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading indicator while submitting', async () => {
    let resolveSubmit: (value: unknown) => void
    mockFeedbackApi.submitFeedback.mockImplementation(
      () => new Promise((r) => { resolveSubmit = r })
    )
    mockFeedbackApi.fetchFeedbackList.mockResolvedValue([])

    render(<App />)

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } })
    fireEvent.change(screen.getByLabelText(/comment/i), { target: { value: 'Test' } })
    fireEvent.click(screen.getByRole('radio', { name: '4' }))
    fireEvent.click(screen.getByRole('radio', { name: /food/i }))

    fireEvent.click(screen.getByRole('button', { name: /submit feedback/i }))

    expect(screen.getByText(/submitting/i)).toBeInTheDocument()

    resolveSubmit!(stubEntry())
  })
})

describe('Feedback Integration - Empty State', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows empty state when no feedback entries exist', async () => {
    mockFeedbackApi.fetchFeedbackList.mockResolvedValue([])

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText(/no feedback yet/i)).toBeInTheDocument()
    })
  })
})

describe('Feedback Integration - Feedback List Render', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all feedback fields from the list', async () => {
    const entries = [
      stubEntry({ id: 1, email: 'alice@cafe.com', comment: 'Amazing latte', rating: 5, favorite_aspect: 'Coffee' }),
      stubEntry({ id: 2, email: 'bob@cafe.com', comment: 'Good food', rating: 4, favorite_aspect: 'Food' }),
    ]
    mockFeedbackApi.fetchFeedbackList.mockResolvedValue(entries)

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('alice@cafe.com')).toBeInTheDocument()
      expect(screen.getByText('Amazing latte')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(screen.getByText('Coffee')).toBeInTheDocument()

      expect(screen.getByText('bob@cafe.com')).toBeInTheDocument()
      expect(screen.getByText('Good food')).toBeInTheDocument()
      expect(screen.getByText('4')).toBeInTheDocument()
      expect(screen.getByText('Food')).toBeInTheDocument()
    })
  })

  it('renders created_at timestamp for each entry', async () => {
    mockFeedbackApi.fetchFeedbackList.mockResolvedValue([
      stubEntry({ id: 1, created_at: '2026-04-26T10:00:00Z' }),
    ])

    render(<App />)

    await waitFor(() => {
      const timeEl = screen.getByRole('time')
      expect(timeEl).toBeInTheDocument()
      expect(timeEl).toHaveAttribute('datetime', '2026-04-26T10:00:00Z')
    })
  })
})

describe('Feedback Integration - Error State', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows error message when fetching the list fails', async () => {
    mockFeedbackApi.fetchFeedbackList.mockRejectedValue(new Error('Network error'))

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText(/failed to load/i)).toBeInTheDocument()
    })
  })
})
