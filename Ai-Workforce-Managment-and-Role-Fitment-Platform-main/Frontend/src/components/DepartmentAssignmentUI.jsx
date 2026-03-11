import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";

export default function DepartmentAssignmentUI({
  hasDepartmentColumn,
  onDepartmentAssignmentChange
}) {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [departmentInsructions, setDepartmentInstructions] = useState("");

  // Common departments (can be fetched from backend)
  const commonDepartments = [
    "Engineering",
    "Finance",
    "HR",
    "Operations",
    "Sales",
    "Marketing",
    "IT",
    "Support",
    "Administration",
    "Other"
  ];

  useEffect(() => {
    if (hasDepartmentColumn) {
      setDepartmentInstructions(
        "Your file contains a department column. It will be used as-is during upload. You can optionally override all records with a single department if needed."
      );
    } else {
      setDepartmentInstructions(
        "Your file does not contain a department column. Please select a department to assign to all records."
      );
    }
  }, [hasDepartmentColumn]);

  const handleDepartmentChange = (dept) => {
    setSelectedDepartment(dept);
    onDepartmentAssignmentChange(dept);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Sector / Department Assignment</CardTitle>
        <CardDescription>
          {departmentInsructions}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasDepartmentColumn && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Selecting a department is recommended to organize employees by sector.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <label className={`text-sm font-medium ${!selectedDepartment && !hasDepartmentColumn ? 'text-red-600' : ''}`}>
            {hasDepartmentColumn ? "Override Department (Optional)" : "Assign Department to All Records (Required)"}
          </label>
          <Select value={selectedDepartment} onValueChange={handleDepartmentChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a department..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">-- Use File Values --</SelectItem>
              {commonDepartments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedDepartment && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              All uploaded employee records will be assigned to: <Badge className="ml-2">{selectedDepartment}</Badge>
            </p>
          </div>
        )}

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> You can manage additional department/sector details in Settings after upload.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
