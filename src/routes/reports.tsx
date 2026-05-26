import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Download, FileText, Plus, RefreshCw, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/reports")({ component: ReportsPage });

const trend = Array.from({ length: 30 }, (_, i) => ({
  d: `${i + 1}`,
  uptime: 99.8 + Math.random() * 0.2,
  incidents: Math.round(Math.random() * 4),
  mttr: 20 + Math.round(Math.random() * 30),
}));

interface ReportItem {
  id: string;
  title: string;
  report_type: string;
  file_format: string;
  file_size: string;
  created_at: string;
}

function ReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Form states
  const [newTitle, setNewTitle] = useState("");
  const [reportType, setReportType] = useState("incident");

  const fetchReports = async () => {
    try {
      const data = await api.get<any>("/reports");
      setReports(data.reports || []);
    } catch (e) {
      console.error("Error loading reports", e);
    }
  };

  useEffect(() => {
    fetchReports().finally(() => setLoading(false));
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("Please enter a report title");
      return;
    }

    setGenerating(true);
    try {
      const response = await api.post<any>("/reports/generate", {
        title: newTitle,
        report_type: reportType,
      });
      
      toast.success("PDF report generated successfully!");
      setNewTitle("");
      
      // Add the new report to the top of the list immediately for better UX
      if (response && response.report) {
        setReports(prev => [response.report, ...prev]);
      } else {
        await fetchReports();
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to generate report");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async (id: string, title: string) => {
    setDownloadingId(id);
    try {
      const blob = await api.get<Blob>(`/reports/${id}/download`);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nexheal-${title.toLowerCase().replace(/ /g, "-")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Download started");
    } catch (e: any) {
      toast.error(e.message || "Failed to download PDF report");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Historical performance, downtime analysis, and downloadable insights."
        actions={
          <Button variant="outline" size="sm" onClick={fetchReports} className="gap-2">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold">Uptime trend</h3>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </div>
            <span className="text-xl font-semibold gradient-text">99.96%</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trend} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="up" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.72 0.19 145)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="oklch(0.72 0.19 145)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
              <XAxis dataKey="d" stroke="oklch(0.72 0.03 250)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis domain={[98, 100]} stroke="oklch(0.72 0.03 250)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "oklch(0.21 0.045 268)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12, fontSize: 12 }} />
              <Area type="monotone" dataKey="uptime" stroke="oklch(0.72 0.19 145)" strokeWidth={2} fill="url(#up)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold">Mean time to recover</h3>
              <p className="text-xs text-muted-foreground">Lower is better</p>
            </div>
            <span className="text-xl font-semibold gradient-text">38s</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trend} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
              <XAxis dataKey="d" stroke="oklch(0.72 0.03 250)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.72 0.03 250)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "oklch(0.21 0.045 268)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12, fontSize: 12 }} />
              <Line type="monotone" dataKey="mttr" stroke="oklch(0.83 0.16 210)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="incidents" stroke="oklch(0.62 0.21 285)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-4">
        {/* Generate report card */}
        <div className="glass rounded-2xl p-5 h-fit">
          <h3 className="text-sm font-semibold mb-4">Generate custom report</h3>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Report Title</label>
              <Input 
                placeholder="Weekly Incident Postmortem" 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="incident">Incident Summary</SelectItem>
                  <SelectItem value="monthly">Monthly SLO Report</SelectItem>
                  <SelectItem value="weekly">Weekly Operational Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full gradient-primary gap-1.5" disabled={generating}>
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Generate PDF
            </Button>
          </form>
        </div>

        {/* Downloadable list */}
        <div className="xl:col-span-2 glass rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-border">
            <h3 className="text-sm font-semibold">Downloadable reports</h3>
            <p className="text-xs text-muted-foreground">Auto-generated weekly and on-demand</p>
          </div>
          <div className="divide-y divide-border">
            {loading ? (
              <div className="p-8 text-center text-xs text-muted-foreground">Loading reports...</div>
            ) : reports.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">No reports generated yet. Use the generator on the left.</div>
            ) : (
              reports.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-4 hover:bg-secondary/30 transition">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary grid place-items-center shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{r.title}</p>
                      <p className="text-xs text-muted-foreground uppercase">{r.file_format} · {r.file_size} · {new Date(r.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 shrink-0"
                    disabled={downloadingId !== null}
                    onClick={() => handleDownload(r.id, r.title)}
                  >
                    {downloadingId === r.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Download className="h-3.5 w-3.5" />
                    )}
                    Download
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
