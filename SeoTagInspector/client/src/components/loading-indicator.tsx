import { Loader2 } from "lucide-react";

export default function LoadingIndicator() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 text-center">
      <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-primary-600 mx-auto" />
      <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">Fetching website data...</p>
    </div>
  );
}
