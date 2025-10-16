'use client';

import { useEffect, useState } from 'react';

export default function ButtonWithAuth({ onClick }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    setIsAuthenticated(!!token);
  }, []);

  return (
    <div className="mt-6">
      <button
        onClick={isAuthenticated ? onClick : undefined}
        className={`px-6 py-2 rounded-full font-semibold transition duration-200 ${
          isAuthenticated
            ? 'bg-[#e3107d] text-white hover:bg-pink-700'
            : 'bg-gray-400 text-white cursor-not-allowed'
        }`}
      >
        Envoyer un message
      </button>

      {!isAuthenticated && (
        <p className="text-sm text-gray-600 italic mt-2">
          Connecte-toi pour discuter avec ce jardinier 🌸
        </p>
      )}
    </div>
  );
}
