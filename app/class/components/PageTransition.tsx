"use client";
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import styles from './PageTransition.module.css';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const [displayChildren, setDisplayChildren] = useState(children);
  const pathname = usePathname();
  const previousPathnameRef = useRef(pathname);

  // Define route hierarchy for slide direction
  const routeHierarchy = [
    '/dashboard',
    '/class',
    '/assignment',
    '/gradebook'
  ];

  const getRouteLevel = (path: string) => {
    // Extract base route from path (e.g., '/class/123' -> '/class')
    const baseRoute = '/' + path.split('/')[1];
    return routeHierarchy.indexOf(baseRoute);
  };

  useEffect(() => {
    if (pathname !== previousPathnameRef.current) {
      const previousLevel = getRouteLevel(previousPathnameRef.current);
      const currentLevel = getRouteLevel(pathname);
      
      // Determine slide direction based on route hierarchy
      const direction = currentLevel > previousLevel ? 'right' : 'left';
      setSlideDirection(direction);
      
      setIsTransitioning(true);
      
      // Start transition
      const timer = setTimeout(() => {
        setDisplayChildren(children);
        setIsTransitioning(false);
      }, 150); // Half of transition duration
      
      previousPathnameRef.current = pathname;
      
      return () => clearTimeout(timer);
    }
  }, [pathname, children]);

  return (
    <div className={styles.transitionContainer}>
      <div 
        className={`${styles.pageWrapper} ${
          isTransitioning 
            ? slideDirection === 'right' 
              ? styles.slideOutLeft 
              : styles.slideOutRight
            : styles.slideIn
        }`}
      >
        {displayChildren}
      </div>
    </div>
  );
}