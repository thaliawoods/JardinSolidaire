'use client';

import GardensMap from '@/components/Map/GardensMap';

export default function MapPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-green-700 mb-4">Carte des jardins</h1>
      <p className="text-gray-600 mb-4">
        Retrouvez ici tous les jardins de JardinSolidaire. Activez la localisation pour centrer la carte.
      </p>
      <div className="rounded-2xl overflow-hidden shadow">
        <GardensMap fullPage={false} height="70vh" />
      </div>
    </div>
  );
}
