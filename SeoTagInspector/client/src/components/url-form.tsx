import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UrlFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export default function UrlForm({ onSubmit, isLoading }: UrlFormProps) {
  const [url, setUrl] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple URL validation
    try {
      // Check if URL has protocol, add https:// if missing
      let formattedUrl = url.trim();
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = 'https://' + formattedUrl;
      }
      
      // Validate URL format using URL constructor
      new URL(formattedUrl);
      
      // Call the parent handler
      onSubmit(formattedUrl);
    } catch (error) {
      // Show error toast for invalid URL
      toast({
        title: "Invalid URL",
        description: "Please enter a valid website URL",
        variant: "destructive",
      });
    }
  };

  const clearUrl = () => {
    setUrl("");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 mb-6">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row sm:items-end gap-4">
        <div className="flex-grow space-y-1.5">
          <label htmlFor="url-input" className="block text-sm font-medium text-gray-700">
            Enter Website URL
          </label>
          <div className="relative rounded-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400"><Search size={16} /></span>
            </div>
            <Input
              type="text"
              id="url-input"
              name="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website domain"
              className="pl-10 pr-10 py-2.5 w-full"
              disabled={isLoading}
              onChange={(e) => {
                let value = e.target.value;
                // Remove any existing protocol
                value = value.replace(/^https?:\/\//, '');
                // Set the value with https:// prefix
                setUrl(`https://${value}`);
              }}
              value={url}
            />
            {url && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={clearUrl}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full"
                  disabled={isLoading}
                  aria-label="Clear input"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Enter any website URL to check its SEO meta tags.
          </p>
        </div>
        <Button
          type="submit"
          className="bg-primary-600 hover:bg-primary-700 text-white py-2.5 px-5 h-auto w-full sm:w-auto"
          disabled={isLoading}
        >
          <Search className="mr-2 h-4 w-4" /> Check SEO Tags
        </Button>
      </form>
    </div>
  );
}
