import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { seoAnalysisRequestSchema, insertSeoAnalysisRecordSchema } from "@shared/schema";
import { ZodError } from "zod";
import axios from "axios";
import * as cheerio from "cheerio";

export async function registerRoutes(app: Express): Promise<Server> {
  // Helper function to analyze SEO meta tags
  async function analyzeSeoMetaTags(url: string) {
    try {
      // Fetch HTML content from the URL
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SeoMetaTagChecker/1.0)',
        },
        timeout: 10000
      });
      
      const html = response.data;
      const $ = cheerio.load(html);
      
      // Extract page title
      const pageTitle = $('title').text() || '';
      
      // Extract meta description
      const metaDescription = $('meta[name="description"]').attr('content') || '';
      
      // Initialize tags array to store all meta tags
      const tags = [];
      
      // Extract basic meta tags
      // Title tag
      const titleLength = pageTitle.length;
      let titleStatus = 'good';
      let titleMessage = '';
      
      if (!pageTitle) {
        titleStatus = 'missing';
        titleMessage = 'Title tag is missing';
      } else if (titleLength < 10) {
        titleStatus = 'needsImprovement';
        titleMessage = 'Title is too short (less than 10 characters)';
      } else if (titleLength > 60) {
        titleStatus = 'needsImprovement';
        titleMessage = 'Title is too long (more than 60 characters)';
      }
      
      tags.push({
        name: 'title',
        value: pageTitle,
        status: titleStatus,
        category: 'basic',
        message: titleMessage
      });
      
      // Description meta tag
      const descLength = metaDescription.length;
      let descStatus = 'good';
      let descMessage = '';
      
      if (!metaDescription) {
        descStatus = 'missing';
        descMessage = 'Meta description is missing';
      } else if (descLength < 50) {
        descStatus = 'needsImprovement';
        descMessage = 'Meta description is too short (less than 50 characters)';
      } else if (descLength > 160) {
        descStatus = 'needsImprovement';
        descMessage = 'Meta description is too long (more than 160 characters)';
      }
      
      tags.push({
        name: 'description',
        value: metaDescription,
        status: descStatus,
        category: 'basic',
        message: descMessage
      });

      // Canonical URL
      const canonicalUrl = $('link[rel="canonical"]').attr('href') || '';
      tags.push({
        name: 'canonical',
        value: canonicalUrl,
        status: canonicalUrl ? 'good' : 'missing',
        category: 'basic',
        message: canonicalUrl ? '' : 'Canonical URL is missing'
      });

      // Robots meta tag
      const robotsContent = $('meta[name="robots"]').attr('content') || '';
      tags.push({
        name: 'robots',
        value: robotsContent,
        status: robotsContent ? 'good' : 'missing',
        category: 'basic',
        message: robotsContent ? '' : 'Robots meta tag is missing'
      });

      // Viewport meta tag
      const viewportContent = $('meta[name="viewport"]').attr('content') || '';
      tags.push({
        name: 'viewport',
        value: viewportContent,
        status: viewportContent ? 'good' : 'missing',
        category: 'basic',
        message: viewportContent ? '' : 'Viewport meta tag is missing'
      });

      // Charset meta tag
      const charsetContent = $('meta[charset]').attr('charset') || '';
      tags.push({
        name: 'charset',
        value: charsetContent,
        status: charsetContent ? 'good' : 'missing',
        category: 'basic',
        message: charsetContent ? '' : 'Charset meta tag is missing'
      });

      // Language
      const htmlLang = $('html').attr('lang') || '';
      tags.push({
        name: 'language',
        value: htmlLang,
        status: htmlLang ? 'good' : 'missing',
        category: 'basic',
        message: htmlLang ? '' : 'HTML lang attribute is missing'
      });
      
      // Extract Open Graph meta tags
      const ogTitle = $('meta[property="og:title"]').attr('content') || '';
      tags.push({
        name: 'og:title',
        value: ogTitle,
        status: ogTitle ? 'good' : 'missing',
        category: 'openGraph',
        message: ogTitle ? '' : 'Open Graph title is missing'
      });
      
      const ogDescription = $('meta[property="og:description"]').attr('content') || '';
      let ogDescStatus = 'good';
      let ogDescMessage = '';
      
      if (!ogDescription) {
        ogDescStatus = 'missing';
        ogDescMessage = 'Open Graph description is missing';
      } else if (ogDescription.length < 50) {
        ogDescStatus = 'needsImprovement';
        ogDescMessage = 'Open Graph description is too short (less than 50 characters)';
      }
      
      tags.push({
        name: 'og:description',
        value: ogDescription,
        status: ogDescStatus,
        category: 'openGraph',
        message: ogDescMessage
      });
      
      const ogImage = $('meta[property="og:image"]').attr('content') || '';
      tags.push({
        name: 'og:image',
        value: ogImage,
        status: ogImage ? 'good' : 'missing',
        category: 'openGraph',
        message: ogImage ? '' : 'Open Graph image is missing'
      });
      
      const ogUrl = $('meta[property="og:url"]').attr('content') || '';
      tags.push({
        name: 'og:url',
        value: ogUrl,
        status: ogUrl ? 'good' : 'missing',
        category: 'openGraph',
        message: ogUrl ? '' : 'Open Graph URL is missing'
      });
      
      const ogType = $('meta[property="og:type"]').attr('content') || '';
      tags.push({
        name: 'og:type',
        value: ogType,
        status: ogType ? 'good' : 'missing',
        category: 'openGraph',
        message: ogType ? '' : 'Open Graph type is missing'
      });
      
      // Extract Twitter Card meta tags
      const twitterCard = $('meta[name="twitter:card"]').attr('content') || '';
      tags.push({
        name: 'twitter:card',
        value: twitterCard,
        status: twitterCard ? 'good' : 'missing',
        category: 'twitter',
        message: twitterCard ? '' : 'Twitter card meta tag is missing'
      });
      
      const twitterTitle = $('meta[name="twitter:title"]').attr('content') || '';
      tags.push({
        name: 'twitter:title',
        value: twitterTitle,
        status: twitterTitle ? 'good' : 'missing',
        category: 'twitter',
        message: twitterTitle ? '' : 'Twitter title meta tag is missing'
      });
      
      const twitterDescription = $('meta[name="twitter:description"]').attr('content') || '';
      tags.push({
        name: 'twitter:description',
        value: twitterDescription,
        status: twitterDescription ? 'good' : 'missing',
        category: 'twitter',
        message: twitterDescription ? '' : 'Twitter description meta tag is missing'
      });
      
      const twitterImage = $('meta[name="twitter:image"]').attr('content') || '';
      tags.push({
        name: 'twitter:image',
        value: twitterImage,
        status: twitterImage ? 'good' : 'missing',
        category: 'twitter',
        message: twitterImage ? '' : 'Twitter image meta tag is missing'
      });
      
      // Calculate summary statistics
      const totalTags = tags.length;
      const goodTags = tags.filter(tag => tag.status === 'good').length;
      const needsImprovementTags = tags.filter(tag => tag.status === 'needsImprovement').length;
      const missingTags = tags.filter(tag => tag.status === 'missing').length;
      
      // Generate recommendations
      const recommendations = [];
      
      // Critical issues (missing required tags)
      const criticalIssues = tags.filter(tag => 
        tag.status === 'missing' && 
        ['title', 'description', 'canonical', 'og:image', 'og:title', 'twitter:card'].includes(tag.name)
      );
      
      criticalIssues.forEach(issue => {
        let title = '';
        let description = '';
        
        switch(issue.name) {
          case 'title':
            title = 'Missing Title Tag';
            description = 'Add a title tag to your page. It\'s the most important element for SEO and user experience.';
            break;
          case 'description':
            title = 'Missing Meta Description';
            description = 'Add a meta description tag to provide a brief summary of your page (150-160 characters).';
            break;
          case 'canonical':
            title = 'Missing Canonical URL';
            description = 'Add a canonical URL to prevent duplicate content issues and help search engines understand your preferred URL.';
            break;
          case 'og:image':
            title = 'Missing Open Graph Image';
            description = 'Add an og:image tag with dimensions of at least 1200x630 pixels to ensure your content looks good when shared on social media.';
            break;
          case 'og:title':
            title = 'Missing Open Graph Title';
            description = 'Add an og:title tag to optimize how your content appears when shared on Facebook and other platforms.';
            break;
          case 'twitter:card':
            title = 'Missing Twitter Card';
            description = 'Add a twitter:card meta tag (summary, summary_large_image, etc.) to control how your content appears when shared on Twitter.';
            break;
          default:
            title = `Missing ${issue.name} Tag`;
            description = `Add the ${issue.name} tag to improve your SEO performance.`;
        }
        
        recommendations.push({
          type: 'critical',
          title,
          description
        });
      });
      
      // Improvements needed
      const improvementIssues = tags.filter(tag => tag.status === 'needsImprovement');
      
      improvementIssues.forEach(issue => {
        let title = '';
        let description = '';
        
        switch(issue.name) {
          case 'title':
            title = 'Title Length Issue';
            description = issue.message;
            break;
          case 'description':
            title = 'Meta Description Length Issue';
            description = 'Your meta description is not optimal. Aim for 150-160 characters to maximize visibility in search results.';
            break;
          case 'og:description':
            title = 'Open Graph Description Issue';
            description = 'Your og:description is too brief. Expand it to 2-4 sentences for better engagement on social platforms.';
            break;
          default:
            title = `${issue.name} Needs Improvement`;
            description = issue.message || `The ${issue.name} tag needs to be optimized.`;
        }
        
        recommendations.push({
          type: 'improvement',
          title,
          description
        });
      });
      
      // Best practices
      // If there are no critical issues with title but could be better
      if (!criticalIssues.some(issue => issue.name === 'title') && pageTitle.length < 40) {
        recommendations.push({
          type: 'bestPractice',
          title: 'More Specific Title',
          description: 'While your title is good, consider making it more specific to improve click-through rates. Include your primary keyword if possible.'
        });
      }
      
      // If no structured data was found
      recommendations.push({
        type: 'bestPractice',
        title: 'Add Structured Data',
        description: 'Implement JSON-LD structured data to enhance your search results with rich snippets and improve visibility.'
      });
      
      // Always recommend securing the site with HTTPS if not already
      if (!url.startsWith('https://')) {
        recommendations.push({
          type: 'critical',
          title: 'Move to HTTPS',
          description: 'Your site is not using HTTPS. Google considers HTTPS as a ranking signal, and browsers mark HTTP sites as "Not Secure".'
        });
      }
      
      // Prepare the response
      const analysisResult = {
        url,
        title: pageTitle,
        description: metaDescription,
        timestamp: Date.now(), // Add current timestamp
        tags,
        summary: {
          total: totalTags,
          good: goodTags,
          needsImprovement: needsImprovementTags,
          missing: missingTags
        },
        recommendations
      };
      
      return analysisResult;
    } catch (error) {
      console.error('Error analyzing URL:', error);
      throw error;
    }
  }

  // API route to analyze SEO meta tags
  app.post('/api/analyze', async (req, res) => {
    try {
      // Validate request
      const { url } = seoAnalysisRequestSchema.parse(req.body);
      
      // Check if we already have analysis for this URL
      const existingAnalysis = await storage.getSeoAnalysisByUrl(url);
      
      if (existingAnalysis) {
        // Return cached analysis if it exists (in real-world scenario, 
        // we might want to check how old it is and refresh if needed)
        return res.json(JSON.parse(existingAnalysis.analysisData));
      }
      
      // Perform SEO analysis
      const analysisResult = await analyzeSeoMetaTags(url);
      
      // Save the analysis result
      await storage.saveSeoAnalysis({
        url,
        analysisData: JSON.stringify(analysisResult),
        createdAt: new Date().toISOString()
      });
      
      // Return the analysis result
      res.json(analysisResult);
    } catch (error) {
      console.error('Error in /api/analyze:', error);
      
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: 'Invalid request data', 
          errors: error.errors 
        });
      }
      
      if (error.response) {
        // Error from Axios request
        return res.status(error.response.status || 500).json({
          message: `Failed to fetch URL: ${error.message}`,
          status: error.response.status,
          statusText: error.response.statusText
        });
      }
      
      res.status(500).json({ 
        message: `Failed to analyze URL: ${error.message}` 
      });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  
  return httpServer;
}
