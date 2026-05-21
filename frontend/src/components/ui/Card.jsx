// Card.jsx — reusable card wrapper
// Use this instead of repeating background/border/shadow/radius everywhere

import { UI } from '@/constants/ui';

const Card = ({
  children,
  className = '',
  style = {},
  padding = UI.spacing.card,
  radius = UI.radius.lg,
  shadow = UI.shadow.card,
  border = UI.border.light,
  onClick,
}) => (
  <div
    className={className}
    onClick={onClick}
    style={{
      background: UI.colors.white,
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
