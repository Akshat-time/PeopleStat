import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, ChevronDown } from "lucide-react";

export default function ColumnMappingUI({
  mappingSuggestions,
  schemaFields,
  onMappingChange,
  preview
}) {
  const [mappings, setMappings] = useState(() => {
    const initial = {};
    mappingSuggestions?.forEach((mapping) => {
      initial[mapping.uploadedColumn] = mapping.suggestedField || "";
    });
    return initial;
  });

  const handleMappingChange = (uploadedColumn, newField) => {
    const updated = { ...mappings, [uploadedColumn]: newField };
    setMappings(updated);
    onMappingChange(updated);
  };

  const getConfidenceBadge = (confidence) => {
    if (confidence >= 80) {
      return <Badge className="bg-green-600">High {confidence}%</Badge>;
    } else if (confidence >= 50) {
      return <Badge className="bg-yellow-600">Medium {confidence}%</Badge>;
    } else {
      return <Badge className="bg-gray-600">Low {confidence}%</Badge>;
    }
  };

  const hasMissingRequired = mappings && (!mappings.name || !mappings.email);

  return (
    <div className="space-y-6">
      {/* Warning for missing required fields */}
      {hasMissingRequired && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Required fields missing: Please map at least "name" and "email" fields before uploading.
          </AlertDescription>
        </Alert>
      )}

      {/* Mapping Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Column Mapping Configuration</CardTitle>
          <CardDescription>
            Review and adjust how uploaded columns map to employee data fields. Auto-detected mappings are suggestions; you can override them.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2 font-semibold">Uploaded Column</th>
                  <th className="text-left py-2 px-2 font-semibold">Auto-Detected</th>
                  <th className="text-left py-2 px-2 font-semibold">Confidence</th>
                  <th className="text-left py-2 px-2 font-semibold">Map To Field</th>
                </tr>
              </thead>
              <tbody>
                {mappingSuggestions?.map((mapping, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-2 font-medium">{mapping.uploadedColumn}</td>
                    <td className="py-3 px-2 text-muted-foreground">
                      {mapping.suggestedField ? (
                        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                          {mapping.suggestedField}
                        </span>
                      ) : (
                        <span className="text-gray-500 italic">No match found</span>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      {getConfidenceBadge(mapping.confidence)}
                    </td>
                    <td className="py-3 px-2">
                      <Select
                        value={mappings[mapping.uploadedColumn] || ""}
                        onValueChange={(value) =>
                          handleMappingChange(mapping.uploadedColumn, value)
                        }
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Select field..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">-- Skip This Column --</SelectItem>
                          {mapping.availableFields?.map((field) => (
                            <SelectItem key={field} value={field}>
                              {field}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Preview of Mapped Data */}
      {preview && preview.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Data Preview (First 5 Rows)</CardTitle>
            <CardDescription>
              Preview of how your data will be mapped. Fix any validation errors before uploading.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {preview.map((row, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${
                  row.errors?.length > 0 ? "border-red-300 bg-red-50" : "border-green-300 bg-green-50"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">Row {row.rowIndex}</h4>
                  {row.errors?.length > 0 && (
                    <Badge variant="destructive">{row.errors.length} error(s)</Badge>
                  )}
                </div>

                {/* Data Display */}
                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  {Object.entries(row.data || {}).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-muted-foreground">{key}:</span>
                      <span className="ml-2 font-mono">
                        {value || "[empty]"}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Errors */}
                {row.errors?.length > 0 && (
                  <div className="bg-red-100 border border-red-300 rounded p-2">
                    <p className="text-sm font-semibold text-red-800 mb-1">Validation Errors:</p>
                    <ul className="text-sm text-red-700 list-disc list-inside">
                      {row.errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Field Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Available Employee Fields</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {Object.entries(schemaFields || {}).map(([field, description]) => (
              <div key={field} className="p-2 border rounded">
                <div className="font-mono text-xs bg-muted px-2 py-1 rounded mb-1">
                  {field}
                </div>
                <div className="text-muted-foreground text-xs">{description}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
