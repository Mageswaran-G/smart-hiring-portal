// Button — reusable button component
// variant: 'primary' | 'outline' | 'ghost'
// size: 'sm' | 'md' | 'lg'

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  className = '',
}) {
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variants = {
    primary: 'bg-gray-900 text-white hover:bg-gray-800 border-none',
    outline: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50',
    ghost:   'bg-transparent text-gray-500 border-none hover:bg-gray-100',
    danger:  'bg-red-500 text-white hover:bg-red-600 border-none',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold rounded-lg cursor-pointer
        transition duration-150
        disabled:opacity-60 disabled:cursor-not-allowed
        ${sizes[size]}
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}>
      {children}
    </button>
  );
}