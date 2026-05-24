// ConfirmModal.jsx — Reusable confirmation modal
// Replaces window.confirm() with premium UI

import { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'danger', // 'danger' | 'warning' | 'info'
}) {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onCancel(); };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const colors = {
    danger  : { icon:'#dc2626', bg:'#fef2f2', btn:'#dc2626', btnHover:'#b91c1c' },
    warning : { icon:'#d97706', bg:'#fef3c7', btn:'#d97706', btnHover:'#b45309' },
    info    : { icon:'#3b82f6', bg:'#eff6ff', btn:'#3b82f6', btnHover:'#2563eb' },
  };
  const c = colors[type] || colors.danger;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onCancel}
        style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,0.5)',
          zIndex:1000, backdropFilter:'blur(2px)',
          animation:'fadeIn 0.15s ease',
        }}
      />

      {/* Modal */}
      <div style={{
        position:'fixed', top:'50%', left:'50%',
        transform:'translate(-50%, -50%)',
        background:'#fff', borderRadius:20, padding:'28px 28px 24px',
        width:'100%', maxWidth:420, zIndex:1001,
        boxShadow:'0 20px 60px rgba(0,0,0,0.2)',
        animation:'slideUp 0.2s ease',
      }}>
        {/* Close button */}
        <button
          onClick={onCancel}
          style={{ position:'absolute', top:16, right:16, background:'#f3f4f6', border:'none', borderRadius:8, width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#6b7280' }}
        >
          <X size={16} />
        </button>

        {/* Icon */}
        <div style={{ width:52, height:52, borderRadius:14, background:c.bg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
          <AlertTriangle size={24} color={c.icon} />
        </div>

        {/* Title */}
        <h2 style={{ fontWeight:800, fontSize:18, color:'#111827', margin:'0 0 8px', letterSpacing:'-0.3px' }}>
          {title}
        </h2>

        {/* Message */}
        <p style={{ fontSize:14, color:'#6b7280', margin:'0 0 24px', lineHeight:1.6 }}>
          {message}
        </p>

        {/* Buttons */}
        <div style={{ display:'flex', gap:10 }}>
          <button
            onClick={onCancel}
            style={{ flex:1, padding:'11px', borderRadius:10, border:'1px solid #e5e7eb', background:'#fff', color:'#374151', fontSize:14, fontWeight:600, cursor:'pointer' }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{ flex:1, padding:'11px', borderRadius:10, border:'none', background:c.btn, color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer' }}
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translate(-50%,-48%)} to{opacity:1;transform:translate(-50%,-50%)} }
      `}</style>
    </>
  );
}
