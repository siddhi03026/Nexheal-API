import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Check, X, Terminal, Container, Brain } from "lucide-react";

export const Route = createFileRoute("/healing")({ component: HealingPage });

const suggestions = [
  {
    service: "payments-api",
    action: "Scale replicas 4 → 6 and recycle idle DB connections",
    confidence: 96,
    impact: "Resolves 5xx spike in ~30s",
  },
  {
    service: "search-service",
    action: "Warm cache from snapshot s3://cache/search-2026-05-19",
    confidence: 89,
    impact: "Returns P95 < 200ms",
  },
  {
    service: "notifications",
    action: "Reset Kafka consumer group and replay from last commit",
    confidence: 82,
    impact: "Clears 30k message backlog",
  },
];

const logs = [
  { t: "14:32:08", s: "INFO", m: "Healing agent activated for payments-api" },
  { t: "14:32:09", s: "INFO", m: "Scaling deployment payments-api: replicas=4 → 6" },
  { t: "14:32:14", s: "OK", m: "New pods ready: payments-api-7f9c-{a,b}" },
  { t: "14:32:16", s: "INFO", m: "Recycling 24 idle DB connections on payments-db" },
  { t: "14:32:21", s: "OK", m: "Error rate dropped from 4.2% → 0.08%" },
  { t: "14:32:22", s: "OK", m: "Incident INC-2841 marked as recovered" },
];

const sevColor: Record<string, string> = {
  INFO: "text-accent-cyan",
  OK: "text-success",
  WARN: "text-warning",
  ERR: "text-danger",
};

function HealingPage() {
  return (
    <AppShell>
      <PageHeader
        title="AI Healing"
        subtitle="Review autonomous recommendations and audit recovery actions."
        actions={
          <Button size="sm" className="gap-2 gradient-primary">
            <Brain className="h-3.5 w-3.5" /> Train on new incidents
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent-cyan" />
                <h3 className="text-sm font-semibold">Suggested actions</h3>
              </div>
              <span className="text-[11px] text-muted-foreground">3 pending approval</span>
            </div>
            <div className="space-y-3">
              {suggestions.map((s) => (
                <div key={s.service} className="rounded-xl bg-secondary/40 p-4 border border-border">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{s.service}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/15 text-primary font-medium">
                          {s.confidence}% confidence
                        </span>
                      </div>
                      <p className="text-sm font-medium mt-1.5">{s.action}</p>
                      <p className="text-xs text-muted-foreground mt-1">{s.impact}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button size="sm" variant="outline" className="gap-1.5">
                        <X className="h-3.5 w-3.5" /> Dismiss
                      </Button>
                      <Button size="sm" className="gap-1.5 gradient-primary">
                        <Check className="h-3.5 w-3.5" /> Approve
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Auto-healing logs</h3>
              </div>
              <span className="text-[11px] text-muted-foreground">live · payments-api</span>
            </div>
            <div className="rounded-xl bg-black/40 border border-border p-4 font-mono text-xs space-y-1.5 max-h-72 overflow-y-auto">
              {logs.map((l, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-muted-foreground tabular-nums">{l.t}</span>
                  <span className={`${sevColor[l.s]} w-10`}>{l.s}</span>
                  <span className="text-foreground/90">{l.m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold mb-3">Recovery progress</h3>
            {[
              { name: "payments-api", v: 92 },
              { name: "search-service", v: 64 },
              { name: "notifications", v: 28 },
              { name: "auth-service", v: 100 },
            ].map((r) => (
              <div key={r.name} className="mb-4 last:mb-0">
                <div className="flex justify-between text-xs mb-1.5">
                  <span>{r.name}</span>
                  <span className="tabular-nums text-muted-foreground">{r.v}%</span>
                </div>
                <Progress value={r.v} className="h-1.5" />
              </div>
            ))}
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Container className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Container restarts</h3>
            </div>
            <div className="space-y-2.5">
              {[
                { name: "payments-api-7f9c", t: "14:32", count: "2x" },
                { name: "search-service-4a2", t: "14:18", count: "1x" },
                { name: "auth-service-9be", t: "13:55", count: "1x" },
                { name: "media-cdn-001", t: "12:11", count: "1x" },
              ].map((c) => (
                <div key={c.name} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-secondary/40">
                  <span className="font-mono">{c.name}</span>
                  <span className="text-muted-foreground tabular-nums">{c.t} · {c.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
