import { useState, useEffect, useRef, useCallback } from 'react'

type AsyncState<T> = { status: 'idle' } | { status: 'loading' } | { status: 'success'; data: T } | { status: 'error'; error: Error }

export function useAsync<T>(asyncFn: () => Promise<T>, deps: unknown[] = []): { status: 'idle' | 'loading' | 'success' | 'error'; data?: T; error?: Error; refetch: () => Promise<void> } {
  const [state, setState] = useState<AsyncState<T>>({ status: 'idle' })
  const requestIdRef = useRef(0)
  const execute = useCallback(async () => {
    const id = ++requestIdRef.current
    setState({ status: 'loading' })
    try {
      const data = await asyncFn()
      if (id === requestIdRef.current) setState({ status: 'success', data })
    } catch (error) {
      if (id === requestIdRef.current) setState({ status: 'error', error: error as Error })
    }
  }, [asyncFn, ...deps])
  useEffect(() => { execute() }, [execute])
  if (state.status === 'success') return { status: 'success', data: state.data, refetch: execute }
  if (state.status === 'error') return { status: 'error', error: state.error, refetch: execute }
  if (state.status === 'loading') return { status: 'loading', refetch: execute }
  return { status: 'idle', refetch: execute }
}
