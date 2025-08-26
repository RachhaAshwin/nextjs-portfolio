"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getNotionDatabase, getNotionPageTitle, getNotionPageDate, getNotionPageDescription, getNotionPageTags } from "../../lib/notion";

// Tag component with Notion-style colors for blog list
const Tag = ({ name, color }) => {
  const colorMap = {
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    brown: 'bg-amber-600/10 border-amber-600/20 text-amber-400',
    gray: 'bg-gray-500/10 border-gray-500/20 text-gray-400',
    green: 'bg-green-500/10 border-green-500/20 text-green-400',
    orange: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
    pink: 'bg-pink-500/10 border-pink-500/20 text-pink-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    red: 'bg-red-500/10 border-red-500/20 text-red-400',
    yellow: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    default: 'bg-[#9333ea]/10 border-[#9333ea]/20 text-[#9333ea]'
  };

  const colorClass = colorMap[color] || colorMap.default;

  return (
    <span className={`px-3 py-1 border text-xs rounded-full font-medium ${colorClass}`}>
      {name}
    </span>
  );
};

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all blog posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const pages = await getNotionDatabase();
        
        if (pages && pages.length > 0) {
          // Filter and sort blog posts
          const blogPosts = pages
            .filter(page => {
              const title = getNotionPageTitle(page);
              
              const hasProperTitle = title && 
                                    title !== 'Untitled' && 
                                    !title.startsWith('http://') && 
                                    !title.startsWith('https://') &&
                                    title.trim().length > 2;
              
              return hasProperTitle;
            })
            .sort((a, b) => new Date(b.created_time) - new Date(a.created_time));
          
          setPosts(blogPosts);
          setError(null);
        } else {
          setError('No blog posts found');
        }
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        // Check if it's a specific Notion API error
        if (err.message && err.message.includes('401')) {
          setError('Invalid Notion API token. Please check your environment variables.');
        } else if (err.message && err.message.includes('404')) {
          setError('Database not found. Please check your database ID and permissions.');
        } else {
          setError('Failed to load blog posts. Please check your Notion integration.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Animation variants
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] pt-20">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#9333ea] mb-4"></div>
            <p className="text-[#ADB7BE]">Loading blog posts...</p>
          </div>
        </div>
      </div>
    );
  }

    if (error) {
    const isTokenError = error.includes('Invalid Notion API token') || error.includes('401');
    const isDatabaseError = error.includes('Database not found') || error.includes('404');
    
    return (
      <div className="min-h-screen bg-[#121212] pt-20">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Blog</h1>
            <div className="bg-[#1a1a1a] border border-[#33353F] rounded-xl p-8 text-left max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-white mb-4">
                {isTokenError ? '🔑 API Token Issue' : isDatabaseError ? '🗃️ Database Issue' : '🚧 Setup Required'}
              </h3>
              
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                <p className="text-red-400 font-medium mb-2">Error:</p>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
              
              {isTokenError && (
                <div className="space-y-4">
                  <p className="text-[#ADB7BE]">Your API token is invalid. Here&apos;s how to fix it:</p>
                  <ol className="text-[#ADB7BE] space-y-2 list-decimal list-inside">
                    <li>Go to <a href="https://www.notion.so/my-integrations" target="_blank" rel="noopener noreferrer" className="text-[#9333ea] hover:underline">notion.so/my-integrations</a></li>
                    <li>Copy the &quot;Internal Integration Token&quot; (starts with &quot;secret_&quot;)</li>
                    <li>Update your <code className="bg-[#33353F] px-2 py-1 rounded text-[#06b6d4]">.env.local</code> file</li>
                    <li>Restart your development server</li>
                  </ol>
                </div>
              )}
              
              {isDatabaseError && (
                <div className="space-y-4">
                  <p className="text-[#ADB7BE]">Database not found. Please check:</p>
                  <ol className="text-[#ADB7BE] space-y-2 list-decimal list-inside">
                    <li>Your database ID is correct in <code className="bg-[#33353F] px-2 py-1 rounded text-[#06b6d4]">.env.local</code></li>
                    <li>You&apos;ve shared the database with your integration</li>
                    <li>The database still exists and is accessible</li>
                  </ol>
                </div>
              )}
              
              {!isTokenError && !isDatabaseError && (
                <div className="space-y-4">
                  <p className="text-[#ADB7BE]">To enable your blog, configure your Notion integration:</p>
                  <ol className="text-[#ADB7BE] space-y-2 list-decimal list-inside">
                    <li>Create a Notion integration at <a href="https://www.notion.so/my-integrations" target="_blank" rel="noopener noreferrer" className="text-[#9333ea] hover:underline">notion.so/my-integrations</a></li>
                    <li>Share your database with the integration</li>
                    <li>Add environment variables to your <code className="bg-[#33353F] px-2 py-1 rounded text-[#06b6d4]">.env.local</code> file</li>
                  </ol>
                </div>
              )}
              
              <div className="mt-4 bg-[#0a0a0a] border border-[#33353F] rounded-lg p-4 font-mono text-sm">
                <p className="text-green-400"># Notion Integration</p>
                <p className="text-[#ADB7BE]">NOTION_API_KEY=&quot;secret_your_integration_token&quot;</p>
                <p className="text-[#ADB7BE]">NOTION_DATABASE_ID=&quot;your_database_id&quot;</p>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <p className="text-[#6B7280] text-sm">
                  Then restart your development server!
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-[#9333ea] hover:bg-[#7c2d92] text-white rounded-lg transition-colors text-sm"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#121212] pt-20">
        {/* Navigation Back */}
        <div className="max-w-4xl mx-auto px-4 pt-8">
          <Link href="/" className="inline-flex items-center text-[#9333ea] hover:text-[#7c2d92] transition-colors duration-300">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Portfolio
          </Link>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto px-4 py-16"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-4">
              From My{" "}
              <span className="bg-gradient-to-r from-[#9333ea] to-[#06b6d4] bg-clip-text text-transparent">
                Command Center
              </span>
            </h1>
            <p className="text-[#ADB7BE] text-lg max-w-2xl mx-auto">
              Insights, experiments, and thoughts from my Notion workspace
            </p>
            <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-[#6B7280]">
              <span>{posts.length} posts</span>
              <span>•</span>
              <span>Updated regularly</span>
            </div>
          </motion.div>

          {/* Blog Posts Grid */}
          <motion.div variants={containerVariants} className="space-y-8">
            {posts.map((post, index) => {
              const title = getNotionPageTitle(post);
              const description = getNotionPageDescription(post);
              const date = getNotionPageDate(post);
              const tags = getNotionPageTags(post);
              
              return (
                <motion.article
                  key={post.id}
                  variants={itemVariants}
                  className="group"
                >
                  <Link 
                    href={`/blog/${post.id}`}
                    className="block bg-[#1a1a1a] border border-[#33353F] rounded-xl p-8 
                             hover:border-[#9333ea]/50 hover:bg-[#1a1a1a]/80 transition-all duration-300
                             transform hover:scale-[1.02] hover:shadow-lg hover:shadow-[#9333ea]/10"
                  >
                    <div className="flex flex-col space-y-4">
                      {/* Date and Reading Time */}
                      <div className="flex items-center space-x-4 text-sm text-[#6B7280]">
                        <time>{date}</time>
                        <span>•</span>
                        <span>3 min read</span>
                      </div>

                      {/* Title */}
                      <h2 className="text-2xl font-bold text-white group-hover:text-[#9333ea] 
                                   transition-colors duration-200">
                        {title}
                      </h2>

                      {/* Description */}
                      {description && (
                        <p className="text-[#ADB7BE] leading-relaxed line-clamp-3">
                          {description}
                        </p>
                      )}

                      {/* Tags */}
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tags.slice(0, 4).map((tag) => (
                            <Tag
                              key={tag.id}
                              name={tag.name}
                              color={tag.color}
                            />
                          ))}
                          {tags.length > 4 && (
                            <span className="px-3 py-1 text-[#6B7280] text-xs">
                              +{tags.length - 4} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Read More Arrow */}
                      <div className="flex items-center text-[#9333ea] font-medium text-sm 
                                    group-hover:translate-x-2 transition-transform duration-200">
                        <span>Read full post</span>
                        <svg 
                          className="w-4 h-4 ml-2" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </motion.div>

          {/* Empty State */}
          {posts.length === 0 && !loading && !error && (
            <motion.div variants={itemVariants} className="text-center py-16">
              <div className="text-[#6B7280] mb-4">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
              <p className="text-[#ADB7BE]">Check back soon for new content!</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default BlogPage;