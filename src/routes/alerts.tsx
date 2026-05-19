import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Flame, Timer, ShieldAlert, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/alerts")({ component: AlertsPage });

const incidents = [
  {
    id: "INC-2841",
    title: "payments-api: 5xx error rate spike",
    severity: "Critical",
    sevTone: "text-danger bg-danger/10",
    service: "payments-api",
    eta: "~2m",
    progress: 78,
    cause: "DB connection pool exhausted after deploy v4.21",
    affected: ["checkout", "billing", "subscriptions"],
    status: "healing" as const,
  },
  {
    id: "INC-2839",
    title: "search-service degraded latency",
    severity: "High",
    sevTone: "text-warning bg-warning/10",
    service: "search-service",
    eta: "~5m",
    progress: 42,
    cause: "Cold cache after node restart in ap-south-1",
    affected: ["product search", "autocomplete"],
    status: "degraded" as const,
  },
  {
    id: "INC-2837",
    title: "notifications service unreachable",
    severity: "Critical",
    sevTone: "text-danger bg-danger/10",
    service: "notifications",
    eta: "~8m",
    progress: 25,
    cause: "Kafka consumer lag > 30k messages",
    affected: ["email", "push", "sms"],
    status: "down" as const,
  },
  {
    id: "INC-2830",
    title: "auth-service memory pressure",
    severity: "Medium",
    sevTone: "text-warning bg-warning/10",
    service: "auth-service",
    eta: "Resolved",
    progress: 100,
    cause: "Memory leak in JWT refresh middleware",
    affected: ["login flow"],
    status: "healthy" as const,
  },
];

function AlertsPage() {
  return (
    <AppShell>
      <PageHeader
        title="Alerts & Incidents"
        subtitle="Active issues, root cause analysis, and live recovery progress."
        actions={
          <>
            <Button variant="outline" size="sm">Filter</Button>
            <Button size="sm" className="gradient-primary">Create runbook</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Critical" value="2" icon={Flame} tone="danger" />
        <MetricCard label="High" value="5" icon={AlertTriangle} tone="warning" />
        <MetricCard label="In Recovery" value="3" icon={Timer} tone="cyan" />
        <MetricCard label="Resolved (24h)" value="38" icon={ShieldAlert} tone="success" />
      </div>

      <div className="mt-4 space-y-3">
        {incidents.map((inc) => (
          <div key={inc.id} className="glass rounded-2xl p-5 hover:border-primary/30 transition">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded ${inc.sevTone}`}>
                    {inc.severity}
                  </span>
                  <span className="text-xs text-muted-foreground tabular-nums">{inc.id}</span>
                  <StatusBadge status={inc.status} />
                </div>
                <h3 className="text-base font-semibold mt-2">{inc.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="text-foreground">Root cause:</span> {inc.cause}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="text-[11px] text-muted-foreground">Affected:</span>
                  {inc.affected.map((a) => (
                    <span key={a} className="text-[11px] px-2 py-0.5 rounded-full bg-secondary/60 border border-border">
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              <div className="lg:w-72 shrink-0 space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Recovery progress</span>
                    <span className="tabular-nums font-medium">{inc.progress}%</span>
                  </div>
                  <Progress value={inc.progress} className="h-1.5" />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Est. fix</span>
                  <span className="font-medium tabular-nums">{inc.eta}</span>
                </div>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  Open details <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
