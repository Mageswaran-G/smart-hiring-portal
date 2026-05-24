// ConfirmModal.jsx — Production-grade reusable confirmation modal

import { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

const COLORS = {
  danger  : { icon:'#dc2626', bg:'#fef2f2', btn:'#dc2626' },
  warning : { icon:'#d97706', bg:'#fef3c7', btn:'#d97706' },
  info    : { icon:'#3b82f6', bg:'#eff6ff', btn:'#3b82f6' },
};

export default function ConfirmModal({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'danger',
}) {
  const confirmRef = useRef(null);
  const c = COLORS[type] || COLORS.danger;

  // Body scroll lock + ESC key + auto focus
  useEffect(() => {
    if (!isOpen) return;

    // Lock scroll
    document.body.style.overflow = 'hidden';

    // Auto focus confirm button
    setTimeout(() => confirmRef.current?.focus(), 50);

    // ESC key
    const handleKey = (e) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter') onConfirm();
    };
    document.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onCancel, onConfirm]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onCancel}
        style={{
          position:'fixed', inset:0,
          background:'rgba(0,0,0,0.55)',
          zIndex:1000,
          backdropFilter:'blur(3px)',
          animation:'cmFadeIn 0.15s ease',
        }}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cm-title"
        aria-describedby="cm-message"
        style={{
          position:'fixed', top:'50%', left:'50%',
          transform:'translate(-50%, -50%)',
          background:'#fff', borderRadius:20,
          padding:'28px 24px 24px',
          width:'calc(100% - 32px)', maxWidth:420,
          maxHeight:'calc(100vh - 32px)', overflowY:'auto',
          zIndex:1001,
          boxShadow:'0 24px 64px rgba(0,0,0,0.22)',
          animation:'cmSlideUp 0.2s ease',
        }}
      >
        {/* Close button */}
        <button
          onClick={onCancel}
          style={{ position:'absolute', top:14, right:14, background:'#f3f4f6', border:'none', borderRadius:8, width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#6b7280', transition:'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background='#e5e7eb'}
          onMouseLeave={e => e.currentTarget.style.background='#f3f4f6'}
        >
          <X size={16} />
        </button>

        {/* Icon */}
        <div style={{ width:52, height:52, borderRadius:14, background:c.bg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
          <AlertTriangle size={24} color={c.icon} />
        </div>

        {/* Title */}
        <h2 id="cm-title" style={{ fontWeight:800, fontSize:18, color:'#111827', margin:'0 0 8px', letterSpacing:'-0.3px' }}>
          {title}
        </h2>

        {/* Message */}
        <p id="cm-message" style={{ fontSize:14, color:'#6b7280', margin:'0 0 24px', lineHeight:1.6 }}>
          {message}
        </p>

        {/* Buttons */}
        <div className="cm-actions" style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          <button
            onClick={onCancel}
            style={{ flex:1, minWidth:120, padding:'11px', borderRadius:10, border:'1px solid #e5e7eb', background:'#fff', color:'#374151', fontSize:14, fontWeight:600, cursor:'pointer', transition:'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background='#f9fafb'}
            onMouseLeave={e => e.currentTarget.style.background='#fff'}
          >
            {cancelText}
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            style={{ flex:1, minWidth:120, padding:'11px', borderRadius:10, border:'none', background:c.btn, color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer', transition:'opacity 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.opacity='0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity='1'}
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes cmFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes cmSlideUp { from{opacity:0;transform:translate(-50%,-47%)} to{opacity:1;transform:translate(-50%,-50%)} }
        @media (max-width:400px) { .cm-actions { flex-direction:column-reverse; } }
      `}</style>
    </>
  );
}
