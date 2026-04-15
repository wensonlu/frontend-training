import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Module4Composition from './Module4Composition'

describe('Module 4: Component Composition Lab', () => {
  it('should render module', () => {
    render(<Module4Composition />)
    expect(screen.getByText(/Trap 1/)).toBeInTheDocument()
    expect(screen.getByText(/Trap 2/)).toBeInTheDocument()
    expect(screen.getByText(/Correct/)).toBeInTheDocument()
  })
})
