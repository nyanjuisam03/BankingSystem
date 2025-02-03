import React, {  useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateAccountStepOne from '../../components/Forms/CreateAccountStepOne';
import CreateAccountStepTwo from '../../components/Forms/CreateAccountStepTwo';

function CreateAccount() {
  const [currentStep, setCurrentStep] = useState(1);
  
  const handleNext = () => setCurrentStep(2);
  const handleBack = () => setCurrentStep(1);


  return (
    <div className="max-w-8xl mx-auto">
      {currentStep === 1 ? (
        <CreateAccountStepOne onNext={handleNext} />
      ) : (
        <CreateAccountStepTwo onBack={handleBack} />
      )}
    </div>
  );
}

export default CreateAccount;