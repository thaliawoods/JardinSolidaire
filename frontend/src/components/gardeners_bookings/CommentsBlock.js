// frontend/src/components/reservation_gardeners/CommentsBlock.jsx
'use client';

export default function CommentsBlock() {
  const comments = [
    { name: 'Marie Dupont', text: 'Très bon contact, super jardinier ! 🌿' },
    { name: 'Jean Martin',  text: 'Ponctuel et efficace, je recommande.' },
    { name: 'Claire Leroy', text: 'Excellent travail, je ferai à nouveau appel à lui.' },
    { name: 'Samuel Roux',  text: 'Professionnel et sympathique, merci !' },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-green-700 mb-4">Commentaires</h2>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {comments.map((c, i) => (
          <div
            key={i}
            className="min-w-[250px] max-w-[300px] bg-white border border-gray-200 rounded-lg shadow p-4 flex-shrink-0"
          >
            <h3 className="font-semibold text-gray-800">{c.name}</h3>
            <p className="text-sm text-gray-600 mt-2">{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
