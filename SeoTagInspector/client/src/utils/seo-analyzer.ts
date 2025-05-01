import { SeoAnalysisResponse, SeoTag } from "../types/seo";

// Helper function to get URL domain (for display purposes)
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    return url;
  }
}

// Get tag status class for styling
export function getStatusClass(status: SeoTag['status']): string {
  switch (status) {
    case 'good':
      return 'bg-green-100 text-green-800';
    case 'needsImprovement':
      return 'bg-yellow-100 text-yellow-800';
    case 'missing':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// Get tag status icon
export function getStatusIcon(status: SeoTag['status']): string {
  switch (status) {
    case 'good':
      return 'check-circle';
    case 'needsImprovement':
      return 'exclamation-circle';
    case 'missing':
      return 'times-circle';
    default:
      return 'question-circle';
  }
}

// Filter tags by category
export function filterTagsByCategory(tags: SeoTag[], category: string): SeoTag[] {
  return tags.filter(tag => tag.category === category);
}

// Format title for search result preview
export function formatTitle(title: string, maxLength = 60): string {
  if (!title) return '';
  return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
}

// Format description for search result preview
export function formatDescription(description: string, maxLength = 160): string {
  if (!description) return '';
  return description.length > maxLength ? description.substring(0, maxLength) + '...' : description;
}

// Format URL for display in previews
export function formatUrl(url: string, maxLength = 60): string {
  if (!url) return '';
  
  try {
    const urlObj = new URL(url);
    let displayUrl = urlObj.hostname + urlObj.pathname;
    
    if (displayUrl.length > maxLength) {
      return displayUrl.substring(0, maxLength) + '...';
    }
    
    return displayUrl;
  } catch (e) {
    return url;
  }
}

// Get tag by name from analysis
export function getTagByName(analysis: SeoAnalysisResponse, name: string): SeoTag | undefined {
  return analysis.tags.find(tag => tag.name === name);
}

// Get formatted value for tag (returns [Missing] for missing tags)
export function getTagValue(analysis: SeoAnalysisResponse, name: string): string {
  const tag = getTagByName(analysis, name);
  return tag?.value || '[Missing]';
}

// Check if a tag exists
export function hasTag(analysis: SeoAnalysisResponse, name: string): boolean {
  return !!getTagByName(analysis, name)?.value;
}

// Calculate percent of good tags
export function calculateGoodPercent(analysis: SeoAnalysisResponse): number {
  if (!analysis.summary.total) return 0;
  return Math.round((analysis.summary.good / analysis.summary.total) * 100);
}
