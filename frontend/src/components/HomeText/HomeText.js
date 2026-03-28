'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import HomeMapSection from '../HomeMapSection/page';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function HomeText() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stats, setStats] = useState({ gardens: null, gardeners: null });

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));

    async function loadStats() {
      try {
        const [gRes, jRes] = await Promise.all([
          fetch(`${API_BASE}/api/gardens`, { cache: 'no-store' }),
          fetch(`${API_BASE}/api/gardeners`, { cache: 'no-store' }),
        ]);
        const gData = await gRes.json().catch(() => null);
        const jData = await jRes.json().catch(() => null);
        const gardens = Array.isArray(gData?.gardens) ? gData.gardens.length : Array.isArray(gData) ? gData.length : null;
        const gardeners = Array.isArray(jData?.gardeners) ? jData.gardeners.length : Array.isArray(jData) ? jData.length : null;
        setStats({ gardens, gardeners });
      } catch {}
    }
    loadStats();
  }, []);

  return (
    <>
      <section style={{
        borderBottom: '1px solid var(--border)',
        overflow: 'hidden',
        position: 'relative',
        marginTop: 'calc(-4rem + 56px)',  /* cancel layout pt-16, offset fixed navbar height */
        minHeight: '72vh',
        display: 'flex',
        alignItems: 'center',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/ivy.png"
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 'clamp(320px, 40vw, 560px)',
            height: 'auto',
            display: 'block',
            userSelect: 'none',
            pointerEvents: 'none',
            transform: 'scaleX(-1)',
          }}
        />

        <div className="max-w-5xl mx-auto px-6 md:px-10" style={{ position: 'relative', zIndex: 1, paddingTop: '2rem', paddingBottom: '2rem', width: '100%' }}>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              fontWeight: 400,
              color: 'var(--foreground)',
              marginBottom: '1.25rem',
              maxWidth: '60%',
            }}
          >
            Relier les jardins<br />
            aux jardinier·es
          </h1>

          <p style={{ fontSize: '1rem', color: 'var(--muted)', maxWidth: 480, marginBottom: '2rem', lineHeight: 1.5 }}>
            Propriétaires qui ont besoin d&apos;un coup de main,
            jardinier·es qui veulent mettre les mains dans la terre —
            ensemble, à Paris et en IDF.
          </p>

          <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <ArrowLink href="/gardens">Explorer les jardins</ArrowLink>
            <ArrowLink href="/gardeners">Voir les jardinier·es</ArrowLink>
            {isLoggedIn
              ? <ArrowLink href="/dashboard">Mon tableau de bord</ArrowLink>
              : <ArrowLink href="/register" muted>Rejoindre</ArrowLink>
            }
          </nav>
        </div>
      </section>

      <section style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-10">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            <Stat value={stats.gardens} label="jardins" />
            <Stat value={stats.gardeners} label="jardinier·es" />
            <Stat value="Paris" label="et région IDF" />
          </div>
        </div>
      </section>

      <section style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-14">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4rem', alignItems: 'start' }}>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.85rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--green)',
              }}
            >
              À propos
            </div>
            <div style={{ color: 'var(--foreground)', lineHeight: 1.75, fontSize: '1.05rem' }}>
              <p style={{ marginBottom: '1rem' }}>
                Un jardin, ça se cultive. Le lien aussi.
              </p>
              <p style={{ marginBottom: '1rem', color: 'var(--muted)' }}>
                On met en lien des propriétaires qui ont besoin d&apos;un coup de main
                et des jardinier·es qui veulent agir, mettre les mains dans la terre,
                et se reconnecter au vivant.
              </p>
              <p style={{ color: 'var(--muted)' }}>
                On partage un moment utile, on apprend, on s&apos;entraide, et on rend
                la nature plus accessible, ensemble.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-14">
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.85rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--green)',
              marginBottom: '3rem',
            }}
          >
            Comment ça marche
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '2rem', color: 'var(--foreground)' }}>
                Vous avez un jardin
              </p>
              <Steps items={[
                { n: '01', title: 'Créez votre profil propriétaire', desc: "Décrivez votre jardin, sa surface, ses besoins et vos disponibilités." },
                { n: '02', title: 'Publiez des créneaux', desc: "Choisissez les jours et heures où vous avez besoin d'un coup de main." },
                { n: '03', title: 'Accueillez un·e jardinier·e', desc: "Confirmez la demande et partagez un moment de jardinage." },
              ]} />
            </div>

            <div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '2rem', color: 'var(--foreground)' }}>
                Vous voulez jardiner
              </p>
              <Steps items={[
                { n: '01', title: 'Créez votre profil jardinier·e', desc: "Listez vos compétences, votre secteur et vos disponibilités." },
                { n: '02', title: 'Explorez la carte', desc: "Trouvez un jardin proche de chez vous avec les créneaux qui vous conviennent." },
                { n: '03', title: 'Réservez et jardinez', desc: "Envoyez une demande, jardinez bénévolement, apprenez et partagez." },
              ]} />
            </div>
          </div>
        </div>
      </section>

      <HomeMapSection />
    </>
  );
}

function ArrowLink({ href, children, muted }) {
  return (
    <Link
      href={href}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        fontSize: '0.95rem',
        color: muted ? 'var(--muted)' : 'var(--foreground)',
        textDecoration: 'underline',
        textUnderlineOffset: '3px',
        textDecorationColor: muted ? 'var(--border)' : 'currentColor',
        transition: 'color 0.15s',
      }}
    >
      {children} <span aria-hidden style={{ fontFamily: 'var(--font-display)' }}>→</span>
    </Link>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 400,
          color: 'var(--green)',
          lineHeight: 1,
          marginBottom: '0.4rem',
        }}
      >
        {value ?? '—'}
      </div>
      <div style={{ fontSize: '0.85rem', color: 'var(--muted)', letterSpacing: '0.03em' }}>{label}</div>
    </div>
  );
}

function Steps({ items }) {
  return (
    <ol style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {items.map(({ n, title, desc }) => (
        <li key={n} style={{ display: 'grid', gridTemplateColumns: '2.5rem 1fr', gap: '0', alignItems: 'start' }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.75rem',
              color: 'var(--muted)',
              paddingTop: '0.15rem',
              letterSpacing: '0.05em',
            }}
          >
            {n}
          </span>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.25rem', color: 'var(--foreground)' }}>
              {title}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.5 }}>{desc}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}
