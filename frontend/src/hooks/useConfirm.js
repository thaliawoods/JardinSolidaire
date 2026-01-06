'use client';

import { useCallback, useState } from 'react';

export function useConfirm() {
  const [state, setState] = useState({
    open: false,
    title: '',
    description: '',
    confirmText: 'Confirmer',
    cancelText: 'Annuler',
    danger: false,
    onConfirm: null,
  });

  const openConfirm = useCallback((opts) => {
    setState({
      open: true,
      title: opts?.title || 'Confirmer',
      description: opts?.description || '',
      confirmText: opts?.confirmText || 'Confirmer',
      cancelText: opts?.cancelText || 'Annuler',
      danger: !!opts?.danger,
      onConfirm: opts?.onConfirm || null,
    });
  }, []);

  const closeConfirm = useCallback(() => {
    setState((s) => ({ ...s, open: false }));
  }, []);

  return { confirm: openConfirm, confirmState: state, closeConfirm };
}
