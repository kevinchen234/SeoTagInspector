import { SeoAnalysisResponse, SeoTag } from "../types/seo";
import { Check, AlertCircle, X } from "lucide-react";
import { filterTagsByCategory, getStatusClass } from "../utils/seo-analyzer";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface TagTableProps {
  tags: SeoTag[];
  title: string;
}

function TagTable({ tags, title }: TagTableProps) {
  return (
    <div>
      <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">{title}</h3>
      <div className="overflow-x-auto -mx-4 sm:mx-0 sm:border sm:border-gray-200 sm:rounded-lg">
        <Table className="min-w-full">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="text-xs font-medium text-gray-500 uppercase py-2 px-3 sm:px-4">Tag</TableHead>
              <TableHead className="text-xs font-medium text-gray-500 uppercase py-2 px-3 sm:px-4">Value</TableHead>
              <TableHead className="text-xs font-medium text-gray-500 uppercase py-2 px-3 sm:px-4">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tags.map((tag) => (
              <TableRow key={tag.name}>
                <TableCell className="whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900 py-2 px-3 sm:px-4">
                  <code className="bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm">{tag.name}</code>
                </TableCell>
                <TableCell className="text-xs sm:text-sm text-gray-700 max-w-xs py-2 px-3 sm:px-4">
                  <div className="truncate">{tag.value || "[Missing]"}</div>
                </TableCell>
                <TableCell className="whitespace-nowrap text-xs sm:text-sm py-2 px-3 sm:px-4">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClass(
                      tag.status
                    )}`}
                  >
                    {tag.status === "good" && <Check className="h-3 w-3 mr-1" />}
                    {tag.status === "needsImprovement" && <AlertCircle className="h-3 w-3 mr-1" />}
                    {tag.status === "missing" && <X className="h-3 w-3 mr-1" />}
                    {tag.status === "good" && "Good"}
                    {tag.status === "needsImprovement" && "Needs Improvement"}
                    {tag.status === "missing" && "Missing"}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

interface GeneralMetaTabProps {
  analysis: SeoAnalysisResponse;
}

export default function GeneralMetaTab({ analysis }: GeneralMetaTabProps) {
  const basicTags = filterTagsByCategory(analysis.tags, "basic");
  const ogTags = filterTagsByCategory(analysis.tags, "openGraph");
  const twitterTags = filterTagsByCategory(analysis.tags, "twitter");

  return (
    <div className="space-y-6">
      <TagTable tags={basicTags} title="Basic Meta Tags" />
      <TagTable tags={ogTags} title="Open Graph Tags" />
      <TagTable tags={twitterTags} title="Twitter Card Tags" />
    </div>
  );
}
