'use client';

import HomeMapSection from "../HomeMapSection/page";

const PresentationSection = () => {
  return (
    <>
      <section className="mx-auto max-w-5xl px-6 py-10">
        <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-6">
          Jardin Solidaire
        </h2>

        <div className="bg-white rounded-2xl shadow-sm p-6 leading-relaxed text-gray-700">
          <p className="mb-3">
            JardinSolidaire répond à un double besoin : aider les propriétaires à entretenir leurs
            jardins, et offrir aux citadins un accès à la nature tout en contribuant à son entretien.
          </p>
          <p className="mb-3">
            Notre objectif : créer de vraies connexions humaines autour de la nature, dans un cadre
            d’entraide et de collaboration.
          </p>
          <p>
            Fonctionnement simple : les propriétaires publient leurs besoins ; les « amis du vert »
            répondent aux annonces.
          </p>
        </div>
      </section>

      {/* Small map preview */}
      <HomeMapSection />
    </>
  );
};

export default PresentationSection;
