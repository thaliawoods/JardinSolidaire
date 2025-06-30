'use client'

import React, { useEffect, useState} from 'react'

const ListeJardiniers = () => {
    const [jardiniers, setJardiniers] = useState([])
    const [favoris, setFavoris] = useState([])
    // const [ageMin, setAgeMin] = useState('');
    const [noteMin, setNoteMin] = useState('');
    const [type, setType] = useState('');
    const [search, setSearch] = useState('')

    useEffect(() => {

    const query = new URLSearchParams();
      if (search)  query.append('search', search);
      // if (ageMin)  query.append('age', ageMin);
      if (noteMin) query.append('note', noteMin);
      if (type)    query.append('type', type);

    fetch(`http://localhost:5001/api/jardiniers?${query.toString()}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        // Si data n'est pas un array, on force à []
        const liste = Array.isArray(data) ? data : [];
        console.log('🧑‍🌾 Jardiniers (Array.isArray):', Array.isArray(data), data);
        setJardiniers(liste);
      })
      .catch(err => {
        console.error('Erreur chargement jardiniers', err);
        setJardiniers([]);  // on vide pour éviter le crash
      });
  }, [search, /*ageMin,*/ noteMin, type]);
    
  
    const toggleFavori = (id) => {
        setFavoris(prev =>
            prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
          )
    }

    return (
        <div className="min-h-screen px-6 py-10 bg-white">
          <h1 className="text-3xl font-bold mb-6 text-center text-green-800">Nos Jardiniers</h1>
    

          <div className="flex flex-wrap gap-4 mb-6">
            {/* Barre de recherche stylisée */}
            <div className="relative w-full lg:w-[30%]">
                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                <input
                type="text"
                placeholder="Rechercher un jardinier..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2  text-sm text-gray-700"
                />
            </div>
            {/* Filtres Age*/}
            {/* <input
              type="number"
              placeholder="Âge minimum"
              value={ageMin}
              onChange={(e) => setAgeMin(e.target.value)}
              className="px-4 py-2 rounded-full border border-gray-300 rounded px-4 py-2 text-sm text-gray-700"
            /> */}
            {/* Filtres Note*/}
            <input
              type="number"
              step="0.1"
              placeholder="Note minimale"
              value={noteMin}
              onChange={(e) => setNoteMin(e.target.value)}
              className="px-4 py-2 rounded-full border border-gray-300 rounded px-4 py-2 text-sm text-gray-700"
            />
            {/* Filtres Type de jardinage*/}
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-4 py-2 rounded-full border border-gray-300 rounded px-4 py-2 text-sm text-gray-700"
            >
              <option value="">Type de jardinage</option>
              <option value="potager">Potager</option>
              <option value="fleurs">Fleurs</option>
              <option value="permaculture">Permaculture</option>
              <option value="jardinage">Apprendre le jardinage</option>
              <option value="tondre">Tondre</option>
            </select>

            <button
              onClick={() => {
                setSearch('');
                setAgeMin('');
                setNoteMin('');
                setType('');
              }}
              className="px-5 py-2 rounded-full bg-[#E3107D] hover:bg-[#c30c6a] text-white  "
            >
              Réinitialiser
            </button>
          </div>

          <div className="space-y-6">
            {jardiniers.map(jardinier => {
                console.log("🧑‍🌾 Jardinier :", jardinier); // 👈 Ajout ici
                return (
              <div key={jardinier.id_utilisateur} className="flex bg-green-100 rounded-xl shadow p-4">
                <div className="w-32 h-32 bg-green-300 rounded shadow relative">
                  <img
                    src={jardinier.photo_profil || '/assets/default-avatar.jpg'}
                    alt={`${jardinier.prenom} ${jardinier.nom}`}
                    className="object-cover w-full h-full rounded"
                  />
                  <button
                    onClick={() => toggleFavori(jardinier.id_utilisateur)}
                    className="absolute top-2 right-2 text-xl hover:scale-125 transition"
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
                  <p className="text-sm text-gray-600"><strong>Âge :</strong> {jardinier.age || 'Non renseigné'} ans</p>
                  <p className="text-sm text-gray-600"><strong>Description :</strong> {jardinier.biographie}</p>
                  <p className="text-sm text-gray-600"><strong>Téléphone :</strong> {jardinier.telephone}</p>
                  <p className="text-sm text-gray-600">📍 {jardinier.adresse}</p>
                  <p className="text-sm text-gray-600"><strong>Note :</strong> {jardinier.note_moyenne}</p>
                </div>
              </div>
                );
            })}
          </div>
        </div>
      )
}

export default ListeJardiniers;