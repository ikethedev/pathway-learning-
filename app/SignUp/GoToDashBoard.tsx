import React from "react"
import Link from 'next/link';


export default function GoToDashBoard(){
    return (
        <div>
            <h1>Yor're all set John Doe</h1>
            <Link href="/dashboard">
                Go to DashBoard
            </Link>
        </div>
    )
}