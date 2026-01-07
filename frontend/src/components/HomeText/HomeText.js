// /src/components/HomeText/HomeText.js
'use client';

import HomeMapSection from '../HomeMapSection/page';

export default function PresentationSection() {
  return (
    <>
      <section className="mx-auto max-w-5xl px-6 py-10">
        <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-6">
          Jardin Solidaire
        </h2>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 leading-relaxed text-gray-700">
          <p className="mb-3">
Un jardin, ça se cultive. Le lien aussi.          </p>
          <p className="mb-3">
            On met en lien des propriétaires qui ont besoin d’un coup de main et des jardinier.es qui veulent agir, mettre les mains dans la terre, et se reconnecter au vivant.
          </p>
          <p>
On partage un moment utile, on apprend, on s’entraide, et on rend la nature plus accessible, ensemble.
          </p>
        </div>
      </section>

      <HomeMapSection />
    </>
  );
}


