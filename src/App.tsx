import './index.css'
import { Wizard } from './modules/module-1-state-machine/Exercise.correct'
import { UserProfile } from './modules/module-2-async-state/Exercise.correct'
import { CustomHooksDemo } from './modules/module-3-custom-hooks/Exercise.correct'
import { CompositionDemo } from './modules/module-4-composition/Exercise.correct'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            🧠 Front-End Logic Training Ground
          </h1>
          <p className="text-gray-600 mt-2">
            刻意设计的逻辑练习 - 每个模块都包含陷阱与正确解法
          </p>
        </header>

        <main className="space-y-12">
          <section>
            <h2 className="text-xl font-semibold mb-4">Module 1: State Machine Wizard</h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <Wizard />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Module 2: Async State Gallery</h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <UserProfile />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Module 3: Custom Hooks Patterns</h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <CustomHooksDemo />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Module 4: Component Composition</h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <CompositionDemo />
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
