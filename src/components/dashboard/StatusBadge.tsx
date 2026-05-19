import { cn } from "@/lib/utils";

type Status = "healthy" | "degraded" | "down" | "healing" | "warning";

const map: Record<Status, { label: string; dot: string; text: string; bg: string }> = {
  healthy: { label: "Healthy", dot: "bg-success", text: "text-success", bg: "bg-success/10" },
  degraded: { label: "Degraded", dot: "bg-warning", text: "text-warning", bg: "bg-warning/10" },
  warning: { label: "Warning", dot: "bg-warning", text: "text-warning", bg: "bg-warning/10" },
  down: { label: "Down", dot: "bg-danger", text: "text-danger", bg: "bg-danger/10" },
  healing: { label: "Healing", dot: "bg-accent-cyan", text: "text-accent-cyan", bg: "bg-accent-cyan/10" },
};

export function StatusBadge({ status }: { status: Status }) {
  const s = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium",
        s.bg,
        s.text
      )}
    >
      <span className={cn("relative h-1.5 w-1.5 rounded-full", s.dot)}>
        {(status === "down" || status === "healing") && (
          <span className={cn("absolute inset-0 rounded-full animate-ping", s.dot, "opacity-60")} />
        )}
      </span>
      {s.label}
    </span>
  );
}
