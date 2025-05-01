import { 
  SeoAnalysisRecord, 
  InsertSeoAnalysisRecord,
  SeoAnalysisResponse
} from "@shared/schema";

// Interface for storage methods
export interface IStorage {
  saveSeoAnalysis(record: InsertSeoAnalysisRecord): Promise<SeoAnalysisRecord>;
  getSeoAnalysisByUrl(url: string): Promise<SeoAnalysisRecord | undefined>;
  getRecentAnalyses(limit: number): Promise<SeoAnalysisRecord[]>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private seoAnalysisRecords: Map<number, SeoAnalysisRecord>;
  private currentId: number;

  constructor() {
    this.seoAnalysisRecords = new Map();
    this.currentId = 1;
  }

  async saveSeoAnalysis(record: InsertSeoAnalysisRecord): Promise<SeoAnalysisRecord> {
    const id = this.currentId++;
    const seoRecord: SeoAnalysisRecord = { ...record, id };
    this.seoAnalysisRecords.set(id, seoRecord);
    return seoRecord;
  }

  async getSeoAnalysisByUrl(url: string): Promise<SeoAnalysisRecord | undefined> {
    // Find the record with matching URL
    for (const record of this.seoAnalysisRecords.values()) {
      if (record.url === url) {
        return record;
      }
    }
    return undefined;
  }

  async getRecentAnalyses(limit: number): Promise<SeoAnalysisRecord[]> {
    // Convert map values to array and sort by id (descending)
    const allRecords = Array.from(this.seoAnalysisRecords.values());
    return allRecords
      .sort((a, b) => b.id - a.id)
      .slice(0, limit);
  }
}

// Create and export storage instance
export const storage = new MemStorage();
