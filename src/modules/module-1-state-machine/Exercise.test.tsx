import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Wizard } from './Exercise.correct'

describe('Wizard - State Machine', () => {
  describe('Navigation', () => {
    it('should start at step 1', () => {
      render(<Wizard />)
      expect(screen.getByText('Step 1 of 3')).toBeDefined()
    })

    it('should advance to step 2 when clicking Next', async () => {
      const user = userEvent.setup()
      render(<Wizard />)
      
      await user.click(screen.getByText('Next'))
      expect(screen.getByText('Step 2 of 3')).toBeDefined()
    })

    it('should go back to step 1 when clicking Previous from step 2', async () => {
      const user = userEvent.setup()
      render(<Wizard />)
      
      await user.click(screen.getByText('Next'))
      await user.click(screen.getByText('Previous'))
      expect(screen.getByText('Step 1 of 3')).toBeDefined()
    })
  })

  describe('Data Persistence', () => {
    it('should preserve form data when navigating back', async () => {
      const user = userEvent.setup()
      render(<Wizard />)
      
      // Fill step 1
      await user.type(screen.getByLabelText('Name (required)'), 'Alice')
      await user.click(screen.getByText('Next'))
      
      // Go back
      await user.click(screen.getByText('Previous'))
      
      // Data should be preserved
      const input = screen.getByLabelText('Name (required)') as HTMLInputElement
      expect(input.value).toBe('Alice')
    })
  })

  describe('Submit Lock', () => {
    it('should show Submit button on step 3', async () => {
      const user = userEvent.setup()
      render(<Wizard />)
      
      await user.click(screen.getByText('Next'))
      await user.click(screen.getByText('Next'))
      
      expect(screen.getByText('Submit')).toBeDefined()
    })
  })

  describe('Account Type', () => {
    it('should allow switching account type', async () => {
      const user = userEvent.setup()
      render(<Wizard />)
      
      const select = screen.getByLabelText('Account Type')
      await user.selectOptions(select, 'business')
      
      expect((select as HTMLSelectElement).value).toBe('business')
    })
  })
})
