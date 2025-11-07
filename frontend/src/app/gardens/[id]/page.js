"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import BookingButton from "@/components/booking/BookingButton";
import { getAnyToken } from "@/lib/api";

const AvailabilityCalendar = dynamic(
  () => import("@/components/availability/AvailabilityCalendar"),
  { ssr: false }
);

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
const BRAND_GREEN = "#16a34a";
const BRAND_PINK = "#E3107D";
const LOCAL_DIRS = ["/assets/", "/images/", "/img/", "/icons/"];

/* ---------- media helpers ---------- */
function resolveMedia(u) {
  if (!u) return "";
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
function greenAvatar(first, last) {
  const txt = initials(first, last);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
    <rect width="256" height="256" rx="24" fill="${BRAND_GREEN}"/>
    <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
      font-family="Inter, Arial" font-weight="700" font-size="110" fill="#fff">${txt}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/* ---------- normalizer ---------- */
function normalizeGarden(payload) {
  if (!payload) return null;

  const photosRaw = payload.photos ?? [];
  const photos = (Array.isArray(photosRaw)
    ? photosRaw
    : typeof photosRaw === "string"
    ? [photosRaw]
    : []
  ).map(resolveMedia);

  const ownerRaw = payload.owner ?? null;
  const owner =
    ownerRaw &&
    {
      id: String(ownerRaw.id ?? ownerRaw.id_utilisateur ?? ""),
      firstName: ownerRaw.firstName ?? ownerRaw.prenom ?? "",
      lastName: ownerRaw.lastName ?? ownerRaw.nom ?? "",
      avatarUrl: resolveMedia(ownerRaw.avatarUrl ?? ownerRaw.photo_profil ?? ""),
      phone: ownerRaw.phone ?? ownerRaw.telephone ?? null,
      address: ownerRaw.address ?? ownerRaw.adresse ?? null,
      averageRating: ownerRaw.averageRating ?? ownerRaw.note ?? null,
      intro: ownerRaw.bio ?? ownerRaw.presentation ?? null,
      ownerId:
        ownerRaw.ownerId ??
        ownerRaw.id_owner ??
        ownerRaw.idProprietaire ??
        ownerRaw.id_proprietaire ??
        null,
    };

  return {
    id: String(payload.id ?? payload.id_jardin ?? ""),
    title: payload.title ?? payload.titre ?? "",
    description: payload.description ?? "",
    address: payload.address ?? payload.adresse ?? "",
    kind: payload.kind ?? payload.type ?? "",
    needs: payload.needs ?? payload.besoins ?? "",
    photos,
    averageRating: payload.averageRating ?? payload.note_moyenne ?? null,
    owner: owner || null,

    // champs utiles pour construire le lien propriétaire
    demoOwnerId:
      payload.ownerProfileId ??
      payload.ownerDemoId ??
      payload.proprietaireDemoId ??
      null,
    ownerUserId:
      payload.ownerUserId ??
      payload.id_proprietaire ??
      payload.id_ownerUser ??
      null,
  };
}

export default function GardenDetailPage({ params }) {
  const { id } = use(params) || {};
  const [garden, setGarden] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError("");

        let res = await fetch(`${API_BASE}/api/gardens/${id}`, { cache: "no-store" });
        if (!res.ok) {
          res = await fetch(`${API_BASE}/api/jardins/${id}`, { cache: "no-store" });
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        if (alive) setGarden(normalizeGarden(data));
      } catch {
        if (alive) {
          setError("Couldn't load this garden.");
          setGarden(null);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 p-6">
        <div className="animate-pulse space-y-4 max-w-6xl mx-auto">
          <div className="h-28 bg-gray-100 rounded-2xl" />
          <div className="h-40 bg-gray-100 rounded-2xl" />
          <div className="h-40 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !garden) {
    return (
      <div className="min-h-screen bg-white text-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-4">
            {error || "Unknown error"}
          </div>
          <p className="text-gray-600">
            Retour aux <Link href="/gardens" className="underline text-green-700">jardins</Link>.
          </p>
        </div>
      </div>
    );
  }

  const owner = garden.owner;
  const ownerAvatar = owner?.avatarUrl || greenAvatar(owner?.firstName, owner?.lastName);

  // construit le meilleur id possible pour /owners/[id]
  const ownerProfileIdRaw =
    garden.demoOwnerId ??
    owner?.ownerId ??        // id de la table Owner (préféré)
    owner?.id ??             // parfois owner.id est l'id Owner
    garden.ownerUserId ??    // fallback : id du User
    null;

  const ownerHref = ownerProfileIdRaw ? `/owners/${ownerProfileIdRaw}` : null;

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 flex-1">
        {/* Retour */}
        <div className="mb-4">
          <Link
            href="/gardens"
            aria-label="Retour aux jardins"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-white/80 text-[#16a34a] border border-[rgba(22,163,74,0.28)] hover:bg-[rgba(22,163,74,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(22,163,74,0.35)] shadow-sm transition"
          >
            <span aria-hidden>←</span> Retour aux jardins
          </Link>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-5">{garden.title}</h1>

        {garden.photos.length > 0 && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={garden.photos[0]}
            alt={garden.title || "Photo de jardin"}
            className="w-full h-56 md:h-72 lg:h-80 object-cover rounded-2xl mb-6"
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <section className="lg:col-span-2">
            <Card title="Informations sur le jardin">
              <div className="mt-3 space-y-1.5 text-sm text-gray-700">
                <p>{garden.description}</p>
                <p><strong>Addresse:</strong> {garden.address || "—"}</p>
                <p><strong>Type:</strong> {garden.kind || "—"}</p>
                <p><strong>Besoins:</strong> {garden.needs || "—"}</p>
                <p><strong>Note moyenne:</strong> {garden.averageRating ?? "—"}★</p>
              </div>
            </Card>
          </section>

          <aside>
            <Card title="Propriétaire du jardin">
              {!owner ? (
                <p className="text-sm text-gray-600">Pas de propriétaire lié.</p>
              ) : (
                <div className="mt-3 grid grid-cols-1 gap-3 text-sm text-gray-700">
                  {/* toute la ligne devient un lien si on a un id */}
                  {ownerHref ? (
                    <Link
                      href={ownerHref}
                      className="flex items-center gap-3 rounded-lg hover:bg-white/50 transition p-1 -m-1 cursor-pointer"
                      aria-label={`Voir le profil de ${owner.firstName} ${owner.lastName}`}
                    >
                      <div
                        className="h-14 w-14 rounded-full overflow-hidden"
                        style={{ border: `4px solid rgba(22,163,74,0.35)` }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={ownerAvatar}
                          alt={`${owner.firstName} ${owner.lastName}`}
                          className="h-full w-full object-cover"
                          onError={(e) => { e.currentTarget.src = greenAvatar(owner.firstName, owner.lastName); }}
                        />
                      </div>
                      <div>
                        <p className="font-medium">{owner.firstName} {owner.lastName}</p>
                        <p className="text-gray-500">{owner.address || "—"}</p>
                      </div>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div
                        className="h-14 w-14 rounded-full overflow-hidden"
                        style={{ border: `4px solid rgba(22,163,74,0.35)` }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={ownerAvatar}
                          alt={`${owner.firstName} ${owner.lastName}`}
                          className="h-full w-full object-cover"
                          onError={(e) => { e.currentTarget.src = greenAvatar(owner.firstName, owner.lastName); }}
                        />
                      </div>
                      <div>
                        <p className="font-medium">{owner.firstName} {owner.lastName}</p>
                        <p className="text-gray-500">{owner.address || "—"}</p>
                      </div>
                    </div>
                  )}

                  {/* CTA explicite en plus (optionnel) */}
                  {ownerHref && (
                    <Link
                      href={ownerHref}
                      className="inline-block mt-1 px-4 py-2 rounded-full text-white"
                      style={{ backgroundColor: BRAND_PINK }}
                    >
                      Voir le profil
                    </Link>
                  )}
                </div>
              )}
            </Card>
          </aside>
        </div>

        {owner?.intro && (
          <section className="mt-6">
            <Card title="Introduction du propriétaire">
              <p className="mt-3 text-gray-700 whitespace-pre-wrap">{owner.intro}</p>
            </Card>
          </section>
        )}

        {/* Booking CTA */}
        <section className="mt-6">
          <BookingButton gardenId={garden.id} />
        </section>

        {/* Availability calendar */}
        <section className="mt-8">
          <h2 className="sr-only">Disponibilités du jardin</h2>
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.15)" }}
          />
          <AvailabilityCalendar mode="garden" ownerId={garden.id} token={getAnyToken()} />
        </section>
      </main>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{ backgroundColor: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.15)" }}
    >
      <h2 className="text-lg font-semibold text-green-800">{title}</h2>
      {children}
    </div>
  );
}
