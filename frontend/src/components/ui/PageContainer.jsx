import { SPACING } from '../../theme/adminTheme';

export default function PageContainer({ children, maxWidth = 1200 }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 640;
  
  return (
    <div style={{
      paddingTop: SPACING.pageY,
      paddingBottom: SPACING.pageY,
      paddingLeft: isMobile ? 12 : SPACING.pageX,
      paddingRight: isMobile ? 12 : SPACING.pageX,
      maxWidth,
      margin: "0 auto",
      boxSizing: "border-box",
      width: "100%",
    }}>
      {children}
    </div>
  );
}