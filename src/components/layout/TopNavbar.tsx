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
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { api, connectNotifications } from "@/lib/api";
import { toast } from "sonner";

interface NotificationItem {
  id: string;
  title: string;
  message?: string;
  type: string;
  created_at: string;
}

const typeToSeverity: Record<string, string> = {
  danger: "danger",
  warning: "warning",
  success: "success",
  info: "info",
};

const sevColor: Record<string, string> = {
  danger: "bg-danger",
  success: "bg-success",
  warning: "bg-warning",
  info: "bg-accent-cyan",
};

export function TopNavbar() {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const data = await api.get<NotificationItem[]>("/notifications");
      // Handle the case where response might be wrapped in an object
      const items = Array.isArray(data) ? data : (data as any).notifications || [];
      setNotifications(items);
      
      const unreadData = await api.get<any>("/notifications/unread-count");
      setUnreadCount(unreadData.count || 0);
    } catch (e) {
      console.error("Failed to load notifications", e);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Subscribe to live notifications via WebSocket
    const ws = connectNotifications((event) => {
      // Refresh list
      fetchNotifications();
      // Show desktop/sonner toast
      if (event.type === "incident") {
        toast.error(`🚨 Incident: ${event.data.title}`);
      } else if (event.type === "recovery") {
        toast.success(`✅ Recovered: ${event.data.api_name}`);
      } else if (event.type === "healing_complete") {
        toast.success(`🔧 Healed: ${event.data.result}`);
      }
    });

    return () => {
      if (ws) ws.close();
    };
  }, []);

  const markAllRead = async () => {
    try {
      await api.post("/notifications/mark-all-read");
      setUnreadCount(0);
      fetchNotifications();
      toast.success("All notifications marked as read");
    } catch (e) {
      console.error(e);
    }
  };

  const getInitials = () => {
    if (!user) return "AS";
    return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
  };

  const formatTime = (timeStr: string) => {
    try {
      const d = new Date(timeStr);
      const diffMs = Date.now() - d.getTime();
      const diffMin = Math.round(diffMs / 60000);
      if (diffMin < 1) return "Just now";
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHrs = Math.round(diffMin / 60);
      if (diffHrs < 24) return `${diffHrs}h ago`;
      return d.toLocaleDateString();
    } catch (e) {
      return "some time ago";
    }
  };

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
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-danger animate-pulse" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 glass-strong">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <button 
                onClick={markAllRead}
                className="text-[10px] text-primary hover:underline"
              >
                Mark all read
              </button>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {notifications.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground">
              No new alerts or notifications.
            </div>
          ) : (
            notifications.map((n) => (
              <DropdownMenuItem key={n.id} className="py-2.5 gap-3">
                <span className={`h-2 w-2 rounded-full ${sevColor[n.type] || "bg-primary"} mt-1.5 shrink-0`} />
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-sm truncate font-medium">{n.title}</span>
                  {n.message && <span className="text-xs text-muted-foreground truncate">{n.message}</span>}
                  <span className="text-[10px] text-muted-foreground/75 mt-0.5">{formatTime(n.created_at)}</span>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full hover:bg-secondary/60 transition">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="gradient-primary text-white text-xs font-semibold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col items-start leading-tight">
              <span className="text-xs font-medium">
                {user ? `${user.first_name} ${user.last_name}` : "User Profile"}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {user?.company || "Sentinel SRE"}
              </span>
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
          <DropdownMenuItem onClick={logout} className="text-danger hover:bg-danger/10 hover:text-danger cursor-pointer">
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
