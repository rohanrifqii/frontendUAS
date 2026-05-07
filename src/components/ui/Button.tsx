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
  const baseStyle = "px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-300";
  
  const variants = {
    outline: "text-white border-2 border-white/30 hover:border-white hover:bg-white/10 backdrop-blur-sm",
    solid: "text-white bg-gradient-to-r from-ftech-orange to-orange-400 hover:shadow-lg hover:shadow-ftech-orange/40 hover:scale-[1.02] active:scale-[0.98]"
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