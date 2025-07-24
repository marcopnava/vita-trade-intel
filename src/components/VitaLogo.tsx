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
    <div className="flex items-center space-x-3">
      <div className={`${sizeClasses[size]} relative`}>
        {/* Horizontal sliced design inspired by the reference */}
        <div className="absolute inset-0 overflow-hidden rounded-full bg-vita-gradient">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-background/20 h-px left-0 right-0"
              style={{
                top: `${(i + 1) * 8}%`,
                transform: `translateX(${i % 2 === 0 ? '0' : '10'}%)`,
                width: i % 2 === 0 ? '100%' : '80%'
              }}
            />
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-xs">VA</span>
        </div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-primary ${textSizeClasses[size]}`}>
            VITA
          </span>
          <span className="text-xs text-muted-foreground -mt-1">
            Virtual Investment Technology Assistant
          </span>
        </div>
      )}
    </div>
  );
};