"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

const BRAND_PINK = "#E3107D"; 

function BackPill({ href = "/profile", children = "Retour au profil" }) {
  return (
    <Link
      href={href}
      aria-label="Retour au profil"
      className="
        inline-flex items-center gap-2
        rounded-full px-5 py-2
        bg-white/80 text-[#16a34a]
        border border-[rgba(22,163,74,0.28)]
        hover:bg-[rgba(22,163,74,0.06)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(22,163,74,0.35)]
        shadow-sm transition
      "
    >
      <span aria-hidden>←</span> {children}
    </Link>
  );
}

export default function EditOwnerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    district: "",
    availability: "",
    area: "", 
    kind: "",
    intro: "",
    description: "",
  });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const me = await apiFetch("/api/me");
        const o = me?.user?.owner;
        if (o) {
          setForm({
            firstName: o.firstName || "",
            lastName: o.lastName || "",
            district: o.district || "",
            availability: o.availability || "",
            area: o.area == null ? "" : String(o.area),
            kind: o.kind || "",
            intro: o.intro || "",
            description: o.description || "",
          });
        }
      } catch (e) {
        setErr(e?.error || e?.message || "server_error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.firstName.trim() || !form.lastName.trim()) {
      alert("First name and last name are required.");
      return;
    }

    const areaInt =
      form.area === "" || form.area == null
        ? null
        : Number.parseInt(form.area, 10);

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      district: form.district.trim(),
      availability: form.availability.trim(),
      area: Number.isFinite(areaInt) ? areaInt : null,
      kind: form.kind.trim(),
      intro: form.intro.trim(),
      description: form.description.trim(),
    };

    try {
      setSubmitting(true);
      await apiFetch("/api/me/owner", {
        method: "POST",
        body: payload,
      });
      router.push("/profile");
    } catch (e) {
      console.error("Update owner failed:", e);
      alert(`Couldn't save your owner profile. ${e?.message || ""}`);
    } finally {
      setSubmitting(false);
    }
  };

  const INPUT_CLS =
    "mt-1 w-full h-11 rounded-xl px-3 border border-gray-300 " +
    "bg-white text-gray-900 placeholder:text-gray-400 " +
    "focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.35)]";

  return (
    <div className="min-h-screen p-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-green-800">
            Modifier mon profil propriétaire
          </h1>
          <BackPill href="/profile" />
        </div>

        {err && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 mb-6">
            Impossible de charger le propriétaire. {err}
          </div>
        )}

        {loading ? (
          <Skeleton />
        ) : (
          <section
            className="rounded-2xl p-6 shadow-sm"
            style={{
              backgroundColor: "rgba(22,163,74,0.08)",
              border: "1px solid rgba(22,163,74,0.15)",
            }}
          >
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Prénom</label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={onChange}
                    className={INPUT_CLS}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Nom</label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={onChange}
                    className={INPUT_CLS}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Quartier</label>
                <input
                  name="district"
                  value={form.district}
                  onChange={onChange}
                  className={INPUT_CLS}
                  placeholder="ex. Belleville"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Disponibilité
                </label>
                <input
                  name="availability"
                  value={form.availability}
                  onChange={onChange}
                  className={INPUT_CLS}
                  placeholder="ex. soirées et week-ends"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">
                    Surface (m²)
                  </label>
                  <input
                    name="area"
                    type="number"
                    min="0"
                    value={form.area}
                    onChange={onChange}
                    className={INPUT_CLS}
                    placeholder="ex. 50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Type de jardin
                  </label>
                  <input
                    name="kind"
                    value={form.kind}
                    onChange={onChange}
                    className={INPUT_CLS}
                    placeholder="ex. cour intérieure, potager…"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Introduction
                </label>
                <input
                  name="intro"
                  value={form.intro}
                  onChange={onChange}
                  className={INPUT_CLS}
                  placeholder="Une brève introduction…"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  rows={4}
                  className={INPUT_CLS + " py-2 h-auto"}
                  placeholder="Parlez aux jardiniers de votre espace, de vos attentes, de l'accès, des outils, etc."
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="
    rounded-full px-6 py-2 text-white shadow-sm transition
    bg-pink-500 hover:bg-pink-600
    disabled:opacity-60
  "
                >
                  {submitting
                    ? "Enregistrement…"
                    : "Enregistrer les modifications"}
                </button>

                <Link
                  href="/profile"
                  className="
                    px-6 py-2 rounded-full
                    bg-white/80 text-[#16a34a]
                    border border-[rgba(22,163,74,0.28)]
                    hover:bg-[rgba(22,163,74,0.06)]
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(22,163,74,0.35)]
                    shadow-sm transition
                  "
                >
                  Annuler
                </Link>
              </div>
            </form>
          </section>
        )}
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="max-w-3xl mx-auto animate-pulse space-y-4">
      <div className="h-5 bg-gray-100 rounded" />
      <div className="h-10 bg-gray-100 rounded" />
      <div className="h-10 bg-gray-100 rounded" />
      <div className="h-10 bg-gray-100 rounded" />
      <div className="h-10 bg-gray-100 rounded" />
      <div className="h-24 bg-gray-100 rounded" />
    </div>
  );
}
