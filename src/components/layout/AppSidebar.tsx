import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  PlusCircle,
  AlertTriangle,
  Sparkles,
  FileBarChart,
  Settings,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/add-api", label: "Add API", icon: PlusCircle },
  { to: "/alerts", label: "Alerts & Incidents", icon: AlertTriangle },
  { to: "/healing", label: "AI Healing", icon: Sparkles },
  { to: "/reports", label: "Reports", icon: FileBarChart },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const path = useRouterState({ select: (r) => r.location.pathname });

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col gap-2 border-r border-border bg-sidebar/60 backdrop-blur-xl p-4 sticky top-0 h-screen">
      <Link to="/" className="flex items-center gap-2.5 px-2 py-3">
        <div className="relative">
          <div className="h-9 w-9 rounded-xl gradient-primary grid place-items-center glow-primary">
            <Activity className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold tracking-tight">Sentinel AI</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            API Healing
          </span>
        </div>
      </Link>

      <div className="mt-4 flex flex-col gap-1">
        <p className="px-3 py-2 text-[10px] uppercase tracking-widest text-muted-foreground">
          Workspace
        </p>
        {nav.map((item) => {
          const active = path === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                active
                  ? "bg-primary/15 text-foreground shadow-[inset_0_0_0_1px_oklch(0.62_0.21_285/0.3)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 transition-colors",
                  active ? "text-primary" : "group-hover:text-primary"
                )}
              />
              <span className="font-medium">{item.label}</span>
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary glow-primary" />
              )}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto glass rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="relative inline-block h-2 w-2 rounded-full bg-success text-success pulse-dot" />
          <p className="text-xs font-medium">System Healthy</p>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          All AI healing agents are online and monitoring 248 endpoints.
        </p>
      </div>
    </aside>
  );
}
