import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'blue' }) => {
  const sizeClasses = {
    xs: 'h-4 w-4 border-2',
    sm: 'h-8 w-8 border-3',
    md: 'h-12 w-12 border-4',
    lg: 'h-16 w-16 border-4',
  };

  const colorClasses = {
    blue: 'border-blue-500 border-t-transparent',
    white: 'border-white border-t-transparent',
    red: 'border-red-500 border-t-transparent',
  };

  return (
    <div className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}></div>
  );
};

export default LoadingSpinner;
