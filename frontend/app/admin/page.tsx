"use client";

import { useState, useEffect, useCallback } from "react";
import { ExplainerClip } from "../types/schema";
import { ClipPlayer } from "../components/engine/ClipPlayer";
import {
  AdminClip,
  generateClip,
  listAllClips,
  publishClip,
  deleteClip,
} from "../lib/adminApi";
import { Loader2, Sparkles, Check, Trash2, RefreshCw } from "lucide-react";

const KEY_STORAGE = "techscroll_admin_key";

function toExplainer(c: AdminClip): ExplainerClip {
  return {
    id: c.id,
    title: c.title,
    hook: c.hook,
    takeaway: c.takeaway,
    scenes: c.scenes as ExplainerClip["scenes"],
  };
}

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [content, setContent] = useState("");

  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<AdminClip | null>(null);
  const [clips, setClips] = useState<AdminClip[]>([]);
  const [showJson, setShowJson] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(KEY_STORAGE);
    if (saved) setAdminKey(saved);
  }, []);

  const refresh = useCallback(async (key: string) => {
    if (!key) return;
    try {
      setClips(await listAllClips(key));
    } catch {
      /* wrong key or backend down — leave list empty */
    }
  }, []);

  useEffect(() => {
    refresh(adminKey);
  }, [adminKey, refresh]);

  const saveKey = (key: string) => {
    setAdminKey(key);
    localStorage.setItem(KEY_STORAGE, key);
  };

  const handleGenerate = async () => {
    setError(null);
    setGenerating(true);
    setPreview(null);
    try {
      const clip = await generateClip(adminKey, {
        title,
        source,
        content,
        sourceUrl: sourceUrl || undefined,
      });
      setPreview(clip);
      await refresh(adminKey);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setGenerating(false);
    }
  };

  const handlePublish = async (id: string) => {
    await publishClip(adminKey, id);
    await refresh(adminKey);
    if (preview?.id === id) setPreview({ ...preview, published: true });
  };

  const handleDelete = async (id: string) => {
    await deleteClip(adminKey, id);
    await refresh(adminKey);
    if (preview?.id === id) setPreview(null);
  };

  const canGenerate =
    adminKey.trim() &&
    title.trim() &&
    source.trim() &&
    content.trim().length > 200 &&
    !generating;

  return (
    <main className="min-h-screen bg-ink-950 text-fg">
      <header className="border-b border-ink-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            TechScroll Admin
          </h1>
          <p className="text-xs text-fg-dim">
            Generate, preview and publish explainers
          </p>
        </div>
        <input
          type="password"
          value={adminKey}
          onChange={(e) => saveKey(e.target.value)}
          placeholder="Admin key"
          className="px-3 py-2 text-sm rounded-lg bg-ink-900 border border-ink-800 outline-none focus:border-accent/50 w-56"
        />
      </header>

      <div className="grid lg:grid-cols-2 gap-6 p-6">
        {/* ---------------- input ---------------- */}
        <section className="flex flex-col gap-4">
          <div className="rounded-2xl border border-ink-800 bg-ink-900/40 p-5 flex flex-col gap-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-fg-dim">
              Source Article
            </h2>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article title"
              className="px-3 py-2.5 text-sm rounded-lg bg-ink-950 border border-ink-800 outline-none focus:border-accent/50"
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Source (e.g. TechCrunch)"
                className="px-3 py-2.5 text-sm rounded-lg bg-ink-950 border border-ink-800 outline-none focus:border-accent/50"
              />
              <input
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="Source URL (optional)"
                className="px-3 py-2.5 text-sm rounded-lg bg-ink-950 border border-ink-800 outline-none focus:border-accent/50"
              />
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste the full article text here…"
              rows={14}
              className="px-3 py-2.5 text-sm rounded-lg bg-ink-950 border border-ink-800 outline-none focus:border-accent/50 font-mono leading-relaxed resize-none"
            />

            <div className="flex items-center justify-between">
              <span className="text-xs text-fg-dim tabular-nums">
                {content.trim().split(/\s+/).filter(Boolean).length} words
              </span>
              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-ink-950 text-sm font-semibold disabled:opacity-30 disabled:pointer-events-none hover:bg-accent-bright transition"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Generating…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Generate Explainer
                  </>
                )}
              </button>
            </div>

            {error && (
              <pre className="text-xs text-rose-400 bg-rose-950/20 border border-rose-500/20 rounded-lg p-3 whitespace-pre-wrap max-h-40 overflow-auto">
                {error}
              </pre>
            )}
          </div>

          {/* ---------------- library ---------------- */}
          <div className="rounded-2xl border border-ink-800 bg-ink-900/40 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-fg-dim">
                Library
              </h2>
              <button
                onClick={() => refresh(adminKey)}
                className="text-fg-dim hover:text-fg transition"
                aria-label="Refresh"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-2 max-h-72 overflow-auto">
              {clips.length === 0 && (
                <p className="text-xs text-fg-dim">No clips yet.</p>
              )}
              {clips.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-ink-950 border border-ink-800"
                >
                  <button
                    onClick={() => setPreview(c)}
                    className="flex-1 text-left min-w-0"
                  >
                    <p className="text-sm truncate">{c.title}</p>
                    <p className="text-[10px] text-fg-dim uppercase tracking-wider">
                      {c.category} · {c.published ? "published" : "draft"}
                    </p>
                  </button>

                  {!c.published && (
                    <button
                      onClick={() => handlePublish(c.id)}
                      className="p-2 rounded-md bg-accent/10 text-accent hover:bg-accent/20 transition"
                      aria-label="Publish"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-2 rounded-md bg-ink-900 text-fg-dim hover:text-rose-400 transition"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- preview ---------------- */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-fg-dim">
              Live Preview
            </h2>
            {preview && (
              <button
                onClick={() => setShowJson((s) => !s)}
                className="text-xs text-fg-dim hover:text-fg transition"
              >
                {showJson ? "Show animation" : "Show JSON"}
              </button>
            )}
          </div>

          <div className="rounded-2xl border border-ink-800 bg-ink-900/40 p-5 min-h-[560px] flex items-center justify-center">
            {!preview && (
              <p className="text-sm text-fg-dim text-center max-w-xs">
                Generate an explainer or pick one from the library to preview it
                here.
              </p>
            )}

            {preview && !showJson && (
              <ClipPlayer clip={toExplainer(preview)} isActive />
            )}

            {preview && showJson && (
              <pre className="w-full h-[520px] overflow-auto text-[11px] leading-relaxed font-mono text-fg-muted">
                {JSON.stringify(preview.scenes, null, 2)}
              </pre>
            )}
          </div>

          {preview && (
            <div className="rounded-2xl border border-ink-800 bg-ink-900/40 p-4 flex items-center justify-between text-xs">
              <div className="text-fg-dim">
                <span className="uppercase tracking-wider">
                  {preview.category}
                </span>
                {preview.model && <> · {preview.model}</>}
                {preview.promptVersion && <> · {preview.promptVersion}</>}
              </div>
              {!preview.published ? (
                <button
                  onClick={() => handlePublish(preview.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-ink-950 font-semibold hover:bg-accent-bright transition"
                >
                  <Check className="w-3.5 h-3.5" /> Publish to feed
                </button>
              ) : (
                <span className="text-accent font-semibold">Published</span>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
