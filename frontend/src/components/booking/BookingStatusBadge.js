'use client';

import React from 'react';

const colors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-green-100 text-green-800',
};

export default function BookingStatusBadge({ status }) {
  const cls = colors[status] || 'bg-gray-100 text-gray-800';
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${cls}`}>
      {status}
    </span>
  );
}
