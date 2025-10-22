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
    q: 'J’ai oublié mon mot de passe, que faire ?',
    a: 'Sur la page de connexion, cliquez sur « Mot de passe oublié ? » et suivez les instructions.',
    links: [{ href: '/login', label: 'Connexion' }],
    tags: 'password reset email',
  },
  {
    q: 'Comment ajouter mon jardin ?',
    a: 'Une fois connecté, cliquez sur “Ajouter mon jardin” dans l’en-tête ou visitez /add-garden.',
    links: [{ href: '/add-garden', label: 'Ajouter un jardin' }],
    tags: 'garden create listing owner',
  },
  {
    q: 'Comment contacter un jardinier / propriétaire ?',
    a: 'Ouvrez une page de jardin ou de profil et utilisez “Envoyer un message” ou “Réserver”. Vous devez être connecté.',
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
    <main className="min-h-screen bg-white">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-bold text-green-800 text-center">Centre d&apos;aide</h1>
        <p className="text-center text-gray-600 mt-2">
          Trouvez des réponses rapidement ou contactez-nous si vous êtes bloqué.
        </p>

        <div className="mt-6 flex justify-center">
          <div className="relative w-full max-w-xl">
            <span className="absolute left-3 top-2.5 text-gray-400" aria-hidden>🔍</span>
            <input
              type="text"
              placeholder="Rechercher de l'aide (compte, mot de passe, jardin, …)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 bg-white text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/60"
              aria-label="Rechercher dans l'aide"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <QuickLink href="/contact">Contact</QuickLink>
          <QuickLink href="/register">Créer un compte</QuickLink>
          <QuickLink href="/login">Se connecter</QuickLink>
          <QuickLink href="/gardens">Parcourir les jardins</QuickLink>
          <QuickLink href="/gardeners">Nos jardiniers</QuickLink>
        </div>

        {/* FAQ */}
        <div className="mt-8 space-y-4" id="faq">
          {faqs.map((item, i) => (
            <details
              key={i}
              className="group rounded-2xl p-5"
              style={{
                backgroundColor: 'rgba(22,163,74,0.08)',
                border: '1px solid rgba(22,163,74,0.15)',
              }}
            >
              <summary className="cursor-pointer list-none">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-base font-semibold text-green-900">{item.q}</h3>
                  <span className="shrink-0 text-green-800 group-open:rotate-180 transition">▾</span>
                </div>
              </summary>
              <div className="mt-3 text-sm text-gray-700">
                <p>{item.a}</p>
                {!!item.links?.length && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.links.map((l, j) => (
                      <Link
                        key={j}
                        href={l.href}
                        className="px-3 py-1 rounded-full text-sm bg-white/80 border border-green-600/25 text-green-700 hover:bg-green-50 transition"
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
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
              Pas de résultats. Essayez d&apos;autres mots, ou{' '}
              <Link href="/contact" className="underline text-pink-500 hover:text-pink-600">
                contactez-nous
              </Link>.
            </div>
          )}
        </div>

        <div className="mt-10 rounded-2xl bg-white border p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-green-900">Besoin d&apos;aide supplémentaire ?</h2>
          <p className="text-sm text-gray-700 mt-2">
            Nous sommes heureux de vous aider avec les problèmes de compte, les bugs et les demandes de fonctionnalités.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="px-5 py-2 rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-sm transition"
            >
              Contact
            </Link>
            <a
              href="mailto:support@jardinsolidaire.local"
              className="px-5 py-2 rounded-full bg-white/80 border border-green-600/25 text-green-700 hover:bg-green-50 transition"
            >
              Email
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function QuickLink({ href, children }) {
  return (
    <Link
      href={href}
      className="px-4 py-2 rounded-full text-sm bg-white/80 border border-green-600/25 text-green-700 hover:bg-green-50 transition"
    >
      {children}
    </Link>
  );
}
