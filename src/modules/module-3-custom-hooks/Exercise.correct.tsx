import { useState, useEffect, useCallback, useRef } from 'react'

// ============================================================================
// MODULE 3: Custom Hooks Patterns
// ============================================================================
// Focus: Logic reuse, isolation, and composition

// ============================================================================
// PATTERN 1: useDebounce - 防抖
// ============================================================================

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

// ============================================================================
// PATTERN 2: useLocalStorage - 本地存储持久化
// ============================================================================

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        console.error('Error saving to localStorage:', error)
      }
    },
    [key, storedValue]
  )

  return [storedValue, setValue]
}

// ============================================================================
// PATTERN 3: useMediaQuery - 响应式
// ============================================================================

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}

// ============================================================================
// PATTERN 4: useToggle - 简单状态切换
// ============================================================================

export function useToggle(
  initialValue: boolean = false
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => {
    setValue((prev) => !prev)
  }, [])

  return [value, toggle, setValue]
}

// ============================================================================
// PATTERN 5: usePrevious - 获取上一个状态
// ============================================================================

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

// ============================================================================
// PATTERN 6: useOnClickOutside - 点击外部检测
// ============================================================================

export function useOnClickOutside(
  ref: React.RefObject<HTMLElement>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return
      }
      handler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}

// ============================================================================
// DEMO COMPONENT
// ============================================================================

export function CustomHooksDemo() {
  const [input, setInput] = useState('')
  const debouncedInput = useDebounce(input, 300)

  const [theme, setTheme] = useLocalStorage('theme', 'light')

  const isMobile = useMediaQuery('(max-width: 640px)')

  const [isOn, toggleIsOn, setIsOn] = useToggle(false)

  const previousInput = usePrevious(input)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const [showDropdown, setShowDropdown] = useState(false)

  useOnClickOutside(dropdownRef, () => setShowDropdown(false))

  return (
    <div className="space-y-6">
      {/* Pattern 1: Debounce */}
      <div className="p-4 border rounded">
        <h3 className="font-semibold mb-2">1. useDebounce</h3>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type to search..."
          className="w-full border p-2 rounded"
        />
        <p className="text-sm text-gray-500 mt-1">
          Debounced: <span className="font-mono">{debouncedInput}</span>
        </p>
      </div>

      {/* Pattern 2: LocalStorage */}
      <div className="p-4 border rounded">
        <h3 className="font-semibold mb-2">2. useLocalStorage</h3>
        <p className="text-sm mb-2">Current theme: {theme}</p>
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Toggle Theme
        </button>
      </div>

      {/* Pattern 3: MediaQuery */}
      <div className="p-4 border rounded">
        <h3 className="font-semibold mb-2">3. useMediaQuery</h3>
        <p>Screen is {isMobile ? 'MOBILE' : 'DESKTOP'}</p>
      </div>

      {/* Pattern 4: Toggle */}
      <div className="p-4 border rounded">
        <h3 className="font-semibold mb-2">4. useToggle</h3>
        <p className="text-lg">{isOn ? 'ON' : 'OFF'}</p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={toggleIsOn}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            Toggle
          </button>
          <button
            onClick={() => setIsOn(true)}
            className="px-3 py-1 bg-green-500 text-white rounded"
          >
            Force ON
          </button>
        </div>
      </div>

      {/* Pattern 5: Previous */}
      <div className="p-4 border rounded">
        <h3 className="font-semibold mb-2">5. usePrevious</h3>
        <p>Current: {input || '(empty)'}</p>
        <p>Previous: {previousInput || '(none)'}</p>
      </div>

      {/* Pattern 6: Click Outside */}
      <div className="p-4 border rounded">
        <h3 className="font-semibold mb-2">6. useOnClickOutside</h3>
        <div ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            {showDropdown ? 'Close' : 'Open'} Dropdown
          </button>
          {showDropdown && (
            <div className="mt-2 p-2 border rounded bg-white">
              <p className="text-sm">Click outside to close!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
