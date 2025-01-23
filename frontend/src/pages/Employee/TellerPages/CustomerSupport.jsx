import React, { useState } from 'react'
import ChosingTiketsStepOne from './ChosingTickets/ChosingTiketsStepOne'
import ChosingTicketsStepTwo from './ChosingTickets/ChosingTicketsStepTwo'


function CustomerSupport() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedTicket, setSelectedTicket] = useState(null)

  const handleNext = (ticket) => {
    setSelectedTicket(ticket)
    setCurrentStep(2)
  }

  const handleBack = () => {
    setSelectedTicket(null)
    setCurrentStep(1)
  }

  return (
    <div className="p-6">
    {currentStep === 1 ? (
      <ChosingTiketsStepOne onNext={handleNext} />
    ) : (
      <ChosingTicketsStepTwo ticket={selectedTicket} onBack={handleBack} />
    )}
  </div>
  )
}

export default CustomerSupport
