// Badge — small colored pill label
// Used for role labels, status indicators

export default function Badge({ children, className = '' }) {
  return (
    <span className={`
      inline-block px-3 py-0.5 rounded-full
      text-xs font-bold tracking-wide
      ${className}
    `}>
      {children}
    </span>
  );
}