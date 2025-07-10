"use client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function usePageTransition() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const navigateWithTransition = (
    href: string, 
    direction: 'forward' | 'back' = 'forward'
  ) => {
    setIsNavigating(true);
    
    // Add a small delay to allow current page to start transition
    setTimeout(() => {
      router.push(href);
      setIsNavigating(false);
    }, 50);
  };

  const goBack = () => {
    setIsNavigating(true);
    setTimeout(() => {
      router.back();
      setIsNavigating(false);
    }, 50);
  };

  return {
    navigateWithTransition,
    goBack,
    isNavigating
  };
}
