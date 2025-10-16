'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

export default function HelpCenterPage() {
  const [query, setQuery] = useState('');

  const seed = [
    {
      q: 'How do I create an account?',
      a: 'Go to the Register page, fill the form, then sign in from the Login page.',
      links: [
        { href: '/register', label: 'Register' },
        { href: '/login', label: 'Login' },
      ],
      tags: 'account register signup login',
    },
    {
      q: 'I forgot my password',
      a: 'On the Login page, click “Forgot password?” and follow the instructions.',
      links: [{ href: '/login', label: 'Login' }],
      tags: 'password reset email',
    },
    {
      q: 'How do I add my garden?',
      a: 'When logged in, click “Ajouter mon jardin” in the header or visit /add-garden.',
      links: [{ href: '/add-garden', label: 'Add garden' }],
      tags: 'garden create listing owner',
    },
    {
      q: 'How do I contact a gardener / owner?',
      a: 'Open a garden or profile page and use “Send message” or “Reserve”. You must be logged in.',
      links: [{ href: '/gardens', label: 'Browse gardens' }],
      tags: 'contact message booking chat',
    },
    {
      q: 'Where do favorites go?',
      a: 'Tap the ♥ on a garden card to save it. Your list appears in the Favorites page.',
      links: [{ href: '/favorites', label: 'Favorites' }],
      tags: 'favorites heart gardens',
    },
  ];

  const faqs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return seed;
    return seed.filter((it) =>
      (it.q + ' ' + it.a + ' ' + it.tags).toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-bold text-green-800 text-center">Help Center</h1>
        <p className="text-center text-gray-600 mt-2">
          Find answers quickly or contact us if you’re stuck.
        </p>

        {/* Search */}
        <div className="mt-6 flex justify-center">
          <div className="relative w-full max-w-xl">
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search help (account, password, garden, …)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 text-sm text-gray-700"
            />
          </div>
        </div>

        {/* Quick links */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <QuickLink href="/contact">Contact support</QuickLink>
          <QuickLink href="/register">Create account</QuickLink>
          <QuickLink href="/login">Sign in</QuickLink>
          <QuickLink href="/gardens">Browse gardens</QuickLink>
          <QuickLink href="/gardeners">Our gardeners</QuickLink>
        </div>

        {/* FAQ */}
        <div className="mt-8 space-y-4" id="faq">
          {faqs.map((item, i) => (
            <details key={i} className="group rounded-2xl bg-emerald-50 border border-emerald-100 p-5">
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
                        className="px-3 py-1 rounded-full border border-gray-300 text-gray-800 hover:bg-gray-50"
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
              No results. Try different words, or{' '}
              <Link href="/contact" className="underline text-[#E3107D]">contact us</Link>.
            </div>
          )}
        </div>

        <div className="mt-10 rounded-2xl bg-white border p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-green-900">Still need help?</h2>
          <p className="text-sm text-gray-700 mt-2">
            We’re happy to help with account issues, bugs, and feature requests.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="px-5 py-2 rounded-full bg-[#E3107D] text-white hover:bg-[#c30c6a]"
            >
              Contact support
            </Link>
            <a
              href="mailto:support@jardinsolidaire.local"
              className="px-5 py-2 rounded-full border border-gray-300 text-gray-800 hover:bg-gray-50"
            >
              Email us
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
      className="px-4 py-2 rounded-full border border-gray-300 text-sm text-gray-800 hover:bg-gray-50"
    >
      {children}
    </Link>
  );
}
