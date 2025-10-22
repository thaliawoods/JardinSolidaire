// src/app/garden/[id]/page.js
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAnyToken } from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function GardenDetailPage() {
  const { id } = useParams();        // e.g. "7"
  const router = useRouter();

  const [garden, setGarden]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr]         = useState("");

  useEffect(() => {
    let alive = true;

    const makeHeaders = () => {
      const t = getAnyToken();
      return t ? { Authorization: `Bearer ${t}` } : {};
    };

    const fetchJson = async (url) => {
      const res = await fetch(url, {
        headers: { ...makeHeaders() },
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP_${res.status}`);
      return res.json();
    };

    (async () => {
      try {
        setErr("");
        setLoading(true);

        // ✅ CALL THE REAL API ENDPOINTS (EN then FR fallback)
        const urlEn = `${API_BASE}/api/gardens/${encodeURIComponent(id)}`;
        const urlFr = `${API_BASE}/api/jardins/${encodeURIComponent(id)}`;

        let data;
        try {
          data = await fetchJson(urlEn);
        } catch {
          data = await fetchJson(urlFr);
        }

        if (alive) setGarden(data);
      } catch (e) {
        if (alive) setErr("Impossible de charger ce jardin.");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, [id]);

  if (loading) return <div className="p-6">Chargement…</div>;
  if (err)      return <div className="p-6 text-red-600">{err}</div>;
  if (!garden)  return <div className="p-6">Jardin introuvable.</div>;

  return (
    <div className="min-h-screen p-6">
      <button
        onClick={() => router.back()}
        className="mb-4 rounded-full border px-4 py-2 hover:bg-gray-50"
      >
        ← Retour
      </button>

      <h1 className="text-3xl font-bold text-green-700">{garden.title}</h1>
      <p className="text-gray-600">{garden.address}</p>

      {garden.description && <p className="mt-4">{garden.description}</p>}

      {Array.isArray(garden.photos) && garden.photos.length > 0 && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {garden.photos.map((src, i) => (
            <img key={i} src={src} alt={`Photo ${i + 1}`} className="w-full h-48 object-cover rounded-xl" />
          ))}
        </div>
      )}
    </div>
  );
}
