import { useState } from 'react'
import './index.css'
import Module1Wizard from './modules/module-1-state-machine/Module1Wizard'
import Module2Async from './modules/module-2-async-state/Module2Async'
import Module4Composition from './modules/module-4-composition/Module4Composition'

function App() {
  const [activeModule, setActiveModule] = useState<string>('module-1')
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🎯 Front-End Logic Training Ground</h1>
          <p className="text-gray-600">刻意设计的逻辑陷阱练习</p>
        </header>
        <nav className="flex gap-2 mb-8">
          {[{ id: 'module-1', label: 'Module 1: State Machine' }, { id: 'module-2', label: 'Module 2: Async State' }, { id: 'module-4', label: 'Module 4: Composition' }].map(mod => (
            <button key={mod.id} onClick={() => setActiveModule(mod.id)} className={`px-4 py-2 rounded-lg font-medium ${activeModule === mod.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>{mod.label}</button>
          ))}
        </nav>
        <main>
          {activeModule === 'module-1' && <Module1Wizard />}
          {activeModule === 'module-2' && <Module2Async />}
          {activeModule === 'module-4' && <Module4Composition />}
        </main>
      </div>
    </div>
  )
}
export default App
