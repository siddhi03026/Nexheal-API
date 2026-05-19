import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { LatencyChart } from "@/components/dashboard/LatencyChart";
import { ResourceChart } from "@/components/dashboard/ResourceChart";
import { HealthRing } from "@/components/dashboard/HealthRing";
import { IncidentTimeline } from "@/components/dashboard/IncidentTimeline";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import {
  Activity,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  Boxes,
  Zap,
  Download,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

const apis = [
  { name: "payments-api", region: "us-east-1", latency: "82ms", uptime: "99.99%", status: "healthy" as const },
  { name: "auth-service", region: "eu-west-2", latency: "146ms", uptime: "99.92%", status: "healing" as const },
  { name: "orders-api", region: "ap-south-1", latency: "108ms", uptime: "99.97%", status: "healthy" as const },
  { name: "search-service", region: "us-west-2", latency: "312ms", uptime: "98.41%", status: "degraded" as const },
  { name: "media-cdn", region: "global", latency: "44ms", uptime: "100%", status: "healthy" as const },
  { name: "notifications", region: "eu-central-1", latency: "—", uptime: "97.12%", status: "down" as const },
];

function DashboardPage() {
  return (
    <AppShell>
      <PageHeader
        title="Operations Overview"
        subtitle="Real-time health, incidents and autonomous healing across all services."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </Button>
            <Button size="sm" className="gap-2 gradient-primary">
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="APIs Monitored" value="248" delta="+12" trend="up" icon={Boxes} tone="primary" />
        <MetricCard label="Active Incidents" value="3" delta="-2" trend="down" icon={AlertTriangle} tone="danger" />
        <MetricCard label="Recovery Success" value="98.6%" delta="+1.4%" trend="up" icon={ShieldCheck} tone="success" />
        <MetricCard label="AI Healings (24h)" value="142" delta="+38" trend="up" icon={Sparkles} tone="cyan" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-semibold">Live API Latency</h3>
              <p className="text-xs text-muted-foreground">P50 and P95 across all endpoints</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> P50</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent-cyan" /> P95</span>
            </div>
          </div>
          <LatencyChart />
        </div>

        <div className="glass rounded-2xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">System Health</h3>
            <StatusBadge status="healthy" />
          </div>
          <HealthRing value={98.6} />
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="rounded-lg bg-secondary/40 p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">MTTR</p>
              <p className="text-lg font-semibold">42s</p>
            </div>
            <div className="rounded-lg bg-secondary/40 p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Uptime</p>
              <p className="text-lg font-semibold">99.97%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">CPU & Memory</h3>
            <span className="text-[11px] text-muted-foreground">last 60m</span>
          </div>
          <ResourceChart />
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">AI Healing Status</h3>
            <Sparkles className="h-4 w-4 text-accent-cyan" />
          </div>
          <div className="space-y-3">
            {[
              { name: "Auto-restart agent", status: "active", val: "v2.4" },
              { name: "Traffic reroute agent", status: "active", val: "v1.9" },
              { name: "DB recovery agent", status: "healing", val: "running" },
              { name: "Memory leak detector", status: "active", val: "v3.1" },
            ].map((a) => (
              <div key={a.name} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/40">
                <div className="flex items-center gap-2.5">
                  <span className={`h-2 w-2 rounded-full ${a.status === "healing" ? "bg-accent-cyan animate-pulse" : "bg-success"}`} />
                  <span className="text-sm">{a.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{a.val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Incident Timeline</h3>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <IncidentTimeline />
        </div>
      </div>

      <div className="glass rounded-2xl mt-4 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h3 className="text-sm font-semibold">Monitored Endpoints</h3>
            <p className="text-xs text-muted-foreground">Real-time status across regions</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Zap className="h-3.5 w-3.5" /> Run Health Check
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr className="border-b border-border">
                <th className="text-left font-medium px-5 py-3">Service</th>
                <th className="text-left font-medium px-5 py-3">Region</th>
                <th className="text-left font-medium px-5 py-3">Latency</th>
                <th className="text-left font-medium px-5 py-3">Uptime</th>
                <th className="text-left font-medium px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {apis.map((a) => (
                <tr key={a.name} className="border-b border-border last:border-0 hover:bg-secondary/30 transition">
                  <td className="px-5 py-3.5 font-medium">{a.name}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{a.region}</td>
                  <td className="px-5 py-3.5 tabular-nums">{a.latency}</td>
                  <td className="px-5 py-3.5 tabular-nums">{a.uptime}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
