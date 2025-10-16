'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

const ListeJardiniers = () => {
  const [jardiniers, setJardiniers] = useState([])
  const [favoris, setFavoris] = useState([])
  const [noteMin, setNoteMin] = useState('')
  const [type, setType] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const query = new URLSearchParams()
    if (search)  query.append('search', search)
    if (noteMin) query.append('note', noteMin)
    if (type)    query.append('type', type)

    fetch(`${API_BASE}/api/jardiniers?${query.toString()}`, { cache: 'no-store' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => setJardiniers(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error('Erreur chargement jardiniers', err)
        setJardiniers([])
      })
  }, [search, noteMin, type])

  const toggleFavori = (id) => {
    setFavoris(prev =>
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    )
  }

  const resetFilters = () => {
    setSearch('')
    setNoteMin('')
    setType('')
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-white">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-800">Nos Jardiniers</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        {/* Recherche */}
        <div className="relative w-full lg:w-[30%]">
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Rechercher un jardinier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 text-sm text-gray-700"
          />
        </div>

        {/* Note minimale */}
        <input
          type="number"
          step="0.1"
          placeholder="Note minimale"
          value={noteMin}
          onChange={(e) => setNoteMin(e.target.value)}
          className="px-4 py-2 rounded-full border border-gray-300 text-sm text-gray-700"
        />

        {/* Type (facultatif si pas géré par l’API) */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="px-4 py-2 rounded-full border border-gray-300 text-sm text-gray-700"
        >
          <option value="">Type de jardinage</option>
          <option value="potager">Potager</option>
          <option value="fleurs">Fleurs</option>
          <option value="permaculture">Permaculture</option>
          <option value="jardinage">Apprendre le jardinage</option>
          <option value="tondre">Tondre</option>
        </select>

        <button
          onClick={resetFilters}
          className="px-5 py-2 rounded-full bg-[#E3107D] hover:bg-[#c30c6a] text-white"
        >
          Réinitialiser
        </button>
      </div>

      <div className="space-y-6">
        {jardiniers.map((jardinier) => (
          <Link key={jardinier.id_utilisateur} href={`/jardinier/${jardinier.id_utilisateur}`} className="block">
            <article className="flex bg-green-100 rounded-xl shadow p-4 hover:shadow-md transition">
              <div className="w-32 h-32 bg-green-300 rounded shadow relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={jardinier.photo_profil || '/assets/default-avatar.jpg'}
                  alt={`${jardinier.prenom} ${jardinier.nom}`}
                  className="object-cover w-full h-full"
                />
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); toggleFavori(jardinier.id_utilisateur) }}
                  className="absolute top-2 right-2 text-xl hover:scale-125 transition"
                  aria-label="Ajouter/retirer des favoris"
                >
                  {favoris.includes(jardinier.id_utilisateur) ? (
                    <span className="text-pink-500">♥</span>
                  ) : (
                    <span className="text-gray-400">♡</span>
                  )}
                </button>
              </div>

              <div className="ml-6 flex flex-col justify-center">
                <p className="text-sm text-gray-600"><strong>Nom :</strong> {jardinier.nom}</p>
                <p className="text-sm text-gray-600"><strong>Prénom :</strong> {jardinier.prenom}</p>
                <p className="text-sm text-gray-600"><strong>Description :</strong> {jardinier.biographie}</p>
                <p className="text-sm text-gray-600"><strong>Téléphone :</strong> {jardinier.telephone}</p>
                <p className="text-sm text-gray-600">📍 {jardinier.adresse}</p>
                <p className="text-sm text-gray-600"><strong>Note :</strong> {jardinier.note_moyenne ?? '—'}★</p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ListeJardiniers
