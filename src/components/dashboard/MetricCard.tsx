import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down";
  icon: LucideIcon;
  tone?: "primary" | "cyan" | "success" | "warning" | "danger";
}

const toneMap = {
  primary: { bg: "bg-primary/15", text: "text-primary", glow: "glow-primary" },
  cyan: { bg: "bg-accent-cyan/15", text: "text-accent-cyan", glow: "glow-cyan" },
  success: { bg: "bg-success/15", text: "text-success", glow: "" },
  warning: { bg: "bg-warning/15", text: "text-warning", glow: "" },
  danger: { bg: "bg-danger/15", text: "text-danger", glow: "" },
};

export function MetricCard({ label, value, delta, trend, icon: Icon, tone = "primary" }: Props) {
  const t = toneMap[tone];
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative overflow-hidden rounded-2xl glass p-5 hover:border-primary/30 transition-colors"
    >
      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            {label}
          </span>
          <span className="text-2xl md:text-3xl font-semibold tracking-tight">{value}</span>
        </div>
        <div className={cn("h-10 w-10 rounded-xl grid place-items-center", t.bg)}>
          <Icon className={cn("h-5 w-5", t.text)} />
        </div>
      </div>
      {delta && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          {trend === "up" ? (
            <TrendingUp className="h-3.5 w-3.5 text-success" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-danger" />
          )}
          <span className={trend === "up" ? "text-success" : "text-danger"}>{delta}</span>
          <span className="text-muted-foreground">vs last 24h</span>
        </div>
      )}
    </motion.div>
  );
}
