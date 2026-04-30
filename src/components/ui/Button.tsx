import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'outline' | 'solid';
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'solid', 
  onClick, 
  className = '' 
}) => {
  const baseStyle = "px-8 py-3 rounded-xl text-lg font-semibold transition-all shadow-md";
  
  const variants = {
    outline: "text-white border-2 border-white hover:bg-white/10",
    solid: "text-white bg-ftech-orange hover:bg-ftech-orange/90 shadow-xl"
  };
  
  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;