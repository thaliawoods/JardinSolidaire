'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OwnerBookingsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/owner/inbox');
  }, [router]);

  return (
    <main className="max-w-3xl mx-auto p-6 text-gray-600">
      redirection…
    </main>
  );
}
