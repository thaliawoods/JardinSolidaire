'use client';

import Link from 'next/link';
import GardensMap from '@/components/Map/GardensMap';

export default function HomeMapSection() {
  return (
    <section>
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-14">
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.85rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--green)',
            }}
          >
            Carte
          </span>
          <Link
            href="/map"
            style={{
              fontSize: '0.875rem',
              color: 'var(--muted)',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            }}
          >
            Ouvrir en plein écran →
          </Link>
        </div>
        <GardensMap height="420px" />
      </div>
    </section>
  );
}
