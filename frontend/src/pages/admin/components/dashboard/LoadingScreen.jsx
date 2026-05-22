import { COLORS } from '../../../../theme/adminTheme';

export default function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      background: COLORS.gray50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 12,
    }}>
      <div style={{
        width: 40,
        height: 40,
        border: `3px solid ${COLORS.border}`,
        borderTopColor: COLORS.primary,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: COLORS.gray400, fontSize: 14 }}>
        Loading admin panel…
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}