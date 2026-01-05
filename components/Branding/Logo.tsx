
import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  hideText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-12", variant = 'dark', hideText = false }) => {
  const color = variant === 'light' ? '#FFFFFF' : '#020617';
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* The abstract circular icon from the image */}
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto shrink-0">
        <path d="M50 20C33.4315 20 20 33.4315 20 50C20 66.5685 33.4315 80 50 80C66.5685 80 80 66.5685 80 50" stroke={color} strokeWidth="8" strokeLinecap="round" />
        <path d="M50 35C41.7157 35 35 41.7157 35 50C35 58.2843 41.7157 65 50 65C58.2843 65 65 58.2843 65 50" stroke={color} strokeWidth="8" strokeLinecap="round" />
        <circle cx="50" cy="50" r="8" fill={color} />
        <path d="M50 50H80" stroke={color} strokeWidth="8" strokeLinecap="round" />
      </svg>
      
      {!hideText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-baseline gap-0.5">
            <span style={{ color }} className="text-3xl font-black tracking-[-0.05em] leading-none">B</span>
            <span style={{ color }} className="text-3xl font-black tracking-[-0.05em] leading-none">S</span>
            <span style={{ color }} className="text-3xl font-black tracking-[-0.05em] leading-none">D</span>
          </div>
          <span style={{ color, opacity: 0.8 }} className="text-[7px] font-black uppercase tracking-[0.4em] leading-none mt-1">
            Business Developers
          </span>
        </div>
      )}
    </div>
  );
};
