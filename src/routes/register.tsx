import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/register")({ component: RegisterPage });

function RegisterPage() {
  return (
    <AuthLayout
      title="Create your workspace"
      subtitle="Start monitoring and auto-healing your APIs in minutes."
      footer={<>Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link></>}
    >
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2"><Label>First name</Label><Input className="h-11" placeholder="Alex" /></div>
          <div className="space-y-2"><Label>Last name</Label><Input className="h-11" placeholder="Stone" /></div>
        </div>
        <div className="space-y-2"><Label>Work email</Label><Input type="email" className="h-11" placeholder="you@company.com" /></div>
        <div className="space-y-2"><Label>Company</Label><Input className="h-11" placeholder="Acme Inc." /></div>
        <div className="space-y-2"><Label>Password</Label><Input type="password" className="h-11" placeholder="At least 8 characters" /></div>
        <Button className="w-full h-11 gradient-primary glow-primary text-base">Create account</Button>
        <p className="text-[11px] text-muted-foreground text-center">By signing up you agree to our Terms and Privacy Policy.</p>
      </form>
    </AuthLayout>
  );
}
