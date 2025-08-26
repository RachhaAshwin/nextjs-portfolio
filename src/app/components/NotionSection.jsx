"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NotionCard from "./notion/NotionCard";
import NotionRenderer from "./notion/NotionRenderer";
import { getNotionDatabase, getNotionPage, getNotionPageTitle, getNotionPageDate } from "../../lib/notion";

const NotionSection = () => {
  const [notionPages, setNotionPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [selectedPageContent, setSelectedPageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preloadedContent, setPreloadedContent] = useState(new Map());

  // Fetch Notion database on component mount
  useEffect(() => {
    const fetchNotionData = async () => {
      try {
        setLoading(true);
        const pages = await getNotionDatabase();
        
        if (pages && pages.length > 0) {
          // Filter for blog-worthy content
          const blogContent = pages.filter(page => {
            const status = page.properties?.Status?.select?.name;
            const title = getNotionPageTitle(page);
            
            // Filter criteria for blog-worthy content:
            // 1. Has a proper title (not just a URL)
            // 2. Is in blog-appropriate status categories
            // 3. Title is not empty or "Untitled"
            const hasProperTitle = title && 
                                  title !== 'Untitled' && 
                                  !title.startsWith('http://') && 
                                  !title.startsWith('https://') &&
                                  title.trim().length > 2;
            
            const isBloglikes = status && [
              'Blogs', 
              'Daily Learnings', 
              'Projects',
              'Done',
              'Musings'
            ].includes(status);
            
            return hasProperTitle && (isBloglikes || !status);
          });
          
          setNotionPages(blogContent);
          setError(null);
        } else {
          setError('No content found in Notion database');
          setNotionPages([]);
        }
      } catch (err) {
        console.error('Error fetching Notion data:', err);
        setError('Failed to load content from Notion');
        setNotionPages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotionData();
  }, []);

  // Preload content on hover for instant display
  const handleCardHover = async (page) => {
    if (!preloadedContent.has(page.id)) {
      try {
        const pageContent = await getNotionPage(page.id);
        if (pageContent) {
          setPreloadedContent(prev => new Map(prev.set(page.id, pageContent)));
        }
      } catch (err) {
        console.log('Preload failed for page:', page.id, err);
      }
    }
  };

  // Handle page selection with preloaded content
  const handlePageClick = async (page) => {
    try {
      setSelectedPage(page);
      
      // Check if content is already preloaded
      const preloaded = preloadedContent.get(page.id);
      if (preloaded) {
        setSelectedPageContent(preloaded);
        return; // No loading state needed!
      }
      
      // Otherwise, fetch with loading state
      setContentLoading(true);
      const pageContent = await getNotionPage(page.id);
      setSelectedPageContent(pageContent);
    } catch (err) {
      console.error('Error fetching page content:', err);
      setError('Failed to load page content');
    } finally {
      setContentLoading(false);
    }
  };

  // Handle demo page selection
  const handleDemoPageClick = (page) => {
    setSelectedPage(page);
    setContentLoading(true);
    
    // Simulate loading delay for realism
    setTimeout(() => {
      setSelectedPageContent({
        fallback: true,
        page: page,
        blocks: [{
          type: 'paragraph',
          paragraph: {
            rich_text: [{ plain_text: page.demoMarkdown }]
          }
        }],
        demoMarkdown: page.demoMarkdown
      });
      setContentLoading(false);
    }, 800);
  };

  // Close page view
  const handleClosePageView = () => {
    setSelectedPage(null);
    setSelectedPageContent(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  if (loading) {
    return (
      <section id="notion-content" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <p className="text-[#ADB7BE] mt-4">Loading content from Notion...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    // Show demo content with realistic markdown examples
    const demoPages = [
      {
        id: 'demo-1',
        created_time: '2024-01-15T10:00:00.000Z',
        properties: {
          Title: { 
            type: 'title',
            title: [{ 
              plain_text: 'Building Scalable AI Systems',
              text: { content: 'Building Scalable AI Systems' }
            }] 
          },
          Description: { 
            type: 'rich_text',
            rich_text: [{ 
              plain_text: 'Exploring best practices for developing and deploying large-scale AI applications with focus on performance, reliability, and maintainability.',
              text: { content: 'Exploring best practices for developing and deploying large-scale AI applications with focus on performance, reliability, and maintainability.' }
            }] 
          },
          Tags: { 
            type: 'multi_select',
            multi_select: [
              { name: 'AI', color: 'blue' }, 
              { name: 'Engineering', color: 'green' }, 
              { name: 'Scalability', color: 'purple' }
            ]
          }
        },
        demoMarkdown: `# Building Scalable AI Systems

## Introduction

When deploying AI systems at scale, several key considerations become critical:

- **Performance optimization**
- **Resource management** 
- **Monitoring and observability**
- **Fault tolerance**

## Architecture Patterns

### Microservices Architecture

\`\`\`python
# Example service structure
class ModelService:
    def __init__(self, model_path):
        self.model = load_model(model_path)
        self.cache = RedisCache()
    
    async def predict(self, inputs):
        # Check cache first
        cached_result = await self.cache.get(inputs.hash())
        if cached_result:
            return cached_result
        
        # Run prediction
        result = self.model.predict(inputs)
        await self.cache.set(inputs.hash(), result, ttl=3600)
        return result
\`\`\`

### Key Benefits

1. **Independent scaling** - Scale components based on demand
2. **Fault isolation** - Failures don't cascade 
3. **Technology diversity** - Use best tool for each job

> 💡 **Pro Tip:** Always implement circuit breakers between services to prevent cascade failures.

## Monitoring Strategy

Monitor these key metrics:

| Metric | Importance | Alert Threshold |
|--------|------------|-----------------|
| Latency | High | > 500ms |
| Error Rate | Critical | > 1% |
| Memory Usage | Medium | > 80% |
| Queue Depth | High | > 1000 |

---

## Conclusion

Building scalable AI systems requires careful planning around architecture, monitoring, and deployment strategies. Start simple and scale incrementally.`
      },
      {
        id: 'demo-2',
        created_time: '2024-01-10T14:30:00.000Z',
        properties: {
          Title: { 
            type: 'title',
            title: [{ 
              plain_text: 'Next.js and Notion Integration',
              text: { content: 'Next.js and Notion Integration' }
            }] 
          },
          Description: { 
            type: 'rich_text',
            rich_text: [{ 
              plain_text: 'A complete guide to integrating Notion as a CMS for your Next.js portfolio, including API setup, authentication, and rendering.',
              text: { content: 'A complete guide to integrating Notion as a CMS for your Next.js portfolio, including API setup, authentication, and rendering.' }
            }] 
          },
          Tags: { 
            type: 'multi_select',
            multi_select: [
              { name: 'Next.js', color: 'orange' }, 
              { name: 'Notion', color: 'gray' }, 
              { name: 'CMS', color: 'yellow' }
            ]
          }
        },
        demoMarkdown: `# Next.js and Notion Integration

Transform your portfolio with **dynamic content management** using Notion as your CMS.

## Why Use Notion as a CMS?

- ✅ **Familiar interface** - Write content like you normally would
- ✅ **Rich formatting** - Support for all Notion block types  
- ✅ **Real-time updates** - Content changes reflect immediately
- ✅ **Collaborative** - Team members can contribute easily

## Quick Setup Guide

### 1. Create Notion Integration

Visit [Notion Integrations](https://notion.so/my-integrations) and create a new integration.

### 2. Environment Variables

\`\`\`bash
# .env.local
NOTION_TOKEN=secret_...
NOTION_DATABASE_ID=your-database-id
\`\`\`

### 3. Install Dependencies

\`\`\`bash
npm install @notionhq/client react-notion-x
\`\`\`

### 4. Basic Implementation

\`\`\`javascript
import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export async function getNotionPages() {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
  });
  
  return response.results;
}
\`\`\`

## Advanced Features

### Custom Block Rendering

You can customize how different Notion blocks render:

\`\`\`jsx
<NotionRenderer
  recordMap={recordMap}
  components={{
    code: ({ block }) => (
      <SyntaxHighlighter language={block.language}>
        {block.code}
      </SyntaxHighlighter>
    ),
  }}
/>
\`\`\`

### SEO Optimization

> 🚀 **Important:** Always extract metadata from Notion properties for optimal SEO performance.

## Common Pitfalls

1. **Rate limiting** - Implement proper caching
2. **Large datasets** - Use pagination 
3. **Image optimization** - Compress Notion images

---

*This integration powers the very section you're reading! Meta, right?* 🎯`
      },
      {
        id: 'demo-3',
        created_time: '2024-01-05T09:15:00.000Z',
        properties: {
          Title: { 
            type: 'title',
            title: [{ 
              plain_text: 'Machine Learning in Production',
              text: { content: 'Machine Learning in Production' }
            }] 
          },
          Description: { 
            type: 'rich_text',
            rich_text: [{ 
              plain_text: 'Real-world insights from deploying ML models at scale, covering monitoring, versioning, and CI/CD practices.',
              text: { content: 'Real-world insights from deploying ML models at scale, covering monitoring, versioning, and CI/CD practices.' }
            }] 
          },
          Tags: { 
            type: 'multi_select',
            multi_select: [
              { name: 'ML', color: 'red' }, 
              { name: 'Production', color: 'blue' }, 
              { name: 'DevOps', color: 'green' }
            ]
          }
        },
        demoMarkdown: `# Machine Learning in Production

## The Reality Check

Moving from Jupyter notebooks to production systems is where **most ML projects fail**. Here's what I learned scaling ML models to millions of users.

### Key Challenges

- Model drift and degradation over time
- Data quality issues in production
- Latency and throughput requirements  
- Version management and rollbacks

## Monitoring Strategy

### Model Performance Metrics

\`\`\`python
# Essential metrics to track
metrics = {
    "accuracy": model_accuracy,
    "latency_p95": response_time_95th_percentile,
    "prediction_drift": feature_drift_score,
    "data_quality": data_validation_score
}

# Alert on significant changes
if accuracy_drop > 0.05:
    send_alert("Model performance degraded")
\`\`\`

### Business Impact Tracking

Track how model predictions affect business KPIs:

- **Conversion rates** - Are predictions helping users convert?
- **User engagement** - Do recommendations increase activity?
- **Revenue impact** - Direct correlation to business outcomes

## Deployment Patterns

### Blue-Green Deployments

> **Best Practice:** Always deploy new models alongside existing ones for comparison.

### A/B Testing Framework

\`\`\`yaml
# Experiment configuration
experiment:
  name: "recommendation_model_v2"
  traffic_split: 
    control: 90%    # Current model
    treatment: 10%  # New model
  
  success_metrics:
    - click_through_rate
    - conversion_rate
    - user_satisfaction
\`\`\`

## Lessons Learned

1. **Start with simple models** - Complex isn't always better
2. **Invest in data pipelines** - Garbage in, garbage out
3. **Monitor everything** - You can't improve what you don't measure
4. **Plan for failure** - Models will drift, be ready

### The Human Factor

Remember: ML models are tools to augment human decision-making, not replace it entirely. 

**Always keep humans in the loop** for critical decisions.

---

*Building production ML systems is 20% machine learning and 80% engineering.* 🔧`
      }
    ];

    return (
      <section id="notion-content" className="py-16">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Latest from Notion
            </h2>
            <p className="text-[#ADB7BE] text-lg max-w-2xl mx-auto mb-4">
              Dynamic content powered by Notion - blogs, thoughts, and updates 
              managed seamlessly and displayed beautifully.
            </p>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 max-w-lg mx-auto">
              <p className="text-yellow-300 text-sm">
                🚀 <strong>Demo Mode:</strong> Configure your Notion integration to see your real content here!
              </p>
            </div>
          </motion.div>

          {/* Demo Content Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {demoPages.map((page, index) => (
              <NotionCard
                key={page.id}
                page={page}
                index={index}
                onClick={() => handleDemoPageClick(page)}
              />
            ))}
          </div>

          {/* Setup Instructions */}
          <motion.div 
            className="text-center mt-12 bg-[#1a1a1a] border border-[#33353F] rounded-xl p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-xl font-bold text-foreground mb-4">Ready to connect your Notion?</h3>
            <div className="text-muted-foreground space-y-2">
              <p>1. Create a Notion integration at <code className="text-primary">notion.so/my-integrations</code></p>
              <p>2. Add your <code className="text-primary">NOTION_TOKEN</code> and <code className="text-primary">NOTION_DATABASE_ID</code> to <code className="text-primary">.env.local</code></p>
              <p>3. Share your Notion database with the integration</p>
              <p>4. Restart your dev server and see your content here!</p>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="notion-content" className="py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="container mx-auto px-4"
        >
          {/* Section Header */}
          <motion.div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              From My Command Center
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Curated content from my Notion workspace - technical blogs, project insights, 
              and learning documentation, all dynamically sourced and beautifully displayed.
            </p>
          </motion.div>

          {/* Content Grid */}
          {notionPages.length === 0 && !loading ? (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-muted-foreground mb-4">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No content available</h3>
              <p className="text-muted-foreground">
                Add some pages to your Notion database to see them here.
              </p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {notionPages.slice(0, 6).map((page, index) => (
                <div
                  key={page.id}
                  onMouseEnter={() => handleCardHover(page)}
                  className="transform transition-all duration-200 hover:scale-105"
                >
                  <NotionCard
                    page={page}
                    index={index}
                    onClick={handlePageClick}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Show more button if there are many pages */}
          {notionPages.length > 6 && (
            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <button className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                View All ({notionPages.length} total)
              </button>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Page Content Modal */}
      <AnimatePresence>
        {selectedPage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
            onClick={handleClosePageView}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#121212] rounded-xl max-w-4xl max-h-[90vh] w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#33353F]">
                <h2 className="text-xl font-bold text-white">
                  Notion Content
                </h2>
                <button
                  onClick={handleClosePageView}
                  className="text-[#ADB7BE] hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
                {contentLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                    <span className="ml-4 text-[#ADB7BE]">Loading content...</span>
                    <div className="mt-2 text-xs text-[#6B7280]">
                      First load may take a moment. Subsequent loads will be instant!
                    </div>
                  </div>
                ) : selectedPageContent ? (
                  <NotionRenderer 
                    recordMap={selectedPageContent} 
                    pageTitle={getNotionPageTitle(selectedPage)}
                    fallback={selectedPageContent?.fallback || false}
                  />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-[#ADB7BE]">Failed to load content</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NotionSection;
