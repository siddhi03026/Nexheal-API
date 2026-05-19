import { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Activity } from "lucide-react";
import { motion } from "framer-motion";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left visual */}
      <div className="relative hidden lg:flex flex-col justify-between p-10 overflow-hidden border-r border-border">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_30%_30%,oklch(0.62_0.21_285/0.35),transparent_60%)]" />
        <Link to="/" className="relative flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl gradient-primary grid place-items-center glow-primary">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold">Sentinel AI</span>
        </Link>

        <div className="relative space-y-6">
          <h2 className="text-4xl font-semibold leading-tight tracking-tight max-w-md">
            Autonomous healing for the APIs <span className="gradient-text">that never sleep.</span>
          </h2>
          <p className="text-muted-foreground max-w-md">
            Detect, diagnose, and remediate incidents in seconds with AI agents trained on
            millions of production failures.
          </p>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <div><span className="text-foreground text-lg font-semibold block">98.6%</span> Recovery rate</div>
            <div><span className="text-foreground text-lg font-semibold block">42s</span> Mean time to heal</div>
            <div><span className="text-foreground text-lg font-semibold block">2.4M+</span> Incidents resolved</div>
          </div>
        </div>

        <p className="relative text-xs text-muted-foreground">© 2026 Sentinel AI Labs</p>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="h-9 w-9 rounded-xl gradient-primary grid place-items-center">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold">Sentinel AI</span>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1.5">{subtitle}</p>
          <div className="mt-7">{children}</div>
          <div className="mt-6 text-sm text-muted-foreground text-center">{footer}</div>
        </motion.div>
      </div>
    </div>
  );
}
