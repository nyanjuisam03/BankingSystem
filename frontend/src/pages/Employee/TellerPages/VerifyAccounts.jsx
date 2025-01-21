import React, { useState } from 'react'

import VerifyAccountStepOne from './VerifyAccounts/VerifyAccountStepOne'
import VerifyAccountStepTwo from './VerifyAccounts/VerifyAccountStepTwo'

function VerifyAccounts() {
  const [currentStep, setCurrentStep] = useState(1)
  
  const handleNext = () => setCurrentStep(2)
  const handleBack = () => setCurrentStep(1)
  return (
    <div>
  { currentStep === 1 ? (
    <VerifyAccountStepOne onNext={handleNext} />
  ):(
<VerifyAccountStepTwo  onBack={handleBack} />
  )}

    </div>
  )
}

export default VerifyAccounts
