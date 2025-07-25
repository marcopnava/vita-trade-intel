import React from 'react';

interface StatusPillProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'info';
  onClick?: () => void;
}

export const StatusPill: React.FC<StatusPillProps> = ({ 
  children, 
  variant = 'success',
  onClick 
}) => {
  const variants = {
    success: 'status-open',
    warning: 'status-maintenance', 
    info: 'status-closed'
  };

  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-full text-xs font-medium border transition-all duration-200
        hover:scale-105 hover:shadow-sm
        ${variants[variant]}
      `}
    >
      {children}
    </button>
  );
};