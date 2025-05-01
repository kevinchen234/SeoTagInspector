import { SeoAnalysisResponse } from "../types/seo";
import { Check, AlertCircle } from "lucide-react";
import { formatTitle, formatDescription, formatUrl } from "../utils/seo-analyzer";

interface GooglePreviewTabProps {
  analysis: SeoAnalysisResponse;
}

export default function GooglePreviewTab({ analysis }: GooglePreviewTabProps) {
  const title = formatTitle(analysis.title);
  const description = formatDescription(analysis.description || "");
  const url = formatUrl(analysis.url);

  // Determine if title is good length
  const isTitleGood = analysis.title.length > 10 && analysis.title.length <= 60;
  
  // Determine if description is good length
  const isDescriptionGood = analysis.description 
    ? analysis.description.length >= 50 && analysis.description.length <= 160
    : false;

  return (
    <div className="bg-white border border-gray-200 rounded p-3 sm:p-4 md:p-5 max-w-2xl mx-auto">
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Google Search Result Preview</h3>
      <div className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-white shadow-sm">
        <div className="text-lg sm:text-xl text-blue-700 font-medium mb-1 hover:underline cursor-pointer truncate">
          {title || "No Title"}
        </div>
        <div className="text-green-800 text-xs sm:text-sm mb-1 truncate">{url}</div>
        <div className="text-xs sm:text-sm text-gray-700 max-w-full line-clamp-3 sm:line-clamp-none">
          {description || "No description available for this page."}
        </div>
      </div>

      <div className="mt-4 sm:mt-6">
        <h4 className="text-sm sm:text-base font-medium text-gray-700 mb-2">Analysis</h4>
        <ul className="space-y-2 text-xs sm:text-sm">
          <li className="flex items-start">
            {isTitleGood ? (
              <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 mt-0.5 sm:mt-1 mr-1.5 sm:mr-2 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-500 mt-0.5 sm:mt-1 mr-1.5 sm:mr-2 flex-shrink-0" />
            )}
            <span>
              {isTitleGood
                ? `Title is well-formatted and under the 60 character limit (${analysis.title.length} chars)`
                : analysis.title.length > 60
                ? `Title is too long (${analysis.title.length} chars). Google typically displays the first 50-60 characters.`
                : analysis.title.length < 10
                ? `Title is too short (${analysis.title.length} chars). Consider a more descriptive title.`
                : `Title length is ${analysis.title.length} characters.`}
            </span>
          </li>
          <li className="flex items-start">
            {isDescriptionGood ? (
              <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 mt-0.5 sm:mt-1 mr-1.5 sm:mr-2 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-500 mt-0.5 sm:mt-1 mr-1.5 sm:mr-2 flex-shrink-0" />
            )}
            <span>
              {!analysis.description
                ? "Description is missing. Google will extract text from your page instead."
                : analysis.description.length < 50
                ? `Description is too short (${analysis.description.length} chars). Aim for 150-160 characters.`
                : analysis.description.length > 160
                ? `Description is too long (${analysis.description.length} chars). Google displays ~155-160 characters on desktop.`
                : `Description length is good (${analysis.description.length} chars).`}
            </span>
          </li>
          <li className="flex items-start">
            <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 mt-0.5 sm:mt-1 mr-1.5 sm:mr-2 flex-shrink-0" />
            <span>URL structure is clean and readable</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
