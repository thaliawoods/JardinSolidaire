'use client';

import Image from 'next/image';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';

import ActionBar from '@/components/gardener-booking/ActionBar';
import SkillsAndIntro from '@/components/gardener-booking/SkillsAndIntro';
import AvailabilityCalendar from '@/components/gardener-booking/AvailabilityCalendar';
import Reviews from '@/components/gardener-booking/Reviews';
import ContactButtons from '@/components/gardener-booking/ContactButtons';

import { useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function GardenerBookingPage({ params }) {
  const { id } = params || {};
  const [gardener, setGardener] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        setLoading(true);
        setErr('');
        const res = await fetch(`${API_BASE}/api/jardiniers/${id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!alive) return;

        setGardener({
          fullName: `${data.prenom || ''} ${data.nom || ''}`.trim() || 'Gardener',
          avatarUrl: data.avatarUrl || '/images/example-gardener.jpg',
          tagline: data.presentation || 'Passionate about natural gardening 🌿',
          competences: Array.isArray(data.competences) ? data.competences : [],
          location: data.localisation || '—',
          rating: data.rating ?? null,
          totalReviews: data.totalReviews ?? 0,
          comments: data.comments || [],
        });
      } catch (e) {
        if (!alive) return;
        setErr('Unable to load the gardener profile.');
        setGardener({
          fullName: 'Example Gardener',
          avatarUrl: '/images/example-gardener.jpg',
          tagline: 'Passionate about permaculture 🍃',
          competences: ['weeding', 'watering'],
          location: '—',
          rating: 4.8,
          totalReviews: 12,
          comments: [],
        });
      } finally {
        if (alive) setLoading(false);
      }
    }
    if (id) load();
    return () => { alive = false; };
  }, [id]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-1 px-[10%] pt-24 pb-10 space-y-8">
        {loading && (
          <div className="animate-pulse space-y-4">
            <div className="h-28 bg-gray-100 rounded-2xl" />
            <div className="h-40 bg-gray-100 rounded-2xl" />
            <div className="h-40 bg-gray-100 rounded-2xl" />
          </div>
        )}

        {!!err && !loading && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        )}

        {gardener && !loading && (
          <>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-6">
                <div className="rounded-full overflow-hidden border-2 border-[#e3107d]">
                  <Image
                    src={gardener.avatarUrl || '/images/example-gardener.jpg'}
                    alt={`${gardener.fullName} avatar`}
                    width={120}
                    height={120}
                    className="object-cover"
                    priority
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{gardener.fullName}</h1>
                  <p className="text-sm text-muted-foreground">{gardener.tagline}</p>
                </div>
              </div>
              <ActionBar />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3 space-y-6">
                <SkillsAndIntro
                  skills={gardener.competences}
                  location={gardener.location}
                  rating={gardener.rating}
                  totalReviews={gardener.totalReviews}
                  intro={gardener.tagline}
                />
                <ContactButtons />
              </div>

              <div className="lg:col-span-2">
                <AvailabilityCalendar />
              </div>
            </div>

            <Reviews items={gardener.comments} />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
