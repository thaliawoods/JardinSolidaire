import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)' }} role="contentinfo">
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '1.25rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.875rem', color: 'var(--green)' }}>
          Jardin Solidaire
        </span>

        <nav style={{ display: 'flex', gap: '1.5rem' }} aria-label="Footer">
          <Link href="/contact" style={{ fontSize: '0.8rem', color: 'var(--muted)', textDecoration: 'none', letterSpacing: '0.01em' }}>
            Contact
          </Link>
          <Link href="/help" style={{ fontSize: '0.8rem', color: 'var(--muted)', textDecoration: 'none', letterSpacing: '0.01em' }}>
            Aide
          </Link>
        </nav>
      </div>
    </footer>
  );
}
