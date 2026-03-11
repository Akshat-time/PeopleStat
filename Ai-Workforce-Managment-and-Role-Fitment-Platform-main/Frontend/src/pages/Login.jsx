import React, { useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(usernameOrEmail, password);
      toast({
        title: "Login Successful",
        description: "Welcome back",
      });
      setLocation("/");
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!resetEmail) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Reset link sent",
      description: "Check your inbox for password reset instructions",
    });

    setShowForgotPassword(false);
    setResetEmail("");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 font-sans">

      {/* LEFT BRAND SECTION */}
      <div className="hidden lg:flex flex-col justify-between px-16 py-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center text-xl font-bold">
            QG
          </div>
          <span className="text-xl font-semibold">Quintess Global</span>
        </div>

        {/* Headline */}
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold leading-tight">
            AI Workforce Optimization
          </h1>
          <p className="mt-6 text-lg text-slate-300">
            Enterprise intelligence to align people, roles, productivity and
            future workforce strategy.
          </p>

          <div className="mt-10 space-y-4">
            <div className="rounded-xl bg-white/10 p-5">
              <h3 className="font-semibold text-lg">AI-Powered Insights</h3>
              <p className="text-sm text-slate-300 mt-1">
                Real-time analytics on workforce performance, risk and efficiency.
              </p>
            </div>

            <div className="rounded-xl bg-white/10 p-5">
              <h3 className="font-semibold text-lg">
                Workforce Planning & Gap Analysis
              </h3>
              <p className="text-sm text-slate-300 mt-1">
                Detect skill gaps, role mismatches and future talent needs.
              </p>
            </div>

            <div className="rounded-xl bg-white/10 p-5">
              <h3 className="font-semibold text-lg">
                Growth & Productivity Analytics
              </h3>
              <p className="text-sm text-slate-300 mt-1">
                Track development readiness, utilization and career momentum.
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400">
          © 2026 Quintess Global · Secure Enterprise Access
        </p>
      </div>

      {/* RIGHT LOGIN SECTION */}
      <div className="flex items-center justify-center px-6 bg-white">
        <Card className="w-full max-w-md p-10 shadow-xl border">

          <h2 className="text-3xl font-bold">Sign In</h2>
          <p className="text-muted-foreground mt-2 text-base">
            Access your AI Workforce Management Console
          </p>

          {error && (
            <Alert variant="destructive" className="mt-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="mt-8 space-y-5">

            <div className="space-y-2">
              <Label>Email or Username</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  className="pl-10 py-6 text-base"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder="Enter your email or username"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  className="pl-10 pr-10 py-6 text-base"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-6 text-lg"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center text-sm">
              New user?{" "}
              <button
                type="button"
                onClick={() => setLocation("/register")}
                className="font-semibold text-blue-600 hover:underline"
              >
                Create account
              </button>
            </div>
          </form>
        </Card>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your email and we’ll send a reset link.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Label>Email Address</Label>
            <Input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForgotPassword(false)}>
              Cancel
            </Button>
            <Button onClick={handleForgotPassword}>
              Send Reset Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
