import type { FeedbackFormData, FeedbackResponse } from '../types/feedback'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Request failed: ${res.status} ${res.statusText} — ${body}`)
  }
  return res.json() as Promise<T>
}

export async function submitFeedback(data: FeedbackFormData): Promise<FeedbackResponse> {
  const res = await fetch(`${API_BASE}/api/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return handleResponse<FeedbackResponse>(res)
}

export async function fetchFeedbackList(): Promise<FeedbackResponse[]> {
  const res = await fetch(`${API_BASE}/api/feedback`)
  return handleResponse<FeedbackResponse[]>(res)
}
