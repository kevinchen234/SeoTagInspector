import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface ErrorDisplayProps {
  message: string;
}

export default function ErrorDisplay({ message }: ErrorDisplayProps) {
  return (
    <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200 p-3 sm:p-4 rounded-lg mb-6">
      <div className="flex items-start">
        <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mt-0.5" />
        <div className="ml-2 sm:ml-3">
          <AlertTitle className="text-xs sm:text-sm font-medium text-red-800">
            Error Fetching Website Data
          </AlertTitle>
          <AlertDescription className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-700">
            {message || "Unable to access the URL. Please check the URL and try again."}
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
}
