'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

// Simule les données locales
const jardins = [
  {
    id: 1,
    nom: "Jardin fleuris",
    description: "Potager communautaire dans le centre-ville.",
    photos: ["/assets/jardin 1.jpg", "/assets/jardin 2.jpg",
    "/assets/jardin 3.jpg",
    "/assets/jardin 4.jpg"],
    adresse: "123 Rue des Lilas, 75000 Paris",
    quartier: "centre",
    type: 'potager'
  },
  {
    id: 2,
    nom: "Joli jardin de fleurs",
    description: "Serre urbaine avec accès libre aux habitants.",
    photos: ["/assets/jardin 1.jpg", "/assets/jardin 2.jpg",
      "/assets/jardin 3.jpg",
      "/assets/jardin 4.jpg"],
    adresse: "123 Rue des Lilas, 75000 Paris",
    quartier: "nord",
    type: 'serre'
  },
  {
    id: 3,
    nom: "Grand jardin",
    description: "Jardin plein sud, cultivé en permaculture.",
    photos: ["/assets/jardin 1.jpg", "/assets/jardin 2.jpg",
      "/assets/jardin 3.jpg",
      "/assets/jardin 4.jpg"],
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

export default function JardinPage() {
  const { id } = useParams()
  const [jardin, setJardin] = useState(null)
  const [mainPhoto, setMainPhoto] = useState(null)



  useEffect(() => {
    const jardinTrouve = jardins.find(j => j.id === parseInt(id))
    setJardin(jardinTrouve)
    if (jardinTrouve && jardinTrouve.photos?.length > 0) {
        setMainPhoto(jardinTrouve.photos[0])
      }
  }, [id])

  if (!jardin) {
    return <p className="p-6 text-center">Jardin introuvable</p>
  }

  return (
    <div className="min-h-screen p-6 bg-white">
    {/* Nom + Actions */}
    <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
        <h1 className="text-2xl font-bold text-green-800">{jardin.nom}</h1>
        <div className="flex gap-3 text-sm">
        <span className="text-gray-600">Propriétaire</span>
        <button>Partager</button>
        <button>♥</button>
        </div>
    </div>
      {/* Photos & infos principales */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
    {/* Image principale */}
    {/* <div className="lg:col-span-2">
      <img src={jardin.photos} className="rounded-lg w-full h-64 object-cover" />
    </div> */}

    {/* Infos du proprio */}
    <div className="bg-gray-100 p-4 rounded-xl text-sm">
      <h3 className="font-bold mb-2 text-green-800">Informations du Propriétaire</h3>
      <p className="font-bold mb-2 text-green-800">Nom : </p>
      <p className="font-bold mb-2 text-green-800">Statut vérifié </p>
      <button className="mt-4 px-4 py-2 bg-pink-500 text-white rounded">Message</button>
    </div>
  </div>

  {/* Informations sur le jardin */}
  <div className="mb-6">
    {/* Galerie de photos */}
    <div className="mb-6">
    <img
        src={mainPhoto}
        alt="Photo principale"
        className="w-full h-64 object-cover rounded-lg mb-4"
    />

{jardin?.photos?.length > 1 && (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
    {jardin.photos.slice(1).map((photo, idx) => (
      <img
        key={idx}
        src={photo}
        alt={`Miniature ${idx + 1}`}
        className="h-24 w-full object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
        onClick={() => setMainPhoto(photo)}
      />
    ))}
  </div>
)}

    </div>

    <h2 className="font-bold text-lg mb-2 text-green-800">Informations du Jardin</h2>
    <p className="text-sm text-green-800">{jardin.description}</p>
    <p className="text-sm text-green-800">Adresse : {jardin.adresse}</p>
    <p className="text-sm text-green-800">Type : {jardin.type}</p>
    <p className="text-sm text-green-800">Quartier : {jardin.quartier}</p>
  </div>

  {/* Calendrier */}
  <div className="mb-6">
    <h2 className="font-bold text-lg mb-2 text-green-800">Calendrier</h2>
    <div className="bg-pink-100 rounded p-4 text-sm text-center">
      (📅 Calendrier à intégrer ici)
    </div>
  </div>

  {/* Commentaires */}
  <div>
    <h2 className="font-bold text-lg mb-2 text-green-800">Commentaires</h2>
    <div className="bg-gray-100 p-4 rounded-xl text-sm">
      (📝 Zone de commentaires à venir)
    </div>
  </div>
</div>
  )
}
