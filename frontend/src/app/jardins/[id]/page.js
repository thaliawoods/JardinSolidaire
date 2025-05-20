'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'


export default function JardinPage() {
  const { id } = useParams()
  const [jardin, setJardin] = useState(null)
  const [mainPhoto, setMainPhoto] = useState(null)
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);


  useEffect(() => {
    async function fetchJardin() {
      try {
        const res = await fetch(`http://localhost:5000/api/jardins/${id}`);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        setJardin(data);
        if (Array.isArray(data.photos) && data.photos.length > 0) {
          setMainPhoto(data.photos[0]);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchJardin();
  }, [id]);

  if (loading)  return <p className="p-6 text-center">Chargement…</p>;
  if (error)    return <p className="p-6 text-center text-red-500">Erreur : {error}</p>;
  if (!jardin)  return <p className="p-6 text-center">Jardin introuvable</p>;
  
  return (
    <div className="min-h-screen p-6 bg-white">
    {/* Nom + Actions */}
    <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
        <h1 className="text-2xl font-bold text-green-800">{jardin.titre}</h1>
        <div className="flex gap-3 text-sm">
        <span className="text-gray-600">Propriétaire : {jardin.utilisateur?.nom} {jardin.utilisateur?.prenom}</span>
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
    <p className="text-sm text-green-800">Besoins : {jardin.besoins}</p>
    <p className="text-sm text-green-800">Publié le : {new Date(jardin.date_publication).toLocaleDateString()}</p>
    <p className="text-sm text-green-800">Note moyenne : {jardin.note_moyenne}</p>
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
