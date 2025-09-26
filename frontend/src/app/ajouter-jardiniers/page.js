'use client'
import React, { useEffect, useState } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'       
const COMP_URL = process.env.NEXT_PUBLIC_API_COMP || 'http://localhost:5001/competences' 

export default function AjouterJardinier() {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    description: '',
    localisation: '',
    experienceAnnees: '',
    competences: [],  
    photos: [],     
  })

  const [competencesList, setCompetencesList] = useState([])

  useEffect(() => {
    fetch(COMP_URL)
      .then((r) => r.json())
      .then((data) => setCompetencesList(data || []))
      .catch((err) => console.error('Erreur chargement compétences', err))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files || [])
    const total = formData.photos.length + newFiles.length
    if (total > 5) {
      alert('Tu ne peux ajouter que 5 photos maximum.')
      return
    }
    setFormData((prev) => ({ ...prev, photos: [...prev.photos, ...newFiles] }))
    e.target.value = ''
  }

  const removePhoto = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== indexToRemove),
    }))
  }

  const handleCompetenceToggle = (id) => {
    setFormData((prev) => {
      const exists = prev.competences.includes(id)
      return {
        ...prev,
        competences: exists
          ? prev.competences.filter((x) => x !== id)
          : [...prev.competences, id],
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const fd = new FormData()
    fd.append('prenom', formData.prenom)
    fd.append('nom', formData.nom)
    fd.append('description', formData.description)
    fd.append('localisation', formData.localisation)
    fd.append('experienceAnnees', formData.experienceAnnees || '')
    fd.append('competences', JSON.stringify(formData.competences)) 
    formData.photos.forEach((f) => fd.append('photos', f))

    try {
      const res = await fetch(`${API_BASE}/jardiniers`, { method: 'POST', body: fd })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      alert('Jardinier ajouté !')
    } catch (err) {
      console.error(err)
      alert("Erreur lors de l'ajout du jardinier")
    }
  }

  return (
    <div className="min-h-screen p-6 bg-white">
      <h1 className="text-2xl font-bold text-green-800 mb-6 text-center">Ajouter un Jardinier</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col items-center">
          <label className="block w-full text-sm font-medium text-gray-700 mb-2">
            Ajout des photos :
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 w-full border rounded px-3 py-2 text-gray-400"
          />

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
            {formData.photos.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-40 object-cover rounded-lg shadow"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black/70 transition"
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-500 self-start">
            {formData.photos.length}/5 photos sélectionnées
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Prénom :</label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom :</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Localisation :</label>
            <input
              type="text"
              name="localisation"
              value={formData.localisation}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description :</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Compétences :</label>
            <div className="grid grid-cols-2 gap-2">
              {competencesList.map((comp) => (
                <label key={comp.id_competence} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.competences.includes(comp.id_competence)}
                    onChange={() => handleCompetenceToggle(comp.id_competence)}
                  />
                  <span>{comp.nom}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Année(s) d&apos;expérience :</label>
            <input
              type="number"
              name="experienceAnnees"
              min="0"
              value={formData.experienceAnnees}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
            />
          </div>

          <button
            type="submit"
            className="bg-[#E3107D] hover:bg-[#c30c6a] text-white px-6 py-2 rounded-full mt-4"
          >
            Ajouter mes informations
          </button>
        </div>
      </form>
    </div>
  )
}
