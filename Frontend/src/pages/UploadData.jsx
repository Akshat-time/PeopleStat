import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud } from "lucide-react";

export default function UploadData() {
  return (
    <div className="h-[80vh] flex flex-col items-center justify-center">
      <Card className="max-w-md w-full border-dashed shadow-sm">
        <CardContent className="pt-12 pb-12 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UploadCloud className="h-8 w-8 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Upload Data</h2>
          <p className="text-slate-500 max-w-sm mx-auto">
            Bulk workforce data ingestion via CSV, JSON, and Excel formats is currently in development.
          </p>
          <div className="pt-4">
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600 text-sm">
              Coming Soon
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
