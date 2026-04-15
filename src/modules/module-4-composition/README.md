# Module 4: Component Composition 🔗

## 训练目标

1. **Props Drilling** - 何时 OK，何时过度
2. **Context Pattern** - 深层数据穿透
3. **Compound Components** - 隐式状态共享
4. **Render Props** - 行为参数化
5. **Sibling Communication** - 状态提升
6. **Hook 封装** - 逻辑复用

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
