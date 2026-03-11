import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { 
  User, Lock, Bell, Moon, Sun, Shield, 
  Eye, EyeOff, Loader2, Save, LogOut 
} from "lucide-react";

export default function Settings() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Profile Settings
  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });

  // Password Settings
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPass, setShowPass] = useState(false);

  // Preference Settings
  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    pushNotifications: false,
    darkMode: localStorage.getItem("theme") === "dark",
    twoFactor: false,
  });

  const handleProfileSave = async () => {
    setIsLoading(true);
    try {
      await api.post("/user/update-profile", { username: profileData.username });
      toast({ title: "Profile Updated", description: "Your basic info has been saved." });
    } catch (err) {
      toast({ title: "Update Failed", description: err.response?.data?.message || "Could not save profile change", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwords.current || !passwords.new) {
       toast({ title: "Missing Fields", description: "All password fields are required", variant: "destructive" });
       return;
    }
    if (passwords.new !== passwords.confirm) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      await api.post("/user/change-password", { 
        currentPassword: passwords.current, 
        newPassword: passwords.new 
      });
      toast({ title: "Password Changed", description: "Your security credentials have been updated." });
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err) {
      toast({ title: "Error", description: err.response?.data?.message || "Failed to change password", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = (val) => {
    setPrefs({ ...prefs, darkMode: val });
    const theme = val ? "dark" : "light";
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", val);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Account Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account preferences and security</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation Sidebar (Mobile View could use tabs) */}
        <div className="space-y-2">
           {[
             { id: 'profile', label: 'Profile Settings', icon: User },
             { id: 'security', label: 'Security & Password', icon: Lock },
             { id: 'notifications', label: 'Notifications', icon: Bell },
             { id: 'appearance', label: 'Appearance', icon: Moon },
           ].map(item => (
             <Button key={item.id} variant="ghost" className="w-full justify-start font-semibold text-slate-600 dark:text-slate-300">
               <item.icon className="h-4 w-4 mr-2" />
               {item.label}
             </Button>
           ))}
           <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
             <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={logout}>
               <LogOut className="h-4 w-4 mr-2" />
               Sign Out
             </Button>
           </div>
        </div>

        {/* Settings Content */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Section: Profile */}
          <Card id="profile" className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg">Profile Details</CardTitle>
              <CardDescription>Update your public information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input value={profileData.username} onChange={e => setProfileData({...profileData, username: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={profileData.email} disabled className="bg-slate-50" />
                </div>
              </div>
              <Button onClick={handleProfileSave} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Section: Security */}
          <Card id="security" className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Shield className="h-5 w-5 text-blue-500" /> Password & Security</CardTitle>
              <CardDescription>Keep your account protected with a strong password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <div className="relative">
                  <Input type={showPass ? "text" : "password"} value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} />
                  <button className="absolute right-3 top-2.5 text-slate-400" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input type="password" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <Input type="password" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} />
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800 mt-4">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Switch checked={prefs.twoFactor} onCheckedChange={(v) => setPrefs({...prefs, twoFactor: v})} />
              </div>
              <Button onClick={handlePasswordChange} disabled={isLoading} className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900">
                 Change Password
              </Button>
            </CardContent>
          </Card>

          {/* Section: Preferences */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg">System Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-slate-400" />
                    <Label>Email Notifications</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">Receive weekly performance summaries</p>
                </div>
                <Switch checked={prefs.emailNotifications} onCheckedChange={(v) => setPrefs({...prefs, emailNotifications: v})} />
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    {prefs.darkMode ? <Moon className="h-4 w-4 text-blue-400" /> : <Sun className="h-4 w-4 text-amber-500" />}
                    <Label>Dark Mode</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">Switch to a darker experimental theme</p>
                </div>
                <Switch checked={prefs.darkMode} onCheckedChange={toggleTheme} />
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
