// Card.jsx — reusable card wrapper
// Use this instead of repeating background/border/shadow/radius everywhere

import { COLORS, SHADOWS, RADIUS, SPACING } from '../../theme/adminTheme';

const Card = ({
  children,
  className = '',
  style = {},
  padding = SPACING.card,
  radius = RADIUS.lg,
  shadow = SHADOWS.card,
  border = `1px solid ${COLORS.gray100}`,
  onClick,
}) => (
  <div
    className={className}
    onClick={onClick}
    style={{
      background: COLORS.white,
      borderRadius: radius,
      padding,
      boxShadow: shadow,
      border,
      ...style,
    }}
  >
    {children}
  </div>
);

export default Card;
