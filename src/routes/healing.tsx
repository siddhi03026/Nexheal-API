import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Check, X, Terminal, Container, Brain, RefreshCw, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/healing")({ component: HealingPage });

interface SuggestionItem {
  id: string;
  api_name: string;
  action: string;
  description: string;
  confidence: number;
  impact?: string;
  status: string;
}

interface LogItem {
  id: string;
  api_name: string;
  action: string;
  status: string;
  result?: string;
  executed_at?: string;
  created_at: string;
}

interface ProgressItem {
  name: string;
  progress: number;
}

function HealingPage() {
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [progressList, setProgressList] = useState<ProgressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const fetchHealingData = async () => {
    try {
      const sugRes = await api.get<any>("/healing/suggestions");
      setSuggestions(sugRes.suggestions || []);

      const logRes = await api.get<any>("/healing/logs");
      setLogs(logRes.logs || []);

      const progRes = await api.get<any>("/healing/recovery-progress");
      setProgressList(progRes.progress || []);
    } catch (e) {
      console.error("Error fetching healing data", e);
    }
  };

  useEffect(() => {
    fetchHealingData().finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id: string) => {
    setActioningId(id);
    try {
      await api.post(`/healing/${id}/approve`);
      toast.success("Healing action approved and execution triggered!");
      await fetchHealingData();
    } catch (e: any) {
      toast.error(e.message || "Failed to approve healing action");
    } finally {
      setActioningId(null);
    }
  };

  const handleDismiss = async (id: string) => {
    setActioningId(id);
    try {
      await api.post(`/healing/${id}/dismiss`);
      toast.success("Healing suggestion dismissed");
      await fetchHealingData();
    } catch (e: any) {
      toast.error(e.message || "Failed to dismiss suggestion");
    } finally {
      setActioningId(null);
    }
  };

  const formatLogTime = (timeStr: string) => {
    try {
      const d = new Date(timeStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch (e) {
      return timeStr;
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="AI Healing"
        subtitle="Review autonomous recommendations and audit recovery actions."
        actions={
          <Button variant="outline" size="sm" onClick={fetchHealingData} className="gap-2">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
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
              <span className="text-[11px] text-muted-foreground">{suggestions.length} pending approval</span>
            </div>
            <div className="space-y-3">
              {loading ? (
                <div className="py-6 text-center text-xs text-muted-foreground">Loading suggestions...</div>
              ) : suggestions.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground bg-secondary/20 rounded-xl">
                  No healing actions currently pending approval.
                </div>
              ) : (
                suggestions.map((s) => (
                  <div key={s.id} className="rounded-xl bg-secondary/40 p-4 border border-border">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground font-semibold uppercase">{s.api_name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/15 text-primary font-medium">
                            {s.confidence}% confidence
                          </span>
                        </div>
                        <p className="text-sm font-medium mt-1.5">Action: {s.action.toUpperCase()} — {s.description}</p>
                        {s.impact && <p className="text-xs text-muted-foreground mt-1">Impact: {s.impact}</p>}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="gap-1.5"
                          disabled={actioningId !== null}
                          onClick={() => handleDismiss(s.id)}
                        >
                          <X className="h-3.5 w-3.5" /> Dismiss
                        </Button>
                        <Button 
                          size="sm" 
                          className="gap-1.5 gradient-primary"
                          disabled={actioningId !== null}
                          onClick={() => handleApprove(s.id)}
                        >
                          {actioningId === s.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Check className="h-3.5 w-3.5" />
                          )}
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Auto-healing logs</h3>
              </div>
              <span className="text-[11px] text-muted-foreground">Recent Actions</span>
            </div>
            <div className="rounded-xl bg-black/40 border border-border p-4 font-mono text-xs space-y-1.5 max-h-72 overflow-y-auto">
              {loading ? (
                <div className="py-4 text-center text-muted-foreground">Loading action audit trails...</div>
              ) : logs.length === 0 ? (
                <div className="py-4 text-center text-muted-foreground">No healing action history logged yet.</div>
              ) : (
                logs.map((l) => (
                  <div key={l.id} className="flex gap-3">
                    <span className="text-muted-foreground tabular-nums">{formatLogTime(l.created_at)}</span>
                    <span className={`w-12 uppercase font-semibold ${l.status === 'completed' ? 'text-success' : l.status === 'failed' ? 'text-danger' : 'text-accent-cyan'}`}>
                      {l.status}
                    </span>
                    <span className="text-foreground/90">[{l.api_name}] Triggered action: {l.action}. Result: {l.result || "Awaiting verification"}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold mb-3">Recovery progress</h3>
            {loading ? (
              <div className="py-4 text-center text-xs text-muted-foreground">Loading status...</div>
            ) : progressList.length === 0 ? (
              <div className="py-4 text-center text-xs text-muted-foreground">No active incident recovery operations.</div>
            ) : (
              progressList.map((r) => (
                <div key={r.name} className="mb-4 last:mb-0">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium">{r.name}</span>
                    <span className="tabular-nums text-muted-foreground">{r.progress}%</span>
                  </div>
                  <Progress value={r.progress} className="h-1.5" />
                </div>
              ))
            )}
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Container className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Container status</h3>
            </div>
            <div className="space-y-2.5">
              {[
                { name: "kubernetes-pod-cluster", t: "Healthy", count: "32/32" },
                { name: "docker-agent-daemon", t: "Active", count: "100%" },
                { name: "prometheus-gateway", t: "Online", count: "Ready" },
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
