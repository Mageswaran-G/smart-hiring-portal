// PageContainer.jsx — Reusable page wrapper
// Consistent max-width, padding for all admin pages

import { SPACING } from '../../theme/adminTheme';
import useIsMobile from '../../hooks/useIsMobile';

export default function PageContainer({ children, maxWidth = 1200 }) {
  const isMobile = useIsMobile();

  return (
    <div style={{
      paddingTop: SPACING.pageY,
      paddingBottom: SPACING.pageY,
      paddingLeft: isMobile ? 12 : SPACING.pageX,
      paddingRight: isMobile ? 12 : SPACING.pageX,
      maxWidth,
      margin: '0 auto',
      boxSizing: 'border-box',
      width: '100%',
    }}>
      {children}
    </div>
  );
}
