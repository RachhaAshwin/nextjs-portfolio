export interface NotionPage {
  id: string;
  title: string;
  url: string;
  created_time: string;
  last_edited_time: string;
  properties: any;
}

export async function getNotionDatabase(): Promise<NotionPage[]> {
  try {
    const response = await fetch('/api/notion?type=database');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    if (data.success) {
      return data.data || [];
    } else {
      throw new Error(data.error || 'Failed to fetch database');
    }
  } catch (error) {
    console.error("Error fetching Notion database:", error);
    return [];
  }
}

export async function getNotionPage(pageId: string): Promise<any> {
  try {
    const response = await fetch(`/api/notion?type=page&pageId=${pageId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.error || 'Failed to fetch page');
    }
  } catch (error) {
    console.error("Error fetching Notion page:", error);
    return null;
  }
}

// Utility functions for extracting page information
export function getNotionPageTitle(page: any): string {
  try {
    const properties = page.properties || {};
    
    // Look for title property
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

export function getNotionPageTags(page: any): string[] {
  try {
    const properties = page.properties || {};
    const tagsProperty = properties.Tags?.multi_select || properties.Categories?.multi_select || [];
    return tagsProperty.map((tag: any) => tag.name) || [];
  } catch (error) {
    console.error("Error extracting tags:", error);
    return [];
  }
}