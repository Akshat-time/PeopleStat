import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export default function EmployeeDrawer({ employee, onClose }) {
  if (!employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="flex-1 bg-black/40" onClick={onClose} />

      {/* Drawer */}
      <div className="w-[420px] bg-white h-full p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Employee Details</h2>
          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-4 mb-6">
          <img
            src={employee.avatar}
            className="h-14 w-14 rounded-full"
          />
          <div>
            <p className="font-semibold">{employee.name}</p>
            <p className="text-sm text-muted-foreground">{employee.role}</p>
            <p className="text-xs text-muted-foreground">
              {employee.department}
            </p>
          </div>
        </div>

        {/* Metrics */}
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Fitment</p>
            <Progress value={employee.fitment} />
          </div>

          <div>
            <p className="text-sm font-medium">Productivity</p>
            <Progress value={employee.productivity} />
          </div>

          <div>
            <p className="text-sm font-medium">Utilization</p>
            <Progress value={employee.utilization} />
          </div>

          <div className="pt-4">
            <Badge
              variant={
                employee.risk === "HIGH"
                  ? "destructive"
                  : employee.risk === "MED"
                  ? "secondary"
                  : "default"
              }
            >
              {employee.risk} RISK
            </Badge>
          </div>
        </div>

        {/* AI Recommendation */}
        <div className="mt-8 bg-muted p-4 rounded-lg">
          <p className="font-medium mb-1">AI Recommendation</p>
          <p className="text-sm text-muted-foreground">
            {employee.recommendation}
          </p>
        </div>

        <Button className="w-full mt-6">Assign Training</Button>
      </div>
    </div>
  );
}
