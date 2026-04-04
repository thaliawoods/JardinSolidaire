import Link from 'next/link';

export const metadata = {
  title: 'Page introuvable — Jardin Solidaire',
};

export default function NotFound() {
  return (
    <div style={{
      minHeight: 'calc(100vh - 56px - 80px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem 1.5rem',
    }}>
      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(6rem, 15vw, 10rem)',
        lineHeight: 1,
        color: 'var(--green)',
        marginBottom: '0.5rem',
      }}>
        404
      </p>

      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
        lineHeight: 1.2,
        color: 'var(--foreground)',
        marginBottom: '0.75rem',
      }}>
        Cette page n&rsquo;existe pas
      </p>

      <p style={{
        fontSize: '0.95rem',
        color: 'var(--muted)',
        maxWidth: '26rem',
        lineHeight: 1.6,
        marginBottom: '2rem',
      }}>
        La page que vous cherchez a peut-être été déplacée ou n&rsquo;existe plus.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontFamily: 'var(--font-display)',
            fontSize: '0.95rem',
            color: 'var(--green)',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
          }}
        >
          Retour à l&rsquo;accueil&ensp;→
        </Link>

        <Link
          href="/gardens"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontFamily: 'var(--font-display)',
            fontSize: '0.95rem',
            color: 'var(--green)',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
          }}
        >
          Voir les jardins&ensp;→
        </Link>
      </div>

      <img
        src="/assets/ivy.png"
        alt=""
        aria-hidden="true"
        style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          width: 'clamp(120px, 20vw, 260px)',
          opacity: 0.15,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />
    </div>
  );
}
