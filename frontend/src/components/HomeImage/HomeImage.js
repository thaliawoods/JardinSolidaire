'use client';

import Link from 'next/link';
import Image from 'next/image';

const HomeImage = () => {
  return (
    <section className="relative w-full h-80 md:h-96 lg:h-[480px] -mt-16">
      <Image
        src="/assets/garden.jpg"
        alt="Hero background image of a garden"
        fill
        sizes="100vw"
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/25" aria-hidden="true" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex gap-4">
          <Link
            href="/gardens"
            className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-3 rounded"
          >
            Les Jardins
          </Link>
          <Link
            href="/gardeners"
            className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-3 rounded"
          >
            Les Jardiniers
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeImage;

