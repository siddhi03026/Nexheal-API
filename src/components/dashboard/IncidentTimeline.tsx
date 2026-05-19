import { CheckCircle2, AlertTriangle, Sparkles, Zap } from "lucide-react";

const events = [
  {
    time: "14:32",
    title: "AI auto-healed payments-api",
    desc: "Restarted pod + rerouted traffic. Resolved in 14s.",
    icon: Sparkles,
    color: "text-accent-cyan bg-accent-cyan/10",
  },
  {
    time: "14:18",
    title: "Latency spike on /v1/checkout",
    desc: "P95 reached 820ms. AI agent triggered.",
    icon: AlertTriangle,
    color: "text-warning bg-warning/10",
  },
  {
    time: "13:55",
    title: "auth-service container restarted",
    desc: "Healing playbook #12 executed successfully.",
    icon: Zap,
    color: "text-primary bg-primary/10",
  },
  {
    time: "13:21",
    title: "Edge node eu-2 marked healthy",
    desc: "Recovery completed after 2m 41s.",
    icon: CheckCircle2,
    color: "text-success bg-success/10",
  },
];

export function IncidentTimeline() {
  return (
    <ol className="relative space-y-5">
      <span className="absolute left-[19px] top-2 bottom-2 w-px bg-border" />
      {events.map((e, i) => {
        const Icon = e.icon;
        return (
          <li key={i} className="relative flex gap-4">
            <div className={`relative z-10 h-10 w-10 shrink-0 rounded-xl grid place-items-center ${e.color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 pt-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">{e.title}</p>
                <span className="text-xs text-muted-foreground tabular-nums">{e.time}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{e.desc}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
