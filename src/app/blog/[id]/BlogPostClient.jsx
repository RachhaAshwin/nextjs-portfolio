"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getNotionPageTitle, getNotionPageDate, getNotionPageDescription, getNotionPageTags } from "../../../lib/notion";
import MarkdownRenderer from "../../components/notion/MarkdownRenderer";

// Tag component with Notion-style colors
const Tag = ({ name, color }) => {
  // Notion color mapping to Tailwind classes
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

export default function BlogPostClient({ postContent, postId }) {
  if (!postContent) {
    return (
      <div className="min-h-screen bg-[#121212] pt-20">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Post Not Found</h1>
            <p className="text-[#ADB7BE] mb-8">The requested blog post could not be loaded.</p>
            <Link 
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-[#9333ea] hover:bg-[#7c2d92] text-white rounded-lg transition-colors"
            >
              ← Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const post = postContent.page;
  const title = post ? getNotionPageTitle(post) : 'Blog Post';
  const date = post ? getNotionPageDate(post) : '';
  const description = post ? getNotionPageDescription(post) : '';
  const tags = post ? getNotionPageTags(post) : [];

  const handleShare = async () => {
    const url = window.location.href;
    const text = `Check out this blog post: ${title}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url);
        // You could add a toast notification here
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy link');
      }
    }
  };

  const shareToTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(title);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareToLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#121212] pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <ol className="flex items-center space-x-2 text-sm text-[#6B7280]">
            <li>
              <Link href="/" className="hover:text-[#9333ea] transition-colors">
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <Link href="/blog" className="hover:text-[#9333ea] transition-colors">
                Blog
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-[#ADB7BE] font-medium truncate max-w-xs">
                {title}
              </span>
            </li>
          </ol>
        </motion.nav>

        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {title}
          </h1>
          
          {description && (
            <p className="text-xl text-[#ADB7BE] mb-6 max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-[#6B7280] mb-6">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <time>{date}</time>
            </div>
            
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>5 min read</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span>From Notion</span>
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {tags.map((tag) => (
                <Tag
                  key={tag.id}
                  name={tag.name}
                  color={tag.color}
                />
              ))}
            </div>
          )}
        </motion.header>

        {/* Article Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-lg prose-invert max-w-none"
        >
          {postContent?.markdown ? (
            <MarkdownRenderer 
              markdown={postContent.markdown} 
              pageTitle={title}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-[#ADB7BE]">Content could not be loaded</p>
            </div>
          )}
        </motion.article>

        {/* Social Sharing & Navigation */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 pt-8 border-t border-[#33353F]"
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Back to Blog Link */}
            <Link 
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-[#1a1a1a] border border-[#33353F] hover:border-[#9333ea]/50 text-white rounded-lg transition-all duration-300 hover:bg-[#1a1a1a]/80"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Blog
            </Link>

            {/* Share Buttons */}
            <div className="flex items-center space-x-4">
              <span className="text-[#6B7280] text-sm font-medium">Share:</span>
              
              <button
                onClick={handleShare}
                className="p-2 bg-[#1a1a1a] border border-[#33353F] hover:border-[#9333ea]/50 rounded-lg transition-all duration-300 hover:bg-[#1a1a1a]/80 group"
                title="Share this post"
              >
                <svg className="w-4 h-4 text-[#6B7280] group-hover:text-[#9333ea]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>

              <button
                onClick={shareToTwitter}
                className="p-2 bg-[#1a1a1a] border border-[#33353F] hover:border-[#1da1f2]/50 rounded-lg transition-all duration-300 hover:bg-[#1a1a1a]/80 group"
                title="Share on Twitter"
              >
                <svg className="w-4 h-4 text-[#6B7280] group-hover:text-[#1da1f2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </button>

              <button
                onClick={shareToLinkedIn}
                className="p-2 bg-[#1a1a1a] border border-[#33353F] hover:border-[#0077b5]/50 rounded-lg transition-all duration-300 hover:bg-[#1a1a1a]/80 group"
                title="Share on LinkedIn"
              >
                <svg className="w-4 h-4 text-[#6B7280] group-hover:text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </button>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
