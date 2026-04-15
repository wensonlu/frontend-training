import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Module2Async from './Module2Async'

describe('Module 2: Async State Gallery', () => {
  it('should render module', () => {
    render(<Module2Async />)
    expect(screen.getByText(/Trap 1/)).toBeInTheDocument()
    expect(screen.getByText(/Trap 2/)).toBeInTheDocument()
    expect(screen.getByText(/Correct/)).toBeInTheDocument()
  })
})
