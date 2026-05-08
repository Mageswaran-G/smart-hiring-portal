// Card — white rounded container used throughout the app
// padding: 'sm' | 'md' | 'lg'

export default function Card({
  children,
  className = '',
  padding = 'md',
  onClick,
}) {
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl shadow-md
        ${paddings[padding]}
        ${onClick ? 'cursor-pointer hover:shadow-lg transition' : ''}
        ${className}
      `}>
      {children}
    </div>
  );
}