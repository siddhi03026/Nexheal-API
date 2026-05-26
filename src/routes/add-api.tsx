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
import { Globe, Server, Bell, ShieldCheck, Loader2 } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

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
  const [name, setName] = useState("");
  const [environment, setEnvironment] = useState("prod");
  const [url, setUrl] = useState("");
  const [endpointPath, setEndpointPath] = useState("/health");
  const [expectedResponse, setExpectedResponse] = useState("");
  const [monitorType, setMonitorType] = useState("http");
  const [interval, setIntervalVal] = useState("30s");
  const [regions, setRegions] = useState("multi");
  
  // Healing permissions states
  const [restartContainers, setRestartContainers] = useState(true);
  const [scaleReplicas, setScaleReplicas] = useState(true);
  const [rerouteTraffic, setRerouteTraffic] = useState(true);
  const [rollbackDeploys, setRollbackDeploys] = useState(false);

  // Notification channels states
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySlack, setNotifySlack] = useState(true);
  const [notifyPagerduty, setNotifyPagerduty] = useState(false);
  const [notifyWebhook, setNotifyWebhook] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !url) {
      toast.error("Service name and Website URL are required");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/endpoints/", {
        name,
        url,
        endpoint_path: endpointPath,
        environment,
        monitor_type: monitorType,
        interval,
        regions,
        expected_response: expectedResponse || null,
        permissions: {
          restart_containers: restartContainers,
          scale_replicas: scaleReplicas,
          reroute_traffic: rerouteTraffic,
          rollback_deploys: rollbackDeploys,
        },
        notifications: {
          email: notifyEmail,
          slack: notifySlack,
          pagerduty: notifyPagerduty,
          webhook: notifyWebhook,
        },
      });

      toast.success("API Endpoint successfully registered and monitoring started!");
      window.location.href = "/dashboard";
    } catch (e: any) {
      toast.error(e.message || "Failed to add API Endpoint");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Add API or Website"
        subtitle="Connect a new endpoint and configure how Sentinel should heal it."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => window.location.href = "/dashboard"}>Cancel</Button>
            <Button size="sm" className="gradient-primary flex items-center gap-1.5" onClick={handleSave} disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Save & Monitor
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 space-y-4">
          <Section icon={Globe} title="Target" desc="What should Sentinel watch?">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Service name</Label>
                <Input 
                  placeholder="payments-api" 
                  className="h-11" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Environment</Label>
                <Select value={environment} onValueChange={setEnvironment}>
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
              <Input 
                placeholder="https://api.acme.com" 
                className="h-11" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>API endpoint</Label>
              <Input 
                placeholder="/v1/health" 
                className="h-11" 
                value={endpointPath}
                onChange={(e) => setEndpointPath(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Expected response</Label>
              <Textarea 
                placeholder='{"status":"ok"}' 
                className="font-mono text-xs min-h-[90px]" 
                value={expectedResponse}
                onChange={(e) => setExpectedResponse(e.target.value)}
              />
            </div>
          </Section>

          <Section icon={Server} title="Monitoring" desc="How often, and from where.">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={monitorType} onValueChange={setMonitorType}>
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
                <Select value={interval} onValueChange={setIntervalVal}>
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
                <Select value={regions} onValueChange={setRegions}>
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
            <div className="flex items-start justify-between gap-4 py-2 border-b border-border">
              <div>
                <p className="text-sm font-medium">Restart containers</p>
                <p className="text-xs text-muted-foreground">Auto-restart on crash loops.</p>
              </div>
              <Switch checked={restartContainers} onCheckedChange={setRestartContainers} />
            </div>
            <div className="flex items-start justify-between gap-4 py-2 border-b border-border">
              <div>
                <p className="text-sm font-medium">Scale replicas</p>
                <p className="text-xs text-muted-foreground">Add pods on latency spikes.</p>
              </div>
              <Switch checked={scaleReplicas} onCheckedChange={setScaleReplicas} />
            </div>
            <div className="flex items-start justify-between gap-4 py-2 border-b border-border">
              <div>
                <p className="text-sm font-medium">Reroute traffic</p>
                <p className="text-xs text-muted-foreground">Shift load to healthy regions.</p>
              </div>
              <Switch checked={rerouteTraffic} onCheckedChange={setRerouteTraffic} />
            </div>
            <div className="flex items-start justify-between gap-4 py-2 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium">Rollback deploys</p>
                <p className="text-xs text-muted-foreground">Revert on error budget burn.</p>
              </div>
              <Switch checked={rollbackDeploys} onCheckedChange={setRollbackDeploys} />
            </div>
          </Section>

          <Section icon={Bell} title="Notifications" desc="Where should alerts go?">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <p className="text-sm">Email</p>
              <Switch checked={notifyEmail} onCheckedChange={setNotifyEmail} />
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <p className="text-sm">Slack #incidents</p>
              <Switch checked={notifySlack} onCheckedChange={setNotifySlack} />
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <p className="text-sm">PagerDuty</p>
              <Switch checked={notifyPagerduty} onCheckedChange={setNotifyPagerduty} />
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <p className="text-sm">Webhook</p>
              <Switch checked={notifyWebhook} onCheckedChange={setNotifyWebhook} />
            </div>
          </Section>
        </div>
      </div>
    </AppShell>
  );
}
