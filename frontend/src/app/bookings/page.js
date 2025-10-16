'use client';

import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { Suspense } from 'react';

import ReservationPage from '../reservation'; 

export default function BookingsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-16">
        <Suspense fallback={<p className="text-center">Loading…</p>}>
          <ReservationPage />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

