import { COLORS, RADIUS, SHADOWS } from '../../theme/adminTheme';

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      {/* Stop click inside from closing */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: COLORS.white,
          borderRadius: RADIUS.lg,
          padding: 32,
          maxWidth: 420,
          width: "90%",
          textAlign: "center",
          boxShadow: SHADOWS.hero,
        }}
      >
        {children}
      </div>
    </div>
  );
}