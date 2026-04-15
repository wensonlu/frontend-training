import { useState, useCallback, useMemo, createContext, useContext, ReactNode } from 'react'

// ============================================================================
// MODULE 4: Component Composition Patterns
// ============================================================================
// Focus: How components relate to and communicate with each other

// ============================================================================
// PATTERN 1: Props Drilling (浅层穿透 - OK)
// ============================================================================

function Button({ onClick, variant = 'primary', children }: { onClick: () => void; variant?: string; children: ReactNode }) {
  return (
    <button onClick={onClick} className={`btn btn-${variant}`}>
      {children}
    </button>
  )
}

function Header({ userName, onLogout }: { userName: string; onLogout: () => void }) {
  // Props drilling 1-2层是OK的，不需要优化
  return (
    <header className="flex justify-between p-4 border-b">
      <span>Welcome, {userName}</span>
      <Button onClick={onLogout} variant="secondary">Logout</Button>
    </header>
  )
}

// ============================================================================
// PATTERN 2: Context Pattern (深层穿透 - 用Context)
// ============================================================================

interface User { id: string; name: string; role: 'admin' | 'user' }
interface Theme { primary: string; bg: string }

const UserContext = createContext<{ user: User | null; setUser: (u: User | null) => void } | null>(null)
const ThemeContext = createContext<{ theme: Theme } | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({ id: '1', name: 'Alice', role: 'user' })
  const value = useMemo(() => ({ user, setUser }), [user])
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme] = useState<Theme>({ primary: '#007bff', bg: '#fff' })
  return <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>
}

function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be inside UserProvider')
  return ctx
}

function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider')
  return ctx
}

// 深层组件 - 不需要层层传props
function DeeplyNestedProfile() {
  const { user } = useUser()
  const { theme } = useTheme()
  return (
    <div style={{ color: theme.primary }}>
      <p>User: {user?.name}</p>
      <p>Role: {user?.role}</p>
    </div>
  )
}

// ============================================================================
// PATTERN 3: Compound Components (复合组件)
// ============================================================================

interface TabsContextValue { activeTab: string; setActiveTab: (t: string) => void }

const TabsContext = createContext<TabsContextValue | null>(null)

function Tabs({ defaultValue, children }: { defaultValue: string; children: ReactNode }) {
  const [activeTab, setActiveTab] = useState(defaultValue)
  const value = useMemo(() => ({ activeTab, setActiveTab }), [activeTab])
  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>
}

function TabList({ children }: { children: ReactNode }) {
  return <div className="flex border-b">{children}</div>
}

function Tab({ value, children }: { value: string; children: ReactNode }) {
  const ctx = useContext(TabsContext)!
  const isActive = ctx.activeTab === value
  return (
    <button
      className={`px-4 py-2 ${isActive ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
      onClick={() => ctx.setActiveTab(value)}
    >
      {children}
    </button>
  )
}

function TabPanel({ value, children }: { value: string; children: ReactNode }) {
  const ctx = useContext(TabsContext)!
  if (ctx.activeTab !== value) return null
  return <div className="p-4">{children}</div>
}

// ============================================================================
// PATTERN 4: Render Props
// ============================================================================

function MouseTracker({ render }: { render: (pos: { x: number; y: number }) => ReactNode }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  return (
    <div
      className="h-32 border rounded flex items-center justify-center"
      onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
    >
      {render(pos)}
    </div>
  )
}

// ============================================================================
// PATTERN 5: Sibling Communication (状态提升)
// ============================================================================

function SiblingParent() {
  const [items, setItems] = useState<string[]>([])
  const [input, setInput] = useState('')

  const addItem = useCallback(() => {
    if (input.trim()) {
      setItems((prev) => [...prev, input])
      setInput('')
    }
  }, [input])

  return (
    <div className="space-y-4 p-4 border rounded">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 rounded flex-1"
          placeholder="Add item..."
        />
        <button onClick={addItem} className="px-4 py-2 bg-blue-500 text-white rounded">
          Add
        </button>
      </div>
      <ul className="list-disc list-inside">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      <p className="text-sm text-gray-500">Total: {items.length} items</p>
    </div>
  )
}

// ============================================================================
// PATTERN 6: Counter with actions (带操作的状态)
// ============================================================================

function useCounter() {
  const [count, setCount] = useState(0)
  const increment = useCallback(() => setCount((c) => c + 1), [])
  const decrement = useCallback(() => setCount((c) => c - 1), [])
  const reset = useCallback(() => setCount(0), [])
  return { count, increment, decrement, reset }
}

function CounterDisplay() {
  const { count, increment, decrement, reset } = useCounter()
  return (
    <div className="p-4 border rounded space-y-2">
      <p className="text-2xl font-bold text-center">{count}</p>
      <div className="flex gap-2 justify-center">
        <button onClick={decrement} className="px-4 py-2 bg-gray-200 rounded">-</button>
        <button onClick={reset} className="px-4 py-2 bg-gray-200 rounded">Reset</button>
        <button onClick={increment} className="px-4 py-2 bg-blue-500 text-white rounded">+</button>
      </div>
    </div>
  )
}

// ============================================================================
// DEMO
// ============================================================================

export function CompositionDemo() {
  return (
    <UserProvider>
      <ThemeProvider>
        <div className="space-y-6">
          {/* Pattern 1: Props Drilling */}
          <div className="p-4 border rounded">
            <h3 className="font-semibold mb-2">1. Props Drilling (浅层OK)</h3>
            <Header userName="Bob" onLogout={() => alert('logged out')} />
          </div>

          {/* Pattern 2: Context */}
          <div className="p-4 border rounded">
            <h3 className="font-semibold mb-2">2. Context (深层用这个)</h3>
            <DeeplyNestedProfile />
          </div>

          {/* Pattern 3: Compound Components */}
          <div className="p-4 border rounded">
            <h3 className="font-semibold mb-2">3. Compound Components</h3>
            <Tabs defaultValue="tab1">
              <TabList>
                <Tab value="tab1">Tab 1</Tab>
                <Tab value="tab2">Tab 2</Tab>
                <Tab value="tab3">Tab 3</Tab>
              </TabList>
              <TabPanel value="tab1"><p>Content for Tab 1</p></TabPanel>
              <TabPanel value="tab2"><p>Content for Tab 2</p></TabPanel>
              <TabPanel value="tab3"><p>Content for Tab 3</p></TabPanel>
            </Tabs>
          </div>

          {/* Pattern 4: Render Props */}
          <div className="p-4 border rounded">
            <h3 className="font-semibold mb-2">4. Render Props</h3>
            <MouseTracker
              render={({ x, y }) => (
                <p>Mouse position: ({x}, {y})</p>
              )}
            />
          </div>

          {/* Pattern 5: Sibling Communication */}
          <div className="p-4 border rounded">
            <h3 className="font-semibold mb-2">5. Sibling Communication</h3>
            <SiblingParent />
          </div>

          {/* Pattern 6: Counter Hook */}
          <div className="p-4 border rounded">
            <h3 className="font-semibold mb-2">6. Counter Hook</h3>
            <CounterDisplay />
          </div>
        </div>
      </ThemeProvider>
    </UserProvider>
  )
}
