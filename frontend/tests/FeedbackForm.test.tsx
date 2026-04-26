import { describe, it, expect, vi } from 'vitest'
import { render } from './setup'
import { screen, fireEvent } from '@testing-library/react'
import { FeedbackForm } from '../src/components/FeedbackForm'

const mockSubmit = vi.fn()

describe('FeedbackForm - Required Field Validation', () => {
  it('shows error when email is empty on submit', async () => {
    render(<FeedbackForm onSubmit={mockSubmit} />)
    const submitBtn = screen.getByRole('button', { name: /submit feedback/i })
    fireEvent.click(submitBtn)
    expect(screen.getByText('Email is required.')).toBeInTheDocument()
  })

  it('shows error when comment is empty on submit', async () => {
    render(<FeedbackForm onSubmit={mockSubmit} />)
    const submitBtn = screen.getByRole('button', { name: /submit feedback/i })
    fireEvent.click(submitBtn)
    expect(screen.getByText('Comment is required.')).toBeInTheDocument()
  })

  it('shows error when rating is not selected on submit', async () => {
    render(<FeedbackForm onSubmit={mockSubmit} />)
    const submitBtn = screen.getByRole('button', { name: /submit feedback/i })
    fireEvent.click(submitBtn)
    expect(screen.getByText('Rating is required.')).toBeInTheDocument()
  })

  it('shows error when favorite_aspect is not selected on submit', async () => {
    render(<FeedbackForm onSubmit={mockSubmit} />)
    const submitBtn = screen.getByRole('button', { name: /submit feedback/i })
    fireEvent.click(submitBtn)
    expect(screen.getByText('Favorite aspect is required.')).toBeInTheDocument()
  })

  it('shows all four errors when form is empty and submitted', async () => {
    render(<FeedbackForm onSubmit={mockSubmit} />)
    const submitBtn = screen.getByRole('button', { name: /submit feedback/i })
    fireEvent.click(submitBtn)
    const errors = screen.getAllByText(/is required/)
    expect(errors.length).toBe(4)
  })
})

describe('FeedbackForm - Invalid Email Validation', () => {
  it('shows error for email without @ symbol', async () => {
    render(<FeedbackForm onSubmit={mockSubmit} />)
    const emailInput = screen.getByLabelText(/email/i)
    fireEvent.change(emailInput, { target: { value: 'invalidemail' } })
    fireEvent.blur(emailInput)
    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument()
  })

  it('shows error for email without domain', async () => {
    render(<FeedbackForm onSubmit={mockSubmit} />)
    const emailInput = screen.getByLabelText(/email/i)
    fireEvent.change(emailInput, { target: { value: 'user@' } })
    fireEvent.blur(emailInput)
    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument()
  })

  it('shows error for email with spaces', async () => {
    render(<FeedbackForm onSubmit={mockSubmit} />)
    const emailInput = screen.getByLabelText(/email/i)
    fireEvent.change(emailInput, { target: { value: 'user email@test.com' } })
    fireEvent.blur(emailInput)
    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument()
  })

  it('accepts valid email formats on blur', async () => {
    render(<FeedbackForm onSubmit={mockSubmit} />)
    const emailInput = screen.getByLabelText(/email/i)
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.blur(emailInput)
    expect(screen.queryByText('Please enter a valid email address.')).not.toBeInTheDocument()
  })
})

describe('FeedbackForm - Blocked Invalid Submission', () => {
  it('does not call onSubmit when form has invalid email', async () => {
    render(<FeedbackForm onSubmit={mockSubmit} />)
    const emailInput = screen.getByLabelText(/email/i)
    fireEvent.change(emailInput, { target: { value: 'notanemail' } })
    const submitBtn = screen.getByRole('button', { name: /submit feedback/i })
    fireEvent.click(submitBtn)
    expect(mockSubmit).not.toHaveBeenCalled()
  })

  it('does not call onSubmit when required fields are empty', async () => {
    render(<FeedbackForm onSubmit={mockSubmit} />)
    const submitBtn = screen.getByRole('button', { name: /submit feedback/i })
    fireEvent.click(submitBtn)
    expect(mockSubmit).not.toHaveBeenCalled()
  })

  it('does not call onSubmit when only some fields are filled', async () => {
    render(<FeedbackForm onSubmit={mockSubmit} />)
    const emailInput = screen.getByLabelText(/email/i)
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    const submitBtn = screen.getByRole('button', { name: /submit feedback/i })
    fireEvent.click(submitBtn)
    expect(mockSubmit).not.toHaveBeenCalled()
  })
})

describe('FeedbackForm - Valid Mock Submission', () => {
  it('calls onSubmit with correct data when all fields are valid', async () => {
    render(<FeedbackForm onSubmit={mockSubmit} />)

    const emailInput = screen.getByLabelText(/email/i)
    fireEvent.change(emailInput, { target: { value: 'visitor@cafe.com' } })

    const commentInput = screen.getByLabelText(/comment/i)
    fireEvent.change(commentInput, { target: { value: 'Great coffee and cozy atmosphere!' } })

    const rating4 = screen.getByRole('radio', { name: '4' })
    fireEvent.click(rating4)

    const aspectCoffee = screen.getByRole('radio', { name: /coffee/i })
    fireEvent.click(aspectCoffee)

    const submitBtn = screen.getByRole('button', { name: /submit feedback/i })
    fireEvent.click(submitBtn)

    expect(mockSubmit).toHaveBeenCalledTimes(1)
    expect(mockSubmit).toHaveBeenCalledWith({
      email: 'visitor@cafe.com',
      comment: 'Great coffee and cozy atmosphere!',
      rating: 4,
      favorite_aspect: 'Coffee',
    })
  })

  it('submits successfully with minimum valid data', async () => {
    render(<FeedbackForm onSubmit={mockSubmit} />)

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } })
    fireEvent.change(screen.getByLabelText(/comment/i), { target: { value: 'Nice place.' } })
    fireEvent.click(screen.getByRole('radio', { name: '1' }))
    fireEvent.click(screen.getByRole('radio', { name: /food/i }))

    mockSubmit.mockClear()
    fireEvent.click(screen.getByRole('button', { name: /submit feedback/i }))

    expect(mockSubmit).toHaveBeenCalledTimes(1)
    expect(mockSubmit).toHaveBeenCalledWith({
      email: 'a@b.com',
      comment: 'Nice place.',
      rating: 1,
      favorite_aspect: 'Food',
    })
  })

  it('clears errors after correcting invalid input and resubmitting', async () => {
    render(<FeedbackForm onSubmit={mockSubmit} />)

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'bad' } })
    fireEvent.click(screen.getByRole('button', { name: /submit feedback/i }))
    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'good@test.com' } })
    fireEvent.change(screen.getByLabelText(/comment/i), { target: { value: 'Valid comment' } })
    fireEvent.click(screen.getByRole('radio', { name: '5' }))
    fireEvent.click(screen.getByRole('radio', { name: /service/i }))

    mockSubmit.mockClear()
    fireEvent.click(screen.getByRole('button', { name: /submit feedback/i }))

    expect(screen.queryByText('Please enter a valid email address.')).not.toBeInTheDocument()
    expect(mockSubmit).toHaveBeenCalledTimes(1)
  })
})
