import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, ShieldCheck, Plug, User, Moon } from "lucide-react";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function Card({
  icon: Icon,
  title,
  desc,
  children,
}: { icon: any; title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-5 md:p-6">
      <div className="flex items-start gap-3 mb-5">
        <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary grid place-items-center">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function Row({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-border last:border-0">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      {children}
    </div>
  );
}

function SettingsPage() {
  return (
    <AppShell>
      <PageHeader title="Settings" subtitle="Manage your workspace, integrations and preferences." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card icon={User} title="Profile" desc="Your personal account details.">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="gradient-primary text-white">AS</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">Change avatar</Button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-2"><Label>First name</Label><Input defaultValue="Alex" className="h-11" /></div>
            <div className="space-y-2"><Label>Last name</Label><Input defaultValue="Stone" className="h-11" /></div>
            <div className="sm:col-span-2 space-y-2"><Label>Email</Label><Input defaultValue="alex@acme.com" className="h-11" /></div>
          </div>
          <Button className="mt-4 gradient-primary">Save changes</Button>
        </Card>

        <Card icon={Bell} title="Notifications" desc="Choose how you'd like to be notified.">
          <Row title="Critical alerts" desc="Immediately page on-call."><Switch defaultChecked /></Row>
          <Row title="Daily digest" desc="Summary at 9:00 local time."><Switch defaultChecked /></Row>
          <Row title="Healing success" desc="Notify when AI resolves an incident."><Switch /></Row>
          <Row title="Weekly reports" desc="Performance recap every Monday."><Switch defaultChecked /></Row>
        </Card>

        <Card icon={ShieldCheck} title="Healing permissions" desc="Workspace-wide automation policies.">
          <Row title="Allow autonomous restart" desc="No human approval required."><Switch defaultChecked /></Row>
          <Row title="Allow autonomous scale" desc="Up to +50% replicas."><Switch defaultChecked /></Row>
          <Row title="Allow autonomous rollback" desc="Revert deploys on error burn."><Switch /></Row>
          <Row title="Require 2-person approval" desc="For destructive actions."><Switch defaultChecked /></Row>
        </Card>

        <Card icon={Plug} title="API integrations" desc="Connect your tools and data sources.">
          {[
            { n: "Datadog", s: "Connected" },
            { n: "PagerDuty", s: "Connected" },
            { n: "Slack", s: "Connected" },
            { n: "GitHub Actions", s: "Connect" },
            { n: "AWS CloudWatch", s: "Connect" },
          ].map((i) => (
            <div key={i.n} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <p className="text-sm font-medium">{i.n}</p>
              <Button
                size="sm"
                variant={i.s === "Connected" ? "outline" : "default"}
                className={i.s === "Connected" ? "" : "gradient-primary"}
              >
                {i.s}
              </Button>
            </div>
          ))}
        </Card>

        <Card icon={Moon} title="Appearance" desc="Theme and display preferences.">
          <Row title="Dark mode" desc="Use the dark cyberpunk theme."><Switch defaultChecked /></Row>
          <Row title="Reduce motion" desc="Disable non-essential animations."><Switch /></Row>
          <Row title="Compact density" desc="Tighter spacing across tables."><Switch /></Row>
        </Card>
      </div>
    </AppShell>
  );
}
