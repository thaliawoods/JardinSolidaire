'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useConfirm } from '@/hooks/useConfirm';

const INPUT = { display: 'block', width: '100%', border: '1px solid var(--border)', padding: '0.6rem 0.75rem', background: '#fff', color: 'var(--foreground)', fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' };
const LABEL = { display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: '0.4rem' };

export default function EditGardenPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [initialLoaded, setInitialLoaded] = useState(false);
  const [publishedAt, setPublishedAt] = useState(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    address: '',
    needs: '',
    area: '',
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { confirm, confirmState, closeConfirm } = useConfirm();

  useEffect(() => {
    if (!id) return;
    (async () => {
      setMsg('');
      setErrorMsg('');
      try {
        const g = await apiFetch(`/api/gardens/${id}`);
        setForm({
          title: g.title || '',
          description: g.description || '',
          address: g.address || '',
          needs: g.needs || '',
          area: g.area ?? '',
        });
        setPublishedAt(g.publishedAt || null);
        setInitialLoaded(true);
      } catch (e) {
        console.error(e);
        setErrorMsg(e?.message || "Impossible de charger ce jardin.");
      }
    })();
  }, [id]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function onSave(e) {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    setErrorMsg('');
    try {
      await apiFetch(`/api/gardens/${id}`, {
        method: 'PUT',
        body: {
          title: form.title.trim(),
          description: form.description.trim() || undefined,
          address: form.address.trim(),
          needs: form.needs.trim() || undefined,
          area: form.area === '' ? null : Number(form.area),
        },
      });
      setMsg('Modifications enregistrées.');
      router.push('/my-gardens?tab=all');
    } catch (e2) {
      console.error(e2);
      setErrorMsg(e2?.message || 'Échec de la mise à jour.');
    } finally {
      setSaving(false);
    }
  }

  async function doDelete() {
    try {
      setSaving(true);
      setErrorMsg('');
      await apiFetch(`/api/gardens/${id}`, { method: 'DELETE' });
      router.push('/my-gardens?tab=all');
    } catch (e) {
      console.error(e);
      setErrorMsg("Impossible de supprimer le jardin.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: 'var(--foreground)', padding: '48px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        <ConfirmModal
          open={confirmState.open}
          title={confirmState.title}
          description={confirmState.description}
          confirmText={confirmState.confirmText}
          cancelText={confirmState.cancelText}
          danger={confirmState.danger}
          busy={saving}
          onClose={closeConfirm}
          onConfirm={async () => {
            const fn = confirmState.onConfirm;
            closeConfirm();
            if (typeof fn === 'function') await fn();
          }}
        />

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginBottom: 8 }}>
          <div>
            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--green)', margin: '0 0 0.75rem' }}>
              Propriétaire
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 400, color: 'var(--foreground)', margin: 0, lineHeight: 1.1 }}>
                Modifier mon jardin
              </h1>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: publishedAt ? 'var(--green)' : 'var(--muted)', border: '1px solid', borderColor: publishedAt ? 'var(--green)' : 'var(--border)', padding: '2px 8px' }}>
                {publishedAt ? 'Publié' : 'Brouillon'}
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: '0.5rem 0 0' }}>
              Mets à jour ton annonce, puis enregistre.
            </p>
          </div>
          <Link href="/my-gardens?tab=all" style={{ fontSize: '0.875rem', color: 'var(--foreground)', textDecoration: 'underline', textUnderlineOffset: 3, whiteSpace: 'nowrap', flexShrink: 0 }}>
            ← Mes jardins
          </Link>
        </div>

        {msg && (
          <div style={{ borderLeft: '2px solid var(--green)', paddingLeft: '0.75rem', fontSize: '0.875rem', color: 'var(--green)', margin: '1.5rem 0' }}>
            {msg}
          </div>
        )}
        {errorMsg && (
          <div style={{ borderLeft: '2px solid #dc2626', paddingLeft: '0.75rem', fontSize: '0.875rem', color: '#dc2626', margin: '1.5rem 0' }}>
            {errorMsg}
          </div>
        )}

        {!initialLoaded ? (
          <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginTop: '2rem' }}>Chargement…</p>
        ) : (
          <form onSubmit={onSave} style={{ border: '1px solid var(--border)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '2rem' }}>

            <div>
              <label style={LABEL}>Titre de l&apos;annonce <span style={{ color: '#dc2626' }}>*</span></label>
              <input name="title" value={form.title} onChange={onChange} style={INPUT} placeholder="Ex. Mon beau jardin" required />
            </div>

            <div>
              <label style={LABEL}>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={onChange}
                rows={4}
                style={{ ...INPUT, resize: 'vertical', lineHeight: 1.6 }}
                placeholder="Parlez un peu de votre jardin…"
              />
            </div>

            <div>
              <label style={LABEL}>Adresse <span style={{ color: '#dc2626' }}>*</span></label>
              <input name="address" value={form.address} onChange={onChange} style={INPUT} placeholder="Ex. 12 rue des Plantes, Paris" required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={LABEL}>Surface (m²)</label>
                <input name="area" value={form.area} onChange={onChange} style={INPUT} placeholder="Ex. 50" inputMode="numeric" />
              </div>
              <div>
                <label style={LABEL}>Besoins du jardin</label>
                <input name="needs" value={form.needs} onChange={onChange} style={INPUT} placeholder="arrosage, désherbage…" />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
              <button
                type="submit"
                disabled={saving}
                style={{ padding: '0.65rem 1.5rem', background: 'var(--green)', color: '#fff', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 600, opacity: saving ? 0.6 : 1 }}
              >
                {saving ? 'Enregistrement…' : 'Enregistrer'}
              </button>

              <button
                type="button"
                onClick={() =>
                  confirm({
                    title: 'Supprimer ce jardin ?',
                    description: "Cette action est définitive.\nTout sera supprimé pour ce jardin.",
                    confirmText: 'Supprimer',
                    danger: true,
                    onConfirm: () => doDelete(),
                  })
                }
                disabled={saving}
                style={{ padding: '0.65rem 1.25rem', background: '#fff', color: '#b91c1c', border: '1px solid #fca5a5', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', opacity: saving ? 0.6 : 1 }}
              >
                Supprimer
              </button>

              <Link href={`/garden/${id}`} style={{ padding: '0.65rem 1.25rem', background: '#fff', color: 'var(--foreground)', border: '1px solid var(--border)', fontSize: '0.875rem', textDecoration: 'none' }}>
                Voir la page
              </Link>

              <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                (Publier/retirer se fait depuis &quot;Mes jardins&quot;.)
              </span>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
