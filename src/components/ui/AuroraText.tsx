import React from 'react';

interface AuroraTextProps {
  children: React.ReactNode;
  className?: string;
}

export const AuroraText: React.FC<AuroraTextProps> = ({ children, className = '' }) => {
  return (
    <span
      className={`bg-gradient-to-r from-[#8E6D2F] via-[#D8B772] via-[#AD8942] to-[#8E6D2F] bg-[200%_auto] bg-clip-text text-transparent animate-[aurora-gradient_6s_ease_infinite] ${className}`}
    >
      {children}
    </span>
  );
};
