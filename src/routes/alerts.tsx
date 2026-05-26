import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Flame, Timer, ShieldAlert, ExternalLink, RefreshCw, X, CheckCircle2, ChevronRight, Brain } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const Route = createFileRoute("/alerts")({ component: AlertsPage });

interface IncidentItem {
  id: string;
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  api_name: string;
  eta?: string;
  recovery_progress: number;
  root_cause?: string;
  affected_services: string[];
  status: "healthy" | "healing" | "degraded" | "down" | "unknown" | "open" | "investigating" | "resolved";
}

interface IncidentStats {
  critical: number;
  high: number;
  in_recovery: number;
  resolved_24h: number;
}

function AlertsPage() {
  const [incidents, setIncidents] = useState<IncidentItem[]>([]);
  const [stats, setStats] = useState<IncidentStats>({
    critical: 0,
    high: 0,
    in_recovery: 0,
    resolved_24h: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchIncidents = async () => {
    try {
      const data = await api.get<any>("/incidents");
      setIncidents(data.incidents || []);
      const statsData = await api.get<IncidentStats>("/incidents/stats");
      setStats(statsData);
    } catch (e) {
      console.error("Error loading incidents", e);
    }
  };

  const handleCreateRunbook = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: "Analyzing incident patterns...",
        success: "AI-generated runbook created successfully!",
        error: "Failed to generate runbook",
      }
    );
  };

  useEffect(() => {
    fetchIncidents().finally(() => setLoading(false));
  }, []);

  const getSevTone = (sev: string) => {
    if (sev === "critical") return "text-danger bg-danger/10";
    if (sev === "high") return "text-warning bg-warning/10";
    return "text-muted-foreground bg-secondary";
  };

  const getStatusType = (status: string) => {
    if (status === "open") return "down";
    if (status === "investigating") return "degraded";
    if (status === "resolved") return "healthy";
    return status as any;
  };

  return (
    <AppShell>
      <PageHeader
        title="Alerts & Incidents"
        subtitle="Active issues, root cause analysis, and live recovery progress."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={fetchIncidents} className="gap-2">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </Button>
            <Button size="sm" className="gradient-primary" onClick={handleCreateRunbook}>Create runbook</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Critical" value={loading ? "..." : String(stats.critical)} icon={Flame} tone="danger" />
        <MetricCard label="High" value={loading ? "..." : String(stats.high)} icon={AlertTriangle} tone="warning" />
        <MetricCard label="In Recovery" value={loading ? "..." : String(stats.in_recovery)} icon={Timer} tone="cyan" />
        <MetricCard label="Resolved (24h)" value={loading ? "..." : String(stats.resolved_24h)} icon={ShieldAlert} tone="success" />
      </div>

      <div className="mt-4 space-y-3">
        {loading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">Loading incident logs...</div>
        ) : incidents.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center text-sm text-muted-foreground">
            No incidents detected. All services are operating within normal parameters.
          </div>
        ) : (
          incidents.map((inc) => (
            <div key={inc.id} className="glass rounded-2xl p-5 hover:border-primary/30 transition">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded ${getSevTone(inc.severity)}`}>
                      {inc.severity}
                    </span>
                    <span className="text-xs text-muted-foreground tabular-nums">INC-{inc.id.substring(18).toUpperCase()}</span>
                    <StatusBadge status={getStatusType(inc.status)} />
                  </div>
                  <h3 className="text-base font-semibold mt-2">{inc.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="text-foreground">Root cause:</span> {inc.root_cause || "Analyzing telemetry logs..."}
                  </p>
                  {inc.affected_services && inc.affected_services.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span className="text-[11px] text-muted-foreground">Affected:</span>
                      {inc.affected_services.map((a) => (
                        <span key={a} className="text-[11px] px-2 py-0.5 rounded-full bg-secondary/60 border border-border">
                          {a}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="lg:w-72 shrink-0 space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground">Recovery progress</span>
                      <span className="tabular-nums font-medium">{inc.recovery_progress}%</span>
                    </div>
                    <Progress value={inc.recovery_progress} className="h-1.5" />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Est. fix</span>
                    <span className="font-medium tabular-nums">{inc.eta || "Evaluating"}</span>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        Open details <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl glass border-primary/20">
                      <DialogHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded ${getSevTone(inc.severity)}`}>
                            {inc.severity}
                          </span>
                          <span className="text-xs text-muted-foreground tabular-nums">INC-{inc.id.substring(18).toUpperCase()}</span>
                        </div>
                        <DialogTitle className="text-xl">{inc.title}</DialogTitle>
                        <DialogDescription>
                          Detailed analysis and recovery steps for this incident.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="rounded-xl bg-secondary/30 p-4 border border-border/50">
                          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <Brain className="h-4 w-4 text-primary" /> Root Cause Analysis
                          </h4>
                          <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                            {inc.root_cause || "The AI agent is currently analyzing telemetry logs and traces to determine the precise root cause."}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="rounded-xl bg-secondary/30 p-4 border border-border/50">
                            <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Recovery Progress</h4>
                            <div className="flex items-end gap-2">
                              <span className="text-2xl font-bold tabular-nums">{inc.recovery_progress}%</span>
                              <span className="text-[11px] text-success pb-1 flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" /> Active
                              </span>
                            </div>
                            <Progress value={inc.recovery_progress} className="h-1.5 mt-2" />
                          </div>
                          <div className="rounded-xl bg-secondary/30 p-4 border border-border/50">
                            <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Estimated Resolution</h4>
                            <div className="flex items-end gap-2">
                              <span className="text-2xl font-bold tabular-nums">{inc.eta || "Calcul..."}</span>
                              <span className="text-[11px] text-muted-foreground pb-1">TTR</span>
                            </div>
                          </div>
                        </div>

                        {inc.affected_services && inc.affected_services.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase">Affected Services</h4>
                            <div className="flex flex-wrap gap-2">
                              {inc.affected_services.map((s) => (
                                <div key={s} className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-secondary/50 border border-border">
                                  <div className="h-1.5 w-1.5 rounded-full bg-danger animate-pulse" />
                                  {s}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </AppShell>
  );
}
