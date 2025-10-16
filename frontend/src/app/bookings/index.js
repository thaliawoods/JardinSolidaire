'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function ReservationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const jardinId = searchParams.get('id');
  const dateParam = searchParams.get('date');

  const [garden, setGarden] = useState(null);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reservationDate, setReservationDate] = useState(
    dateParam ? new Date(dateParam) : null
  );
  const [editMode, setEditMode] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const apiFetch = useCallback(
    async (path, { method = 'GET', body } = {}) => {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        cache: 'no-store',
      });
      if (!res.ok) {
        let e = {};
        try { e = await res.json(); } catch {}
        throw new Error(e.error || `HTTP_${res.status}`);
      }
      return res.json();
    },
    [token]
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr('');

        if (!jardinId) return;

        const g = await fetch(`${API_BASE}/api/jardins/${jardinId}`, {
          cache: 'no-store',
        }).then((r) => {
          if (!r.ok) throw new Error(`HTTP_${r.status}`);
          return r.json();
        });
        if (alive) setGarden(g);

        if (token) {
          const data = await apiFetch('/api/me');
          if (alive) setMe(data.user);
        } else {
          setMe(null);
        }
      } catch (e) {
        if (alive) setErr(e.message || 'server_error');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [jardinId, token, apiFetch]);

  const goLogin = () => router.push('/login');
  const goSignup = () => router.push('/signup');

  const photos = Array.isArray(garden?.photos)
    ? garden.photos
    : garden?.photos
    ? [garden.photos]
    : [];

  const reserve = async () => {
    try {
      setBusy(true);
      setErr('');
      setOk('');

      if (!me) {
        goLogin();
        return;
      }
      if (!reservationDate) {
        setErr('Please pick a reservation date.');
        return;
      }

      await apiFetch('/api/reservations', {
        method: 'POST',
        body: {
          id_utilisateur: me.id_utilisateur,
          id_jardin: Number(jardinId),
          date_reservation: reservationDate.toISOString(),
          statut: 'en_attente',
          commentaires: '',
        },
      });

      setOk('Reservation request sent ✅');
      // optional redirect:
      // router.push(`/gardens/${jardinId}`);
    } catch (e) {
      setErr(e.message || 'Failed to create the reservation.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-white">
      <h1 className="text-2xl font-bold mb-6 text-green-800">Reservation request</h1>

      {loading && <p className="text-gray-600">Loading…</p>}
      {!!err && (
        <p className="text-sm text-red-600 mb-4">
          {err}
        </p>
      )}
      {!!ok && (
        <p className="text-sm text-green-700 mb-4">
          {ok}
        </p>
      )}

      {!editMode ? (
        <>
          <p className="text-green-700 text-center my-4">
            📅 Selected date:{' '}
            <strong>{reservationDate ? reservationDate.toLocaleDateString() : '—'}</strong>
          </p>
          <div className="text-center">
            <button
              onClick={() => setEditMode(true)}
              className="bg-[#E3107D] hover:bg-[#c30c6a] text-white font-semibold px-4 py-1 rounded-full transition mb-6"
            >
              Change date
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
            Confirm new date
          </button>
        </div>
      )}

      {garden && (
        <div className="mb-6">
          {photos.length > 0 && (
            <img
              src={photos[0]}
              alt={garden.titre}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
          )}
          <p className="font-bold text-lg mb-2 text-green-800">{garden.titre}</p>
          <p className="text-sm text-green-800">{garden.description}</p>
          <p className="text-sm text-green-800">Address: {garden.adresse || '—'}</p>
          <p className="text-sm text-green-800">Type: {garden.type || '—'}</p>
          <p className="text-sm text-green-800">Needs: {garden.besoins || '—'}</p>
        </div>
      )}

      {!me ? (
        <div className="space-y-4">
          <p className="text-sm mb-2 text-green-800">
            Please log in or sign up to reserve
          </p>
          <div className="flex gap-2">
            <button onClick={goLogin} className="border px-4 py-2 rounded w-full text-green-800">
              Log in
            </button>
            <button onClick={goSignup} className="border px-4 py-2 rounded w-full text-green-800">
              Sign up
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={reserve}
          disabled={!reservationDate || busy}
          className="mt-4 px-6 py-2 bg-[#E3107D] hover:bg-[#c30c6a] text-white font-semibold rounded-full disabled:opacity-60"
        >
          {busy ? 'Sending…' : 'Reserve'}
        </button>
      )}
    </div>
  );
}
