'use client'

import Header from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import ActionBar from '../../components/reservation_jardiniers/ActionBar'
import CompetenceBloc from '../../components/reservation_jardiniers/BlocCompetencePresentation'
import CalendrierBloc from '../../components/reservation_jardiniers/CalendrierBloc'
import CommentaireBloc from '../../components/reservation_jardiniers/CommentaireBloc'
import BoutonAvecConnexions from '../../components/reservation_jardiniers/BoutonAvecConnexion'
import Image from 'next/image'

export default function PageJardinier() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />

      <main className="flex-1 px-[10%] pt-24 pb-10 space-y-8">
        {/* 📸 Nom + Photo + Boutons */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Image
              src="/images/exemple-jardinier.jpg"
              alt="Photo du jardinier"
              width={120}
              height={120}
              className="rounded-full object-cover border-2 border-[#e3107d]"
            />
            <div>
              <h1 className="text-2xl font-bold">Lucas Durand</h1>
              <p className="text-sm text-muted-foreground">Jardinier passionné de permaculture 🍃</p>
            </div>
          </div>
          <ActionBar />
        </div>

        {/* 🧱 Zone principale en deux colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Bloc gauche : compétences */}
          <div className="lg:col-span-3 space-y-6">
            <CompetenceBloc />
            <BoutonAvecConnexions />
          </div>

          {/* Bloc droit : calendrier */}
          <div className="lg:col-span-2">
            <CalendrierBloc />
          </div>
        </div>

        {/* 💬 Commentaires */}
        <CommentaireBloc />
      </main>

      <Footer />
    </div>
  )
}
