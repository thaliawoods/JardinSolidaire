'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';

export default function AuthGate({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const search = useSearchParams();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      const existingNext = search.get('next');
      const fallbackNext =
        typeof window !== 'undefined'
          ? encodeURIComponent(window.location.pathname + window.location.search)
          : encodeURIComponent('/my-space');

      const nextParam = existingNext || fallbackNext;
      router.replace(`/login?next=${nextParam}`);
    }
  }, [loading, isAuthenticated, router, search]);

  if (loading) {
    return <div className="pt-24 text-center text-gray-600">Checking session…</div>;
  }
  if (!isAuthenticated) return null; 

  return children;
}
