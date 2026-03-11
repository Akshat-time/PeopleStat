import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Upload, FileText, Users, Activity, Loader2, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ColumnMappingUI from "@/components/ColumnMappingUI";
import DepartmentAssignmentUI from "@/components/DepartmentAssignmentUI";

export default function UploadData() {
  const { toast } = useToast();

  // Upload type tabs
  const [activeTab, setActiveTab] = useState("employees");

  // Form steps (only for employee data)
  const [currentStep, setCurrentStep] = useState(1); // 1, 2, 3, 4
  const [file, setFile] = useState(null);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [isUploadingFinal, setIsUploadingFinal] = useState(false);

  // Step 1: File uploaded
  // Step 2: Mapping suggestions
  const [mappingSuggestions, setMappingSuggestions] = useState(null);
  const [schemaFields, setSchemaFields] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileMetadata, setFileMetadata] = useState(null);

  // Step 3: Mapping adjustments
  const [finalMappings, setFinalMappings] = useState({});
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const API_BASE = "http://localhost:5000/api";

  // ===== FILE HANDLING =====
  const handleFileSelect = async (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // Validate file type
    const validTypes = [
      "text/csv",
      "application/json",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "application/pdf"
    ];

    const fileExtension = selected.name.split(".").pop().toLowerCase();
    const supportedExtensions = ["csv", "xlsx", "xls", "json", "pdf"];

    if (!supportedExtensions.includes(fileExtension)) {
      toast({
        title: "Invalid file type",
        description: `Please upload ${supportedExtensions.join(", ")} files only`,
        variant: "destructive"
      });
      return;
    }

    setFile(selected);
    setCurrentStep(2);
    await getColumnMappingSuggestions(selected);
  };

  const getColumnMappingSuggestions = async (fileToProcess) => {
    setIsParsingFile(true);

    const formData = new FormData();
    formData.append("file", fileToProcess);

    try {
      const response = await fetch(`${API_BASE}/upload/employee/suggest-mappings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Error parsing file",
          description: data.error,
          variant: "destructive"
        });
        setCurrentStep(1);
        setFile(null);
        return;
      }

      setMappingSuggestions(data.mappingSuggestions);
      setSchemaFields(data.schemaFields);
      setPreview(data.preview);
      setFileMetadata({
        filename: data.filename,
        fileType: data.fileType,
        totalRows: data.totalRows
      });

      // Pre-fill final mappings with suggestions
      const suggestions = {};
      data.mappingSuggestions.forEach((mapping) => {
        suggestions[mapping.uploadedColumn] = mapping.suggestedField || "";
      });
      setFinalMappings(suggestions);
    } catch (error) {
      toast({
        title: "Failed to parse file",
        description: error.message,
        variant: "destructive"
      });
      setCurrentStep(1);
      setFile(null);
    } finally {
      setIsParsingFile(false);
    }
  };

  const handleMappingChange = (updatedMappings) => {
    setFinalMappings(updatedMappings);
  };

  const handleDepartmentAssignmentChange = (dept) => {
    setSelectedDepartment(dept);
  };

  // ===== NAVIGATION =====
  const handleNext = () => {
    if (currentStep === 2) {
      // Validate required fields are mapped
      if (!finalMappings.name || !finalMappings.email) {
        toast({
          title: "Missing required mappings",
          description: "Please map at least 'name' and 'email' fields",
          variant: "destructive"
        });
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setFile(null);
    setMappingSuggestions(null);
    setFinalMappings({});
    setSelectedDepartment("");
    setFileMetadata(null);
  };

  const handleFinalUpload = async () => {
    setIsUploadingFinal(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("mappings", JSON.stringify(finalMappings));
    if (selectedDepartment) {
      formData.append("department", selectedDepartment);
    }

    try {
      const response = await fetch(`${API_BASE}/upload/employee`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Upload failed",
          description: data.error,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Upload successful",
        description: `${data.count} employees uploaded successfully`,
      });

      handleReset();
    } catch (error) {
      toast({
        title: "Upload error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsUploadingFinal(false);
    }
  };

  // ===== RENDER STEPS =====
  const renderStep = () => {
    if (activeTab !== "employees") {
      return renderLegacyUpload();
    }

    switch (currentStep) {
      case 1:
        return renderStep1_FileUpload();
      case 2:
        return renderStep2_ColumnMapping();
      case 3:
        return renderStep3_DepartmentAssignment();
      case 4:
        return renderStep4_Confirmation();
      default:
        return renderStep1_FileUpload();
    }
  };

  const renderStep1_FileUpload = () => (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge className="bg-primary text-primary-foreground">Step 1 of 4</Badge>
          <span className="font-medium">File Upload</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Employee Data</CardTitle>
          <CardDescription>
            Select a CSV, Excel, JSON, or PDF file containing employee data. Maximum file size: 50MB
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="file-input">Select File</Label>
            <Input
              id="file-input"
              type="file"
              accept=".csv,.xlsx,.xls,.json,.pdf"
              onChange={handleFileSelect}
              disabled={isParsingFile}
            />
            <p className="text-xs text-muted-foreground">
              Supported formats: CSV, Excel (.xlsx/.xls), JSON, PDF
            </p>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              After uploading, you'll be able to review and adjust how columns map to your employee data fields.
            </AlertDescription>
          </Alert>

          {file && isParsingFile && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Parsing file...</p>
              </div>
            </div>
          )}

          {file && !isParsingFile && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">{file.name}</p>
                <p className="text-sm text-green-700">File ready. Click Next to review mappings.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-end">
        <Button onClick={handleNext} disabled={!file || isParsingFile} size="lg">
          <span>Next: Review Mappings</span>
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderStep2_ColumnMapping = () => (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge className="bg-primary text-primary-foreground">Step 2 of 4</Badge>
          <span className="font-medium">Column Mapping</span>
        </div>
        <span className="text-sm text-muted-foreground">
          {fileMetadata?.filename} ({fileMetadata?.totalRows} rows)
        </span>
      </div>

      <ColumnMappingUI
        mappingSuggestions={mappingSuggestions}
        schemaFields={schemaFields}
        onMappingChange={handleMappingChange}
        preview={preview}
      />

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious} size="lg">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button onClick={handleNext} size="lg">
          <span>Next: Assign Department</span>
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderStep3_DepartmentAssignment = () => (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge className="bg-primary text-primary-foreground">Step 3 of 4</Badge>
          <span className="font-medium">Sector / Department</span>
        </div>
      </div>

      <DepartmentAssignmentUI
        hasDepartmentColumn={mappingSuggestions?.some(m => m.suggestedField === "department")}
        onDepartmentAssignmentChange={handleDepartmentAssignmentChange}
      />

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious} size="lg">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button onClick={handleNext} size="lg">
          <span>Next: Confirm & Upload</span>
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderStep4_Confirmation = () => (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge className="bg-primary text-primary-foreground">Step 4 of 4</Badge>
          <span className="font-medium">Confirm & Upload</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Summary</CardTitle>
          <CardDescription>Review your upload configuration</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* File Info */}
          <div className="border-b pb-4">
            <h3 className="font-semibold mb-2">File Information</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Filename:</span>
                <p className="font-mono">{fileMetadata?.filename}</p>
              </div>
              <div>
                <span className="text-muted-foreground">File Type:</span>
                <p className="font-mono uppercase">{fileMetadata?.fileType}</p>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Total Records:</span>
                <p className="font-mono">{fileMetadata?.totalRows}</p>
              </div>
            </div>
          </div>

          {/* Mapping Summary */}
          <div className="border-b pb-4">
            <h3 className="font-semibold mb-2">Column Mappings</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(finalMappings)
                .filter(([_, value]) => value)
                .map(([uploaded, field]) => (
                  <div key={uploaded}>
                    <span className="text-muted-foreground">{uploaded}:</span>
                    <p className="font-mono text-primary">{field}</p>
                  </div>
                ))}
            </div>
          </div>

          {/* Department Info */}
          {selectedDepartment && (
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-2">Department Assignment</h3>
              <Badge>{selectedDepartment}</Badge>
            </div>
          )}

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Clicking "Upload" will create or update employee records based on email matching. This action can be traced in your activity logs.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={isUploadingFinal} size="lg">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset} disabled={isUploadingFinal} size="lg">
            Cancel
          </Button>
          <Button onClick={handleFinalUpload} disabled={isUploadingFinal} size="lg">
            {isUploadingFinal ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload {fileMetadata?.totalRows} Employees
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  // Legacy upload for non-employee data types (for backward compatibility)
  const renderLegacyUpload = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Upload Data</h1>
        <p className="text-sm text-muted-foreground">
          Upload workforce data using CSV or Excel files. Manual entry is not required.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Upload {activeTab === "jds" ? "Job Description" : "Activity"} Data
          </CardTitle>
          <CardDescription>
            Upload a CSV or Excel file containing {activeTab === "jds" ? "job descriptions" : "activity logs"}.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Select File</Label>
            <Input type="file" accept=".csv,.xlsx" />
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This upload type uses legacy processing. For enhanced features, use the Employees tab.
            </AlertDescription>
          </Alert>

          <Button className="w-full">
            <Upload className="mr-2 h-4 w-4" />
            Upload File
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Tab Selection (only for choosing data type) */}
      {currentStep === 1 && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="employees" onClick={() => setCurrentStep(1)}>
              <Users className="h-4 w-4 mr-2" />
              Employees
            </TabsTrigger>
            <TabsTrigger value="jds">
              <FileText className="h-4 w-4 mr-2" />
              Job Descriptions
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Activity className="h-4 w-4 mr-2" />
              Activity Logs
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {/* Render appropriate content */}
      {renderStep()}
    </div>
  );
}
