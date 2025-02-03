import React, { useState } from 'react';
import CreateLoanStepOne from '../../components/Forms/CreateLoanStepOne';
import CreateLoanStepTwo from '../../components/Forms/CreateLoanStepTwo';


function LoanFile() {
  
  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => {
    setCurrentStep(2);
  };

  const handleBackStep = () => {
    setCurrentStep(1);
  };
  return (
  <div>
 {currentStep === 1 && (
        <CreateLoanStepOne onNext={handleNextStep} />
      )}
      
      {currentStep === 2 && (
        <CreateLoanStepTwo onBack={handleBackStep} />
      )}
  </div> 
  );
}

export default LoanFile;