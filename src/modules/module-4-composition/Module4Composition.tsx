import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
interface User { name: string; role: 'admin' | 'user' | 'guest' }
interface UserContextType { user: User | null; login: (name: string) => void; logout: () => void }
const UserContext = createContext<UserContextType | null>(null)
function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  return <UserContext.Provider value={{ user, login: (name) => setUser({ name, role: 'user' }), logout: () => setUser(null) }}>{children}</UserContext.Provider>
}
function useUser() { const ctx = useContext(UserContext); if (!ctx) throw new Error('useUser required'); return ctx }

export function PropsDrillingTrap() {
  const [data, setData] = useState('Hello')
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Trap 1: Props Drilling</h2>
      <DeepComponent data={data} onUpdate={setData} level={1} />
    </div>
  )
}
function DeepComponent({ data, onUpdate, level }: { data: string; onUpdate: (v: string) => void; level: number }) {
  if (level > 3) return <div className="bg-blue-50 p-2 rounded"><span>Final: {data}</span><button onClick={() => onUpdate(data + '!')} className="ml-2 px-2 py-1 bg-blue-500 text-white rounded">Update</button></div>
  return <div className="ml-4 border-l-2 border-gray-300 pl-2"><div className="text-xs text-gray-500">Level {level}</div><DeepComponent data={data} onUpdate={onUpdate} level={level + 1} /></div>
}

export function ContextAbuseTrap() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Trap 2: Context Abuse</h2>
      <AppProvider><NotificationBadge /></AppProvider>
    </div>
  )
}
interface AppState { user: User | null; theme: 'light' | 'dark'; notifications: string[] }
const AppContext = createContext<{ state: AppState } | null>(null)
function AppProvider({ children }: { children: ReactNode }) { return <AppContext.Provider value={{ state: { user: null, theme: 'light', notifications: [] } }}>{children}</AppContext.Provider> }
function NotificationBadge() { const ctx = useContext(AppContext); if (!ctx) return null; return <span className="bg-red-500 text-white rounded-full px-2">{ctx.state.notifications.length}</span> }

export function CompositionCorrect() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">✅ Correct: Composed</h2>
      <UserProvider><UserDisplay /><LoginButton /></UserProvider>
    </div>
  )
}
function UserDisplay() { const { user } = useUser(); return user ? <span>👤 {user.name}</span> : <span>Guest</span> }
function LoginButton() { const { login } = useUser(); return <button onClick={() => login('Alice')} className="px-3 py-1 bg-green-500 text-white rounded">Login</button> }

export default function Module4Composition() {
  return (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <h3 className="font-bold text-red-800 mb-2">Traps</h3>
        <div className="grid grid-cols-2 gap-4"><PropsDrillingTrap /><ContextAbuseTrap /></div>
      </div>
      <CompositionCorrect />
    </div>
  )
}
