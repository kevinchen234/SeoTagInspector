import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { SeoAnalysisResponse } from "../types/seo";
import UrlForm from "@/components/url-form";
import LoadingIndicator from "@/components/loading-indicator";
import ErrorDisplay from "@/components/error-display";
import ResultsContainer from "@/components/results-container";
import { CircleHelp, Search, BarChart2, ArrowRight, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<SeoAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeUrl = useMutation({
    mutationFn: async (url: string) => {
      const res = await apiRequest("POST", "/api/analyze", { url });
      return res.json();
    },
    onSuccess: (data: SeoAnalysisResponse) => {
      setAnalysisResult(data);
      setError(null);
      // Scroll to results
      setTimeout(() => {
        const resultsElement = document.getElementById('results-section');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    },
    onError: (err: Error) => {
      setError(err.message);
      setAnalysisResult(null);
    },
  });

  const handleSubmit = (url: string) => {
    setError(null);
    analyzeUrl.mutate(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-700 to-indigo-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 sm:py-5 flex justify-between items-center">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center">
            <svg 
              className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span className="truncate">SEO Meta Tag Checker</span>
          </h1>
          <a 
            href="#" 
            className="text-primary-100 hover:text-white transition flex items-center text-sm sm:text-base"
            onClick={(e) => {
              e.preventDefault();
              window.open(
                "https://developers.google.com/search/docs/fundamentals/seo-starter-guide",
                "_blank"
              );
            }}
          >
            <CircleHelp className="h-4 w-4 mr-1" />
            <span>Help</span>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-4 sm:py-6 md:py-8">
        {/* Hero Section - Show only when no results */}
        {!analysisResult && !analyzeUrl.isPending && (
          <div className="mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                Analyze Your Website's SEO At A Glance
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Enter any URL to get a comprehensive visual analysis of your site's SEO meta tags, 
                with easy-to-understand summaries and actionable recommendations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="bg-blue-100 p-3 rounded-full mb-3">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Visual SEO Analysis</h3>
                <p className="text-sm text-gray-600">
                  Get visual summaries of your SEO implementation with color-coded indicators and progress rings.
                </p>
              </div>
              
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="bg-indigo-100 p-3 rounded-full mb-3">
                  <BarChart2 className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Category Breakdown</h3>
                <p className="text-sm text-gray-600">
                  See how your site performs across different SEO categories like basic meta tags, Open Graph, and Twitter Cards.
                </p>
              </div>
              
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="bg-green-100 p-3 rounded-full mb-3">
                  <ArrowRight className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Actionable Insights</h3>
                <p className="text-sm text-gray-600">
                  Get specific recommendations to improve your website's SEO with prioritized action items.
                </p>
              </div>
            </div>

            <div className="bg-white p-5 md:p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
              <h3 className="font-semibold text-lg mb-3">What We Check:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Title & Meta Description</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Open Graph Tags</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Twitter Card Markup</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Canonical URLs</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Robots Meta Tags</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Viewport Settings</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* URL Input Form */}
        <UrlForm onSubmit={handleSubmit} isLoading={analyzeUrl.isPending} />

        {/* Loading State */}
        {analyzeUrl.isPending && <LoadingIndicator />}

        {/* Error Message Display */}
        {error && <ErrorDisplay message={error} />}

        {/* Results Section */}
        {analysisResult && !analyzeUrl.isPending && (
          <div id="results-section" className="pt-2">
            <ResultsContainer analysis={analysisResult} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-4 sm:py-5 mt-auto">
        <div className="container mx-auto px-4 text-center text-xs sm:text-sm">
          <p>SEO Meta Tag Checker Tool &copy; {new Date().getFullYear()}</p>
          <p className="mt-1">
            Check any website's SEO meta tags and get recommendations for improvement.
          </p>
        </div>
      </footer>
    </div>
  );
}
