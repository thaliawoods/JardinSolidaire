'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';

export default function AuthGate({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login?next=/my-space');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return <div className="pt-24 text-center text-gray-600">Vérification de la session…</div>;
  }
  if (!isAuthenticated) return null;

  return children;
}
