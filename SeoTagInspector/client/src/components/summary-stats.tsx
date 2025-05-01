import { SeoSummaryStats } from "../types/seo";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Check, AlertCircle, X } from "lucide-react";

interface SummaryStatsProps {
  stats: SeoSummaryStats;
}

export default function SummaryStats({ stats }: SummaryStatsProps) {
  // Calculate overall score percentage
  const calculateScore = () => {
    if (stats.total === 0) return 0;
    return Math.round((stats.good / stats.total) * 100);
  };

  const score = calculateScore();

  // Function to generate a message based on score
  const getScoreMessage = () => {
    if (score >= 80) return "Great SEO implementation!";
    if (score >= 50) return "Room for SEO improvements";
    return "Significant SEO issues found";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-5">
      <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">SEO Performance Score</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
        {/* Score Ring */}
        <div className="md:col-span-1 flex justify-center">
          <ProgressRing 
            value={score} 
            size={100} 
            strokeWidth={8}
            className="my-2"
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold">{score}%</span>
              <span className="text-xs text-gray-500">Overall</span>
            </div>
          </ProgressRing>
        </div>
        
        {/* Score Message */}
        <div className="md:col-span-1 flex flex-col items-center md:items-start">
          <div className="text-sm font-medium mb-1">{getScoreMessage()}</div>
          <div className="text-xs text-gray-500">{stats.total} meta tags analyzed</div>
        </div>
        
        {/* Stats Grid */}
        <div className="md:col-span-3 grid grid-cols-3 gap-2 sm:gap-3">
          <div className="bg-green-50 rounded-lg p-2 sm:p-3 text-center border border-green-100">
            <div className="flex justify-center mb-1">
              <Check className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-base sm:text-xl font-bold text-green-600">{stats.good}</div>
            <div className="text-xs text-gray-600">Properly Implemented</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-2 sm:p-3 text-center border border-yellow-100">
            <div className="flex justify-center mb-1">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="text-base sm:text-xl font-bold text-yellow-600">{stats.needsImprovement}</div>
            <div className="text-xs text-gray-600">Need Improvement</div>
          </div>
          <div className="bg-red-50 rounded-lg p-2 sm:p-3 text-center border border-red-100">
            <div className="flex justify-center mb-1">
              <X className="h-4 w-4 text-red-500" />
            </div>
            <div className="text-base sm:text-xl font-bold text-red-600">{stats.missing}</div>
            <div className="text-xs text-gray-600">Missing Tags</div>
          </div>
        </div>
      </div>
    </div>
  );
}
