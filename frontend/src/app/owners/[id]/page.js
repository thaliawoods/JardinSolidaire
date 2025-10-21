"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
const BRAND_GREEN = "#16a34a";
const BRAND_PINK = "#E3107D";

function resolveMedia(u) {
  if (!u) return null;
  const s = String(u).trim();
  if (s.startsWith("http") || s.startsWith("data:")) return s;
  if (s.startsWith("/uploads/")) return `${API_BASE}${s}`;
  if (s.startsWith("/")) return s;
  return `${API_BASE}/uploads/${s.replace(/^\.?\/*/, "")}`;
}
function initials(a = "", b = "") {
  const x = (a || "").trim()[0] || "";
  const y = (b || "").trim()[0] || "";
  return `${x}${y}`.toUpperCase() || "U";
}
function greenPlaceholder(first, last) {
  const txt = initials(first, last);
  return `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'>
      <rect width='256' height='256' rx='24' fill='${BRAND_GREEN}'/>
      <text x='50%' y='54%' text-anchor='middle' dominant-baseline='middle'
        font-family='Inter, Arial' font-weight='700' font-size='110' fill='#fff'>${txt}</text>
    </svg>`
  )}`;
}

function normalizeOwner(raw) {
  if (!raw) return null;

  const base = raw.owner || raw.proprietaire || raw.utilisateur || raw;

  const firstName = base.firstName ?? base.prenom ?? "";
  const lastName = base.lastName ?? base.nom ?? "";

  const avatarRaw = base.avatarUrl ?? base.photo_profil ?? base.avatar ?? null;
  const avatarUrl = resolveMedia(avatarRaw);

  const address = base.address ?? base.localisation ?? base.adresse ?? "";
  const availability = base.availability ?? base.disponibilite ?? "";
  const surface =
    base.surface ??
    base.superficie ??
    base.surface_m2 ??
    base.superficie_m2 ??
    "";
  const gardenType = base.gardenType ?? base.type_jardin ?? base.kind ?? "";
  const rating = base.rating ?? base.note ?? base.note_moyenne ?? null;
  const reviewsCount =
    base.reviewsCount ??
    base.nb_avis ??
    (Array.isArray(base.reviews) ? base.reviews.length : null);

  const intro =
    base.intro ??
    base.presentation ??
    base.biographie ??
    base.description ??
    "";
  const comments = Array.isArray(base.comments)
    ? base.comments
    : Array.isArray(base.avis)
    ? base.avis
    : [];

  return {
    id: String(base.id ?? base.id_utilisateur ?? base.id_proprietaire ?? ""),
    firstName,
    lastName,
    avatarUrl,
    address,
    availability,
    surface,
    gardenType,
    rating,
    reviewsCount,
    intro,
    comments,
  };
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

        let res = await fetch(`${API_BASE}/api/owners/${id}`, {
          cache: "no-store",
        });
        if (!res.ok)
          res = await fetch(`${API_BASE}/api/proprietaires/${id}`, {
            cache: "no-store",
          });
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
    return () => {
      alive = false;
    };
  }, [id]);

  const fallback = useMemo(
    () => greenPlaceholder(owner?.firstName, owner?.lastName),
    [owner?.firstName, owner?.lastName]
  );

  if (loading) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="h-24 bg-gray-100 rounded-2xl animate-pulse mb-4" />
        <div className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
      </main>
    );
  }

  if (err || !owner) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 mb-4">
          {err || "Impossible de charger le propriétaire."}
        </div>
        <button
          onClick={() => router.back()}
          className="inline-block mt-4 px-4 py-2 rounded-full text-white"
          style={{ backgroundColor: BRAND_GREEN }}
        >
          ← Retour au jardin
        </button>
      </main>
    );
  }

  const avatarSrc = owner.avatarUrl || fallback;

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.back()}
          aria-label="Retour au jardin"
          className="
    inline-flex items-center gap-2
    rounded-full px-4 py-2
    bg-white/80 text-[#16a34a]
    border border-[rgba(22,163,74,0.28)]
    hover:bg-[rgba(22,163,74,0.06)]
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(22,163,74,0.35)]
    shadow-sm transition
  "
        >
          <span aria-hidden>←</span> Retour au jardin
        </button>
      </div>

      <section className="flex items-start gap-4 mb-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatarSrc}
          alt={`${owner.firstName} ${owner.lastName}`}
          className="w-20 h-20 rounded-full object-cover shadow"
          style={{ border: `4px solid rgba(22,163,74,0.35)` }}
          onError={(e) => {
            e.currentTarget.src = fallback;
          }}
        />
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-green-700">
            {owner.firstName} {owner.lastName}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {!!owner.reviewsCount && (
              <span
                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                style={{
                  backgroundColor: "white",
                  border: "1px solid rgba(22,163,74,0.25)",
                  color: BRAND_GREEN,
                }}
              >
                {owner.reviewsCount} avis
              </span>
            )}
            {owner.rating != null && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800">
                ★ {Number(owner.rating).toFixed(1)} note globale
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-4 mb-6">
        <Card title="Owner details">
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700">
            <p>
              <span className="font-medium text-gray-800">Full name</span>
              <br />
              {owner.firstName} {owner.lastName}
            </p>
            {!!owner.address && (
              <p>
                <span className="font-medium text-gray-800">Neighborhood</span>
                <br />
                {owner.address}
              </p>
            )}
            {!!owner.availability && (
              <p>
                <span className="font-medium text-gray-800">Availability</span>
                <br />
                {owner.availability}
              </p>
            )}
            {!!owner.surface && (
              <p>
                <span className="font-medium text-gray-800">Surface</span>
                <br />
                {owner.surface}
              </p>
            )}
            {!!owner.gardenType && (
              <p>
                <span className="font-medium text-gray-800">Garden type</span>
                <br />
                {owner.gardenType}
              </p>
            )}
          </div>
        </Card>

        <Card title="Badges">
          <div className="flex flex-wrap gap-2">
            <span
              className="px-2 py-1 text-xs rounded-full"
              style={{
                backgroundColor: "rgba(22,163,74,0.12)",
                color: BRAND_GREEN,
              }}
            >
              Propriétaire
            </span>
            {!!owner.gardenType && (
              <span
                className="px-2 py-1 text-xs rounded-full"
                style={{
                  backgroundColor: "white",
                  border: "1px solid rgba(22,163,74,0.25)",
                  color: BRAND_GREEN,
                }}
              >
                {owner.gardenType}
              </span>
            )}
            {!!owner.address && (
              <span
                className="px-2 py-1 text-xs rounded-full"
                style={{
                  backgroundColor: "white",
                  border: "1px solid rgba(22,163,74,0.25)",
                  color: BRAND_GREEN,
                }}
              >
                📍 {owner.address}
              </span>
            )}
          </div>
        </Card>
      </section>

      <Card title="Introduction" className="mb-6">
        <p className="text-gray-700">{owner.intro || "—"}</p>
      </Card>

      <Card title="Comments">
        {owner.comments?.length ? (
          <ul className="space-y-3">
            {owner.comments.map((c, i) => {
              const text =
                typeof c === "string"
                  ? c
                  : c.comment || c.contenu || c.commentaire || "—";
              const who =
                typeof c === "object" ? c.author || c.auteur || "" : "";
              const note =
                typeof c === "object" && c.note != null ? ` • ★ ${c.note}` : "";
              return (
                <li
                  key={i}
                  className="text-sm text-gray-700 rounded-xl px-3 py-2"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.6)",
                    border: "1px solid rgba(22,163,74,0.15)",
                  }}
                >
                  <span className="block">{text}</span>
                  {(who || note) && (
                    <span className="text-xs text-gray-500">
                      {who}
                      {note}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-600 text-sm">No comments yet.</p>
        )}
      </Card>
    </main>
  );
}

function Card({ title, children, className = "" }) {
  return (
    <section
      className={`rounded-2xl p-5 shadow-sm ${className}`}
      style={{
        backgroundColor: "rgba(22,163,74,0.08)", 
        border: "1px solid rgba(22,163,74,0.15)",
      }}
    >
      <h2 className="text-sm font-semibold" style={{ color: BRAND_GREEN }}>
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
