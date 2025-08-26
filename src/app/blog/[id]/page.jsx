import { notFound } from "next/navigation";
import { getNotionPage, getNotionPageTitle, getNotionPageDate, getNotionPageDescription } from "../../../lib/notion";
import BlogPostClient from "./BlogPostClient";

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  try {
    const postContent = await getNotionPage(params.id);
    
    if (!postContent || !postContent.page) {
      return {
        title: 'Blog Post Not Found',
        description: 'The requested blog post could not be found.',
      };
    }

    const post = postContent.page;
    const title = getNotionPageTitle(post);
    const description = getNotionPageDescription(post) || `Read "${title}" on Ashwin's blog - insights from my Notion command center.`;
    const publishedDate = post.created_time;
    const modifiedDate = post.last_edited_time;

    return {
      title: `${title} | Ashwin's Blog`,
      description: description,
      keywords: [
        'blog',
        'technology',
        'development',
        'insights',
        'notion',
        'programming',
        ...(post.properties?.Tags?.multi_select?.map(tag => tag.name) || [])
      ],
      authors: [{ name: 'Ashwin Rachha' }],
      creator: 'Ashwin Rachha',
      publisher: 'Ashwin Rachha',
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      openGraph: {
        title: title,
        description: description,
        url: `/blog/${params.id}`,
        siteName: "Ashwin's Portfolio",
        locale: 'en_US',
        type: 'article',
        publishedTime: publishedDate,
        modifiedTime: modifiedDate,
        authors: ['Ashwin Rachha'],
        section: 'Technology',
        tags: post.properties?.Tags?.multi_select?.map(tag => tag.name) || [],
      },
      twitter: {
        card: 'summary_large_image',
        title: title,
        description: description,
        creator: '@ashwinrachha',
        site: '@ashwinrachha',
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog Post | Ashwin\'s Portfolio',
      description: 'Read insights and thoughts from Ashwin\'s blog.',
    };
  }
}

// Server component that fetches data
export default async function BlogPost({ params }) {
  try {
    const postContent = await getNotionPage(params.id);
    
    if (!postContent) {
      notFound();
    }

    // Pass the fetched data to the client component
    return <BlogPostClient postContent={postContent} postId={params.id} />;
    
  } catch (error) {
    console.error('Error fetching blog post:', error);
    notFound();
  }
}

// Generate static params for popular posts (for static generation)
export async function generateStaticParams() {
  try {
    // Only pre-generate in production to avoid long build times in development
    if (process.env.NODE_ENV !== 'production') {
      return [];
    }

    // Fetch posts for static generation (server-side version)
    const { Client } = await import('@notionhq/client');
    
    if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
      console.log('Notion credentials not found, skipping static generation');
      return [];
    }
    
    const notion = new Client({ auth: process.env.NOTION_API_KEY });
    
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      sorts: [
        {
          timestamp: "created_time",
          direction: "descending",
        },
      ],
      page_size: 10, // Pre-generate only the 10 most recent posts
    });

    return response.results
      .filter(page => {
        // Basic filtering similar to client-side
        const properties = page.properties || {};
        const titleProperty = Object.values(properties).find(
          (prop) => prop.type === "title"
        );
        
        const title = titleProperty?.title?.[0]?.plain_text || "Untitled";
        
        return title && 
               title !== 'Untitled' && 
               !title.startsWith('http://') && 
               !title.startsWith('https://') &&
               title.trim().length > 2;
      })
      .slice(0, 5) // Pre-generate top 5 posts only
      .map((post) => ({
        id: post.id,
      }));
      
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}