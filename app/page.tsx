'use client'
import { useState } from 'react'
import React from 'react'
import SignUp from './pages/signup'
import Dashboard from './dashboard/page'
import Login from './login/page'


export default function Page() {
  const [isLogginIn, setIsLogginIn] = useState(true);
  


  return (
    <div >
     <Dashboard />
    </div>
  );
}