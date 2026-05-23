
// Reusable page wrapper — consistent maxWidth, padding, margin
// Usage: <PageContainer> ... </PageContainer>

export default function PageContainer({ children, maxWidth = 1200 }) {
  return (
    <div style={{
      padding: "16px 24px",
      maxWidth,
      margin: "0 auto",
      boxSizing: "border-box",
      width: "100%",
      overflowX: "hidden",
    }}>
      {children}
    </div>
  );
}