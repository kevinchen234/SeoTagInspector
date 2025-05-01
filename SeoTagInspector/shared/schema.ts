import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Since we're using in-memory storage, this is just a type definition
// to help structure our data consistently

// SEO meta tag categories
export const SEO_TAG_CATEGORIES = {
  BASIC: "basic",
  OPEN_GRAPH: "openGraph",
  TWITTER: "twitter",
} as const;

// SEO tag status options
export const SEO_TAG_STATUS = {
  GOOD: "good",
  NEEDS_IMPROVEMENT: "needsImprovement",
  MISSING: "missing",
} as const;

// Schema for SEO tag analysis request
export const seoAnalysisRequestSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

// Schema for each individual SEO tag
export const seoTagSchema = z.object({
  name: z.string(),
  value: z.string().optional(),
  status: z.enum([
    SEO_TAG_STATUS.GOOD,
    SEO_TAG_STATUS.NEEDS_IMPROVEMENT,
    SEO_TAG_STATUS.MISSING,
  ]),
  category: z.enum([
    SEO_TAG_CATEGORIES.BASIC,
    SEO_TAG_CATEGORIES.OPEN_GRAPH,
    SEO_TAG_CATEGORIES.TWITTER,
  ]),
  message: z.string().optional(),
});

// Schema for SEO analysis response
export const seoAnalysisResponseSchema = z.object({
  url: z.string().url(),
  title: z.string(),
  description: z.string().optional(),
  timestamp: z.number(), // Add timestamp field for when analysis was created
  tags: z.array(seoTagSchema),
  summary: z.object({
    total: z.number(),
    good: z.number(),
    needsImprovement: z.number(),
    missing: z.number(),
  }),
  recommendations: z.array(
    z.object({
      type: z.enum(["critical", "improvement", "bestPractice"]),
      title: z.string(),
      description: z.string(),
    })
  ),
});

// For database schema (though we're using in-memory storage)
export const seoAnalysisRecords = pgTable("seo_analysis_records", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  analysisData: text("analysis_data").notNull(), // JSON string of the analysis
  createdAt: text("created_at").notNull(), // ISO string date
});

// Schema for inserting a new analysis record
export const insertSeoAnalysisRecordSchema = createInsertSchema(seoAnalysisRecords).pick({
  url: true,
  analysisData: true,
  createdAt: true,
});

// Types
export type SeoAnalysisRequest = z.infer<typeof seoAnalysisRequestSchema>;
export type SeoTag = z.infer<typeof seoTagSchema>;
export type SeoAnalysisResponse = z.infer<typeof seoAnalysisResponseSchema>;
export type InsertSeoAnalysisRecord = z.infer<typeof insertSeoAnalysisRecordSchema>;
export type SeoAnalysisRecord = typeof seoAnalysisRecords.$inferSelect;
