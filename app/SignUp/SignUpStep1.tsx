import React from "react"
import Link from 'next/link';

export default function SignUpStepOne() {
    return (
        <>
            <p>Step 1 of 4</p>
            <h1>Account Setup</h1>
            <form action="">
                <input id="name" type="text" className="form-input" placeholder="Name"/>
                <input id="email" type="text" className="form-input" placeholder="Email"/>
                <input id="name" type="text" className="form-input" placeholder="Password"/>
                <p>
                    Already have an account?{' '}
                    <Link href="/login">
                        Login
                    </Link>
                </p>
            </form>
        </>
    )
}