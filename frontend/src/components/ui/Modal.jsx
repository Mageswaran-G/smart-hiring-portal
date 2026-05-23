import { useEffect } from 'react';
import { COLORS, RADIUS, SHADOWS } from '../../theme/adminTheme';

export default function Modal({ isOpen, onClose, children }) {
  
  // Close on ESC key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

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
      <div
        role="dialog"
        aria-modal="true"
        onClick={e => e.stopPropagation()}
        style={{
          background: COLORS.white,
          borderRadius: RADIUS.lg,
          padding: 32,
          maxWidth: 420,
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
          textAlign: "center",
          boxShadow: SHADOWS.hero,
        }}
      >
        {children}
      </div>
    </div>
  );
}