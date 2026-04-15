import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState, createContext, useContext } from 'react'

describe('Component Composition Patterns', () => {
  describe('Props Drilling (浅层OK)', () => {
    it('should pass props through 1-2 levels', async () => {
      const user = userEvent.setup()
      let receivedName = ''
      
      render(
        <div>
          <button onClick={() => { receivedName = 'Test' }}>
            Set Name
          </button>
          <span data-testid="name">{receivedName}</span>
        </div>
      )
      
      await user.click(screen.getByText('Set Name'))
      expect(screen.getByTestId('name').textContent).toBe('Test')
    })
  })

  describe('Context Pattern', () => {
    it('should provide and consume context', async () => {
      const TestContext = createContext<{ value: string } | null>(null)
      let contextValue: { value: string } | null = null
      
      render(
        <TestContext.Provider value={{ value: 'hello' }}>
          <TestContext.Consumer>
            {(ctx) => {
              contextValue = ctx
              return <span>{ctx?.value}</span>
            }}
          </TestContext.Consumer>
        </TestContext.Provider>
      )
      
      expect(screen.getByText('hello')).toBeDefined()
      expect(contextValue?.value).toBe('hello')
    })
  })

  describe('Sibling Communication', () => {
    it('should share state between siblings via parent', async () => {
      const user = userEvent.setup()
      let items: string[] = []
      
      function SiblingParent() {
        const [input, setInput] = useState('')
        
        return (
          <div>
            <input 
              data-testid="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={() => items.push(input)}>Add</button>
            <ul>
              {items.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        )
      }
      
      render(<SiblingParent />)
      
      await user.type(screen.getByTestId('input'), 'item1')
      await user.click(screen.getByText('Add'))
      
      expect(screen.getByText('item1')).toBeDefined()
    })
  })

  describe('Toggle Pattern', () => {
    it('should toggle boolean state', async () => {
      const user = userEvent.setup()
      let isOn = false
      
      render(
        <div>
          <button onClick={() => { isOn = !isOn }}>
            {isOn ? 'ON' : 'OFF'}
          </button>
        </div>
      )
      
      expect(screen.getByText('OFF')).toBeDefined()
      await user.click(screen.getByText('OFF'))
      expect(screen.getByText('ON')).toBeDefined()
    })
  })
})

describe('CompositionDemo Component', () => {
  it('should render without crashing', () => {
    // Full demo test would go here
  })
})
