'use client'
import React, { useState, useEffect } from 'react'

export default function AjouterJardin() {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    localisation: '',
    surface: '',
    services: '',
    photos: [],
    competences: []
  });

  const [competencesList, setCompetencesList] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5001/competences') // 🔁 À adapter selon ton URL backend
      .then((res) => res.json())
      .then((data) => setCompetencesList(data))
      .catch((err) => console.error('Erreur chargement compétences', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const total = formData.photos.length + newFiles.length;

    if (total > 5) {
      alert("Tu ne peux ajouter que 5 photos maximum.");
      return;
    }

    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...newFiles]
    }));
  };

  const handleCompetenceToggle = (id) => {
    setFormData(prev => {
      const alreadySelected = prev.competences.includes(id);
      const competences = alreadySelected
        ? prev.competences.filter(cid => cid !== id)
        : [...prev.competences, id];

      return { ...prev, competences };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Données du jardinier ➕', formData);
    alert("Jardinier ajouté (simulation) !");
  };

  const removePhoto = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== indexToRemove)
    }));
  };

  return (
    <div className="min-h-screen p-6 bg-white">
      <h1 className="text-2xl font-bold text-green-800 mb-6 text-center">Je veux jardiner</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col items-center">
          <label className="block w-full text-sm font-medium text-gray-700 mb-2">Ajout des photos :</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 w-full border rounded px-3 py-2 text-gray-400"
          />
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
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
                  className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-opacity-80 transition"
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Prénom :</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
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
              {competencesList.map(comp => (
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
              type="text"
              name="services"
              value={formData.services}
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
  );
}
