'use client';

import Link from 'next/link';
import Image from 'next/image';

const HomeImage = () => {
  return (
    <div className="relative w-full h-80 md:h-96 lg:h-[500px]">
      <Image
        src="/assets/garden.jpg"
        alt="Hero background image of a garden"
        fill
        sizes="100vw"
        style={{ objectFit: 'cover' }}
        priority
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex gap-6">
          <Link
            href="/gardens"
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded"
          >
            Nos Jardins
          </Link>
          <Link
            href="/gardeners"
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded"
          >
            Nos Jardiniers
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeImage;
