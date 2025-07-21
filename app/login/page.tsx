'use client'
import React, { ChangeEvent, useState } from "react"
import Link from 'next/link';
import sharedStyles from "./shared/FormStyles.module.css"
import formCommonStyles from "./shared/FormStyles.module.css"
import shareUi from "../global/sharedUi.module.css";
import loginStyles from "./Login.module.css"
import { getSupabaseClient } from "app/lib/auth/supabaseClient"
import { useRouter } from "next/navigation"

export default function Login({ onLogin }) {
  

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

     
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async ({ email, password }) => {
        const supabase = getSupabaseClient()
        setIsLoading(true)
        
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
          })
    
          if (error) {
            console.error('Login error:', error.message)
            alert(`Login failed: ${error.message}`)
            return
          }
    
          if (data.user) {
            console.log('Login successful:', data.user)
            // Redirect to dashboard or home page
            router.push('/dashboard') // or wherever you want to redirect
          }
    
        } catch (error) {
          console.error('Unexpected error:', error)
          alert('An unexpected error occurred. Please try again.')
        } finally {
          setIsLoading(false)
        }
      }

    const updateEmail = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        
        // Clear any existing timer
        if (emailTimer) {
            clearTimeout(emailTimer);
        }
        
        // Set timer to show validation after 3 seconds
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

    const updatePassword = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        
        // Clear any existing timer
        if (passwordTimer) {
            clearTimeout(passwordTimer);
        }
        
        // Set timer to show validation after 3 seconds
        const timer = setTimeout(() => {
            setPasswordHasChanged(true);
            
            // Basic validation for login (just check if not empty)
            const isValid = value.length > 0;
            setIsPasswordValid(isValid);
            
            if (!isValid) {
                setPasswordError("Password is required");
            } else {
                setPasswordError("");
            }
        }, 3000);
        
        setPasswordTimer(timer);
        
        // Clear submit error when user starts typing
        if (submitError) setSubmitError("");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        // Clear previous submit error
        setSubmitError("");
        
        // Trigger validation for all fields that haven't been changed yet
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
        if (!isEmailValid || !isPasswordValid || email === "" || password === "") {
            setSubmitError("Please fix the errors above before continuing");
            return;
        }

        // If everything is valid, proceed with login

        handleLogin({ email, password })
      
    }

    return (
        <div className={`${formCommonStyles["container"]}`}>
            <h1 className={sharedStyles['step-header']}>Login</h1>
            <form
                className={`${shareUi["column"]} ${formCommonStyles["form"]}`}
            >
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
                
                <button 
                    type="button" 
                    onClick={handleSubmit} 
                    className={`${shareUi["nav-buttons"]} ${loginStyles['login-btn']}`}
                >
                    Login
                </button>

                <div className={loginStyles['forgot-password']}>
                    <Link className={loginStyles['forgot-password-link']} href="/forgot-password">
                        Forgot Password?
                    </Link>
                </div>
 
                <p className={loginStyles['signup']}>
                    Don't have an account?
                    <Link className={loginStyles['signup-link']}  href="/signup">
                        Sign Up
                    </Link>
                </p>
            </form>
        </div>
    )
}