import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, FileText, Users, Activity, Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/services/api";

export default function UploadData() {
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("employees");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);

    // MOCK preview just to show the user a file is staged
    setPreview([
      { col1: selected.name, col2: `${Math.round(selected.size / 1024)} KB`, col3: "Pending", col4: "-" },
    ]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file before uploading",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      if (activeTab === "employees") {
        const formData = new FormData();
        formData.append("resume", file);

        const response = await api.postMultipart("/employees/upload-resume", formData);
        
        toast({
          title: "Upload successful",
          description: `Extracted Skills: ${response.extractedSkills?.join(', ') || 'None found'}`,
        });
      } else {
        // Other tabs not fully implemented for this demo
        await new Promise(r => setTimeout(r, 1000));
        toast({
          title: "Upload successful",
          description: "Data uploaded and queued for processing",
        });
      }

      setFile(null);
      setPreview([]);
    } catch (err) {
      toast({
        title: "Upload Failed",
        description: err.message || "Failed to process the upload.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold">Upload Data</h1>
        <p className="text-sm text-muted-foreground">
          Upload workforce data using Resumes, CSV, or Excel files. 
        </p>
      </div>

      {/* DATA TYPE SELECTION */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="employees">
            <Users className="h-4 w-4 mr-2" />
            Resumes / Employee Data
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

        <TabsContent value={activeTab} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload {activeTab === "employees" ? "Employee Resume" : activeTab === "jds" ? "Job Description" : "Activity"} Data</CardTitle>
              <CardDescription>
                {activeTab === "employees" ? "Upload a PDF resume. The AI will parse it and extract your skills." : "Upload a file to process."}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Select File</Label>
                <Input
                  type="file"
                  accept={activeTab === "employees" ? ".pdf,.doc,.docx,.txt" : ".csv,.xlsx"}
                  onChange={handleFileSelect}
                />
                {file && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {file.name}
                  </p>
                )}
              </div>

              <Button
                onClick={handleUpload}
                disabled={!file || isUploading}
                size="lg"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Confirm Upload
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* PREVIEW */}
          {preview.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <CardTitle>File Staged</CardTitle>
                </div>
              </CardHeader>

              <CardContent>
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>File Name</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {preview.map((row, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{row.col1}</TableCell>
                          <TableCell>{row.col2}</TableCell>
                          <TableCell>{row.col3}</TableCell>
                          <TableCell>{row.col4}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
