"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
const BRAND_GREEN = "#16a34a";
const BRAND_PINK = "#E3107D";
const LOCAL_DIRS = ["/assets/", "/images/", "/img/", "/icons/"];

function resolveMedia(u) {
  if (!u) return null;
  const s = String(u).trim();
  if (s.startsWith("http") || s.startsWith("data:")) return s;
  if (LOCAL_DIRS.some((p) => s.startsWith(p))) return s;
  if (s.startsWith("/uploads/")) return `${API_BASE}${s}`;
  if (s.startsWith("/")) return s;
  const clean = s.replace(/^\.?\/*/, "");
  if (clean.startsWith("uploads/")) return `${API_BASE}/${clean}`;
  if (LOCAL_DIRS.some((p) => clean.startsWith(p.slice(1)))) return `/${clean}`;
  return `${API_BASE}/uploads/${clean}`;
}

function initials(a = "", b = "") {
  const x = (a || "").trim()[0] || "";
  const y = (b || "").trim()[0] || "";
  return (`${x}${y}`.toUpperCase() || "U");
}

function greenPlaceholder(first, last) {
  const txt = initials(first, last);
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <rect width="256" height="256" rx="24" fill="${BRAND_GREEN}"/>
  <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
        font-family="Inter, Arial" font-weight="700" font-size="110" fill="#fff">${txt}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function normalizeOwner(raw) {
  if (!raw) return null;

  const base = raw.owner || raw.proprietaire || raw.utilisateur || raw;

  const firstName = base.firstName ?? base.prenom ?? "";
  const lastName = base.lastName ?? base.nom ?? "";

  const avatarRaw = base.avatarUrl ?? base.photo_profil ?? base.avatar ?? null;
  const avatarUrl = resolveMedia(avatarRaw);

  const address = base.address ?? base.localisation ?? base.adresse ?? "—";
  const availability = base.availability ?? base.disponibilite ?? "";
  const surface =
    base.surface ??
    base.superficie ??
    base.surface_m2 ??
    base.superficie_m2 ??
    "";
  const gardenType = base.gardenType ?? base.type_jardin ?? base.kind ?? "";

  const intro =
    base.intro ??
    base.presentation ??
    base.biographie ??
    base.description ??
    "—";

  return {
    id: String(base.id ?? base.id_utilisateur ?? base.id_proprietaire ?? ""),
    firstName,
    lastName,
    avatarUrl,
    address,
    availability,
    surface,
    gardenType,
    intro,
  };
}

function Chip({ children }) {
  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-medium"
      style={{
        backgroundColor: "rgba(22,163,74,0.06)",
        border: "1px solid rgba(22,163,74,0.18)",
        color: "#14532d",
      }}
    >
      {children}
    </span>
  );
}

export default function OwnerDetailPage({ params }) {
  const { id } = params || {};
  const router = useRouter();

  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");

        let res = await fetch(`${API_BASE}/api/owners/${id}`, { cache: "no-store" });
        if (!res.ok) res = await fetch(`${API_BASE}/api/proprietaires/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        if (!alive) return;
        setOwner(normalizeOwner(data));
      } catch (e) {
        if (alive) {
          setErr("Impossible de charger le propriétaire.");
          setOwner(null);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  const fallback = useMemo(
    () => greenPlaceholder(owner?.firstName, owner?.lastName),
    [owner?.firstName, owner?.lastName]
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-6 py-10">
        <div className="max-w-6xl mx-auto animate-pulse space-y-4">
          <div className="h-24 bg-gray-100 rounded-2xl" />
          <div className="h-36 bg-gray-100 rounded-2xl" />
        </div>
      </main>
    );
  }

  if (err || !owner) {
    return (
      <main className="min-h-screen bg-white px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-4">
            {err || "Impossible de charger le propriétaire."}
          </div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-white text-green-700 border border-[rgba(22,163,74,0.25)] hover:bg-[rgba(22,163,74,0.04)] shadow-sm transition"
          >
            ← Retour
          </button>
        </div>
      </main>
    );
  }

  const avatarSrc = owner.avatarUrl || fallback;

  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-white text-green-700 border border-[rgba(22,163,74,0.25)] hover:bg-[rgba(22,163,74,0.04)] shadow-sm transition"
          >
            ← Retour
          </button>
        </div>

        {/* ✅ même disposition qu’avant : avatar + nom + chips + pills */}
        <section className="rounded-2xl p-6 mb-6 bg-white border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div
              className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden flex-shrink-0"
              style={{ border: "4px solid rgba(22,163,74,0.20)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarSrc}
                alt={`${owner.firstName} ${owner.lastName}`}
                className="h-full w-full object-cover"
                onError={(e) => { e.currentTarget.src = fallback; }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-semibold text-green-900 leading-tight">
                {owner.firstName} {owner.lastName}
              </h1>

              <div className="mt-3 flex flex-wrap gap-2">
                <Chip>Propriétaire</Chip>
                {owner.gardenType ? <Chip>{owner.gardenType}</Chip> : null}
                {owner.address && owner.address !== "—" ? <Chip>{owner.address}</Chip> : null}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <MetaPill label="Localisation" value={owner.address || "—"} />
              <MetaPill label="Type" value={owner.gardenType || "—"} />
              {owner.surface ? <MetaPill label="Surface" value={String(owner.surface)} /> : null}
              {owner.availability ? <MetaPill label="Dispo" value={String(owner.availability)} /> : null}
            </div>
          </div>

          {/* CTA rose */}
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              className="px-6 py-3 rounded-full text-white shadow-sm hover:opacity-95 transition w-full sm:w-auto"
              style={{ backgroundColor: BRAND_PINK }}
            >
              Contacter
            </button>

            <Link
              href="/gardens"
              className="px-6 py-3 rounded-full border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 transition w-full sm:w-auto text-center"
            >
              Voir les jardins
            </Link>
          </div>
        </section>

        <section>
          <Card title="Présentation">
            <p className="mt-3 text-gray-700 whitespace-pre-wrap">{owner.intro || "—"}</p>
          </Card>
        </section>
      </div>
    </main>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm">
      <h2 className="text-lg font-semibold text-green-800">{title}</h2>
      {children}
    </div>
  );
}

function MetaPill({ label, value }) {
  return (
    <div
      className="rounded-full px-4 py-2 text-sm"
      style={{
        backgroundColor: "rgba(22,163,74,0.06)",
        border: "1px solid rgba(22,163,74,0.18)",
        color: "#14532d",
      }}
      title={label}
    >
      <span className="opacity-80">{label} :</span> <span className="font-medium">{value}</span>
    </div>
  );
}
