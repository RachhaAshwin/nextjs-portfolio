import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { NextResponse } from "next/server";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const n2m = new NotionToMarkdown({ notionClient: notion });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const pageId = searchParams.get("pageId");

  try {
    if (type === "database") {
      const databaseId = process.env.NOTION_DATABASE_ID!;
      
      // Filter to only show items from the "Blogs" lane/status
      const response = await notion.databases.query({
        database_id: databaseId,
        filter: {
          property: "Status", // The name of your Status column in Notion
          select: {
            equals: "Blogs", // Only items in the "Blogs" lane
          },
        },
        sorts: [
          {
            timestamp: "created_time",
            direction: "descending",
          },
        ],
        page_size: 100, // Get blog posts efficiently
      });
      
      return NextResponse.json({ success: true, data: response.results });
    }

    if (type === "page" && pageId) {
      const mdblocks = await n2m.pageToMarkdown(pageId);
      const mdString = n2m.toMarkdownString(mdblocks);
      const pageResponse = await notion.pages.retrieve({ page_id: pageId });

      return NextResponse.json({
        success: true,
        data: {
          markdown: mdString.parent,
          page: pageResponse,
        },
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Notion API error:", error);
    
    // Handle specific Notion API errors with helpful messages
    if (error.code === 'unauthorized') {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid Notion API token. Please check your NOTION_API_KEY in .env.local",
          details: "Make sure you've copied the correct integration token from notion.so/my-integrations"
        },
        { status: 401 }
      );
    }
    
    if (error.code === 'object_not_found') {
      return NextResponse.json(
        { 
          success: false, 
          error: "Database not found. Please check your NOTION_DATABASE_ID in .env.local",
          details: "Make sure the database ID is correct and you've shared the database with your integration"
        },
        { status: 404 }
      );
    }
    
    if (error.code === 'validation_error') {
      return NextResponse.json(
        { 
          success: false, 
          error: "Database schema issue",
          details: error.message || "The database structure might not match what's expected"
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch from Notion API",
        details: error.message || "Unknown error occurred"
      },
      { status: 500 }
    );
  }
}