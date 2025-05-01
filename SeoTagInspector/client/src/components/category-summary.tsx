import { SeoAnalysisResponse } from "../types/seo";
import { filterTagsByCategory } from "../utils/seo-analyzer";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Check, AlertCircle, X, Tag, Facebook, Twitter } from "lucide-react";

interface CategorySummaryProps {
  analysis: SeoAnalysisResponse;
}

export default function CategorySummary({ analysis }: CategorySummaryProps) {
  const basicTags = filterTagsByCategory(analysis.tags, "basic");
  const ogTags = filterTagsByCategory(analysis.tags, "openGraph");
  const twitterTags = filterTagsByCategory(analysis.tags, "twitter");

  // Calculate percentages for each category
  const calculateCategoryScore = (tags: typeof basicTags) => {
    if (tags.length === 0) return 0;
    
    const goodCount = tags.filter(tag => tag.status === "good").length;
    return Math.round((goodCount / tags.length) * 100);
  };

  const basicScore = calculateCategoryScore(basicTags);
  const ogScore = calculateCategoryScore(ogTags);
  const twitterScore = calculateCategoryScore(twitterTags);

  // Helper function to get icon based on score
  const getStatusIcon = (score: number) => {
    if (score >= 80) return <Check className="h-5 w-5 text-green-500" />;
    if (score >= 50) return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    return <X className="h-5 w-5 text-red-500" />;
  };

  // Helper function to get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  // Category data
  const categories = [
    {
      name: "Basic SEO",
      icon: <Tag className="h-6 w-6" />,
      score: basicScore,
      count: basicTags.length,
      description: "Core meta tags for search engines",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      name: "Facebook/Open Graph",
      icon: <Facebook className="h-6 w-6" />,
      score: ogScore,
      count: ogTags.length,
      description: "Tags for social sharing on Facebook",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200"
    },
    {
      name: "Twitter Cards",
      icon: <Twitter className="h-6 w-6" />,
      score: twitterScore,
      count: twitterTags.length,
      description: "Tags for Twitter sharing cards",
      bgColor: "bg-sky-50",
      borderColor: "border-sky-200"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {categories.map((category) => (
        <div key={category.name} 
          className={`rounded-lg ${category.bgColor} border ${category.borderColor} p-4 flex flex-col items-center text-center shadow-sm`}
        >
          <div className="mb-2">{category.icon}</div>
          <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
          <p className="text-xs text-gray-600 mb-3">{category.description}</p>
          
          <div className="flex items-center mb-1">
            <ProgressRing 
              value={category.score} 
              size={70} 
              strokeWidth={7}
              className="mb-1"
            >
              <div className={`flex flex-col text-lg font-bold ${getScoreColor(category.score)}`}>
                {category.score}%
              </div>
            </ProgressRing>
          </div>
          
          <div className="flex items-center text-sm text-gray-700">
            {getStatusIcon(category.score)}
            <span className="ml-1">
              {category.count} tag{category.count !== 1 ? "s" : ""} checked
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}