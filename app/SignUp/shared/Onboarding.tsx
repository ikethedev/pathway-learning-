import React from 'react'
import styles from './OnboardingLayout.module.css'

interface OnboardingLayoutProps {
  children: React.ReactNode
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        {children}
      </div>
    </div>
  )
}