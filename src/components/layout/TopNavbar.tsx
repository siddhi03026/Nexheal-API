import { Bell, Search, Menu, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AppSidebar } from "./AppSidebar";
import { Link } from "@tanstack/react-router";
import { Activity } from "lucide-react";

const notifications = [
  { title: "Payments API latency spike", time: "2m ago", severity: "danger" },
  { title: "Auto-healed: auth-service container", time: "9m ago", severity: "success" },
  { title: "New deployment on /v1/orders", time: "21m ago", severity: "info" },
  { title: "RAM usage > 85% on edge-eu-2", time: "1h ago", severity: "warning" },
];

const sevColor: Record<string, string> = {
  danger: "bg-danger",
  success: "bg-success",
  warning: "bg-warning",
  info: "bg-accent-cyan",
};

export function TopNavbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/70 backdrop-blur-xl px-4 lg:px-6">
      {/* Mobile sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72 bg-sidebar border-sidebar-border">
          <div className="p-4">
            <Link to="/" className="flex items-center gap-2.5 px-1 py-2">
              <div className="h-9 w-9 rounded-xl gradient-primary grid place-items-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold">Sentinel AI</span>
            </Link>
          </div>
          <div className="lg:hidden -mt-4">
            {/* reuse sidebar visually */}
            <div className="hidden">{/* placeholder */}</div>
          </div>
          <div className="lg:hidden">
            <AppSidebar />
          </div>
        </SheetContent>
      </Sheet>

      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          placeholder="Search APIs, incidents, logs..."
          className="w-full h-10 pl-9 pr-20 rounded-lg bg-secondary/60 border border-border text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition placeholder:text-muted-foreground"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">
          <Command className="h-3 w-3" /> K
        </kbd>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-danger" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 glass-strong">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Notifications</span>
            <span className="text-[10px] text-muted-foreground">4 new</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {notifications.map((n, i) => (
            <DropdownMenuItem key={i} className="py-2.5 gap-3">
              <span className={`h-2 w-2 rounded-full ${sevColor[n.severity]} mt-1.5 shrink-0`} />
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-sm truncate">{n.title}</span>
                <span className="text-xs text-muted-foreground">{n.time}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full hover:bg-secondary/60 transition">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="gradient-primary text-white text-xs font-semibold">
                AS
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col items-start leading-tight">
              <span className="text-xs font-medium">Alex Stone</span>
              <span className="text-[10px] text-muted-foreground">DevOps Lead</span>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 glass-strong">
          <DropdownMenuLabel>My account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
