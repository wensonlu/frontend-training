import { useState, useCallback, useRef } from 'react'
import { useAsync } from './useAsync'

const fetchUser = (shouldFail = false, delay = 1000): Promise<{ id: number; name: string }> => {
  return new Promise((resolve, reject) => setTimeout(() => shouldFail ? reject(new Error('Network error')) : resolve({ id: 1, name: 'John Doe' }), delay))
}

function LoadingSpinner() { return <div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div> }
function ErrorDisplay({ message }: { message: string }) { return <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">❌ Error: {message}</div> }
function SuccessDisplay({ data }: { data: { name: string } }) { return <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">✅ Loaded: {data.name}</div> }

export function AsyncTrap1() {
  const [user, setUser] = useState<{ id: number; name: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const loadUser = async (delay: number) => { setLoading(true); setError(null); try { setUser(await fetchUser(false, delay)) } catch (e) { setError((e as Error).message) } finally { setLoading(false) } }
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Trap 1: Race Condition</h2>
      <div className="flex gap-2 mb-4">
        <button onClick={() => loadUser(3000)} className="px-3 py-1 bg-blue-100 text-blue-700 rounded">Slow (3s)</button>
        <button onClick={() => loadUser(500)} className="px-3 py-1 bg-green-100 text-green-700 rounded">Fast (0.5s)</button>
      </div>
      {loading && <LoadingSpinner />}
      {error && <ErrorDisplay message={error} />}
      {user && <SuccessDisplay data={user} />}
    </div>
  )
}

export function AsyncTrap2() {
  const [user, setUser] = useState<{ id: number; name: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const loadUser = async (shouldFail: boolean) => { setLoading(true); try { setUser(await fetchUser(shouldFail)) } catch (e) { setError((e as Error).message) } finally { setLoading(false) } }
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Trap 2: Error Persists</h2>
      <div className="flex gap-2 mb-4">
        <button onClick={() => loadUser(true)} className="px-3 py-1 bg-red-100 text-red-700 rounded">Fail</button>
        <button onClick={() => loadUser(false)} className="px-3 py-1 bg-green-100 text-green-700 rounded">Success</button>
      </div>
      {loading && <LoadingSpinner />}
      {error && <ErrorDisplay message={error} />}
      {user && <SuccessDisplay data={user} />}
    </div>
  )
}

export function AsyncCorrect() {
  const [requestCount, setRequestCount] = useState(0)
  const requestIdRef = useRef(0)
  const loadUserSlow = useCallback(async () => { const id = ++requestIdRef.current; setRequestCount(id); return fetchUser(false, 2000) }, [])
  const loadUserFast = useCallback(async () => { const id = ++requestIdRef.current; setRequestCount(id); return fetchUser(false, 500) }, [])
  const { status, data, error } = useAsync(requestCount === 1 ? loadUserSlow : loadUserFast, [requestCount])
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">✅ Correct: Race Handled</h2>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setRequestCount(1)} className="px-3 py-1 bg-blue-100 text-blue-700 rounded">Slow (3s)</button>
        <button onClick={() => setRequestCount(2)} className="px-3 py-1 bg-green-100 text-green-700 rounded">Fast (0.5s)</button>
      </div>
      {status === 'loading' && <LoadingSpinner />}
      {status === 'error' && error && <ErrorDisplay message={error.message} />}
      {status === 'success' && data && <SuccessDisplay data={data} />}
    </div>
  )
}

export default function Module2Async() {
  return (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <h3 className="font-bold text-red-800 mb-2">Traps</h3>
        <div className="grid grid-cols-2 gap-4"><AsyncTrap1 /><AsyncTrap2 /></div>
      </div>
      <AsyncCorrect />
    </div>
  )
}
