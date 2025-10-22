'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function BookingButton({ gardenId, className = '' }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(`/bookings/new?gardenId=${encodeURIComponent(gardenId)}`)}
      className={`rounded-full px-4 py-2 shadow hover:opacity-90 transition bg-pink-500 text-white ${className}`}
      aria-label="Réserver ce jardin"
    >
      Réserver ce jardin
    </button>
  );
}
