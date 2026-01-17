import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState, useEffect } from "react";
import { Loader2, Shield } from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordMutation = useMutation({
    mutationFn: async (data) => {
      return apiRequest("/api/settings/password", {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update password",
        variant: "destructive",
      });
    },
  });

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Please fill in all password fields",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Validation Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Validation Error",
        description: "New password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    passwordMutation.mutate({ currentPassword, newPassword });
  };

  const { data: settings } = useQuery({
    queryKey: ["/api/settings"],
    enabled: user?.role === "admin",
  });

  const settingMutation = useMutation({
    mutationFn: async ({ key, value, category, description }) => {
      return apiRequest(`/api/settings/${key}`, {
        method: "PUT",
        body: JSON.stringify({ value, category, description }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Settings Updated",
        description: "System settings have been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update settings",
        variant: "destructive",
      });
    },
  });

  const [fitmentWeights, setFitmentWeights] = useState({
    skills: 40,
    activity: 30,
    productivity: 20,
    softskills: 10,
  });

  useEffect(() => {
    if (settings) {
      const fitmentWeightsSetting = settings.find((s) => s.key === "fitment_weights");
      if (fitmentWeightsSetting && fitmentWeightsSetting.value) {
        setFitmentWeights(fitmentWeightsSetting.value);
      }
    }
  }, [settings]);

  const handleFitmentWeightChange = (key, value) => {
    setFitmentWeights((prev) => ({ ...prev, [key]: value }));
  };

  const saveFitmentWeights = () => {
    settingMutation.mutate({
      key: "fitment_weights",
      value: fitmentWeights,
      category: "system",
      description: "Weights for fitment score calculation",
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account and application preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={user?.username || ""} disabled data-testid="input-username" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user?.email || ""}
              disabled
              data-testid="input-email"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" value={user?.role === "admin" ? "Administrator" : "Employee"} disabled />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Change your password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                data-testid="input-current-password"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                data-testid="input-new-password"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                data-testid="input-confirm-password"
              />
            </div>
            <Button
              type="submit"
              disabled={passwordMutation.isPending}
              data-testid="button-update-password"
            >
              {passwordMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {user?.role === "admin" && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Admin Settings</CardTitle>
                <CardDescription>Configure system-wide settings (Admin only)</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Fitment Score Weights</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Configure how different factors are weighted when calculating employee-to-role fit scores.
                Total should equal 100%.
              </p>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="weight-skills">Skills Match</Label>
                    <span className="text-sm font-medium">{fitmentWeights.skills}%</span>
                  </div>
                  <Input
                    id="weight-skills"
                    type="range"
                    min="0"
                    max="100"
                    value={fitmentWeights.skills}
                    onChange={(e) => handleFitmentWeightChange("skills", parseInt(e.target.value))}
                    data-testid="input-weight-skills"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="weight-activity">Activity Level</Label>
                    <span className="text-sm font-medium">{fitmentWeights.activity}%</span>
                  </div>
                  <Input
                    id="weight-activity"
                    type="range"
                    min="0"
                    max="100"
                    value={fitmentWeights.activity}
                    onChange={(e) => handleFitmentWeightChange("activity", parseInt(e.target.value))}
                    data-testid="input-weight-activity"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="weight-productivity">Productivity Score</Label>
                    <span className="text-sm font-medium">{fitmentWeights.productivity}%</span>
                  </div>
                  <Input
                    id="weight-productivity"
                    type="range"
                    min="0"
                    max="100"
                    value={fitmentWeights.productivity}
                    onChange={(e) => handleFitmentWeightChange("productivity", parseInt(e.target.value))}
                    data-testid="input-weight-productivity"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="weight-softskills">Soft Skills</Label>
                    <span className="text-sm font-medium">{fitmentWeights.softskills}%</span>
                  </div>
                  <Input
                    id="weight-softskills"
                    type="range"
                    min="0"
                    max="100"
                    value={fitmentWeights.softskills}
                    onChange={(e) => handleFitmentWeightChange("softskills", parseInt(e.target.value))}
                    data-testid="input-weight-softskills"
                  />
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="font-medium">Total Weight</span>
                  <span className={`font-bold ${
                    Object.values(fitmentWeights).reduce((a, b) => a + b, 0) === 100
                      ? "text-green-600 dark:text-green-500"
                      : "text-destructive"
                  }`}>
                    {Object.values(fitmentWeights).reduce((a, b) => a + b, 0)}%
                  </span>
                </div>
              </div>
              <Button
                onClick={saveFitmentWeights}
                disabled={settingMutation.isPending || Object.values(fitmentWeights).reduce((a, b) => a + b, 0) !== 100}
                className="mt-4"
                data-testid="button-save-fitment-weights"
              >
                {settingMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Fitment Weights"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive email updates about system activity
              </p>
            </div>
            <Switch defaultChecked data-testid="switch-email-notifications" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Fatigue Alerts</p>
              <p className="text-sm text-muted-foreground">
                Get notified when employees show burnout indicators
              </p>
            </div>
            <Switch defaultChecked data-testid="switch-fatigue-alerts" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Weekly Reports</p>
              <p className="text-sm text-muted-foreground">
                Receive weekly summary reports via email
              </p>
            </div>
            <Switch data-testid="switch-weekly-reports" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data & Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" data-testid="button-export-data">
            Export My Data
          </Button>
          <p className="text-sm text-muted-foreground">
            Download all your data in a machine-readable format
          </p>
          <Separator />
          <Button variant="destructive" data-testid="button-delete-account">
            Delete Account
          </Button>
          <p className="text-sm text-muted-foreground">
            Permanently delete your account and all associated data
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
