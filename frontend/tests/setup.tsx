import '@testing-library/jest-dom'
import { render as rtlRender, type RenderOptions } from '@testing-library/react'
import React from 'react'

function Wrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function render(ui: React.ReactElement, options?: RenderOptions) {
  return rtlRender(ui, { wrapper: Wrapper, ...options })
}
