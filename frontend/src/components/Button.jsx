import React from 'react';

const Button = ({
  children,
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const handleClick = (e) => {
    if (!disabled && !loading && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      className={` bg-blue-600  hover:bg-blue-700  text-white 
        font-medium py-2 px-4 rounded transition duration-200 ease-in-out
        focus:outline-none focus:ring-2  focus:ring-blue-500 focus:ring-offset-2
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};

export default Button;