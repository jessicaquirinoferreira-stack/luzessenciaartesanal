import React from 'react';

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children: React.ReactNode;
}

export const ShimmerButton: React.FC<ShimmerButtonProps> = ({
  shimmerColor = '#F5D77F',
  shimmerDuration = '3s',
  borderRadius = '1rem',
  background = '#2E251C',
  className = '',
  children,
  ...props
}) => {
  return (
    <button
      style={{
        borderRadius,
        backgroundColor: background,
      }}
      className={`group relative overflow-hidden px-6 py-3.5 text-white font-medium text-xs sm:text-sm transition-all duration-300 hover:shadow-lg active:scale-[0.98] disabled:opacity-50 cursor-pointer ${className}`}
      {...props}
    >
      {/* Moving Shimmer Beam */}
      <span
        style={{
          animationDuration: shimmerDuration,
        }}
        className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
      />

      {/* Radiant Glow on hover */}
      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-[#C5A059]/20 to-transparent pointer-events-none" />

      {/* Button Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};
