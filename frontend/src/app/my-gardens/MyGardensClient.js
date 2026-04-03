"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

import ConfirmModal from "@/components/ui/ConfirmModal";
import { useConfirm } from "@/hooks/useConfirm";
import AvailabilityCalendar from "@/components/availability/AvailabilityCalendar";

export default function MyGardensClient() {
  const router = useRouter();
  const search = useSearchParams();

  const initialTab =
    search.get("tab") === "drafts"
      ? "drafts"
      : search.get("tab") === "all"
      ? "all"
      : "published";

  const [tab, setTab] = useState(initialTab);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [busyId, setBusyId] = useState(null);
  const [toast, setToast] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [openAvailId, setOpenAvailId] = useState(null);

  const { confirm, confirmState, closeConfirm } = useConfirm();

  function pushToast(t) {
    setToast(t);
    window.clearTimeout(window.__js_toast_timeout__);
    window.__js_toast_timeout__ = window.setTimeout(() => setToast(""), 2200);
  }

  function setTabAndUrl(t) {
    setTab(t);
    const q =
      t === "published" ? "published" : t === "drafts" ? "drafts" : "all";
    router.replace(`/my-gardens?tab=${q}`);
  }

  async function load() {
    setLoading(true);
    setErrorMsg("");
    try {
      const query = { mine: 1 };
      if (tab === "published") query.published = true;
      if (tab === "drafts") query.published = false;

      const data = await apiFetch("/api/gardens", { query });
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setRows([]);
      setErrorMsg("Impossible de charger vos jardins.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  useEffect(() => {
    if (!openAvailId) return;
    const exists = rows.some((r) => r.id === openAvailId);
    if (!exists) setOpenAvailId(null);
  }, [rows, openAvailId]);

  const stats = useMemo(() => {
    const published = rows.filter((r) => !!r.publishedAt).length;
    const drafts = rows.length - published;
    return { published, drafts, total: rows.length };
  }, [rows]);

  function onEdit(id) {
    router.push(`/garden/${id}/edit`);
  }

  async function safeUnpublish(id) {
    try {
      await apiFetch(`/api/gardens/${id}/unpublish`, { method: "POST" });
      return;
    } catch (e) {
      if (e?.status !== 404) throw e;
    }
    await apiFetch(`/api/gardens/${id}`, {
      method: "PUT",
      body: { publishedAt: null },
    });
  }

  async function safePublish(id) {
    try {
      await apiFetch(`/api/gardens/${id}/publish`, { method: "POST" });
      return;
    } catch (e) {
      if (e?.status !== 404) throw e;
    }
    await apiFetch(`/api/gardens/${id}`, {
      method: "PUT",
      body: { publishedAt: new Date().toISOString() },
    });
  }

  async function doUnpublish(id) {
    try {
      setBusyId(id);
      await safeUnpublish(id);
      pushToast("Annonce retirée.");
      await load();
    } catch (e) {
      setErrorMsg("Impossible de retirer l'annonce.");
    } finally {
      setBusyId(null);
    }
  }

  async function doPublish(id) {
    try {
      setBusyId(id);
      await safePublish(id);
      pushToast("Annonce publiée.");
      await load();
    } catch (e) {
      setErrorMsg("Impossible de publier l'annonce.");
    } finally {
      setBusyId(null);
    }
  }

  async function doDelete(id) {
    try {
      setBusyId(id);
      await apiFetch(`/api/gardens/${id}`, { method: "DELETE" });
      pushToast("Jardin supprimé.");
      setOpenAvailId((prev) => (prev === id ? null : prev));
      await load();
    } catch (e) {
      setErrorMsg("Impossible de supprimer le jardin.");
    } finally {
      setBusyId(null);
    }
  }

  const tabs = [
    { key: "published", label: "Publiés" },
    { key: "drafts", label: "Brouillons" },
    { key: "all", label: "Tous" },
  ];

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <ConfirmModal
        open={confirmState.open}
        title={confirmState.title}
        description={confirmState.description}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        danger={confirmState.danger}
        busy={!!busyId}
        onClose={closeConfirm}
        onConfirm={async () => {
          const fn = confirmState.onConfirm;
          closeConfirm();
          if (typeof fn === "function") await fn();
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "2rem",
              color: "var(--foreground)",
              margin: 0,
            }}
          >
            Mes jardins
          </h1>
          <div style={{ fontSize: "0.8125rem", color: "var(--muted)", marginTop: "0.375rem" }}>
            {stats.total} au total · {stats.published} publié
            {stats.published > 1 ? "s" : ""} · {stats.drafts} brouillon
            {stats.drafts > 1 ? "s" : ""}
          </div>
        </div>

        <Link
          href="/add-garden"
          style={{
            flexShrink: 0,
            background: "var(--green)",
            color: "#fff",
            border: "none",
            padding: "0.6rem 1.25rem",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: "0.875rem",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          + Ajouter un jardin
        </Link>
      </div>

      {toast && (
        <div
          style={{
            marginBottom: "1rem",
            borderLeft: "3px solid var(--green)",
            paddingLeft: "0.75rem",
            fontSize: "0.875rem",
            color: "var(--foreground)",
          }}
        >
          {toast}
        </div>
      )}

      {errorMsg && (
        <p style={{ marginBottom: "1rem", fontSize: "0.875rem", color: "var(--muted)" }}>
          {errorMsg}
        </p>
      )}

      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          borderBottom: "1px solid var(--border)",
          marginBottom: "1.5rem",
        }}
      >
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTabAndUrl(key)}
            type="button"
            style={{
              background: "none",
              border: "none",
              borderBottom: tab === key ? "2px solid var(--foreground)" : "2px solid transparent",
              padding: "0.5rem 0",
              marginBottom: "-1px",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: "0.875rem",
              color: tab === key ? "var(--foreground)" : "var(--muted)",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && (
        <p style={{ fontSize: "0.875rem", color: "var(--muted)" }}>Chargement…</p>
      )}

      {!loading && rows.length === 0 && (
        <div style={{ padding: "2.5rem 0" }}>
          <p style={{ fontSize: "0.9375rem", color: "var(--foreground)" }}>
            {tab === "published"
              ? "Aucun jardin publié pour le moment."
              : tab === "drafts"
              ? "Aucun brouillon."
              : "Aucun jardin."}
          </p>
          <p style={{ fontSize: "0.875rem", color: "var(--muted)", marginTop: "0.375rem" }}>
            Crée un jardin, puis publie-le pour le rendre visible.
          </p>
          <Link
            href="/add-garden"
            style={{
              display: "inline-block",
              marginTop: "1rem",
              background: "var(--green)",
              color: "#fff",
              border: "none",
              padding: "0.6rem 1.25rem",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: "0.875rem",
              textDecoration: "none",
            }}
          >
            + Ajouter un jardin
          </Link>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1rem" }}>
        {rows.map((g) => {
          const isBusy = busyId === g.id;
          const isPublished = !!g.publishedAt;
          const isOpen = openAvailId === g.id;

          return (
            <div
              key={g.id}
              style={{ border: "1px solid var(--border)", background: "#fff", padding: "1.25rem" }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem" }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                    <span
                      style={{
                        fontSize: "0.9375rem",
                        fontWeight: 500,
                        color: "var(--foreground)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {g.title || "Sans titre"}
                    </span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: isPublished ? "var(--green)" : "var(--muted)",
                        flexShrink: 0,
                      }}
                    >
                      {isPublished ? "Publié" : "Brouillon"}
                    </span>
                  </div>
                  <div style={{ marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <div style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>
                      <span>Adresse :</span>{" "}
                      <span style={{ color: "var(--foreground)" }}>{g.address || "—"}</span>
                    </div>
                    <div style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>
                      <span>Besoins :</span>{" "}
                      <span style={{ color: "var(--foreground)" }}>{g.needs || "—"}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/garden/${g.id}`}
                  style={{
                    flexShrink: 0,
                    background: "none",
                    color: "var(--foreground)",
                    border: "1px solid var(--border)",
                    padding: "0.6rem 1.25rem",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: "0.875rem",
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                >
                  Voir
                </Link>
              </div>

              <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                <button
                  onClick={() => onEdit(g.id)}
                  type="button"
                  disabled={isBusy}
                  style={{
                    background: "none",
                    color: "var(--foreground)",
                    border: "1px solid var(--border)",
                    padding: "0.6rem 1.25rem",
                    cursor: isBusy ? "default" : "pointer",
                    fontFamily: "inherit",
                    fontSize: "0.875rem",
                    opacity: isBusy ? 0.6 : 1,
                  }}
                >
                  Modifier
                </button>

                <Link
                  href={`/my-gardens/${g.id}/slots`}
                  style={{
                    background: "none",
                    color: "var(--foreground)",
                    border: "1px solid var(--border)",
                    padding: "0.6rem 1.25rem",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: "0.875rem",
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                >
                  Gérer créneaux
                </Link>

                {isPublished ? (
                  <button
                    disabled={isBusy}
                    onClick={() =>
                      confirm({
                        title: "Retirer cette annonce ?",
                        description:
                          "Elle ne sera plus visible par les jardinier·es.\nTu pourras la republier plus tard.",
                        confirmText: "Retirer",
                        danger: false,
                        onConfirm: () => doUnpublish(g.id),
                      })
                    }
                    type="button"
                    style={{
                      background: "var(--green)",
                      color: "#fff",
                      border: "none",
                      padding: "0.6rem 1.25rem",
                      cursor: isBusy ? "default" : "pointer",
                      fontFamily: "inherit",
                      fontSize: "0.875rem",
                      opacity: isBusy ? 0.6 : 1,
                    }}
                  >
                    {isBusy ? "…" : "Retirer"}
                  </button>
                ) : (
                  <button
                    disabled={isBusy}
                    onClick={() => doPublish(g.id)}
                    type="button"
                    style={{
                      background: "var(--green)",
                      color: "#fff",
                      border: "none",
                      padding: "0.6rem 1.25rem",
                      cursor: isBusy ? "default" : "pointer",
                      fontFamily: "inherit",
                      fontSize: "0.875rem",
                      opacity: isBusy ? 0.6 : 1,
                    }}
                  >
                    {isBusy ? "…" : "Publier"}
                  </button>
                )}

                <button
                  disabled={isBusy}
                  onClick={() =>
                    confirm({
                      title: "Supprimer ce jardin ?",
                      description:
                        "Cette action est définitive.\nToutes les infos liées à ce jardin seront supprimées.",
                      confirmText: "Supprimer",
                      danger: true,
                      onConfirm: () => doDelete(g.id),
                    })
                  }
                  type="button"
                  style={{
                    background: "none",
                    color: "#c0392b",
                    border: "1px solid #c0392b",
                    padding: "0.6rem 1.25rem",
                    cursor: isBusy ? "default" : "pointer",
                    fontFamily: "inherit",
                    fontSize: "0.875rem",
                    opacity: isBusy ? 0.6 : 1,
                  }}
                >
                  {isBusy ? "…" : "Supprimer"}
                </button>
              </div>

              {isOpen && (
                <div style={{ marginTop: "1.25rem" }}>
                  <AvailabilityCalendar
                    mode="garden"
                    intent="form"
                    gardenId={g.id}
                    title="Calendrier"
                  />
                </div>
              )}

              <div style={{ marginTop: "0.75rem", fontSize: "0.75rem", color: "var(--muted)" }}>
                Astuce : garde en brouillon tant que tu n&apos;as pas ajouté toutes les infos.
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
