import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
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
  uptime: 99 + Math.random() * 1,
  incidents: Math.round(Math.random() * 12),
  mttr: 30 + Math.round(Math.random() * 60),
}));

const reports = [
  { name: "May 2026 — Monthly SLO report", size: "1.2 MB", type: "PDF" },
  { name: "Incident postmortem INC-2841", size: "248 KB", type: "PDF" },
  { name: "Q2 Recovery analytics", size: "3.4 MB", type: "XLSX" },
  { name: "API latency benchmark", size: "612 KB", type: "PDF" },
  { name: "AI healing audit log", size: "8.1 MB", type: "CSV" },
];

function ReportsPage() {
  return (
    <AppShell>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Historical performance, downtime analysis, and downloadable insights."
        actions={
          <Button size="sm" className="gap-2 gradient-primary">
            <Download className="h-3.5 w-3.5" /> Export all
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
            <span className="text-xl font-semibold gradient-text">99.97%</span>
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
            <span className="text-xl font-semibold gradient-text">42s</span>
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

      <div className="glass rounded-2xl mt-4 overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="text-sm font-semibold">Downloadable reports</h3>
          <p className="text-xs text-muted-foreground">Auto-generated weekly and on-demand</p>
        </div>
        <div className="divide-y divide-border">
          {reports.map((r) => (
            <div key={r.name} className="flex items-center justify-between p-4 hover:bg-secondary/30 transition">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary grid place-items-center shrink-0">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.type} · {r.size}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-2 shrink-0">
                <Download className="h-3.5 w-3.5" /> Download
              </Button>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
