import React from 'react';

interface VitaLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const VitaLogo: React.FC<VitaLogoProps> = ({ size = 'md', showText = true }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className={`${sizeClasses[size]} relative`}>
        {/* Circular logo with VA letters matching mockup */}
        <div className="absolute inset-0 rounded-full border border-primary bg-background/50 backdrop-blur-sm">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-primary font-semibold text-xs tracking-wider">VA</span>
          </div>
        </div>
      </div>
      {showText && (
        <div className="text-center">
          <div className={`font-semibold text-primary ${textSizeClasses[size]} tracking-wider`}>
            VITA
          </div>
          <div className="text-xs text-muted-foreground tracking-wide uppercase">
            Virtual Investment Technology Assistant
          </div>
        </div>
      )}
    </div>
  );
};