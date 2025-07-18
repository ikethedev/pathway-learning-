import React, { useState } from "react";
import SignUpStep1 from "../SignUp/step1/SignUpStep1";
import SignUpStep2 from "../SignUp/step2/SignUpStep2";
import SignUpStep3 from "../SignUp/step3/SignUpStep3";
import OnboardingLayout from "../SignUp/shared/Onboarding"
import { createClient } from '@supabase/supabase-js'
import GoToDashBoard from "../SignUp/dashboard/GoToDashBoard";


// api key 
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface FormData {
    // Step 1 - Account Setup
    name?: string;
    email?: string;
    password?: string;
    
    // Step 2 - School & Role Information
    state?: string;
    schoolName?: string;
    district?: string;
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
    const [currentStep, setCurrentStep] = useState<number>(1);
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

    const handleFinalSubmit = async (): Promise<void> => {
        try {
            console.log("Final form submission:", formData);
            
            // Validate required fields
            if (!formData.email || !formData.password || !formData.name) {
                throw new Error("Missing required fields");
            }
    
            // 1. Create the user account with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        name: formData.name,
                    }
                }
            });
    
            if (authError) {
                throw new Error(authError.message);
            }
    
            // 2. Sign in the user immediately after signup
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password
            });
    
            if (signInError) {
                throw new Error(signInError.message);
            }
    
            // 3. Now insert the profile (user is authenticated)
            if (signInData.user) {
                const { error: profileError } = await supabase
                    .from('user_profiles')
                    .insert({
                        id: signInData.user.id,
                        name: formData.name,
                        email: formData.email,
                        school_name: formData.schoolName,
                        selected_grades: formData.selectedGrades || [],
                        selected_subjects: formData.selectedSubjects || [],
                        selected_goals: formData.selectedGoals || [],
                        other_goals: formData.otherGoals
                    });
    
                if (profileError) {
                    throw new Error(`Profile creation failed: ${profileError.message}`);
                }
    
                console.log('User successfully created and signed in:', signInData.user);
                goToNextStep(); // Go to dashboard
            }
        } catch (error) {
            console.error('Signup error:', error);
            alert(`Signup failed: ${error.message}`);
        }
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
                    handleFinalSubmit={handleFinalSubmit}
                    onNext={goToNextStep}
                    onBack={goToPrevStep}
                />
            )}

            {currentStep === 4 && <GoToDashBoard formData={formData} />}
            </OnboardingLayout>
    );
}