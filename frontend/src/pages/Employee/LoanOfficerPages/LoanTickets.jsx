import React, { useState } from 'react'
import StepTwoLoanTickets from './LoanTickets/StepTwoLoanTickets'
import  StepOneLoanTickets from './LoanTickets/StepOneLoanTickets'
function LoanTickets() {

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
      <StepOneLoanTickets onNext={handleNext} />
    ) : (
      <StepTwoLoanTickets ticket={selectedTicket} onBack={handleBack} />
    )}
  </div>
  )
}

export default LoanTickets
