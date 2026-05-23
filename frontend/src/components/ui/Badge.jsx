import { COLORS } from '../../theme/adminTheme';

const VARIANTS = {
  primary: { bg: COLORS.light,   color: COLORS.primary, border: `1px solid ${COLORS.border}` },
  success: { bg: '#f0fdf4',         color: COLORS.successText, border: '1px solid #bbf7d0' },
  warning: { bg: '#fffbeb',         color: '#92400e',         border: '1px solid #fcd34d' },
  danger:  { bg: '#fef2f2',         color: COLORS.dangerText,  border: '1px solid #fecaca' },
  neutral: { bg: COLORS.gray100, color: COLORS.gray500, border: `1px solid ${COLORS.gray100}` },
  info:    { bg: '#eff6ff',         color: '#1d4ed8',         border: '1px solid #bfdbfe' },
  orange:  { bg: '#fff7ed',         color: '#ea580c',  border: '1px solid #fed7aa' },
};

const Badge = ({
  children,
  variant = 'gray',
  size = 'md',
  className = '',
  style = {},
}) => {
  const v = VARIANTS[variant] || VARIANTS.gray;
  const padding = size === 'sm' ? '2px 8px' : '4px 12px';
  const fontSize = size === 'sm' ? 10 : 12;

  return (
    <span className={className} style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding,
      fontSize,
      fontWeight: 700,
      borderRadius: 20,
      background: v.bg,
      color: v.color,
      border: v.border,
      letterSpacing: '0.3px',
      whiteSpace: 'nowrap',
      ...style,
    }}>
      {children}
    </span>
  );
};

export default Badge;
