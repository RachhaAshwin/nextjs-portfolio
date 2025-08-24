// Utility functions for Notion integration

export interface NotionPage {
  id: string;
  title: string;
  url: string;
  created_time: string;
  last_edited_time: string;
  properties: any;
}

export interface NotionDatabase {
  results: NotionPage[];
}

// Convert Notion blocks to Markdown
export function blocksToMarkdown(blocks: any[]): string {
  if (!blocks || blocks.length === 0) return '';
  
  return blocks.map(blockToMarkdown).filter(Boolean).join('\n\n');
}

function blockToMarkdown(block: any, depth = 0): string {
  if (!block || !block.type) return '';
  
  const type = block.type;
  const data = block[type] || {};
  const indent = '  '.repeat(depth);
  
  switch (type) {
    case 'paragraph':
      return richTextToMarkdown(data.rich_text);
      
    case 'heading_1':
      return `# ${richTextToMarkdown(data.rich_text)}`;
      
    case 'heading_2':
      return `## ${richTextToMarkdown(data.rich_text)}`;
      
    case 'heading_3':
      return `### ${richTextToMarkdown(data.rich_text)}`;
      
    case 'bulleted_list_item':
      const bulletContent = richTextToMarkdown(data.rich_text);
      const childItems = block.children?.map((child: any) => 
        blockToMarkdown(child, depth + 1)
      ).filter(Boolean).join('\n') || '';
      
      return `${indent}- ${bulletContent}${childItems ? '\n' + childItems : ''}`;
      
    case 'numbered_list_item':
      const numberedContent = richTextToMarkdown(data.rich_text);
      const numberedChildItems = block.children?.map((child: any) => 
        blockToMarkdown(child, depth + 1)
      ).filter(Boolean).join('\n') || '';
      
      return `${indent}1. ${numberedContent}${numberedChildItems ? '\n' + numberedChildItems : ''}`;
      
    case 'code':
      const language = data.language || 'text';
      const codeText = richTextToMarkdown(data.rich_text);
      return `\`\`\`${language}\n${codeText}\n\`\`\``;
      
    case 'quote':
      return `> ${richTextToMarkdown(data.rich_text)}`;
      
    case 'callout':
      const icon = data.icon?.emoji || '💡';
      const calloutText = richTextToMarkdown(data.rich_text);
      return `> ${icon} **Note:** ${calloutText}`;
      
    case 'divider':
      return '---';
      
    case 'image':
      const imageUrl = data.file?.url || data.external?.url;
      const caption = richTextToMarkdown(data.caption);
      return imageUrl ? `![${caption || ''}](${imageUrl})` : '';
      
    case 'bookmark':
      const bookmarkUrl = data.url;
      const bookmarkCaption = richTextToMarkdown(data.caption);
      return bookmarkUrl ? `[🔗 ${bookmarkCaption || bookmarkUrl}](${bookmarkUrl})` : '';
      
    case 'to_do':
      const isChecked = data.checked;
      const todoText = richTextToMarkdown(data.rich_text);
      return `${indent}- [${isChecked ? 'x' : ' '}] ${todoText}`;
      
    case 'toggle':
      const toggleText = richTextToMarkdown(data.rich_text);
      const toggleChildren = block.children?.map((child: any) => 
        blockToMarkdown(child, depth + 1)
      ).filter(Boolean).join('\n') || '';
      
      return `<details>\n<summary>${toggleText}</summary>\n\n${toggleChildren}\n</details>`;
      
    default:
      // Handle unknown block types gracefully
      if (data.rich_text && data.rich_text.length > 0) {
        return richTextToMarkdown(data.rich_text);
      }
      return `<!-- Unsupported block type: ${type} -->`;
  }
}

function richTextToMarkdown(richText: any[]): string {
  if (!richText || richText.length === 0) return '';
  
  return richText.map((text) => {
    if (!text) return '';
    
    let content = text.plain_text || '';
    const annotations = text.annotations || {};
    
    // Apply formatting
    if (annotations.bold) content = `**${content}**`;
    if (annotations.italic) content = `*${content}*`;
    if (annotations.strikethrough) content = `~~${content}~~`;
    if (annotations.code) content = `\`${content}\``;
    if (annotations.underline) content = `<u>${content}</u>`;
    
    // Handle links
    if (text.href) {
      content = `[${content}](${text.href})`;
    }
    
    return content;
  }).join('');
}

// Fetch database entries
export async function getNotionDatabase(): Promise<NotionPage[]> {
  try {
    const response = await fetch('/api/notion?type=database', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch Notion database');
    }

    return data.data || [];
  } catch (error) {
    console.error('Error fetching Notion database:', error);
    return [];
  }
}

// Simple in-memory cache for page content
const pageCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const requestCache = new Map<string, Promise<any>>(); // Deduplication cache

// Fetch specific page content with caching and deduplication
export async function getNotionPage(pageId: string): Promise<any> {
  // Check if request is already in progress
  if (requestCache.has(pageId)) {
    return requestCache.get(pageId);
  }

  // Check cache first
  const cached = pageCache.get(pageId);
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    return cached.data;
  }

  // Create and cache the promise to prevent duplicate requests
  const fetchPromise = fetchPageContent(pageId);
  requestCache.set(pageId, fetchPromise);

  try {
    const result = await fetchPromise;
    
    // Cache successful results
    if (result) {
      pageCache.set(pageId, {
        data: result,
        timestamp: Date.now()
      });
    }
    
    return result;
  } finally {
    // Remove from request cache when done
    requestCache.delete(pageId);
  }
}

// Internal function to actually fetch content
async function fetchPageContent(pageId: string): Promise<any> {
  try {
    const response = await fetch(`/api/notion?type=page&pageId=${pageId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch Notion page');
    }

    // Handle both normal recordMap and fallback structure
    if (data.fallback) {
      return {
        ...data.data,
        fallback: true
      };
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetching Notion page:', error);
    return null;
  }
}

// Extract title from Notion page properties
export function getNotionPageTitle(page: any): string {
  try {
    const properties = page.properties || {};
    
    // First, try to find any property with type 'title' (this is the most reliable)
    for (const [key, property] of Object.entries(properties)) {
      const prop = property as any;
      if (prop.type === 'title' && prop.title && prop.title.length > 0) {
        const titleText = prop.title[0]?.plain_text || prop.title[0]?.text?.content;
        if (titleText && titleText.trim() !== '') {
          return titleText.trim();
        }
      }
    }
    
    // Fallback: try common property names
    const possibleTitleKeys = ['Title', 'Name', 'title', 'name', 'Page'];
    for (const key of possibleTitleKeys) {
      if (properties[key]) {
        const prop = properties[key] as any;
        if (prop.title && prop.title.length > 0) {
          const titleText = prop.title[0]?.plain_text || prop.title[0]?.text?.content;
          if (titleText && titleText.trim() !== '') {
            return titleText.trim();
          }
        }
        // Also try rich_text properties that might be used as titles
        if (prop.rich_text && prop.rich_text.length > 0) {
          const titleText = prop.rich_text[0]?.plain_text || prop.rich_text[0]?.text?.content;
          if (titleText && titleText.trim() !== '') {
            return titleText.trim();
          }
        }
      }
    }
    
    // Try to extract from URL if it looks like a readable slug
    if (page.url && typeof page.url === 'string') {
      const urlParts = page.url.split('/').pop();
      if (urlParts && !urlParts.includes('-') && urlParts.length > 10) {
        // Skip if it looks like a UUID
        return 'Untitled';
      } else if (urlParts && urlParts.includes('-')) {
        // Try to make a readable title from URL slug
        const readableTitle = urlParts
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
          .replace(/^\d+\s*/, ''); // Remove leading numbers
        if (readableTitle.length > 3) {
          return readableTitle;
        }
      }
    }
    
    // Last resort: try to get the page title from the page object itself
    if (page.title && typeof page.title === 'string') {
      return page.title;
    }
    
    // If we have an object title
    if (page.title && Array.isArray(page.title) && page.title.length > 0) {
      const titleText = page.title[0]?.plain_text || page.title[0]?.text?.content;
      if (titleText) {
        return titleText;
      }
    }
    
    return 'Untitled';
  } catch (error) {
    console.error('Error extracting title:', error, page);
    return 'Untitled';
  }
}

// Extract plain text from Notion rich text
export function getNotionRichText(richText: any[]): string {
  try {
    if (!richText || !Array.isArray(richText)) {
      return '';
    }
    
    return richText
      .map((text) => {
        // Handle different rich text formats
        if (text.plain_text) {
          return text.plain_text;
        }
        if (text.text && text.text.content) {
          return text.text.content;
        }
        if (typeof text === 'string') {
          return text;
        }
        return '';
      })
      .filter(Boolean)
      .join('');
  } catch (error) {
    console.error('Error extracting rich text:', error);
    return '';
  }
}

// Extract description from various possible property types
export function getNotionPageDescription(page: any): string {
  try {
    const properties = page.properties || {};
    
    // Try different possible description property names
    const possibleDescKeys = ['Description', 'Content', 'Summary', 'description', 'content', 'summary', 'Abstract', 'Excerpt'];
    
    for (const key of possibleDescKeys) {
      if (properties[key]) {
        const prop = properties[key] as any;
        
        // Rich text property
        if (prop.type === 'rich_text' && prop.rich_text) {
          const text = getNotionRichText(prop.rich_text);
          if (text && text.trim() !== '') {
            return text.trim();
          }
        }
        
        // Text property (fallback)
        if (prop.rich_text) {
          const text = getNotionRichText(prop.rich_text);
          if (text && text.trim() !== '') {
            return text.trim();
          }
        }
        
        // Plain text property
        if (typeof prop.text === 'string' && prop.text.trim() !== '') {
          return prop.text.trim();
        }
      }
    }
    
    return '';
  } catch (error) {
    console.error('Error extracting description:', error);
    return '';
  }
}

// Format Notion date
export function formatNotionDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

// Extract any date from Notion page (created_time, last_edited_time, or date properties)
export function getNotionPageDate(page: any): string {
  try {
    // Try different date sources
    if (page.created_time) {
      return formatNotionDate(page.created_time);
    }
    if (page.last_edited_time) {
      return formatNotionDate(page.last_edited_time);
    }
    
    // Try to find date properties
    const properties = page.properties || {};
    for (const [key, property] of Object.entries(properties)) {
      if ((property as any)?.type === 'created_time' && (property as any)?.created_time) {
        return formatNotionDate((property as any).created_time);
      }
      if ((property as any)?.type === 'date' && (property as any)?.date?.start) {
        return formatNotionDate((property as any).date.start);
      }
    }
    
    return 'No date available';
  } catch (error) {
    console.error('Error extracting date:', error);
    return 'No date available';
  }
}
