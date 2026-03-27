'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function CheckEmailClient() {
  const sp = useSearchParams();
  const email = sp.get('email');

  return (
    <div style={{ minHeight: '100vh', background: '#fff', paddingTop: 56 }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '4rem 2rem' }}>

        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--green)', marginBottom: '0.75rem' }}>
          Inscription
        </p>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 400, color: 'var(--foreground)', marginBottom: '1.25rem', lineHeight: 1.1 }}>
          Vérifie ta boîte mail
        </h1>

        <p style={{ fontSize: '1rem', color: 'var(--foreground)', marginBottom: '0.75rem', lineHeight: 1.6 }}>
          Un lien de confirmation t&apos;a été envoyé{email ? ` à ${email}` : ''}.
          Clique dessus pour activer ton compte.
        </p>

        <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '2.5rem' }}>
          Vérifie tes spams si tu ne le vois pas.
        </p>

        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <Link
            href="/login"
            style={{ padding: '0.65rem 1.5rem', background: 'var(--green)', color: '#fff', border: 'none', fontFamily: 'inherit', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-block' }}
          >
            Se connecter
          </Link>
          <Link
            href="/"
            style={{ fontSize: '0.875rem', color: 'var(--muted)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
          >
            ← Accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
