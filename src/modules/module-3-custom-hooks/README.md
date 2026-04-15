# Module 3: Custom Hooks Patterns 🎣

## 训练目标

1. **逻辑复用** - 把重复逻辑抽取到 Hook
2. **关注点分离** - 副作用与 UI 分离
3. **组合模式** - 小 Hook 组合成大 Hook
4. **测试友好** - 独立逻辑可单独测试

## 六大 Hook 模式

| Hook | 用途 | 关键点 |
|------|------|--------|
| `useDebounce` | 防抖 | 延迟更新 + cleanup timer |
| `useLocalStorage` | 持久化 | JSON序列化 + 异常处理 |
| `useMediaQuery` | 响应式 | matchMedia API |
| `useToggle` | 切换 | 原子化状态 |
| `usePrevious` | 上一个值 | useRef 技巧 |
| `useOnClickOutside` | 点击外部 | 事件委托 |

## 核心概念

### 错误模式 (❌)

```tsx
// 问题：逻辑和UI耦合，无法复用
function SearchInput() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  // 每次输入都发请求 ❌
  useEffect(() => {
    fetchResults(query)
  }, [query])

  // 防抖逻辑重复写 ❌
  const debouncedQuery = useMemo(() => {
    let timer
    return query => {
      clearTimeout(timer)
      timer = setTimeout(() => setQuery(query), 300)
    }
  }, [])
}
```

### 正确模式 (✅)

```tsx
// 逻辑抽取到 Hook
function useDebounce(value, delay) { /* ... */ }

// UI 只负责渲染
function SearchInput() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)

  // 副作用只关注 debouncedQuery
  useEffect(() => {
    fetchResults(debouncedQuery)
  }, [debouncedQuery])
}
```

## 思考题

1. 为什么 `usePrevious` 用 `useRef` 而不是 `useState`？
2. `useLocalStorage` 的异常处理为什么重要？
3. 如何测试自定义 Hook？
