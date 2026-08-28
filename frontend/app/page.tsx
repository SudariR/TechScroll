import Link from 'next/link';
import { ArrowRight, Cpu, Layers, Sparkles, Zap, ShieldCheck, Gauge } from 'lucide-react';

const STEPS = [
  { icon: Zap, title: 'Ingest', body: 'A scheduled collector pulls fresh articles from major technology feeds and deduplicates them automatically.' },
  { icon: Sparkles, title: 'Understand', body: 'Gemini converts each article into a structured lesson plan — scenes, comparisons, timelines and takeaways as strict JSON.' },
  { icon: ShieldCheck, title: 'Verify', body: 'Every response passes a runtime schema contract and a content-quality gate. Anything questionable is held for human review.' },
  { icon: Layers, title: 'Render', body: 'A registry-based animation engine turns that JSON into deterministic, swipeable explainers — no video, no AI-generated imagery.' },
];

const STACK = [
  'Next.js', 'TypeScript', 'Tailwind', 'Framer Motion',
  'NestJS', 'PostgreSQL', 'Prisma', 'Gemini API', 'Zod',
];

export default function Landing() {
  return (
    <main className="min-h-screen bg-ink-950 text-fg overflow-x-hidden">
      {/* nav */}
      <nav className="sticky top-0 z-50 backdrop-blur bg-ink-950/70 border-b border-ink-800">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-display text-base tracking-tight">TechScroll</span>
          <Link
            href="/feed"
            className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-accent text-ink-950 hover:bg-accent-bright transition"
          >
            Open the feed
          </Link>
        </div>
      </nav>

      {/* hero */}
      <section className="relative max-w-5xl mx-auto px-6 pt-24 pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[560px] h-[560px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-7 rounded-full bg-accent-soft border border-accent-border">
            <Cpu className="w-3.5 h-3.5 text-accent" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent">
              AI-assisted learning engine
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] max-w-3xl mb-6">
            Technology news,<br />rebuilt as something<br />you actually learn from.
          </h1>

          <p className="text-base md:text-lg text-fg-muted max-w-xl leading-relaxed mb-9">
            TechScroll turns complex tech stories into short, swipeable interactive
            explainers. Not summaries. Not AI video. Structured lessons rendered by a
            deterministic animation engine.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/feed"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent text-ink-950 text-sm font-semibold hover:bg-accent-bright transition"
            >
              Start scrolling <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/admin"
              className="px-5 py-3 rounded-xl border border-ink-800 text-sm font-medium text-fg-muted hover:border-ink-700 hover:text-fg transition"
            >
              View the pipeline
            </Link>
          </div>
        </div>
      </section>

      {/* principle */}
      <section className="border-y border-ink-800 bg-ink-900/30">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <p className="font-display text-2xl md:text-3xl leading-snug max-w-3xl">
            Information is always more important than animation.
            <span className="text-fg-dim"> If an animation doesn’t teach something, it doesn’t ship.</span>
          </p>
        </div>
      </section>

      {/* how it works */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-fg-dim mb-10">
          How it works
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className="relative p-6 rounded-2xl border border-ink-800 bg-ink-900/40 hover:border-ink-700 transition"
            >
              <span className="absolute top-6 right-6 text-[10px] font-mono text-fg-dim">
                0{i + 1}
              </span>
              <div className="w-9 h-9 rounded-xl bg-accent-soft border border-accent-border grid place-items-center mb-4">
                <s.icon className="w-4 h-4 text-accent" />
              </div>
              <h3 className="font-display text-lg mb-2">{s.title}</h3>
              <p className="text-sm text-fg-muted leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* differentiator */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Gauge, k: 'Deterministic', v: 'The same JSON always renders the same explainer. No generative video, no unpredictable output.' },
            { icon: ShieldCheck, k: 'Contract-enforced', v: 'Model output is validated at runtime. Invalid responses trigger a self-repair pass, not a crash.' },
            { icon: Layers, k: 'Template-driven', v: 'Five reusable learning patterns cover most technology stories without writing new components.' },
          ].map((f) => (
            <div key={f.k} className="p-6 rounded-2xl border border-ink-800">
              <f.icon className="w-4 h-4 text-accent mb-4" />
              <h3 className="text-sm font-semibold mb-2">{f.k}</h3>
              <p className="text-sm text-fg-muted leading-relaxed">{f.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* stack */}
      <section className="border-t border-ink-800">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-fg-dim mb-6">
            Built with
          </h2>
          <div className="flex flex-wrap gap-2">
            {STACK.map((t) => (
              <span
                key={t}
                className="px-3 py-1.5 rounded-lg border border-ink-800 bg-ink-900/40 text-xs text-fg-muted"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* cta */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-4">
          See it in motion.
        </h2>
        <p className="text-sm text-fg-muted mb-8">
          The feed updates itself. New explainers are generated, validated and published automatically.
        </p>
        <Link
          href="/feed"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-accent text-ink-950 text-sm font-semibold hover:bg-accent-bright transition"
        >
          Open TechScroll <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      <footer className="border-t border-ink-800 py-8 text-center text-xs text-fg-dim">
        TechScroll — an AI-assisted learning platform for technology news.
      </footer>
    </main>
  );
}