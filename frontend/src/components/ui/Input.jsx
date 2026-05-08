// Input — reusable text input
// Consistent styling across all forms

export default function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  disabled = false,
  multiline = false,
  rows = 3,
  focusColor = '#E65C00',
  hint = '',
}) {
  const baseClass = `
    w-full px-3.5 py-2.5
    border border-gray-200 rounded-lg
    text-sm text-gray-800
    outline-none
    transition duration-150
    disabled:opacity-60 disabled:cursor-not-allowed
  `;

  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
          {label}
        </label>
      )}
      {multiline ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={`${baseClass} resize-y`}
          onFocus={e => e.target.style.borderColor = focusColor}
          onBlur={e  => e.target.style.borderColor = '#e5e7eb'}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={baseClass}
          onFocus={e => e.target.style.borderColor = focusColor}
          onBlur={e  => e.target.style.borderColor = '#e5e7eb'}
        />
      )}
      {hint && <p className="text-xs text-gray-300 mt-1">{hint}</p>}
    </div>
  );
}