import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/register")({ component: RegisterPage });

function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    const trimmedEmail = email.trim();
    const trimmedCompany = company.trim();

    if (!trimmedFirst || !trimmedLast || !trimmedEmail || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post<any>("/auth/register", {
        first_name: trimmedFirst,
        last_name: trimmedLast,
        email: trimmedEmail,
        company: trimmedCompany || undefined,
        password,
      });
      login(res.user, res.access_token, res.refresh_token);
      toast.success("Account created successfully!");
      window.location.href = "/dashboard";
    } catch (error: any) {
      toast.error(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your workspace"
      subtitle="Start monitoring and auto-healing your APIs in minutes."
      footer={<>Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>First name</Label>
            <Input 
              className="h-11" 
              placeholder="Alex" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <Label>Last name</Label>
            <Input 
              className="h-11" 
              placeholder="Stone" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Work email</Label>
          <Input 
            type="email" 
            className="h-11" 
            placeholder="you@company.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="off"
          />
        </div>
        <div className="space-y-2">
          <Label>Company</Label>
          <Input 
            className="h-11" 
            placeholder="Acme Inc." 
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="space-y-2">
          <Label>Password</Label>
          <Input 
            type="password" 
            className="h-11" 
            placeholder="At least 8 characters" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
        <Button 
          type="submit" 
          className="w-full h-11 gradient-primary glow-primary text-base flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
        <p className="text-[11px] text-muted-foreground text-center">By signing up you agree to our Terms and Privacy Policy.</p>
      </form>
    </AuthLayout>
  );
}
