import { useState } from 'react'
import { useWizardStore } from './useWizardStore'

export function WizardTrap1() {
  const { currentStep, totalSteps, nextStep, prevStep, formData, updateFormData } = useWizardStore()
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Trap 1: No Debounce</h2>
      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
      <div className="mt-6">
        <input type="text" value={(formData[currentStep]?.name as string) || ''} onChange={(e) => updateFormData(currentStep, { name: e.target.value })} placeholder="Enter name" className="w-full p-2 border rounded mb-4" />
        <div className="flex gap-2">
          <button onClick={nextStep} disabled={currentStep === totalSteps} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">Next</button>
          <button onClick={prevStep} disabled={currentStep === 1} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Back</button>
        </div>
      </div>
    </div>
  )
}

export function WizardTrap2() {
  const [step, setStep] = useState(1)
  const [step1Data, setStep1Data] = useState('')
  const [step2Data, setStep2Data] = useState('')
  const [step3Data, setStep3Data] = useState('')
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Trap 2: Data Lost</h2>
      <StepIndicator currentStep={step} totalSteps={3} />
      <div className="mt-6">
        {step === 1 && <input value={step1Data} onChange={(e) => setStep1Data(e.target.value)} placeholder="Step 1" className="w-full p-2 border rounded" />}
        {step === 2 && <input value={step2Data} onChange={(e) => setStep2Data(e.target.value)} placeholder="Step 2" className="w-full p-2 border rounded" />}
        {step === 3 && <input value={step3Data} onChange={(e) => setStep3Data(e.target.value)} placeholder="Step 3" className="w-full p-2 border rounded" />}
        <div className="flex gap-2 mt-4">
          <button onClick={() => setStep(step - 1)} disabled={step === 1} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Back</button>
          <button onClick={() => setStep(step + 1)} disabled={step === 3} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  )
}

export function WizardCorrect() {
  const { currentStep, totalSteps, nextStep, prevStep, formData, updateFormData, isSubmitting, setSubmitting } = useWizardStore()
  const [lastClickTime, setLastClickTime] = useState(0)
  const handleNext = () => {
    const now = Date.now()
    if (now - lastClickTime < 500) return
    setLastClickTime(now)
    if (currentStep < totalSteps) nextStep()
    else { setSubmitting(true); setTimeout(() => { setSubmitting(false); alert('Done!') }, 1000) }
  }
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Correct: Debounced</h2>
      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
      <div className="mt-6">
        <input type="text" value={(formData[currentStep]?.name as string) || ''} onChange={(e) => updateFormData(currentStep, { name: e.target.value })} placeholder={`Step ${currentStep}`} className="w-full p-2 border rounded mb-4" />
        <div className="flex gap-2">
          <button onClick={handleNext} disabled={isSubmitting} className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50 min-w-[100px]">{isSubmitting ? '...' : currentStep === totalSteps ? 'Submit' : 'Next'}</button>
          <button onClick={prevStep} disabled={currentStep === 1 || isSubmitting} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Back</button>
        </div>
      </div>
    </div>
  )
}

function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${step === currentStep ? 'bg-blue-600 text-white' : step < currentStep ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>{step < currentStep ? '✓' : step}</div>
          {step < totalSteps && <div className={`w-8 h-1 ${step < currentStep ? 'bg-green-500' : 'bg-gray-200'}`} />}
        </div>
      ))}
    </div>
  )
}

export default function Module1Wizard() {
  return (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <h3 className="font-bold text-red-800 mb-2">Traps</h3>
        <div className="grid grid-cols-2 gap-4"><WizardTrap1 /><WizardTrap2 /></div>
      </div>
      <WizardCorrect />
    </div>
  )
}
