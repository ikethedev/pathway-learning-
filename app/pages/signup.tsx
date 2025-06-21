import React, {useState}from "react"
import SignUpStepOne from "../SignUp/SignUpStep1";
import SignUpStepTwo from "../SignUp/SignUpStep2";
import SignUpStep3 from "../SignUp/SignUpStep3";
import SignUpStep4 from "../SignUp/SignUpStep4";
import GoToDashBoard from "../SignUp/GoToDashBoard";

export default function SignUp() {
    const [currentStep, setCurrentStep] = useState(1);

    const nextStep = (e: React.MouseEvent) => {
        e.preventDefault()
        setCurrentStep(currentStep + 1)
    }

    const prevStep = (e: React.MouseEvent) => {
        e.preventDefault()
        setCurrentStep(currentStep - 1)
    }
    
    return (
        <>
            {currentStep === 1 && < SignUpStepOne />}
            {currentStep === 2 && <SignUpStepTwo />}
            {currentStep === 3 && <SignUpStep3 />}
            {currentStep === 4 && <SignUpStep4 />}
            {currentStep === 5 && <GoToDashBoard />}
            {currentStep > 1 &&  <button onClick={prevStep}>Previous</button> }
           {currentStep < 5 && <button onClick={nextStep}>Next</button>}
           
        </>
    )
};