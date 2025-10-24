'use client';

import Link from 'next/link';
import GardensMap from '@/components/Map/GardensMap';

export default function HomeMapSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-2xl font-semibold text-green-700">Les Jardins sur la carte</h3>
        <Link
          href="/map"
          className="text-sm bg-pink-500 hover:bg-pink-600 text-white px-3 py-1.5 rounded"
        >
          Ouvrir la carte
        </Link>
      </div>
      <GardensMap height="360px" />
    </section>
  );
}
