'use client';

import React, { useEffect } from 'react';

export default function ConfirmModal({
  open,
  title = 'Confirmer',
  description = '',
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  danger = false,
  busy = false,
  onConfirm,
  onClose,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 1rem' }}
      aria-modal="true"
      role="dialog"
    >
      <button
        type="button"
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', border: 'none', cursor: 'pointer' }}
        onClick={onClose}
        aria-label="Fermer"
      />

      <div style={{ position: 'relative', width: '100%', maxWidth: 480, background: '#fff', border: '1px solid var(--border)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: danger ? '#b91c1c' : 'var(--foreground)' }}>
              {title}
            </div>
            {description ? (
              <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginTop: '0.375rem', whiteSpace: 'pre-line' }}>
                {description}
              </div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '0.875rem', padding: '0.25rem', flexShrink: 0 }}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            style={{ padding: '0.5rem 1.25rem', background: '#fff', color: 'var(--foreground)', border: '1px solid var(--border)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', opacity: busy ? 0.6 : 1 }}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            style={{ padding: '0.5rem 1.25rem', background: danger ? '#fff' : 'var(--green)', color: danger ? '#b91c1c' : '#fff', border: danger ? '1px solid #fca5a5' : 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 600, opacity: busy ? 0.6 : 1 }}
          >
            {busy ? '…' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
