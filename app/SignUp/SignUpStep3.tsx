import React, { useState } from "react"

export default function SignUpStep3() {
    const [selectedGoals, setSelectedGoals] = useState<string[]>([])
    const [otherGoals, setOtherGoals] = useState('')

const allGoals = [
  "Identify student learning gaps",
  "Track student progress",
  "Provide differentiated assignments",
  "Reduce grading time",
  "Other"
];
    
    return (
        <div>
             <p>Step 3 of 4</p>
            <h1>What are your biggest goals while using Pathway Learning AI</h1>
            <form action="">
                {allGoals.map(goal => {
                    return <li>{goal}</li>
                })}
            </form>
        </div>
    )
}