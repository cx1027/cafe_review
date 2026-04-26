export interface FeedbackFormData {
  email: string
  comment: string
  rating: number | ''
  favorite_aspect: string
}

export interface FeedbackErrors {
  email?: string
  comment?: string
  rating?: string
  favorite_aspect?: string
}

export interface FeedbackResponse {
  id: number
  email: string
  comment: string
  rating: number
  favorite_aspect: string
  created_at: string
}
