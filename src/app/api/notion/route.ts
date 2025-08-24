import { Client } from '@notionhq/client';
import { NotionAPI } from 'notion-client';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Notion clients
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const notionClient = new NotionAPI();

// GET /api/notion - Fetch Notion database entries
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'database';
    const pageId = searchParams.get('pageId');

    if (type === 'database' && process.env.NOTION_DATABASE_ID) {
      // Fetch database entries without sorting (to avoid property name issues)
      const response = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID,
        page_size: 50, // Limit results
      });

      return NextResponse.json({
        success: true,
        data: response.results,
      });
    } else if (type === 'page' && pageId) {
      // Fetch specific page content for rendering
      try {
        console.log('Fetching page content for:', pageId);
        
        // Try to get full page content with reduced timeout for better UX
        const recordMapPromise = notionClient.getPage(pageId);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 3000)
        );
        
        const recordMap = await Promise.race([recordMapPromise, timeoutPromise]);
        
        console.log('Successfully fetched full page content');
        return NextResponse.json({
          success: true,
          data: recordMap,
        });
      } catch (pageError) {
        console.error('Error fetching full page content, falling back:', pageError.message);
        
        // Optimized fallback: parallel requests for better speed
        try {
          const [pageInfo, blocks] = await Promise.all([
            notion.pages.retrieve({ page_id: pageId }),
            notion.blocks.children.list({ 
              block_id: pageId,
              page_size: 50 // Reduced from 100 for faster initial load
            })
          ]);
          
          // Only fetch children for first few blocks to speed up initial load
          const priorityBlocks = blocks.results.slice(0, 10);
          const remainingBlocks = blocks.results.slice(10);
          
          // Fetch children only for priority blocks
          const enhancedPriorityBlocks = await Promise.all(
            priorityBlocks.map(async (block) => {
              if (block.has_children) {
                try {
                  const children = await notion.blocks.children.list({ 
                    block_id: block.id,
                    page_size: 20 // Reduced for speed
                  });
                  return {
                    ...block,
                    children: children.results
                  };
                } catch (childError) {
                  console.warn('Could not fetch children for block:', block.id);
                  return block;
                }
              }
              return block;
            })
          );
          
          // Combine priority blocks (with children) and remaining blocks (without children for now)
          const allBlocks = [...enhancedPriorityBlocks, ...remainingBlocks];
          
          console.log('Optimized fallback successful');
          return NextResponse.json({
            success: true,
            data: {
              page: pageInfo,
              blocks: allBlocks,
            },
            fallback: true,
          });
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
          return NextResponse.json({
            success: false,
            error: 'Failed to fetch page content',
          }, { status: 500 });
        }
      }
    }

    return NextResponse.json(
      { success: false, error: 'Missing required parameters' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Notion API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch Notion data' },
      { status: 500 }
    );
  }
}

// POST /api/notion - Create new Notion page (optional)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, properties } = body;

    if (!process.env.NOTION_DATABASE_ID) {
      return NextResponse.json(
        { success: false, error: 'Database ID not configured' },
        { status: 400 }
      );
    }

    const response = await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_ID },
      properties: {
        Title: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
        ...properties,
      },
    });

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Notion Creation Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create Notion page' },
      { status: 500 }
    );
  }
}
