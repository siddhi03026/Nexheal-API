import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe, Server, Bell, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/add-api")({ component: AddApiPage });

function Section({
  icon: Icon,
  title,
  desc,
  children,
}: {
  icon: any;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
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
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function AddApiPage() {
  return (
    <AppShell>
      <PageHeader
        title="Add API or Website"
        subtitle="Connect a new endpoint and configure how Sentinel should heal it."
        actions={
          <>
            <Button variant="outline" size="sm">Cancel</Button>
            <Button size="sm" className="gradient-primary">Save & Monitor</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 space-y-4">
          <Section icon={Globe} title="Target" desc="What should Sentinel watch?">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Service name</Label>
                <Input placeholder="payments-api" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label>Environment</Label>
                <Select defaultValue="prod">
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prod">Production</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="dev">Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Website URL</Label>
              <Input placeholder="https://api.acme.com" className="h-11" />
            </div>
            <div className="space-y-2">
              <Label>API endpoint</Label>
              <Input placeholder="/v1/health" className="h-11" />
            </div>
            <div className="space-y-2">
              <Label>Expected response</Label>
              <Textarea placeholder='{"status":"ok"}' className="font-mono text-xs min-h-[90px]" />
            </div>
          </Section>

          <Section icon={Server} title="Monitoring" desc="How often, and from where.">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select defaultValue="http">
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="http">HTTP / REST</SelectItem>
                    <SelectItem value="graphql">GraphQL</SelectItem>
                    <SelectItem value="grpc">gRPC</SelectItem>
                    <SelectItem value="ws">WebSocket</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Interval</Label>
                <Select defaultValue="30s">
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10s">Every 10s</SelectItem>
                    <SelectItem value="30s">Every 30s</SelectItem>
                    <SelectItem value="1m">Every minute</SelectItem>
                    <SelectItem value="5m">Every 5 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Regions</Label>
                <Select defaultValue="multi">
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multi">Multi-region (5)</SelectItem>
                    <SelectItem value="us">US only</SelectItem>
                    <SelectItem value="eu">EU only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Section>
        </div>

        <div className="space-y-4">
          <Section icon={ShieldCheck} title="Healing permissions" desc="What can the AI agent do?">
            {[
              { t: "Restart containers", d: "Auto-restart on crash loops." },
              { t: "Scale replicas", d: "Add pods on latency spikes." },
              { t: "Reroute traffic", d: "Shift load to healthy regions." },
              { t: "Rollback deploys", d: "Revert on error budget burn." },
            ].map((p, i) => (
              <div key={p.t} className="flex items-start justify-between gap-4 py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium">{p.t}</p>
                  <p className="text-xs text-muted-foreground">{p.d}</p>
                </div>
                <Switch defaultChecked={i < 3} />
              </div>
            ))}
          </Section>

          <Section icon={Bell} title="Notifications" desc="Where should alerts go?">
            {["Email", "Slack #incidents", "PagerDuty", "Webhook"].map((c, i) => (
              <div key={c} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <p className="text-sm">{c}</p>
                <Switch defaultChecked={i < 2} />
              </div>
            ))}
          </Section>
        </div>
      </div>
    </AppShell>
  );
}
