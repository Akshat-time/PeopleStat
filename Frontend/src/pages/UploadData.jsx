import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, FileText, Users, Activity, Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

    // MOCK preview (frontend only)
    setPreview([
      { col1: "John Doe", col2: "john@company.com", col3: "Engineering", col4: "82%" },
      { col1: "Jane Smith", col2: "jane@company.com", col3: "Finance", col4: "76%" },
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

    // BACKEND WILL BE CONNECTED LATER
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: "Upload successful",
        description: "Data uploaded and queued for processing",
      });
      setFile(null);
      setPreview([]);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold">Upload Data</h1>
        <p className="text-sm text-muted-foreground">
          Upload workforce data using CSV or Excel files. Manual entry is not required.
        </p>
      </div>

      {/* DATA TYPE SELECTION */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="employees">
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

        {/* UPLOAD CARD */}
        <TabsContent value={activeTab} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload {activeTab === "employees" ? "Employee" : activeTab === "jds" ? "Job Description" : "Activity"} Data</CardTitle>
              <CardDescription>
                Upload a CSV or Excel file. First few rows will be previewed before confirmation.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Select File</Label>
                <Input
                  type="file"
                  accept=".csv,.xlsx"
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
                  <CardTitle>Preview (First Rows)</CardTitle>
                </div>
                <CardDescription>
                  This is a preview only. Full data will be processed after upload.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Column 1</TableHead>
                        <TableHead>Column 2</TableHead>
                        <TableHead>Column 3</TableHead>
                        <TableHead>Column 4</TableHead>
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
