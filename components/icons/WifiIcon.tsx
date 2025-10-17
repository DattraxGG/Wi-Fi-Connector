
import React from 'react';

interface WifiIconProps {
  level: number; // 1 to 4
  className?: string;
}

export const WifiIcon: React.FC<WifiIconProps> = ({ level, className = 'w-6 h-6' }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M5 12.55a11 11 0 0 1 14.08 0" className={level >= 1 ? 'opacity-100' : 'opacity-20'}></path>
      <path d="M1.42 9a16 16 0 0 1 21.16 0" className={level >= 2 ? 'opacity-100' : 'opacity-20'}></path>
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" className={level >= 3 ? 'opacity-100' : 'opacity-20'}></path>
      <line x1="12" y1="20" x2="12.01" y2="20" className={level >= 4 ? 'opacity-100' : 'opacity-20'}></line>
    </svg>
  );
};
