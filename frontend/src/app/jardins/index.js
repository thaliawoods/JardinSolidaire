'use client'
import React, { useState} from "react"
import Link from "next/link";

// Données locales ici directement
const jardins = [
  {
    id: 1,
    nom: "Jardin fleuris",
    description: "Potager communautaire dans le centre-ville.",
    photoUrl: "/assets/jardin 1.jpg",
    adresse: "123 Rue des Lilas, 75000 Paris",
    quartier: "centre",
    type: 'potager'
  },
  {
    id: 2,
    nom: "Joli jardin de fleurs",
    description: "Serre urbaine avec accès libre aux habitants.",
    photoUrl: "/assets/jardin 2.jpg",
    adresse: "123 Rue des Lilas, 75000 Paris",
    quartier: "nord",
    type: 'serre'
  },
  {
    id: 3,
    nom: "Grand jardin",
    description: "Jardin plein sud, cultivé en permaculture.",
    photoUrl: "/assets/jardin 3.jpg",
    adresse: "123 Rue des Lilas, 75000 Paris",
    quartier: "sud",
    type: 'fleur'
  },
  {
    id: 4,
    nom: "La Prairie ",
    description: "Espace vert avec zone de compost et serre.",
    photoUrl: "/assets/jardin 4.jpg",
    adresse: "123 Rue des Lilas, 75000 Paris",
    quartier: "centre",
    type: 'pelouse'
  },
  {
    id: 5,
    nom: "Jardin de potager",
    description: "Potager communautaire dans le centre-ville.",
    photoUrl: "/assets/jardin 5.jpg",
    adresse: "123 Rue des Lilas, 75000 Paris",
    quartier: "centre",
    type: 'potager'
  },
  {
    id: 6,
    nom: "La Serre Enchantée",
    description: "Serre urbaine avec accès libre aux habitants.",
    photoUrl: "/assets/jardin 6.jpg",
    adresse: "123 Rue des Lilas, 75000 Paris",
    quartier: "nord",
    type: 'serre'
  },
  {
    id: 7,
    nom: "Jardin Soleil",
    description: "Jardin plein sud, cultivé en permaculture.",
    photoUrl: "/assets/jardin 7.jpg",
    adresse: "123 Rue des Lilas, 75000 Paris",
    quartier: "sud",
    type: 'fleur'
  },
  {
    id: 8,
    nom: "Jardin vert",
    description: "Espace vert avec zone de compost et serre.",
    photoUrl: "/assets/jardin 8.jpg",
    adresse: "75000 Paris",
    quartier: "centre",
    type: 'pelouse'
  }
]

const ListeJardins = () => {
    const [favoris, setFavoris] = useState([])
    const [search, setSearch] = useState('')
    const [quartier, setQuartier] = useState ('')
    const [type, setType] = useState ('')

    const toggleFavori = (id) => {
        setFavoris((prev) => 
            prev.includes(id) ? prev.filter((fid) => fid !== id) : [ ...prev, id]
        )
    }
  return (
    <div className="min-h-screen px-6 py-10s bg-white">
      <h1 className="text-3xl font-bold mb-8 text-center text-green-800">Nos Jardins Solidaires</h1>

      <div className="mb-8 flex flex-col lg:flex-row items-center gap-4 flex-wrap">

        {/* Barre de recherche stylisée */}
        <div className="relative w-full lg:w-[30%]">
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            <input
            type="text"
            placeholder="Rechercher un jardin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2  text-sm text-gray-700"
            />
        </div>

        {/* Sélecteur quartier */}
        <select
            value={quartier}
            onChange={(e) => setQuartier(e.target.value)}
            className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2  w-full lg:w-[20%] text-sm text-gray-700"
        >
            <option value="">Tous les quartiers</option>
            <option value="centre">Centre-ville</option>
            <option value="nord">Quartier Nord</option>
            <option value="sud">Quartier Sud</option>
        </select>

        {/* Sélecteur type */}
        <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2  w-full lg:w-[20%] text-sm text-gray-700"
        >
            <option value="">Tous les types de jardins</option>
            <option value="potager">Potager</option>
            <option value="serre">Serre</option>
            <option value="fleur">Fleur</option>
        </select>

        {/* Bouton réinitialiser */}
        <button
            onClick={() => {
            setSearch('')
            setQuartier('')
            setType('')
            }}
            className="px-5 py-2 rounded-full bg-[#E3107D] hover:bg-[#c30c6a] text-white transition w-full lg:w-auto"
        >
            Réinitialiser
        </button>
        </div>



      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {jardins
        .filter((jardin) => 
          jardin.nom.toLowerCase().includes(search.toLowerCase()) &&
          (quartier === '' || jardin.quartier === quartier) &&
          (type === '' || jardin.type === type)
        )
        .map((jardin) => (
          <Link
            key={jardin.id}
            href={`/jardins/${jardin.id}`}
            className="block"
          >
          <div className="bg-green-100 rounded-2xl overflow-hidden shadow-md relative group hover:shadow-xl transition">
            
        
            {/* Image */}
            <img
              src={jardin.photoUrl}
              alt={jardin.nom}
              className="h-48 w-full object-cover"
            />

            {/* Texte */}
            <div className="px-3 py-2 text-sm text-gray-700">
            {/* Titre + cœur */}
            <div className="flex justify-between items-start mb-1">
                <h2 className="font-bold text-base text-green-900">{jardin.nom}</h2>
                <button
                onClick={() => toggleFavori(jardin.id)}
                className="text-xl transition-transform transform hover:scale-125"
                >
                {favoris.includes(jardin.id) ? (
                    <span className="text-pink-500">♥</span>
                ) : (
                    <span className="text-gray-400">♡</span>
                )}
                </button>
            </div>

            {/* Infos supplémentaires */}
            <p className="text-xs leading-tight">{jardin.description}</p>
            <p className="text-xs leading-tight">{jardin.adresse}</p>
            <p className="text-xs leading-tight">{jardin.type}</p>
            <p className="text-xs leading-tight">{jardin.quartier}</p>
            </div>

            </div>
        </Link>
        ))}
      </div>
    </div>
  )
}

export default ListeJardins
