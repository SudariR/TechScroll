"use client";

import Link from "next/link";
import {
  ArrowRight,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  ShieldCheck,
  Gauge,
  ChevronDown,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { AmbientBackground } from "./components/visual/AmbientBackground";
import { Reveal } from "./components/visual/Reveal";

const STEPS = [
  {
    icon: Zap,
    title: "Ingest",
    body: "A scheduled collector pulls fresh articles from major technology feeds and deduplicates them automatically.",
  },
  {
    icon: Sparkles,
    title: "Understand",
    body: "Gemini converts each article into a structured lesson plan — scenes, comparisons, timelines and takeaways as strict JSON.",
  },
  {
    icon: ShieldCheck,
    title: "Verify",
    body: "Every response passes a runtime schema contract and a content-quality gate. Anything questionable is held for human review.",
  },
  {
    icon: Layers,
    title: "Render",
    body: "A registry-based animation engine turns that JSON into deterministic, swipeable explainers — no video, no AI-generated imagery.",
  },
];

const STACK = [
  "Next.js",
  "TypeScript",
  "Tailwind",
  "Framer Motion",
  "NestJS",
  "PostgreSQL",
  "Prisma",
  "Gemini API",
  "Zod",
];

const HERO_LINES = [
  "Technology news,",
  "rebuilt as something",
  "you actually learn from.",
];

export default function Landing() {
  const { scrollY } = useScroll();
  const scrollCueOpacity = useTransform(scrollY, [0, 100], [1, 0]);

  return (
    <main className="min-h-screen bg-ink-950 text-fg overflow-x-hidden relative">
      <AmbientBackground variant="landing" />

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-ink-950/70 border-b border-ink-800/80">
          <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
            <span className="font-display text-base font-semibold tracking-tight text-fg">
              TechScroll
            </span>
            <Link
              href="/feed"
              className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-accent text-ink-950 hover:bg-accent-bright transition-all shadow-[0_0_15px_-3px_rgba(0,168,0,0.3)]"
            >
              Open the feed
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative max-w-5xl mx-auto px-6 pt-24 pb-20">
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1 mb-7 rounded-full bg-accent-soft border border-accent-border"
            >
              {/* <Cpu className="w-3.5 h-3.5 text-accent" /> */}
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent">
                AI-assisted learning engine
              </span>
            </motion.div>

            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-[1.08] max-w-3xl mb-6">
              {HERO_LINES.map((line, idx) => (
                <motion.span
                  key={idx}
                  className={`block ${idx === HERO_LINES.length - 1
                    ? "bg-gradient-to-r from-fg via-fg to-accent bg-clip-text text-transparent"
                    : "text-fg"
                    }`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.55,
                    delay: 0.12 * idx,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {line}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.4, ease: "easeOut" }}
              className="text-base md:text-lg text-fg-muted max-w-xl leading-relaxed mb-9"
            >
              TechScroll turns complex tech stories into short, swipeable
              interactive explainers. Not summaries. Not AI video. Structured
              lessons rendered by a deterministic animation engine.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.5, ease: "easeOut" }}
              className="flex flex-wrap items-center gap-3"
            >
              <Link
                href="/feed"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent text-ink-950 text-sm font-semibold hover:bg-accent-bright shadow-[0_0_20px_-4px_rgba(0,168,0,0.4)] transition-all"
              >
                Start scrolling <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/admin"
                className="px-5 py-3 rounded-xl border border-ink-800 bg-ink-900/40 text-sm font-medium text-fg-muted hover:border-ink-700 hover:text-fg hover:bg-ink-900/70 transition-all"
              >
                View the pipeline
              </Link>
            </motion.div>

            {/* Live Stat Strip */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.6, ease: "easeOut" }}
              className="flex flex-wrap items-center gap-4 sm:gap-6 pt-6 border-t border-ink-800/80 mt-9 text-xs text-fg-dim"
            >
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-fg">5</span> learning
                templates
              </div>
              <div className="w-1 h-1 rounded-full bg-ink-700" />
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-fg">100%</span>{" "}
                schema-validated output
              </div>
              <div className="w-1 h-1 rounded-full bg-ink-700" />
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-fg">Updates</span> hourly
              </div>
            </motion.div>

            {/* Floating Scroll Cue */}
            <motion.div
              style={{ opacity: scrollCueOpacity }}
              className="pt-14 flex items-center gap-2 text-xs text-fg-dim font-medium tracking-wide"
            >
              <ChevronDown className="w-4 h-4 animate-bounce text-fg-muted" />
              <span>Scroll to explore</span>
            </motion.div>
          </div>
        </section>

        {/* Principle Section */}
        <Reveal>
          <section className="border-y border-ink-800 bg-ink-900/40 backdrop-blur-sm">
            <div className="max-w-5xl mx-auto px-6 py-14">
              <p className="font-display text-2xl md:text-3xl leading-snug max-w-3xl">
                Information is always more important than animation.
                <span className="text-fg-dim">
                  {" "}
                  If an animation doesn’t teach something, it doesn’t ship.
                </span>
              </p>
            </div>
          </section>
        </Reveal>

        {/* How It Works */}
        <section className="max-w-5xl mx-auto px-6 py-20">
          <Reveal>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-fg-dim mb-10">
              How it works
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <div className="relative p-6 rounded-2xl border border-ink-800 bg-ink-900/40 hover:border-ink-700 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group">
                  {/* Top-edge highlight */}
                  <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                  {/* Step number rendered large and low-contrast */}
                  <span className="absolute top-5 right-6 text-4xl font-display font-bold text-ink-700 select-none group-hover:text-ink-600 transition-colors">
                    0{i + 1}
                  </span>

                  <div className="w-9 h-9 rounded-xl bg-accent-soft border border-accent-border grid place-items-center mb-4">
                    <s.icon className="w-4 h-4 text-accent" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2 text-fg">
                    {s.title}
                  </h3>
                  <p className="text-sm text-fg-muted leading-relaxed max-w-md">
                    {s.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Differentiators */}
        <section className="max-w-5xl mx-auto px-6 pb-20">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: Gauge,
                k: "Deterministic",
                v: "The same JSON always renders the same explainer. No generative video, no unpredictable output.",
              },
              {
                icon: ShieldCheck,
                k: "Contract-enforced",
                v: "Model output is validated at runtime. Invalid responses trigger a self-repair pass, not a crash.",
              },
              {
                icon: Layers,
                k: "Template-driven",
                v: "Five reusable learning patterns cover most technology stories without writing new components.",
              },
            ].map((f, i) => (
              <Reveal key={f.k} delay={i * 0.08}>
                <div className="relative p-6 rounded-2xl border border-ink-800 bg-ink-900/40 hover:border-ink-700 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                  {/* Top-edge highlight */}
                  <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                  <f.icon className="w-4 h-4 text-accent mb-4" />
                  <h3 className="text-sm font-semibold mb-2 text-fg">{f.k}</h3>
                  <p className="text-sm text-fg-muted leading-relaxed">
                    {f.v}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Stack */}
        <Reveal>
          <section className="border-t border-ink-800">
            <div className="max-w-5xl mx-auto px-6 py-14">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-fg-dim mb-6">
                Built with
              </h2>
              <div className="flex flex-wrap gap-2">
                {STACK.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1.5 rounded-lg border border-ink-800 bg-ink-900/40 text-xs text-fg-muted hover:border-ink-700 hover:text-fg transition-colors"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* CTA */}
        <Reveal>
          <section className="max-w-5xl mx-auto px-6 py-24 text-center">
            <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-4 text-fg font-bold">
              See it in motion.
            </h2>
            <p className="text-sm text-fg-muted mb-8 max-w-md mx-auto leading-relaxed">
              The feed updates itself. New explainers are generated, validated and published automatically.
            </p>
            <Link
              href="/feed"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-accent text-ink-950 text-sm font-semibold hover:bg-accent-bright shadow-[0_0_25px_-5px_rgba(0,168,0,0.4)] transition-all"
            >
              Open TechScroll <ArrowRight className="w-4 h-4" />
            </Link>
          </section>
        </Reveal>

        <footer className="border-t border-ink-800 py-8 text-center text-xs text-fg-dim">
          TechScroll — an AI-assisted learning platform for technology news.
        </footer>
      </div>
    </main>
  );
}