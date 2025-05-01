import { SeoAnalysisResponse } from "../types/seo";
import { Check, AlertCircle, X, Image } from "lucide-react";
import { getTagByName, getTagValue, extractDomain } from "../utils/seo-analyzer";

interface FacebookPreviewTabProps {
  analysis: SeoAnalysisResponse;
}

export default function FacebookPreviewTab({ analysis }: FacebookPreviewTabProps) {
  // Get values from analysis
  const ogTitle = getTagValue(analysis, "og:title");
  const ogDescription = getTagValue(analysis, "og:description");
  const ogImage = getTagValue(analysis, "og:image");
  const ogUrl = getTagValue(analysis, "og:url");
  
  // Check if tags exist
  const hasOgTitle = ogTitle !== "[Missing]";
  const hasOgDescription = ogDescription !== "[Missing]";
  const hasOgImage = ogImage !== "[Missing]";
  const hasOgUrl = ogUrl !== "[Missing]";
  
  // Get tag quality info
  const ogDescriptionTag = getTagByName(analysis, "og:description");
  const isDescriptionTooShort = ogDescriptionTag?.status === "needsImprovement";
  
  // Get domain for display
  const domain = extractDomain(analysis.url);

  return (
    <div className="bg-white border border-gray-200 rounded p-3 sm:p-4 md:p-5 max-w-2xl mx-auto">
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Facebook Sharing Preview</h3>
      
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm max-w-md mx-auto">
        {/* Image section */}
        {hasOgImage ? (
          <img 
            src={ogImage} 
            alt="Open Graph preview" 
            className="w-full h-40 sm:h-52 object-cover"
            onError={(e) => {
              // If image fails to load, show placeholder
              const img = e.target as HTMLImageElement;
              img.style.display = 'none';
              if (img.nextElementSibling instanceof HTMLElement) {
                img.nextElementSibling.style.display = 'flex';
              }
            }}
          />
        ) : (
          <div className="w-full h-40 sm:h-52 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 flex flex-col items-center">
              <Image className="h-8 w-8 sm:h-12 sm:w-12 mb-2" />
              <p className="text-xs sm:text-sm">No og:image specified</p>
            </span>
          </div>
        )}
        
        {/* Content section */}
        <div className="p-2 sm:p-3 border-t border-gray-300 bg-white">
          <div className="text-gray-500 text-xs uppercase tracking-wide mb-1">{domain}</div>
          <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-0.5 sm:mb-1 line-clamp-1">
            {hasOgTitle ? ogTitle : analysis.title || "No Title"}
          </h3>
          <p className="text-gray-700 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3">
            {hasOgDescription 
              ? ogDescription 
              : analysis.description || "No description provided."}
          </p>
        </div>
      </div>

      <div className="mt-4 sm:mt-6">
        <h4 className="text-sm sm:text-base font-medium text-gray-700 mb-2">Analysis</h4>
        <ul className="space-y-2 text-xs sm:text-sm">
          <li className="flex items-start">
            {hasOgTitle ? (
              <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 mt-0.5 sm:mt-1 mr-1.5 sm:mr-2 flex-shrink-0" />
            ) : (
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500 mt-0.5 sm:mt-1 mr-1.5 sm:mr-2 flex-shrink-0" />
            )}
            <span>
              {hasOgTitle 
                ? "og:title is present and matches the page title" 
                : "og:title is missing. Facebook will use the page title instead."}
            </span>
          </li>
          <li className="flex items-start">
            {!hasOgDescription ? (
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500 mt-0.5 sm:mt-1 mr-1.5 sm:mr-2 flex-shrink-0" />
            ) : isDescriptionTooShort ? (
              <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-500 mt-0.5 sm:mt-1 mr-1.5 sm:mr-2 flex-shrink-0" />
            ) : (
              <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 mt-0.5 sm:mt-1 mr-1.5 sm:mr-2 flex-shrink-0" />
            )}
            <span>
              {!hasOgDescription 
                ? "og:description is missing. Facebook will extract text from your page." 
                : isDescriptionTooShort 
                ? "og:description is present but too short (Facebook recommends 2-4 sentences)"
                : "og:description is properly implemented"}
            </span>
          </li>
          <li className="flex items-start">
            {hasOgImage ? (
              <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 mt-0.5 sm:mt-1 mr-1.5 sm:mr-2 flex-shrink-0" />
            ) : (
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500 mt-0.5 sm:mt-1 mr-1.5 sm:mr-2 flex-shrink-0" />
            )}
            <span>
              {hasOgImage 
                ? "og:image is present. Ensure it's at least 1200x630 pixels for optimal display." 
                : "og:image is missing. Facebook requires an image of at least 1200x630 pixels for optimal display"}
            </span>
          </li>
          <li className="flex items-start">
            {hasOgUrl ? (
              <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 mt-0.5 sm:mt-1 mr-1.5 sm:mr-2 flex-shrink-0" />
            ) : (
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500 mt-0.5 sm:mt-1 mr-1.5 sm:mr-2 flex-shrink-0" />
            )}
            <span>
              {hasOgUrl 
                ? "og:url is correctly configured" 
                : "og:url is missing. This helps Facebook understand the canonical URL for your content."}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
