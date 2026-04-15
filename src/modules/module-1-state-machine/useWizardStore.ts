import { create } from 'zustand'

interface WizardState {
  currentStep: number
  totalSteps: number
  formData: Record<number, Record<string, unknown>>
  isSubmitting: boolean
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  updateFormData: (step: number, data: Record<string, unknown>) => void
  setSubmitting: (value: boolean) => void
  reset: () => void
}

export const useWizardStore = create<WizardState>((set, get) => ({
  currentStep: 1, totalSteps: 3, formData: {}, isSubmitting: false,
  setStep: (step) => { const { totalSteps } = get(); if (step >= 1 && step <= totalSteps) set({ currentStep: step }) },
  nextStep: () => { const { currentStep, totalSteps } = get(); if (currentStep < totalSteps) set({ currentStep: currentStep + 1 }) },
  prevStep: () => { const { currentStep } = get(); if (currentStep > 1) set({ currentStep: currentStep - 1 }) },
  updateFormData: (step, data) => set((state) => ({ formData: { ...state.formData, [step]: { ...state.formData[step], ...data } } })),
  setSubmitting: (value) => set({ isSubmitting: value }),
  reset: () => set({ currentStep: 1, formData: {}, isSubmitting: false }),
}))
