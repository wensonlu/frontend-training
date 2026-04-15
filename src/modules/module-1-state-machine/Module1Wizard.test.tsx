import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Module1Wizard from './Module1Wizard'

describe('Module 1: State Machine Wizard', () => {
  it('should render traps and correct solution', () => {
    render(<Module1Wizard />)
    expect(screen.getByText(/Trap 1/)).toBeInTheDocument()
    expect(screen.getByText(/Trap 2/)).toBeInTheDocument()
    expect(screen.getByText(/Correct/)).toBeInTheDocument()
  })
  it('should show step indicators', () => {
    render(<Module1Wizard />)
    expect(screen.getAllByText('1').length).toBeGreaterThan(0)
  })
})
