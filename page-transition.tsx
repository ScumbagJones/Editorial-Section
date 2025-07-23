import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "wouter";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const [location] = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);

  useEffect(() => {
    if (location !== displayLocation) {
      setIsTransitioning(true);
      
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setIsTransitioning(false);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [location, displayLocation]);

  return (
    <div className="relative">
      {/* Transition overlay */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity duration-300 pointer-events-none ${
          isTransitioning ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      {/* Page content */}
      <div 
        className={`transition-all duration-300 ${
          isTransitioning ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
        }`}
      >
        {children}
      </div>
    </div>
  );
}