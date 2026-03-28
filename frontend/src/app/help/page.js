'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

const seed = [
  {
    q: 'Comment créer un compte ?',
    a: "Allez sur la page d'inscription, remplissez le formulaire, puis connectez-vous depuis la page de connexion.",
    links: [
      { href: '/register', label: 'Inscription' },
      { href: '/login', label: 'Connexion' },
    ],
    tags: 'account register signup login',
  },
  {
    q: "J'ai oublié mon mot de passe, que faire ?",
    a: 'Sur la page de connexion, cliquez sur « Mot de passe oublié ? » et suivez les instructions.',
    links: [{ href: '/login', label: 'Connexion' }],
    tags: 'password reset email',
  },
  {
    q: 'Comment ajouter mon jardin ?',
    a: "Une fois connecté, cliquez sur \"Ajouter mon jardin\" dans l'en-tête ou visitez /add-garden.",
    links: [{ href: '/add-garden', label: 'Ajouter un jardin' }],
    tags: 'garden create listing owner',
  },
  {
    q: 'Comment contacter un·e jardinier·e / propriétaire ?',
    a: 'Ouvrez une page de jardin ou de profil et utilisez "Envoyer un message" ou "Réserver". Vous devez être connecté.',
    links: [{ href: '/gardens', label: 'Parcourir les jardins' }],
    tags: 'contact message booking chat',
  },
  {
    q: 'Où vont les favoris ?',
    a: "Appuyez sur le ♥ sur une carte de jardin pour l'enregistrer. Votre liste apparaît dans la page des Favoris.",
    links: [{ href: '/favorites', label: 'Favoris' }],
    tags: 'favorites heart gardens',
  },
];

export default function Page() {
  const [query, setQuery] = useState('');

  const faqs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return seed;
    return seed.filter((it) => (it.q + ' ' + it.a + ' ' + it.tags).toLowerCase().includes(q));
  }, [query]);

  return (
    <main style={{ background: '#fff', minHeight: '100vh' }}>
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontSize: '2rem',
            color: 'var(--foreground)',
            textAlign: 'center',
          }}
        >
          Centre d&apos;aide
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--muted)', marginTop: '0.5rem', fontSize: '0.9375rem' }}>
          Trouvez des réponses rapidement ou contactez-nous si vous êtes bloqué.
        </p>

        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
          <input
            type="text"
            placeholder="Rechercher de l'aide (compte, mot de passe, jardin, …)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Rechercher dans l'aide"
            style={{
              width: '100%',
              maxWidth: 560,
              padding: '0.6rem 0.875rem',
              border: '1px solid var(--border)',
              background: '#fff',
              color: 'var(--foreground)',
              fontSize: '0.875rem',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ marginTop: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <Link style={{ fontSize: '0.875rem', color: 'var(--muted)', textDecoration: 'underline', textUnderlineOffset: '3px' }} href="/contact">Contact</Link>
          <Link style={{ fontSize: '0.875rem', color: 'var(--muted)', textDecoration: 'underline', textUnderlineOffset: '3px' }} href="/register">Créer un compte</Link>
          <Link style={{ fontSize: '0.875rem', color: 'var(--muted)', textDecoration: 'underline', textUnderlineOffset: '3px' }} href="/login">Se connecter</Link>
          <Link style={{ fontSize: '0.875rem', color: 'var(--muted)', textDecoration: 'underline', textUnderlineOffset: '3px' }} href="/gardens">Parcourir les jardins</Link>
          <Link style={{ fontSize: '0.875rem', color: 'var(--muted)', textDecoration: 'underline', textUnderlineOffset: '3px' }} href="/gardeners">Nos jardinier·es</Link>
        </div>

        <div style={{ marginTop: '2rem' }} id="faq">
          {faqs.map((item, i) => (
            <details
              key={i}
              style={{ borderBottom: '1px solid var(--border)', padding: '1rem 0' }}
            >
              <summary style={{ cursor: 'pointer', listStyle: 'none', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                <span style={{ fontSize: '0.9375rem', color: 'var(--foreground)', fontWeight: 400 }}>{item.q}</span>
                <span style={{ flexShrink: 0, color: 'var(--muted)' }}>▾</span>
              </summary>
              <div style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--muted)' }}>
                <p>{item.a}</p>
                {!!item.links?.length && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    {item.links.map((l, j) => (
                      <Link
                        key={j}
                        href={l.href}
                        style={{ fontSize: '0.875rem', color: 'var(--foreground)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
                      >
                        {l.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </details>
          ))}

          {faqs.length === 0 && (
            <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--muted)' }}>
              Pas de résultats. Essayez d&apos;autres mots, ou{' '}
              <Link href="/contact" style={{ color: 'var(--foreground)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                contactez-nous
              </Link>.
            </p>
          )}
        </div>

        <div style={{ marginTop: '2.5rem' }}>
          <p style={{ fontSize: '0.9375rem', color: 'var(--foreground)', marginBottom: '0.375rem' }}>
            Besoin d&apos;aide supplémentaire ?
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>
            Nous sommes heureux de vous aider avec les problèmes de compte, les bugs et les demandes de fonctionnalités.{' '}
            <Link
              href="/contact"
              style={{ color: 'var(--green)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
            >
              Contact
            </Link>
            {' '}·{' '}
            <a
              href="mailto:support@jardinsolidaire.local"
              style={{ color: 'var(--green)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
            >
              Email
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
