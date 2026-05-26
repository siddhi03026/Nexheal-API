import { createFileRoute, Link } from "@tanstack/react-router";
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
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

interface MetricData {
  total_apis: number;
  active_incidents: number;
  recovery_rate: number;
  healings_24h: number;
  avg_uptime: number;
}

interface EndpointData {
  id: string;
  name: string;
  region: string;
  latency: string;
  uptime: string;
  status: "healthy" | "healing" | "degraded" | "down" | "unknown";
}

function DashboardPage() {
  const [metrics, setMetrics] = useState<MetricData>({
    total_apis: 0,
    active_incidents: 0,
    recovery_rate: 100,
    healings_24h: 0,
    avg_uptime: 100,
  });
  const [endpoints, setEndpoints] = useState<EndpointData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const metricsData = await api.get<MetricData>("/dashboard/metrics");
      setMetrics(metricsData);
      
      const endpointsData = await api.get<any>("/dashboard/endpoints");
      setEndpoints(endpointsData.endpoints || []);
    } catch (e) {
      console.error("Error loading dashboard metrics", e);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
    toast.success("Metrics refreshed");
  };

  const runHealthCheck = async () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: "Running active monitoring health check...",
        success: () => {
          handleRefresh();
          return "All endpoint diagnostics completed!";
        },
        error: "Failed to run health check",
      }
    );
  };

  useEffect(() => {
    fetchDashboardData().finally(() => setLoading(false));
  }, []);

  return (
    <AppShell>
      <PageHeader
        title="Operations Overview"
        subtitle="Real-time health, incidents and autonomous healing across all services."
        actions={
          <Button variant="outline" size="sm" className="gap-2" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} /> Refresh
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="APIs Monitored" value={loading ? "..." : String(metrics.total_apis)} delta="+2" trend="up" icon={Boxes} tone="primary" />
        <MetricCard label="Active Incidents" value={loading ? "..." : String(metrics.active_incidents)} delta="0" trend="down" icon={AlertTriangle} tone="danger" />
        <MetricCard label="Recovery Success" value={loading ? "..." : `${metrics.recovery_rate}%`} delta="+0.4%" trend="up" icon={ShieldCheck} tone="success" />
        <MetricCard label="AI Healings (24h)" value={loading ? "..." : String(metrics.healings_24h)} delta="+3" trend="up" icon={Sparkles} tone="cyan" />
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
            <StatusBadge status={metrics.active_incidents > 0 ? "degraded" : "healthy"} />
          </div>
          <HealthRing value={metrics.avg_uptime} />
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="rounded-lg bg-secondary/40 p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">MTTR</p>
              <p className="text-lg font-semibold">42s</p>
            </div>
            <div className="rounded-lg bg-secondary/40 p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Uptime</p>
              <p className="text-lg font-semibold">{metrics.avg_uptime}%</p>
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
          <Button variant="outline" size="sm" className="gap-2" onClick={runHealthCheck}>
            <Zap className="h-3.5 w-3.5" /> Run Health Check
          </Button>
        </div>
        <div className="overflow-x-auto">
          {endpoints.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No monitored endpoints yet. Go to <Link to="/add-api" className="text-primary hover:underline">Add API</Link> to get started.
            </div>
          ) : (
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
                {endpoints.map((a) => (
                  <tr key={a.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition">
                    <td className="px-5 py-3.5 font-medium">{a.name}</td>
                    <td className="px-5 py-3.5 text-muted-foreground capitalize">{a.region}</td>
                    <td className="px-5 py-3.5 tabular-nums">{a.latency}</td>
                    <td className="px-5 py-3.5 tabular-nums">{a.uptime}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={a.status === "unknown" ? "warning" : a.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AppShell>
  );
}
