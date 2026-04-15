# Module 2: Async State Gallery ⚡

## 训练目标

1. **Discriminated Union** - 安全的异步状态类型
2. **请求取消** - AbortController 防止内存泄漏
3. **Loading Skeleton** - 更好的加载体验
4. **Error Boundary** - 隔离异步错误

## 核心概念

### 错误模式 (❌)

```tsx
// 问题：类型不安全，loading时无法访问data
const [data, setData] = useState(null)
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)

// TypeScript: data可能是null，访问data.name会报错
```

### 正确模式 (✅)

```tsx
// 使用 discriminated union
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }  // data只在success时存在
  | { status: 'error'; error: Error }

// TypeScript自动缩小类型范围
if (state.status === 'success') {
  console.log(state.data.name) // ✅ 安全
}
```

## Hooks

### useAsync

```tsx
const { state, execute, reset } = useAsync(
  async () => {
    const response = await fetch('/api/user')
    return response.json()
  },
  { immediate: false } // 不立即执行
)
```

### useCancellableFetch

```tsx
const { data, loading, error, refetch, cancel } = useCancellableFetch('/api/user')
```

## 思考题

1. 为什么需要在 useEffect 中使用 `mountedRef`？
2. AbortController 在哪些场景下必须使用？
3. Error Boundary 和 try/catch 有什么区别？
