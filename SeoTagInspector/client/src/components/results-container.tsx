import { SeoAnalysisResponse } from "../types/seo";
import { LinkIcon, BarChart3 } from "lucide-react";
import SummaryStats from "./summary-stats";
import CategorySummary from "./category-summary";
import TabNavigation from "./tab-navigation";
import GeneralMetaTab from "./general-meta-tab";
import GooglePreviewTab from "./google-preview-tab";
import FacebookPreviewTab from "./facebook-preview-tab";
import TwitterPreviewTab from "./twitter-preview-tab";
import RecommendationsTab from "./recommendations-tab";

interface ResultsContainerProps {
  analysis: SeoAnalysisResponse;
}

export default function ResultsContainer({ analysis }: ResultsContainerProps) {
  return (
    <div className="space-y-6">
      {/* URL Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-4 shadow-md">
        <div className="flex items-center">
          <LinkIcon className="h-5 w-5 mr-2 flex-shrink-0" />
          <div className="text-xs sm:text-sm md:text-base font-medium overflow-hidden text-ellipsis">
            {analysis.url}
          </div>
        </div>
        <div className="mt-2 text-xs text-blue-100 flex items-center">
          <BarChart3 className="h-3.5 w-3.5 mr-1" />
          <span>Analysis completed on {new Date(analysis.timestamp).toLocaleString()}</span>
        </div>
      </div>

      {/* Overall Summary Stats */}
      <SummaryStats stats={analysis.summary} />

      {/* Category Summaries */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-5">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">SEO Categories Performance</h2>
        <CategorySummary analysis={analysis} />
      </div>

      {/* Tab Navigation */}
      <TabNavigation>
        <GeneralMetaTab analysis={analysis} />
        <GooglePreviewTab analysis={analysis} />
        <FacebookPreviewTab analysis={analysis} />
        <TwitterPreviewTab analysis={analysis} />
        <RecommendationsTab analysis={analysis} />
      </TabNavigation>
    </div>
  );
}
