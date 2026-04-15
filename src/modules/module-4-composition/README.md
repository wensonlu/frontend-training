# Module 4: Component Composition 🔗

## 训练目标

1. **Props Drilling** - 何时 OK，何时过度
2. **Context Pattern** - 深层状态共享
3. **Compound Components** - 隐式状态共享
4. **Render Props** - 行为参数化
5. **Sibling Communication** - 状态提升
6. **Hook 封装** - 逻辑复用

## 六大模式

### 1. Props Drilling (浅层OK)

```tsx
// 1-2层穿透是OK的，不需要优化
function Header({ userName, onLogout }) {
  return <button onClick={onLogout}>{userName}</button>
}
```

### 2. Context Pattern (深层用这个)

```tsx
const UserContext = createContext<User | null>(null)

function DeeplyNested() {
  const user = useContext(UserContext) // 无需层层传props
}
```

### 3. Compound Components

```tsx
<Tabs defaultValue="tab1">
  <TabList>
    <Tab value="tab1">Tab 1</Tab>
    <Tab value="tab2">Tab 2</Tab>
  </TabList>
  <TabPanel value="tab1">Content 1</TabPanel>
  <TabPanel value="tab2">Content 2</TabPanel>
</Tabs>
```

### 4. Render Props

```tsx
<MouseTracker render={({ x, y }) => (
  <p>Position: ({x}, {y})</p>
)} />
```

### 5. Sibling Communication

状态提升到共同父组件

### 6. Counter Hook

```tsx
const { count, increment, decrement, reset } = useCounter()
```

## 组合模式对比

| 模式 | 适用场景 | 复杂度 |
|------|----------|--------|
| Props Drilling | 1-2层传递 | ⭐ |
| Context | 多层/全局状态 | ⭐⭐ |
| Compound Components | 相关组件集合 | ⭐⭐ |
| Render Props | 行为复用 | ⭐⭐ |
| 状态提升 | 兄弟组件通信 | ⭐⭐ |

## 思考题

1. Props Drilling 在哪些情况下需要优化？
2. Context 的性能问题如何避免？
3. Compound Components 和 HOC 的区别？
