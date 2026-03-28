'use client';

import React, { useMemo } from 'react';

const STATUS_LABEL_FR = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  cancelled: 'Annulée',
  completed: 'Terminée',
};

function normalizeStatus(s) {
  return String(s || '').trim().toLowerCase();
}

export default function BookingStatusBadge({ status }) {
  const s = normalizeStatus(status);

  const ui = useMemo(() => {
    if (s === 'confirmed') {
      return {
        label: STATUS_LABEL_FR.confirmed,
        className: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
      };
    }
    if (s === 'cancelled' || s === 'canceled') {
      return {
        label: STATUS_LABEL_FR.cancelled,
        className: 'bg-red-50 text-red-700 ring-1 ring-red-200',
      };
    }
    if (s === 'completed') {
      return {
        label: STATUS_LABEL_FR.completed,
        className: 'bg-green-50 text-green-700 ring-1 ring-green-200',
      };
    }
    return {
      label: STATUS_LABEL_FR.pending,
      className: 'bg-gray-50 text-gray-700 ring-1 ring-gray-200',
    };
  }, [s]);

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${ui.className}`}>
      {ui.label}
    </span>
  );
}
