// Import types from shared schema
import { SeoAnalysisRequest, SeoAnalysisResponse, SeoTag } from "@shared/schema";

// Re-export the types for use in frontend
export type { SeoAnalysisRequest, SeoAnalysisResponse, SeoTag };

// Additional frontend-specific types

// For SEO Summary Stats display
export interface SeoSummaryStats {
  total: number;
  good: number;
  needsImprovement: number;
  missing: number;
}

// For Tab navigation
export type TabType = "general" | "google" | "facebook" | "twitter" | "recommendations";

// For Recommendations
export interface SeoRecommendation {
  type: "critical" | "improvement" | "bestPractice";
  title: string;
  description: string;
}

// Simplified Google preview data
export interface GooglePreviewData {
  title: string;
  url: string;
  description: string;
}

// Simplified Social media preview data
export interface SocialPreviewData {
  title: string;
  description: string;
  image?: string;
  url: string;
  siteName?: string;
}
