'use client'

import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ReservationPage from "./index";
import { Suspense } from "react";

export default function Reservation() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-16">
        <Suspense fallback={<p className="text-center">Chargement...</p>}>
          <ReservationPage />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

