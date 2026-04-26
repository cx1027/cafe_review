import { useState, useEffect, useCallback } from 'react'
import type { FeedbackFormData, FeedbackResponse } from '../types/feedback'
import { submitFeedback, fetchFeedbackList } from '../api/feedback'

export type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'
export type LoadStatus = 'loading' | 'error' | 'success'

export function useFeedback() {
  const [entries, setEntries] = useState<FeedbackResponse[]>([])
  const [loadStatus, setLoadStatus] = useState<LoadStatus>('loading')
  const [loadError, setLoadError] = useState('')
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [submitError, setSubmitError] = useState('')

  const loadEntries = useCallback(async () => {
    setLoadStatus('loading')
    try {
      const data = await fetchFeedbackList()
      setEntries(data)
      setLoadStatus('success')
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load feedback.')
      setLoadStatus('error')
    }
  }, [])

  useEffect(() => {
    loadEntries()
  }, [loadEntries])

  const handleSubmit = useCallback(
    async (data: FeedbackFormData) => {
      setSubmitStatus('loading')
      setSubmitError('')
      try {
        const newEntry = await submitFeedback(data)
        setEntries((prev) => [newEntry, ...prev])
        setSubmitStatus('success')
        setTimeout(() => setSubmitStatus('idle'), 4000)
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : 'Failed to submit feedback.')
        setSubmitStatus('error')
      }
    },
    []
  )

  const clearSubmitStatus = useCallback(() => {
    setSubmitStatus('idle')
    setSubmitError('')
  }, [])

  return {
    entries,
    loadStatus,
    loadError,
    submitStatus,
    submitError,
    handleSubmit,
    clearSubmitStatus,
    refetch: loadEntries,
  }
}
