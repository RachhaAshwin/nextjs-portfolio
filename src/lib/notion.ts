import { cache } from 'react';

export interface NotionPage {
  id: string;
  title: string;
  url: string;
  created_time: string;
  last_edited_time: string;
  properties: any;
}

// In-memory cache with TTL
class MemoryCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  set(key: string, data: any, ttlMinutes: number = 5): void {
    const ttl = ttlMinutes * 60 * 1000; // Convert to milliseconds
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  size(): number {
    return this.cache.size;
  }
}

// Global cache instances
const databaseCache = new MemoryCache();
const pageCache = new MemoryCache();
const requestCache = new Map<string, Promise<any>>(); // For request deduplication

// Next.js cache wrapper for server-side caching
export const getCachedNotionDatabase = cache(async (): Promise<any[]> => {
  console.log('🚀 Server cache: Fetching database');
  return getNotionDatabase();
});

export const getCachedNotionPage = cache(async (pageId: string): Promise<any> => {
  console.log(`🚀 Server cache: Fetching page ${pageId.slice(0, 8)}...`);
  return getNotionPage(pageId);
});

// Cache management utilities
export function clearNotionCache(): void {
  databaseCache.clear();
  pageCache.clear();
  requestCache.clear();
  console.log('🗑️ Cleared all Notion caches');
}

export function getCacheStats(): { database: number; pages: number; requests: number } {
  return {
    database: databaseCache.size(),
    pages: pageCache.size(),
    requests: requestCache.size
  };
}

// Smart cache warming with priority and performance tracking
export async function warmCache(pageIds: string[] = []): Promise<void> {
  const warmingTimer = new PerformanceTimer(`Cache Warming ${pageIds.length} pages`);
  console.log(`🔥 Warming cache for ${pageIds.length} pages`);
  
  // Priority 1: Warm database cache (fastest)
  const databaseWarming = getNotionDatabase().catch(e => 
    console.warn('⚠️  Database cache warming failed:', e.message)
  );
  
  // Priority 2: Warm page caches with smart batching
  const batchSize = 2; // Reduced batch size for better performance
  const batches = [];
  
  for (let i = 0; i < pageIds.length; i += batchSize) {
    batches.push(pageIds.slice(i, i + batchSize));
  }
  
  console.log(`🔥 Warming ${batches.length} batches of ${batchSize} pages each`);
  
  // Sequential batching to avoid overwhelming the API
  const results = [];
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`🔥 Processing batch ${i + 1}/${batches.length}`);
    
    const batchTimer = new PerformanceTimer(`Batch ${i + 1}`);
    
    const batchResults = await Promise.allSettled(
      batch.map(pageId => {
        const pageTimer = new PerformanceTimer(`Warming ${pageId.slice(0, 8)}`);
        return getNotionPage(pageId)
          .then(result => {
            pageTimer.end();
            return { pageId, success: true, result };
          })
          .catch(e => {
            pageTimer.end();
            console.warn(`⚠️  Page ${pageId.slice(0, 8)} warming failed: ${e.message}`);
            return { pageId, success: false, error: e.message };
          });
      })
    );
    
    batchTimer.end();
    results.push(...batchResults);
    
    // Small delay between batches to be respectful to Notion API
    if (i < batches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
    }
  }
  
  // Wait for database warming to complete
  await databaseWarming;
  
  // Performance summary
  const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
  const failed = results.length - successful;
  
  warmingTimer.end();
  console.log(`🎯 Cache warming complete: ${successful} successful, ${failed} failed`);
  
  // Log cache stats
  const stats = getCacheStats();
  console.log(`📊 Post-warming cache stats:`, stats);
}

// Cached database fetching with request deduplication
export async function getNotionDatabase(): Promise<any[]> {
  const cacheKey = 'notion-database';
  
  // Check memory cache first
  const cached = databaseCache.get(cacheKey);
  if (cached) {
    console.log('📦 Cache hit: Database');
    return cached;
  }
  
  // Check for ongoing request (deduplication)
  if (requestCache.has(cacheKey)) {
    console.log('🔄 Request deduplication: Database');
    return await requestCache.get(cacheKey)!;
  }
  
  // Create new request
  const requestPromise = fetchNotionDatabase();
  requestCache.set(cacheKey, requestPromise);
  
  try {
    const result = await requestPromise;
    // Cache successful results for 5 minutes
    databaseCache.set(cacheKey, result, 5);
    console.log(`💾 Cached database: ${result.length} posts`);
    return result;
  } finally {
    requestCache.delete(cacheKey);
  }
}

// Performance utilities (shared with API route)
class PerformanceTimer {
  private startTime: number;
  
  constructor(private operation: string) {
    this.startTime = Date.now();
    console.log(`⏱️  ${operation} - Started`);
  }
  
  end(): number {
    const duration = Date.now() - this.startTime;
    console.log(`⏱️  ${this.operation} - Completed in ${duration}ms`);
    return duration;
  }
}

// Request timeout wrapper
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, operation: string): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`${operation} timed out after ${timeoutMs}ms`)), timeoutMs)
  );
  
  return Promise.race([promise, timeoutPromise]);
}

// Request queue for controlling concurrency
class RequestQueue {
  private queue: (() => Promise<any>)[] = [];
  private running: Set<Promise<any>> = new Set();
  private readonly maxConcurrent = 3; // Max 3 concurrent Notion API calls
  
  async add<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      this.processQueue();
    });
  }
  
  private async processQueue(): Promise<void> {
    if (this.running.size >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }
    
    const request = this.queue.shift()!;
    const promise = request();
    
    this.running.add(promise);
    
    promise
      .finally(() => {
        this.running.delete(promise);
        this.processQueue();
      });
  }
  
  get stats() {
    return {
      queued: this.queue.length,
      running: this.running.size
    };
  }
}

const requestQueue = new RequestQueue();

// Optimized server-side Notion client factory
async function createOptimizedNotionClient() {
  const { Client } = await import('@notionhq/client');
  
  return new Client({ 
    auth: process.env.NOTION_API_KEY,
    timeoutMs: 25000, // 25 second timeout
  });
}

// Optimized server-side notion-to-md factory  
async function createOptimizedNotionToMd() {
  const { NotionToMarkdown } = await import('notion-to-md');
  const notion = await createOptimizedNotionClient();
  
  return new NotionToMarkdown({ 
    notionClient: notion,
    config: {
      parseChildPages: false, // Skip child pages for speed
    }
  });
}

// Internal database fetching function
async function fetchNotionDatabase(): Promise<any[]> {
  const isServer = typeof window === 'undefined';
  
  if (isServer) {
    // Server-side: Optimized direct Notion API calls
    return requestQueue.add(async () => {
      const timer = new PerformanceTimer('Server Database Query');
      
      try {
        const notion = await createOptimizedNotionClient();
        const response = await withTimeout(
          notion.databases.query({
            database_id: process.env.NOTION_DATABASE_ID!,
            filter: {
              property: "Status",
              select: {
                equals: "Blogs",
              },
            },
            sorts: [
              {
                timestamp: "created_time",
                direction: "descending",
              },
            ],
            page_size: 25, // Limit for faster queries
          }),
          10000, // 10 second timeout
          'Server database query'
        );
        
        const stats = requestQueue.stats;
        console.log(`🎯 Request queue: ${stats.queued} queued, ${stats.running} running`);
        
        timer.end();
        return response.results as any[];
      } catch (error) {
        timer.end();
        console.error("❌ Server database fetch failed:", error.message);
        throw error;
      }
    });
  } else {
    // Client-side: API route
    const timer = new PerformanceTimer('Client Database Fetch');
    
    try {
      const baseUrl = window.location.origin;
      const response = await withTimeout(
        fetch(`${baseUrl}/api/notion?type=database`),
        12000, // 12 second timeout for client requests
        'Client database fetch'
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      timer.end();
      return data.data || [];
    } catch (error) {
      timer.end();
      console.error("❌ Client database fetch failed:", error.message);
      return [];
    }
  }
}

// Cached page fetching with request deduplication  
export async function getNotionPage(pageId: string): Promise<any> {
  const cacheKey = `notion-page-${pageId}`;
  
  // Check memory cache first
  const cached = pageCache.get(cacheKey);
  if (cached) {
    console.log(`📦 Cache hit: Page ${pageId.slice(0, 8)}...`);
    return cached;
  }
  
  // Check for ongoing request (deduplication)
  if (requestCache.has(cacheKey)) {
    console.log(`🔄 Request deduplication: Page ${pageId.slice(0, 8)}...`);
    return await requestCache.get(cacheKey)!;
  }
  
  // Create new request
  const requestPromise = fetchNotionPage(pageId);
  requestCache.set(cacheKey, requestPromise);
  
  try {
    const result = await requestPromise;
    if (result) {
      // Cache successful results for 10 minutes (longer for individual pages)
      pageCache.set(cacheKey, result, 10);
      console.log(`💾 Cached page: ${pageId.slice(0, 8)}...`);
    }
    return result;
  } finally {
    requestCache.delete(cacheKey);
  }
}

// Optimized server-side markdown processing
async function optimizedServerMarkdownConversion(pageId: string): Promise<string> {
  const timer = new PerformanceTimer(`Server Markdown ${pageId.slice(0, 8)}`);
  
  try {
    const n2m = await createOptimizedNotionToMd();
    
    const mdblocks = await withTimeout(
      n2m.pageToMarkdown(pageId), 
      15000, // 15 seconds max for markdown conversion
      'Server markdown conversion'
    );
    
    const mdString = n2m.toMarkdownString(mdblocks);
    timer.end();
    
    return mdString.parent;
  } catch (error) {
    timer.end();
    console.error(`❌ Server markdown conversion failed for ${pageId.slice(0, 8)}: ${error.message}`);
    throw error;
  }
}

// Internal page fetching function
async function fetchNotionPage(pageId: string): Promise<any> {
  const isServer = typeof window === 'undefined';
  
  if (isServer) {
    // Server-side: Optimized direct Notion API calls with queuing
    return requestQueue.add(async () => {
      const timer = new PerformanceTimer(`Server Page ${pageId.slice(0, 8)}`);
      
      try {
        // Use Promise.allSettled for graceful partial failure handling
        const [markdownResult, pageResult] = await Promise.allSettled([
          optimizedServerMarkdownConversion(pageId),
          withTimeout(
            createOptimizedNotionClient().then(notion => 
              notion.pages.retrieve({ page_id: pageId })
            ),
            8000, // 8 seconds for page metadata
            'Server page metadata'
          )
        ]);
        
        const stats = requestQueue.stats;
        console.log(`🎯 Request queue: ${stats.queued} queued, ${stats.running} running`);
        
        // Handle partial failures gracefully
        const markdown = markdownResult.status === 'fulfilled' ? markdownResult.value : '';
        const page = pageResult.status === 'fulfilled' ? pageResult.value : null;
        
        if (markdownResult.status === 'rejected') {
          console.warn(`⚠️  Server markdown failed: ${markdownResult.reason.message}`);
        }
        
        if (pageResult.status === 'rejected') {
          console.warn(`⚠️  Server page metadata failed: ${pageResult.reason.message}`);
        }
        
        timer.end();
        
        return {
          markdown,
          page,
          partial: markdownResult.status === 'rejected' || pageResult.status === 'rejected'
        };
      } catch (error) {
        timer.end();
        console.error(`❌ Server page fetch failed for ${pageId.slice(0, 8)}: ${error.message}`);
        throw error;
      }
    });
  } else {
    // Client-side: Optimized API route with timeout
    const timer = new PerformanceTimer(`Client Page ${pageId.slice(0, 8)}`);
    
    try {
      const baseUrl = window.location.origin;
      const response = await withTimeout(
        fetch(`${baseUrl}/api/notion?type=page&pageId=${pageId}`),
        20000, // 20 second timeout for client requests (longer because includes markdown)
        'Client page fetch'
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      timer.end();
      return data.data;
    } catch (error) {
      timer.end();
      console.error(`❌ Client page fetch failed for ${pageId.slice(0, 8)}: ${error.message}`);
      return null;
    }
  }
}

// Utility functions for extracting page information
export function getNotionPageTitle(page: any): string {
  try {
    const properties = page.properties || {};
    const titleProperty = Object.values(properties).find(
      (prop: any) => prop.type === "title"
    ) as any;
    
    if (titleProperty?.title?.[0]?.plain_text) {
      return titleProperty.title[0].plain_text;
    }
    
    // Fallback to Name property
    if (properties.Name?.title?.[0]?.plain_text) {
      return properties.Name.title[0].plain_text;
    }
    
    // Another fallback
    if (properties.Title?.title?.[0]?.plain_text) {
      return properties.Title.title[0].plain_text;
    }
    
    return "Untitled";
  } catch (error) {
    console.error("Error extracting title:", error);
    return "Untitled";
  }
}

export function getNotionPageDescription(page: any): string {
  try {
    const properties = page.properties || {};
    
    // Look for description or summary property
    const descProperty = properties.Description?.rich_text?.[0]?.plain_text ||
                        properties.Summary?.rich_text?.[0]?.plain_text ||
                        properties.Excerpt?.rich_text?.[0]?.plain_text;
    
    return descProperty || "";
  } catch (error) {
    console.error("Error extracting description:", error);
    return "";
  }
}

export function getNotionPageDate(page: any): string {
  try {
    const createdTime = page.created_time;
    if (createdTime) {
      return new Date(createdTime).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return "";
  } catch (error) {
    console.error("Error extracting date:", error);
    return "";
  }
}

export function getNotionPageTags(page: any): { id: string; name: string; color: string }[] {
  try {
    const tagsProperty = page?.properties?.Tags; // Assumes your property is named "Tags"
    if (tagsProperty?.type === 'multi_select') {
      return tagsProperty.multi_select.map((tag: any) => ({
        id: tag.id,
        name: tag.name,
        color: tag.color,
      }));
    }
    return [];
  } catch (error) {
    console.error('Error extracting tags:', error);
    return [];
  }
}