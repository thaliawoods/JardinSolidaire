'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function SkillsAndIntro({ gardenerId }) {
  const [gardener, setGardener] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!gardenerId) return;
        const res = await axios.get(`${API_BASE}/api/gardeners/${gardenerId}`);
        setGardener(res.data);
      } catch (error) {
        console.error('Erreur chargement jardinier :', error);
      }
    }
    fetchData();
  }, [gardenerId]);

  if (!gardener) return <p>Chargement...</p>;

  const competences =
    Array.isArray(gardener.competences)
      ? gardener.competences.map((c) =>
          typeof c === 'string' ? c : c?.nom || ''
        ).filter(Boolean)
      : [];

  const intro = gardener.presentation || gardener.biographie || 'Non renseigné.';

  return (
    <div className="bg-green-50 p-4 rounded-lg shadow-sm w-full">
      <h2 className="text-xl font-semibold text-green-900 mb-2">
        Liste des compétences
      </h2>
      <ul className="list-disc list-inside text-green-800 mb-4">
        {competences.length > 0 ? (
          competences.map((label, i) => <li key={i}>{label}</li>)
        ) : (
          <li>Aucune compétence renseignée.</li>
        )}
      </ul>

      <h2 className="text-xl font-semibold text-green-900 mb-2">
        Informations du jardinier
      </h2>
      <p className="text-green-800 whitespace-pre-line">{intro}</p>
    </div>
  );
}
