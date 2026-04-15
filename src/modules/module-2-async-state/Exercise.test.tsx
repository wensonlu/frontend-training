import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { UserProfile, useAsync, Skeleton } from './Exercise.correct'

describe('Async State Patterns', () => {
  describe('useAsync Hook', () => {
    it('should start in idle status', async () => {
      const promise = new Promise<string>((resolve) => setTimeout(() => resolve('done'), 100))
      const { result } = renderHook(() => useAsync(() => promise))
      
      expect(result.current.state.status).toBe('idle')
    })

    it('should show loading state', async () => {
      vi.useFakeTimers()
      const promise = new Promise<string>((resolve) => setTimeout(() => resolve('done'), 1000))
      const { result } = renderHook(() => useAsync(() => promise))
      
      result.current.execute()
      expect(result.current.state.status).toBe('loading')
      
      vi.useRealTimers()
    })
  })

  describe('Skeleton Component', () => {
    it('should render with default dimensions', () => {
      render(<Skeleton />)
      const skeleton = screen.getByRole('presentation')
      expect(skeleton).toBeDefined()
    })

    it('should render with custom dimensions', () => {
      render(<Skeleton width="50%" height="2rem" />)
      const skeleton = screen.getByRole('presentation')
      expect(skeleton).toBeDefined()
    })
  })

  describe('UserProfile Demo', () => {
    it('should show idle message initially', () => {
      render(<UserProfile />)
      expect(screen.getByText('Click to fetch user')).toBeDefined()
    })

    it('should show loading skeleton when fetching', async () => {
      vi.useFakeTimers()
      render(<UserProfile />)
      
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      await user.click(screen.getByText('Fetch User'))
      
      // Should show skeleton
      expect(document.querySelector('.animate-pulse')).toBeDefined()
      
      vi.useRealTimers()
    })

    it('should have Fetch User button', () => {
      render(<UserProfile />)
      expect(screen.getByText('Fetch User')).toBeDefined()
    })

    it('should have Reset button', () => {
      render(<UserProfile />)
      expect(screen.getByText('Reset')).toBeDefined()
    })
  })
})

// Helper to test hooks
function renderHook<T>(callback: () => T) {
  let result: { current: T }
  function TestComponent() {
    result = { current: callback() }
    return null
  }
  render(<TestComponent />)
  return { result: result! }
}
