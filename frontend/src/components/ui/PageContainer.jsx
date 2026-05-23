import { SPACING } from '../../theme/adminTheme';

export default function PageContainer({ children, maxWidth = 1200 }) {
  return (
    <div style={{
      padding: `${SPACING.pageY}px ${SPACING.pageX}px`,
      maxWidth,
      margin: "0 auto",
      boxSizing: "border-box",
      width: "100%",
    }}>
      {children}
    </div>
  );
}