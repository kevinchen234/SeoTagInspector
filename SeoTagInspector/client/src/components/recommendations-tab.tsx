import { SeoAnalysisResponse, SeoRecommendation } from "../types/seo";
import { AlertCircle, X, Lightbulb } from "lucide-react";

interface RecommendationSectionProps {
  title: string;
  type: "critical" | "improvement" | "bestPractice";
  recommendations: SeoRecommendation[];
}

function RecommendationSection({ title, type, recommendations }: RecommendationSectionProps) {
  if (recommendations.length === 0) return null;

  const getBorderColor = () => {
    switch (type) {
      case "critical":
        return "border-red-500";
      case "improvement":
        return "border-yellow-500";
      case "bestPractice":
        return "border-green-500";
    }
  };

  const getTitleColor = () => {
    switch (type) {
      case "critical":
        return "text-red-700";
      case "improvement":
        return "text-yellow-700";
      case "bestPractice":
        return "text-green-700";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "critical":
        return <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500" />;
      case "improvement":
        return <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-500" />;
      case "bestPractice":
        return <Lightbulb className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />;
    }
  };

  return (
    <div className={`border-l-4 ${getBorderColor()} pl-3 sm:pl-4 py-2`}>
      <h4 className={`font-medium ${getTitleColor()} mb-2 text-sm sm:text-base`}>{title}</h4>
      <ul className="space-y-2.5 text-xs sm:text-sm">
        {recommendations.map((rec, index) => (
          <li key={index} className="flex items-start">
            <div className="mt-0.5 mr-1.5 sm:mr-2 flex-shrink-0">
              {getIcon()}
            </div>
            <div>
              <span className="font-medium">{rec.title}:</span>
              <p className="text-gray-600 mt-0.5 sm:mt-1">{rec.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface RecommendationsTabProps {
  analysis: SeoAnalysisResponse;
}

export default function RecommendationsTab({ analysis }: RecommendationsTabProps) {
  // Filter recommendations by type
  const criticalIssues = analysis.recommendations.filter(rec => rec.type === "critical");
  const improvements = analysis.recommendations.filter(rec => rec.type === "improvement");
  const bestPractices = analysis.recommendations.filter(rec => rec.type === "bestPractice");

  return (
    <div className="bg-white border border-gray-200 rounded p-3 sm:p-4 md:p-5">
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">SEO Improvement Recommendations</h3>
      
      <div className="space-y-4">
        <RecommendationSection 
          title="Critical Issues" 
          type="critical" 
          recommendations={criticalIssues} 
        />
        
        <RecommendationSection 
          title="Improvements Needed" 
          type="improvement" 
          recommendations={improvements} 
        />
        
        <RecommendationSection 
          title="Best Practices" 
          type="bestPractice" 
          recommendations={bestPractices} 
        />

        {analysis.recommendations.length === 0 && (
          <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
            <Lightbulb className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 mx-auto mb-1.5 sm:mb-2" />
            <p className="text-xs sm:text-sm text-gray-700">No recommendations to display. Your SEO looks great!</p>
          </div>
        )}
      </div>
    </div>
  );
}
