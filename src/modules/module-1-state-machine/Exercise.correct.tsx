import { useState, useCallback, useRef } from 'react'

interface WizardState {
  currentStep: 1 | 2 | 3
  name: string
  accountType: 'individual' | 'business'
  email: string
  product: string
  phone: string
  agreeTerms: boolean
  isSubmitting: boolean
}

export function Wizard() {
  const [state, setState] = useState<WizardState>({
    currentStep: 1,
    name: '',
    accountType: 'individual',
    email: '',
    product: '',
    phone: '',
    agreeTerms: false,
    isSubmitting: false,
  })
  const submitLockRef = useRef(false)

  const handleNext = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(3, prev.currentStep + 1) as 1 | 2 | 3,
    }))
  }, [])

  const handlePrev = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(1, prev.currentStep - 1) as 1 | 2 | 3,
    }))
  }, [])

  const handleSubmit = useCallback(async () => {
    if (submitLockRef.current) return
    submitLockRef.current = true
    setState((prev) => ({ ...prev, isSubmitting: true }))
    await new Promise((r) => setTimeout(r, 500))
    submitLockRef.current = false
    setState((prev) => ({ ...prev, isSubmitting: false }))
  }, [])

  return (
    <div className="wizard p-4 border rounded-lg">
      <div className="step-indicator mb-4">Step {state.currentStep} of 3</div>

      {state.currentStep === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Name (required)</label>
            <input
              id="name"
              value={state.name}
              onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Account Type</label>
            <select
              id="account-type"
              value={state.accountType}
              onChange={(e) =>
                setState((s) => ({ ...s, accountType: e.target.value as 'individual' | 'business' }))
              }
              className="w-full border p-2 rounded"
            >
              <option value="individual">Individual</option>
              <option value="business">Business</option>
            </select>
          </div>
        </div>
      )}

      {state.currentStep === 2 && (
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={state.email}
              onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Product</label>
            <select
              id="product"
              value={state.product}
              onChange={(e) => setState((s) => ({ ...s, product: e.target.value }))}
              className="w-full border p-2 rounded"
            >
              <option value="">Select product</option>
              <option value="savings">Savings</option>
              <option value="checking">Checking</option>
            </select>
          </div>
        </div>
      )}

      {state.currentStep === 3 && (
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Phone</label>
            <input
              id="phone"
              type="tel"
              value={state.phone}
              onChange={(e) => setState((s) => ({ ...s, phone: e.target.value }))}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                checked={state.agreeTerms}
                onChange={(e) => setState((s) => ({ ...s, agreeTerms: e.target.checked }))}
                className="mr-2"
              />
              I agree to terms
            </label>
          </div>
        </div>
      )}

      <div className="navigation mt-4 flex gap-2">
        <button
          onClick={handlePrev}
          disabled={state.currentStep === 1 || state.isSubmitting}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>

        {state.currentStep < 3 ? (
          <button onClick={handleNext} className="px-4 py-2 bg-blue-500 text-white rounded">
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={state.isSubmitting}
            className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
          >
            {state.isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        )}
      </div>
    </div>
  )
}
