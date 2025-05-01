import { SeoAnalysisResponse } from "../types/seo";
import { Check, X, Image } from "lucide-react";
import { getTagValue, extractDomain } from "../utils/seo-analyzer";

interface TwitterPreviewTabProps {
  analysis: SeoAnalysisResponse;
}

export default function TwitterPreviewTab({ analysis }: TwitterPreviewTabProps) {
  // Get values from analysis
  const twitterCard = getTagValue(analysis, "twitter:card");
  const twitterTitle = getTagValue(analysis, "twitter:title");
  const twitterDescription = getTagValue(analysis, "twitter:description");
  const twitterImage = getTagValue(analysis, "twitter:image");
  
  // Check if tags exist
  const hasCard = twitterCard !== "[Missing]";
  const hasTitle = twitterTitle !== "[Missing]";
  const hasDescription = twitterDescription !== "[Missing]";
  const hasImage = twitterImage !== "[Missing]";
  
  // Get fallback values if Twitter-specific tags are missing
  const title = hasTitle ? twitterTitle : analysis.title;
  const description = hasDescription ? twitterDescription : analysis.description;
  const domain = extractDomain(analysis.url);

  return (
    <div className="bg-white border border-gray-200 rounded p-3 sm:p-4 md:p-5 max-w-2xl mx-auto">
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Twitter Card Preview</h3>
      
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm max-w-md mx-auto">
        {/* Image section */}
        {hasImage ? (
          <img 
            src={twitterImage} 
            alt="Twitter Card preview" 
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
              <p className="text-xs sm:text-sm">No twitter:image specified</p>
            </span>
          </div>
        )}
        
        {/* Content section */}
        <div className="p-2 sm:p-3 border-t border-gray-300 bg-white">
          <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-0.5 sm:mb-1 line-clamp-1">
            {title || "No Title"}
          </h3>
          <p className="text-gray-700 text-xs sm:text-sm mb-1 sm:mb-2 line-clamp-2 sm:line-clamp-3">
            {description || "No description provided."}
          </p>
          <div className="text-gray-500 text-xs">{domain}</div>
        </div>
      </div>

      <div className="mt-4 sm:mt-6">
        <h4 className="text-sm sm:text-base font-medium text-gray-700 mb-2">Analysis</h4>
        <ul className="space-y-2 text-xs sm:text-sm">
          <li className="flex items-start">
            {hasCard ? (
              <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 mt-0.5 sm:mt-1 mr-1.5 sm:mr-2 flex-shrink-0" />
            ) : (
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500 mt-0.5 sm:mt-1 mr-1.5 sm:mr-2 flex-shrink-0" />
            )}
            <span>
              {hasCard 
                ? `twitter:card is set to "${twitterCard}" which is appropriate for most content` 
                : "twitter:card is missing. Twitter won't be able to display a rich card."}
            </span>
          </li>
          <li className="flex items-start">
            {hasTitle ? (
              <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 mt-0.5 sm:mt-1 mr-1.5 sm:mr-2 flex-shrink-0" />
            ) : (
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500 mt-0.5 sm:mt-1 mr-1.5 sm:mr-2 flex-shrink-0" />
            )}
            <span>
              {hasTitle 
                ? "twitter:title is properly set" 
                : "twitter:title is missing. Falling back to page title"}
            </span>
          </li>
          <li className="flex items-start">
            {hasDescription ? (
              <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 mt-0.5 sm:mt-1 mr-1.5 sm:mr-2 flex-shrink-0" />
            ) : (
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500 mt-0.5 sm:mt-1 mr-1.5 sm:mr-2 flex-shrink-0" />
            )}
            <span>
              {hasDescription 
                ? "twitter:description is properly set" 
                : "twitter:description is missing. Falling back to meta description"}
            </span>
          </li>
          <li className="flex items-start">
            {hasImage ? (
              <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 mt-0.5 sm:mt-1 mr-1.5 sm:mr-2 flex-shrink-0" />
            ) : (
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500 mt-0.5 sm:mt-1 mr-1.5 sm:mr-2 flex-shrink-0" />
            )}
            <span>
              {hasImage 
                ? "twitter:image is properly set" 
                : "twitter:image is missing. Twitter recommends images of at least 120x120 pixels and less than 1MB in file size"}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
