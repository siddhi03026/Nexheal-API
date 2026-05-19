import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({ component: ForgotPage });

function ForgotPage() {
  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll send you a secure link to reset it."
      footer={<>Remembered it? <Link to="/login" className="text-primary hover:underline">Back to sign in</Link></>}
    >
      <form className="space-y-4">
        <div className="space-y-2"><Label>Email</Label><Input type="email" className="h-11" placeholder="you@company.com" /></div>
        <Button className="w-full h-11 gradient-primary glow-primary">Send reset link</Button>
      </form>
    </AuthLayout>
  );
}
