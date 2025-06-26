import React, { useState } from "react";
import SignUpStep1 from "../SignUp/step1/SignUpStep1";
import SignUpStep2 from "../SignUp/step2/SignUpStep2";
import SignUpStep3 from "../SignUp/step3/SignUpStep3";
import OnboardingLayout from "../SignUp/shared/Onboarding"


import GoToDashBoard from "../SignUp/dashboard/GoToDashBoard";

interface FormData {
    // Step 1 - Account Setup
    name?: string;
    email?: string;
    password?: string;
    
    // Step 2 - School & Role Information
    schoolName?: string;
    selectedGrades?: string[];
    selectedSubjects?: string[];
    
    // Step 3 - Goals
    selectedGoals?: string[];
    otherGoals?: string;
    
    // Step 4 - Class Setup
    classTitle?: string;
    useJoinCode?: boolean;
    roster?: any[];
    classCode?: string;
    autoAccounts?: any[];
    importOption?: string; // For tracking which import method was selected
}

export default function SignUp() {
    const [currentStep, setCurrentStep] = useState<number>(4);
    const [formData, setFormData] = useState<FormData>({});

    const goToNextStep = (): void => {
        setCurrentStep(prev => prev + 1);
    };

    const goToPrevStep = (): void => {
        setCurrentStep(prev => prev - 1);
    };

    const updateFormData = (newData: Partial<FormData>): void => {
        setFormData(prev => ({ ...prev, ...newData }));
        console.log("Updated formData:", { ...formData, ...newData });
    };

    const handleFinalSubmit = (): void => {
        console.log("Final form submission:", formData);
        // Handle final form submission here
        // Send to API, etc.
        goToNextStep(); // Go to dashboard
    };

    return (
        <OnboardingLayout>
            {currentStep === 1 && (
                <SignUpStep1 
                    formData={formData}
                    updateFormData={updateFormData}
                    onNext={goToNextStep}
                />
            )}

            {currentStep === 2 && (
                <SignUpStep2 
                    formData={formData}
                    updateFormData={updateFormData}
                    onNext={goToNextStep}
                    onBack={goToPrevStep}
                />
            )}

            {currentStep === 3 && (
                <SignUpStep3 
                    formData={formData}
                    updateFormData={updateFormData}
                    onNext={goToNextStep}
                    onBack={goToPrevStep}
                />
            )}

            {currentStep === 4 && <GoToDashBoard />}
            </OnboardingLayout>
    );
}