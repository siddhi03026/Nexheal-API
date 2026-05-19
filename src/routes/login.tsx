import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Mail } from "lucide-react";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Sentinel AI workspace."
      footer={<>Don't have an account? <Link to="/register" className="text-primary hover:underline">Create one</Link></>}
    >
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" type="button" className="gap-2"><Github className="h-4 w-4" /> GitHub</Button>
          <Button variant="outline" type="button" className="gap-2"><Mail className="h-4 w-4" /> Google</Button>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> OR <span className="h-px flex-1 bg-border" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@company.com" className="h-11" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot?</Link>
          </div>
          <Input id="password" type="password" placeholder="••••••••" className="h-11" />
        </div>
        <Button className="w-full h-11 gradient-primary glow-primary text-base">Sign in</Button>
      </form>
    </AuthLayout>
  );
}
