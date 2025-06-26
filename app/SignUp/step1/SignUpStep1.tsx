import React, { ChangeEvent, useState } from "react"
import Link from 'next/link';
import sharedStyles from "../shared/FormStyles.module.css"
import formCommonStyles from "../shared/FormStyles.module.css"
import shareUi from "../../global/sharedUi.module.css";
import step1Styles from "./SignUpStep1.module.css"


export default function SignUpStep1({ onNext, formData, updateFormData }) {
    const [isValid, setIsValid] = useState(false);
    const [name, setName] = useState("");
    const [isNameValid, setIsNameValid] = useState(true);
    const [nameError, setNameError] = useState("");
    const [nameHasChanged, setNameHasChanged] = useState(false);
    const [nameTimer, setNameTimer] = useState(null);
    const [email, setEmail] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [emailError, setEmailError] = useState("");
    const [emailHasChanged, setEmailHasChanged] = useState(false);
    const [emailTimer, setEmailTimer] = useState(null);
    const [password, setPassword] = useState("")
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [passwordError, setPasswordError] = useState("");
    const [passwordHasChanged, setPasswordHasChanged] = useState(false);
    const [passwordTimer, setPasswordTimer] = useState(null);
    const [submitError, setSubmitError] = useState("");

    const updateName = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setName(value);
        
        // Clear any existing timer
        if (nameTimer) {
            clearTimeout(nameTimer);
        }
        
        // Set timer to show validation after 5 seconds
        const timer = setTimeout(() => {
            setNameHasChanged(true);
            
            // Validate name
            const nameRegex = /^[a-zA-Z\s]{2,}$/;
            const isValid = nameRegex.test(value);
            setIsNameValid(isValid);
            
            if (!isValid) {
                if (value.length === 0) {
                    setNameError("Name is required");
                } else if (value.length < 2) {
                    setNameError("Name must be at least 2 characters long");
                } else {
                    setNameError("Name can only contain letters and spaces");
                }
            } else {
                setNameError("");
            }
        }, 3000);
        
        setNameTimer(timer);
        
        // Clear submit error when user starts typing
        if (submitError) setSubmitError("");
    }

    const updatePassword = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        
        // Clear any existing timer
        if (passwordTimer) {
            clearTimeout(passwordTimer);
        }
        
        // Set timer to show validation after 5 seconds
        const timer = setTimeout(() => {
            setPasswordHasChanged(true);
            
            // Validate password
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
            const isValid = passwordRegex.test(value);
            setIsPasswordValid(isValid);
            
            if (!isValid) {
                if (value.length === 0) {
                    setPasswordError("Password is required");
                } else if (value.length < 8) {
                    setPasswordError("Password must be at least 8 characters long");
                } else {
                    setPasswordError("Password must contain uppercase, lowercase, number, and special character");
                }
            } else {
                setPasswordError("");
            }
        }, 3000);
        
        setPasswordTimer(timer);
        
        // Clear submit error when user starts typing
        if (submitError) setSubmitError("");
    };

    const updateEmail = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        
        // Clear any existing timer
        if (emailTimer) {
            clearTimeout(emailTimer);
        }
        
        // Set timer to show validation after 5 seconds
        const timer = setTimeout(() => {
            setEmailHasChanged(true);
            
            // Validate email
            const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            setIsEmailValid(isValid);
            
            if (!isValid) {
                if (value.length === 0) {
                    setEmailError("Email is required");
                } else {
                    setEmailError("Please enter a valid email address");
                }
            } else {
                setEmailError("");
            }
        }, 3000);
        
        setEmailTimer(timer);
        
        // Clear submit error when user starts typing
        if (submitError) setSubmitError("");
    }

    const handleSubmit = (e: React.MouseEvent) => {
        e.preventDefault()
        
        // Clear previous submit error
        setSubmitError("");
        
        // Trigger validation for all fields that haven't been changed yet
        if (!nameHasChanged) {
            setNameHasChanged(true);
            if (name === "") {
                setNameError("Name is required");
                setIsNameValid(false);
            }
        }
        
        if (!emailHasChanged) {
            setEmailHasChanged(true);
            if (email === "") {
                setEmailError("Email is required");
                setIsEmailValid(false);
            }
        }
        
        if (!passwordHasChanged) {
            setPasswordHasChanged(true);
            if (password === "") {
                setPasswordError("Password is required");
                setIsPasswordValid(false);
            }
        }
        
        // Check if all fields are valid
        if (!isNameValid || !isEmailValid || !isPasswordValid || name === "" || email === "" || password === "") {
            setSubmitError("Please fix the errors above before continuing");
            return;
        }
        
        // If everything is valid, proceed to next step
        onNext();
    }

    return (
        <div className={`${formCommonStyles["container"]}`}>
            <p className={sharedStyles['step']}>Step 1 of 3</p>
            <h1 className={sharedStyles['step-header']}>Account Setup</h1>
            <form
        action="submit"
        className={`${shareUi["column"]} ${formCommonStyles["form"]}`}
      >
                <input 
                    id="name" 
                    type="text" 
                    className={`${formCommonStyles["form-input"]} ${isNameValid ? null : "error"}`} 
                    placeholder="Name" 
                    value={name} 
                    onChange={updateName}
                />
                <span className={formCommonStyles["error-message"]}>
                    {nameHasChanged && nameError ? nameError : ""}
                </span>
                
                <input 
                    id="email" 
                    type="text" 
                    className={`${formCommonStyles["form-input"]} ${isEmailValid ? null : "error"}`} 
                    placeholder="Email" 
                    value={email}
                    onChange={updateEmail}
                />
                <span className={formCommonStyles["error-message"]}>
                    {emailHasChanged && emailError ? emailError : ""}
                </span>
                
                <input 
                    type="password" 
                    className={`${formCommonStyles["form-input"]} ${isPasswordValid ? null : "error"}`} 
                    placeholder="Password" 
                    value={password} 
                    onChange={updatePassword}
                />
                <span className={formCommonStyles["error-message"]}>
                    {passwordHasChanged && passwordError ? passwordError : ""}
                </span>
                
                {submitError && <div className={formCommonStyles["error-message"]}>{submitError}</div>}
                    <button onClick={handleSubmit}  className={`${shareUi["nav-buttons"]} ${step1Styles['next-btn']}`} >Next</button>
 
                <p className={step1Styles['login']}>
                    Already have an account?
                        <Link className={step1Styles['login_link']} href="/login">
                            Login
                        </Link>
        
                </p>
            </form>
        </div>
    )
}