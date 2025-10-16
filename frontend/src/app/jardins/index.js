'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Slider from 'react-slick';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const ListeJardins = () => {
  const [favoris, setFavoris] = useState([]);
  const [search, setSearch] = useState('');
  const [quartier, setQuartier] = useState('');
  const [type, setType] = useState('');
  const [jardins, setJardins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    const query = new URLSearchParams();
    if (search) query.append('search', search);
    if (quartier) query.append('quartier', quartier);
    if (type) query.append('type', type);

    setLoading(true);
    setErr('');

    fetch(`${API_BASE}/api/jardins?${query.toString()}`, { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const liste = Array.isArray(data) ? data : data?.jardins;
        setJardins(liste || []);
      })
      .catch((e) => {
        console.error('❌ Erreur chargement jardins', e);
        setErr("Impossible de charger les jardins.");
        setJardins([]);
      })
      .finally(() => setLoading(false));
  }, [search, quartier, type]);

  const toggleFavori = (id) => {
    setFavoris((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const reset = () => {
    setSearch('');
    setQuartier('');
    setType('');
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-white">
      <h1 className="text-3xl font-bold mb-8 text-center text-green-800">
        Nos Jardins Solidaires
      </h1>

      <div className="mb-8 flex flex-col lg:flex-row items-center gap-4 flex-wrap">
        {/* Barre de recherche */}
        <div className="relative w-full lg:w-[30%]">
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Rechercher un jardin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 text-sm text-gray-700"
          />
        </div>

        {/* Sélecteur type */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 w-full lg:w-[20%] text-sm text-gray-700"
        >
          <option value="">Tous les types de jardins</option>
          <option value="potager">Potager</option>
          <option value="serre">Serre</option>
          <option value="fleurs">Fleurs</option>
          <option value="tondre">Tondre</option>
        </select>

        <button
          onClick={reset}
          className="px-5 py-2 rounded-full bg-[#E3107D] hover:bg-[#c30c6a] text-white transition w-full lg:w-auto"
        >
          Réinitialiser
        </button>
      </div>

      {loading && <p className="text-center text-gray-500">Chargement…</p>}
      {!!err && (
        <p className="text-center text-red-600 mb-4">{err}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {jardins.map((jardin) => (
          <Link
            key={jardin.id_jardin}
            href={`/jardins/${jardin.id_jardin}`}
            className="block"
          >
            <div className="bg-green-100 rounded-2xl overflow-hidden shadow-md relative group hover:shadow-xl transition">
              {/* Image */}
              <div className="h-48 overflow-hidden">
                {Array.isArray(jardin.photos) && jardin.photos.length > 0 ? (
                  <Slider dots infinite speed={500} slidesToShow={1} slidesToScroll={1}>
                    {jardin.photos.map((photo, index) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={index}
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="h-48 w-full object-cover"
                      />
                    ))}
                  </Slider>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src="/assets/default.jpg"
                    alt="Image par défaut"
                    className="h-48 w-full object-cover"
                  />
                )}
              </div>

              {/* Texte */}
              <div className="px-3 py-2 text-sm text-gray-700">
                {/* Titre + cœur */}
                <div className="flex justify-between items-start mb-1">
                  <h2 className="font-bold text-base text-green-900">
                    {jardin.titre}
                  </h2>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavori(jardin.id_jardin);
                    }}
                    className="text-xl transition-transform transform hover:scale-125"
                    aria-label="Ajouter aux favoris"
                  >
                    {favoris.includes(jardin.id_jardin) ? (
                      <span className="text-pink-500">♥</span>
                    ) : (
                      <span className="text-gray-400">♡</span>
                    )}
                  </button>
                </div>

                <p className="text-xs leading-tight">{jardin.description}</p>
                <p className="text-xs leading-tight">{jardin.adresse}</p>
                <p className="text-xs leading-tight">{jardin.type}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ListeJardins;
