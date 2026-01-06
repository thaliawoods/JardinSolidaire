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
  // ESC pour fermer
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      aria-modal="true"
      role="dialog"
    >
      {/* overlay */}
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Fermer"
      />

      {/* panel */}
      <div className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className={`text-lg font-bold ${danger ? 'text-rose-700' : 'text-gray-900'}`}>
              {title}
            </div>

            {description ? (
              <div className="text-sm text-gray-600 mt-1 whitespace-pre-line">
                {description}
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-2 py-1 rounded-lg hover:bg-gray-50 text-gray-600"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="rounded-full px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 shadow-sm transition disabled:opacity-60"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`rounded-full px-5 py-2 font-semibold shadow-sm transition disabled:opacity-60 ${
              danger
                ? 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50'
                : 'bg-pink-500 hover:bg-pink-600 text-white'
            }`}
          >
            {busy ? '…' : confirmText}
          </button>
        </div>

        {/* petite barre gradient (ton style) */}
        <div
          className="mt-4 h-1 w-full rounded-full"
          style={{
            background:
              'linear-gradient(90deg, rgba(22,163,74,0.25), rgba(227,16,125,0.22))',
          }}
        />
      </div>
    </div>
  );
}
