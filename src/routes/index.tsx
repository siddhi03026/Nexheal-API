import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Activity,
  ArrowRight,
  Bot,
  Boxes,
  BrainCircuit,
  ChevronRight,
  CircuitBoard,
  FileBarChart,
  Github,
  Linkedin,
  MessageSquare,
  Play,
  Radar,
  Shield,
  Sparkles,
  Twitter,
  Wand2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LatencyChart } from "@/components/dashboard/LatencyChart";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import robotImg from "@/assets/nexheal-robot.png";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NexHeal AI — Autonomous Intelligence for API Reliability" },
      {
        name: "description",
        content:
          "Monitor, detect, and heal APIs automatically with NexHeal AI — the autonomous reliability platform for modern DevOps teams.",
      },
      { property: "og:title", content: "NexHeal AI — Self-Healing API Platform" },
      {
        property: "og:description",
        content: "Autonomous Intelligence for API Reliability & Self-Healing Systems.",
      },
    ],
  }),
  component: LandingPage,
});

/* ---------- Navbar ---------- */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Features", href: "#features" },
    { label: "Solutions", href: "#how" },
    ...(isAuthenticated ? [{ label: "Dashboard", to: "/dashboard" as const }] : []),
    { label: "Pricing", href: "#pricing" },
    { label: "Docs", href: "#docs" },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div
        className={`mx-auto max-w-6xl px-4 transition-all ${
          scrolled ? "scale-[0.99]" : ""
        }`}
      >
        <nav
          className={`flex items-center justify-between rounded-2xl px-4 md:px-5 py-2.5 ${
            scrolled ? "glass-strong shadow-elevated" : "glass"
          }`}
          style={{ boxShadow: scrolled ? "var(--shadow-elevated)" : undefined }}
        >
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg gradient-primary grid place-items-center glow-primary">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold tracking-tight">NexHeal AI</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((l) =>
              l.to ? (
                <Link
                  key={l.label}
                  to={l.to}
                  className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.label}
                  href={l.href}
                  className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md"
                >
                  {l.label}
                </a>
              )
            )}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {!loading && (
              <>
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    <Button size="sm" className="gradient-primary gap-1.5">
                      Dashboard <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login" className="hidden sm:inline-flex">
                      <Button variant="ghost" size="sm">Login</Button>
                    </Link>
                    <Link to="/register">
                      <Button size="sm" className="gradient-primary gap-1.5">
                        Get Started <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], [0, -40]);
  return (
    <section className="relative pt-32 md:pt-40 pb-20 overflow-hidden">
      {/* background */}
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "var(--gradient-glow)" }}
      />
      {/* particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-primary/60"
            style={{
              left: `${(i * 53) % 100}%`,
              top: `${(i * 37) % 100}%`,
            }}
            animate={{ y: [0, -20, 0], opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 4 + (i % 4), repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>

      <div className="relative max-w-6xl mx-auto px-4 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center lg:text-left"
        >
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-full glass">
            <Sparkles className="h-3 w-3 text-accent-cyan" />
            Autonomous AI Reliability
          </span>
          <h1 className="mt-5 text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
            AI-Powered <span className="gradient-text">Autonomous API</span>
            <br className="hidden md:block" /> Healing Platform
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
            Detect failures, analyze root causes, and heal APIs automatically using
            intelligent AI-driven automation. Monitor. Detect. Heal. Automatically.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 justify-center lg:justify-start">
            <Link to="/register">
              <Button size="lg" className="gradient-primary gap-2 h-12 px-6">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="gap-2 h-12 px-6">
              <Play className="h-4 w-4" /> Live Demo
            </Button>
          </div>
          <div className="mt-6 flex items-center gap-4 justify-center lg:justify-start text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              All systems healthy
            </span>
            <span>•</span>
            <span>SOC 2 Type II</span>
            <span>•</span>
            <span>No credit card</span>
          </div>
        </motion.div>

        {/* Robot + floating cards */}
        <motion.div
          style={{ y }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative h-[440px] md:h-[520px]"
        >
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-40"
            style={{ background: "var(--gradient-primary)" }}
          />
          <motion.img
            src={robotImg}
            alt="NexHeal AI assistant"
            width={896}
            height={1152}
            className="relative z-10 mx-auto h-full w-auto object-contain drop-shadow-[0_20px_60px_oklch(0.62_0.21_285_/_0.4)]"
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* floating cards */}
          <motion.div
            className="absolute top-8 -left-2 md:left-0 glass rounded-xl p-3 w-44 z-20"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity }}
          >
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>payments-api</span>
              <StatusBadge status="healthy" />
            </div>
            <p className="mt-1.5 text-lg font-semibold tabular-nums">82ms</p>
            <div className="mt-1 h-1 rounded-full bg-secondary/60 overflow-hidden">
              <div className="h-full w-3/4 gradient-primary" />
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-10 -right-2 md:right-0 glass rounded-xl p-3 w-48 z-20"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-accent-cyan" />
              <span className="text-[11px] font-medium">Auto-heal triggered</span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Restarted auth-service in 1.2s
            </p>
          </motion.div>

          <motion.div
            className="absolute top-1/2 -right-4 md:right-6 glass rounded-xl p-3 z-20"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="flex items-center gap-2 text-[11px]">
              <Radar className="h-3.5 w-3.5 text-primary" />
              <span>248 endpoints monitored</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- TrustedBy ---------- */
function TrustedBy() {
  const logos = ["CloudScale", "NovaStack", "HyperOps", "ByteFlow", "QuantumEdge"];
  return (
    <section className="py-12 border-y border-border/60">
      <div className="max-w-6xl mx-auto px-4">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Trusted by engineering teams at
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {logos.map((l) => (
            <span
              key={l}
              className="text-lg md:text-xl font-semibold tracking-tight text-muted-foreground/70 grayscale hover:grayscale-0 hover:text-foreground transition-all"
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Features ---------- */
const features = [
  { icon: Activity, title: "Real-Time API Monitoring", desc: "Sub-second metrics across every endpoint, region, and version." },
  { icon: BrainCircuit, title: "AI Root Cause Analysis", desc: "Correlates traces, logs and deploys to surface the actual cause." },
  { icon: Wand2, title: "Intelligent Self-Healing", desc: "Restart, reroute, scale or rollback — automatically and safely." },
  { icon: FileBarChart, title: "Smart Incident Reports", desc: "Auto-generated post-mortems with timelines and impact analysis." },
  { icon: MessageSquare, title: "AI Chatbot Assistant", desc: "Ask in plain English: why did it fail, what changed, what now?" },
  { icon: Radar, title: "Predictive Failure Detection", desc: "Anomaly models forecast outages 15–30 minutes before they hit." },
];

function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeader
          eyebrow="Capabilities"
          title="Autonomous Reliability Engine"
          subtitle="Everything you need to keep your APIs healthy — without paging a human."
        />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group relative glass rounded-2xl p-6 hover:border-primary/40 transition"
            >
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition pointer-events-none"
                style={{ background: "var(--gradient-glow)" }} />
              <div className="relative">
                <div className="h-11 w-11 rounded-xl gradient-primary grid place-items-center glow-primary">
                  <f.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- How It Works ---------- */
const steps = [
  { title: "Connect APIs", desc: "Drop in an SDK or point at an endpoint.", icon: Boxes },
  { title: "Monitoring Starts", desc: "Latency, errors and traces stream live.", icon: Activity },
  { title: "AI Detects Issue", desc: "Anomaly models flag the first signal.", icon: Radar },
  { title: "Root Cause Analysis", desc: "Correlated across logs, deploys, infra.", icon: BrainCircuit },
  { title: "Healing Triggered", desc: "Restart, scale, reroute or rollback.", icon: Wand2 },
  { title: "Recovery Verified", desc: "SLO restored. Report auto-generated.", icon: Shield },
];

function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section id="how" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeader eyebrow="How it works" title="From signal to self-healing in seconds"
          subtitle="A continuous autonomous loop, no human in the path unless you want one." />

        <div ref={ref} className="mt-14 relative">
          {/* connector line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
          <motion.div
            className="hidden md:block absolute left-1/2 top-0 w-px -translate-x-1/2 gradient-primary"
            initial={{ height: 0 }}
            animate={inView ? { height: "100%" } : { height: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <div className="space-y-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, x: i % 2 ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`grid md:grid-cols-2 gap-4 items-center ${
                  i % 2 ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className={`glass rounded-2xl p-5 ${i % 2 ? "md:ml-8" : "md:mr-8"}`}>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary grid place-items-center">
                      <s.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                        Step {i + 1}
                      </p>
                      <h3 className="font-semibold">{s.title}</h3>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{s.desc}</p>
                </div>
                <div className="hidden md:flex justify-center">
                  <div className="h-3 w-3 rounded-full bg-primary glow-primary" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Dashboard Preview ---------- */
function DashboardPreview() {
  return (
    <section className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeader eyebrow="Product" title="A control plane built for autonomous operations"
          subtitle="Beautiful, dense, real-time. Everything operators need at a glance." />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-12 relative"
        >
          <div className="absolute -inset-6 rounded-[2rem] blur-3xl opacity-40"
            style={{ background: "var(--gradient-primary)" }} />
          <div className="relative glass-strong rounded-2xl p-3 md:p-4 shadow-elevated">
            <div className="flex items-center gap-1.5 px-2 pb-2">
              <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
              <span className="ml-3 text-[11px] text-muted-foreground">nexheal.ai / dashboard</span>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              <div className="md:col-span-2 glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Live API Latency</p>
                    <p className="text-lg font-semibold">P50 · 86ms <span className="text-muted-foreground text-sm">/ P95 · 214ms</span></p>
                  </div>
                  <StatusBadge status="healthy" />
                </div>
                <LatencyChart />
              </div>
              <div className="space-y-3">
                {[
                  { l: "Uptime", v: "99.99%", tone: "text-success" },
                  { l: "MTTR", v: "42s", tone: "text-accent-cyan" },
                  { l: "Healings (24h)", v: "142", tone: "text-primary" },
                  { l: "Open Incidents", v: "3", tone: "text-warning" },
                ].map((m) => (
                  <div key={m.l} className="glass rounded-xl p-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{m.l}</span>
                    <span className={`text-lg font-semibold tabular-nums ${m.tone}`}>{m.v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 grid md:grid-cols-3 gap-3">
              {[
                { n: "payments-api", s: "healthy" as const, v: "82ms" },
                { n: "auth-service", s: "healing" as const, v: "146ms" },
                { n: "search-service", s: "degraded" as const, v: "312ms" },
              ].map((a) => (
                <div key={a.n} className="glass rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{a.n}</p>
                    <p className="text-[11px] text-muted-foreground">{a.v} avg</p>
                  </div>
                  <StatusBadge status={a.s} />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- AI Assistant ---------- */
function TypingLine({ text, delay = 0 }: { text: string; delay?: number }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    let i = 0;
    const start = setTimeout(() => {
      const id = setInterval(() => {
        i++;
        setShown(text.slice(0, i));
        if (i >= text.length) clearInterval(id);
      }, 18);
    }, delay);
    return () => clearTimeout(start);
  }, [text, delay]);
  return <span>{shown}</span>;
}

function AIAssistant() {
  return (
    <section className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-full glass">
            <Bot className="h-3 w-3 text-accent-cyan" /> AI Assistant
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
            Talk to your <span className="gradient-text">infrastructure</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-md">
            Ask questions in natural language. Get root cause, healing actions and
            historical context — instantly. No dashboards to dig through.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {[
              "Natural language root cause analysis",
              "Runbook generation from past incidents",
              "Autonomous one-click remediation",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="h-6 w-6 rounded-full bg-primary/15 text-primary grid place-items-center">
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-strong rounded-2xl p-5 shadow-elevated"
        >
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-primary grid place-items-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">NexHeal Copilot</p>
                <p className="text-[11px] text-success flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Online
                </p>
              </div>
            </div>
            <span className="text-[11px] text-muted-foreground">GPT-class · private</span>
          </div>

          <div className="space-y-3 mt-4">
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary/15 px-4 py-2.5 text-sm">
                Why did the payment API fail?
              </div>
            </div>
            <div className="flex gap-2 items-start">
              <div className="h-7 w-7 rounded-lg gradient-primary grid place-items-center shrink-0">
                <Bot className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm glass px-4 py-2.5 text-sm">
                <TypingLine text="Database overload caused latency spikes at 14:02 UTC. Connection pool exhausted after deploy v4.21." />
              </div>
            </div>
            <div className="flex gap-2 items-start">
              <div className="h-7 w-7 rounded-lg gradient-primary grid place-items-center shrink-0">
                <Bot className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm glass px-4 py-2.5 text-sm">
                <TypingLine
                  delay={2800}
                  text="✓ Healing action executed: scaled DB read replicas +2, rerouted 30% traffic. Service recovered in 1.4s."
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-secondary/40 px-3 py-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <input
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              placeholder="Ask NexHeal anything…"
              readOnly
            />
            <Button size="sm" className="gradient-primary h-7 px-3">
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Stats ---------- */
function Counter({ to, suffix = "", decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1600;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setVal(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
}

function Stats() {
  const stats = [
    { v: 99.99, suffix: "%", decimals: 2, label: "Uptime SLA" },
    { v: 2, suffix: "M+", decimals: 0, label: "API checks / day" },
    { v: 85, suffix: "%", decimals: 0, label: "Faster recovery" },
    { v: 500, suffix: "+", decimals: 0, label: "Incidents healed" },
  ];
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="glass rounded-2xl p-6 text-center">
            <p className="text-3xl md:text-4xl font-bold gradient-text">
              <Counter to={s.v} suffix={s.suffix} decimals={s.decimals} />
            </p>
            <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- CTA ---------- */
function CTA() {
  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative glass-strong rounded-3xl p-10 md:p-16 text-center overflow-hidden"
        >
          <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full blur-3xl opacity-50 gradient-primary" />
          <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full blur-3xl opacity-40"
            style={{ background: "var(--accent-cyan)" }} />
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Start Building <span className="gradient-text">Self-Healing</span> Infrastructure
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Join the engineering teams reclaiming their nights and weekends with
              autonomous AI reliability.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link to="/register">
                <Button size="lg" className="gradient-primary gap-2 h-12 px-7">
                  Start Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="gap-2 h-12 px-7">
                <Zap className="h-4 w-4" /> Schedule Demo
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  const cols = [
    { title: "Product", items: ["Features", "Pricing", "Changelog", "Dashboard"] },
    { title: "Resources", items: ["Docs", "API Reference", "Status", "Blog"] },
    { title: "Company", items: ["About", "Customers", "Careers", "Contact"] },
  ];
  return (
    <footer className="relative mt-10 border-t border-border/60">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="relative max-w-6xl mx-auto px-4 py-14 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl gradient-primary grid place-items-center glow-primary">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold">NexHeal AI</span>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            Autonomous Intelligence for API Reliability & Self-Healing Systems.
          </p>
          <div className="mt-5 flex items-center gap-2">
            {[Github, Twitter, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="h-9 w-9 rounded-lg glass grid place-items-center hover:border-primary/40 transition">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{c.title}</p>
            <ul className="mt-4 space-y-2.5">
              {c.items.map((it) => (
                <li key={it}>
                  <a href="#" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
                    {it}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="relative border-t border-border/60">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <CircuitBoard className="h-3.5 w-3.5 text-primary" />
            Powered by Autonomous AI Reliability Systems
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} NexHeal AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Helpers ---------- */
function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-full glass">
        <Sparkles className="h-3 w-3 text-accent-cyan" /> {eyebrow}
      </span>
      <h2 className="mt-5 text-3xl md:text-5xl font-bold tracking-tight">{title}</h2>
      <p className="mt-4 text-muted-foreground">{subtitle}</p>
    </div>
  );
}

/* ---------- Page ---------- */
function LandingPage() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <TrustedBy />
        <Features />
        <HowItWorks />
        <DashboardPreview />
        <AIAssistant />
        <Stats />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
