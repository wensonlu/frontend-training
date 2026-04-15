import { useState, useEffect, useCallback, useRef } from 'react'

type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }

interface UseAsyncOptions {
  immediate?: boolean
}

interface UseAsyncReturn<T> {
  state: AsyncState<T>
  execute: () => Promise<void>
  reset: () => void
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions = {}
): UseAsyncReturn<T> {
  const { immediate = true } = options
  const [state, setState] = useState<AsyncState<T>>({ status: 'idle' })
  const mountedRef = useRef(true)

  useEffect(() => {
    return () => { mountedRef.current = false }
  }, [])

  const execute = useCallback(async () => {
    setState({ status: 'loading' })
    try {
      const result = await asyncFunction()
      if (mountedRef.current) {
        setState({ status: 'success', data: result })
      }
    } catch (err) {
      if (mountedRef.current) {
        setState({ status: 'error', error: err instanceof Error ? err : new Error('Unknown') })
      }
    }
  }, [asyncFunction])

  useEffect(() => {
    if (immediate) execute()
  }, [immediate, execute])

  const reset = useCallback(() => setState({ status: 'idle' }), [])

  return { state, execute, reset }
}

export function useCancellableFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const fetchData = useCallback(async () => {
    abortRef.current?.abort()
    abortRef.current = new AbortController()
    setLoading(true)
    setError(null)
    try {
      await new Promise((r) => setTimeout(r, 500))
      setData({ id: '1', name: 'Alice', email: 'alice@example.com' } as T)
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err)
      }
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    return () => abortRef.current?.abort()
  }, [])

  return { data, loading, error, refetch: fetchData }
}

export function Skeleton({ width = '100%', height = '1rem' }: { width?: string; height?: string }) {
  return <div className="animate-pulse bg-gray-200 rounded" style={{ width, height }} />
}

export function UserProfile() {
  const { state, execute, reset } = useAsync(
    async () => {
      await new Promise((r) => setTimeout(r, 800))
      return { id: '1', name: 'John Doe', email: 'john@example.com' }
    },
    { immediate: false }
  )

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold mb-2">User Profile</h3>
      <button onClick={execute} className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
        Fetch User
      </button>
      <button onClick={reset} className="px-3 py-1 bg-gray-200 rounded text-sm ml-2">
        Reset
      </button>

      <div className="mt-4">
        {state.status === 'idle' && <p className="text-gray-500">Click to fetch user</p>}
        {state.status === 'loading' && (
          <div className="space-y-2">
            <Skeleton width="60%" />
            <Skeleton width="80%" height="0.75rem" />
            <Skeleton width="40%" height="0.75rem" />
          </div>
        )}
        {state.status === 'success' && (
          <div className="text-green-600">
            <p>Name: {state.data.name}</p>
            <p>Email: {state.data.email}</p>
          </div>
        )}
        {state.status === 'error' && <p className="text-red-500">Error: {state.error.message}</p>}
      </div>
    </div>
  )
}
