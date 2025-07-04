'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const ReservationPage = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const jardinId = searchParams.get('id')
  const dateParam = searchParams.get('date');

  const [jardin, setJardin] = useState(null)
  const [user, setUser] = useState(null) // ⚠️ à remplacer par ton vrai système auth
  const [reservationDate, setReservationDate] = useState(
  dateParam ? new Date(dateParam) : null
  );
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    // Remplacer par ton vrai fetch API vers /api/jardins/:id
    if (jardinId) {
      fetch(`http://localhost:5000/api/jardins/${jardinId}`)
        .then(res => res.json())
        .then(data => setJardin(data))
        .catch(err => console.error('Erreur jardin :', err))
    }

    // Simuler un utilisateur connecté (remplacer par ton auth context)
    const storedUser = localStorage.getItem('user') // ou utilise ton contexte auth
    if (storedUser) setUser(JSON.parse(storedUser))
  }, [jardinId])

  const handleConnexion = () => router.push('/connexion')
  const handleInscription = () => router.push('/inscription')

  

  return (
    <div className="min-h-screen px-6 py-10 bg-white">
      <h1 className="text-2xl font-bold mb-6 text-green-800">Demande de réservation</h1>

      {/* Date de réservation */}
      {!editMode ? (
        <>
          <p className="text-green-700 text-center my-4">
            📅 Date sélectionnée : <strong>{reservationDate?.toLocaleDateString()}</strong>
          </p>
          <div className="text-center">
            <button
              onClick={() => setEditMode(true)}
              className="bg-[#E3107D] hover:bg-[#c30c6a] text-white font-semibold px-4 py-1 rounded-full transition mb-6"
            >
              Modifier la date
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-4 my-4">
          <DatePicker
            selected={reservationDate}
            onChange={(date) => setReservationDate(date)}
            inline
          />
          <button
            onClick={() => setEditMode(false)}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Confirmer la nouvelle date
          </button>
        </div>
      )}


      {/* infos jardin */}
      {jardin && (
        <div className="mb-6">
          <img
            src={jardin.photos}
            alt={jardin.titre}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          <p className="font-bold text-lg mb-2 text-green-800">{jardin.titre}</p>
          <p className="text-sm text-green-800">{jardin.description}</p>
          <p className="text-sm text-green-800">Adresse : {jardin.adresse}</p>
          <p className="text-sm text-green-800">Type : {jardin.type}</p>
          <p className="text-sm text-green-800">Besoins : {jardin.besoins}</p>
        </div>
      )}

      {/* authentification */}
      {!user ? (
        <div className="space-y-4">
          <p className="text-sm mb-2 text-green-800">Connectez-vous ou inscrivez-vous pour réserver</p>
          <div className="flex gap-2">
            <button onClick={handleConnexion} className="border px-4 py-2 rounded w-full text-green-800">Se connecter</button>
            <button onClick={handleInscription} className="border px-4 py-2 rounded w-full text-green-800">S'inscrire</button>
          </div>
        </div>
      ) : (
        <button
          className="mt-4 px-6 py-2 bg-[#E3107D] hover:bg-[#c30c6a] text-white font-semibold rounded-full"
        >
          Réserver
        </button>
      )}
    </div>
  )
}

export default ReservationPage
