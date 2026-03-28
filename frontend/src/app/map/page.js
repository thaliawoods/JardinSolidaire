import GardensMap from '@/components/Map/GardensMap';

export default function MapPage() {
  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '2rem' }}>
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 400,
          fontSize: '2rem',
          color: 'var(--foreground)',
          marginBottom: '0.75rem',
        }}
      >
        Carte des jardins
      </h1>
      <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
        Retrouvez ici tous les jardins de JardinSolidaire. Activez la localisation pour centrer la carte.
      </p>

      {/* wrappers anti-dépassement */}
      <div style={{ width: '100%', minWidth: 0, overflow: 'hidden' }}>
        <div
          style={{
            border: '1px solid var(--border)',
            overflow: 'hidden',
            width: '100%',
            minWidth: 0,
          }}
        >
          <div style={{ width: '100%', minWidth: 0 }}>
            <GardensMap fullPage={false} height="70vh" />
          </div>
        </div>
      </div>
    </div>
  );
}
