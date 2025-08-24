"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const BlogTeaser = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
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

  return (
    <section id="blog-teaser" className="py-16">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="container mx-auto px-4"
      >
        {/* Section Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            From My Command Center
          </h2>
          <p className="text-[#ADB7BE] text-lg max-w-2xl mx-auto">
            Technical insights, project deep-dives, and learnings from building 
            products that matter. All sourced directly from my Notion workspace.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
          variants={itemVariants}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {/* Latest Posts */}
          <div className="bg-[#1a1a1a] border border-[#33353F] rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-[#9333ea]/10 border border-[#9333ea]/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#9333ea]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Latest Posts</h3>
            <p className="text-[#ADB7BE] text-sm">
              Fresh insights on AI, engineering, and product development
            </p>
          </div>

          {/* Rich Content */}
          <div className="bg-[#1a1a1a] border border-[#33353F] rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-[#9333ea]/10 border border-[#9333ea]/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#9333ea]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Rich Format</h3>
            <p className="text-[#ADB7BE] text-sm">
              Code snippets, diagrams, and detailed technical breakdowns
            </p>
          </div>

          {/* Live Updates */}
          <div className="bg-[#1a1a1a] border border-[#33353F] rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-[#9333ea]/10 border border-[#9333ea]/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#9333ea]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Live Updates</h3>
            <p className="text-[#ADB7BE] text-sm">
              Content synced directly from Notion, always up-to-date
            </p>
          </div>
        </motion.div>

        {/* Main CTA */}
        <motion.div variants={itemVariants} className="text-center">
          <div className="bg-gradient-to-r from-[#9333ea]/10 to-[#a855f7]/10 border border-[#9333ea]/30 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Explore the Full Blog
            </h3>
            <p className="text-[#ADB7BE] mb-6">
              Dive deep into technical tutorials, project case studies, and insights 
              from building scalable systems. All posts are crafted with code examples 
              and real-world applications.
            </p>
            <Link 
              href="/blog"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-[#9333ea] to-[#a855f7] 
                         text-white font-semibold rounded-full hover:shadow-lg hover:shadow-[#9333ea]/25 
                         transform hover:scale-105 transition-all duration-300 group"
            >
              <span>Read All Posts</span>
              <svg 
                className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            
            {/* Stats */}
            <div className="flex items-center justify-center space-x-8 mt-6 pt-6 border-t border-[#33353F]">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#9333ea]">19+</div>
                <div className="text-xs text-[#6B7280]">Articles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#9333ea]">5+</div>
                <div className="text-xs text-[#6B7280]">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#9333ea]">Live</div>
                <div className="text-xs text-[#6B7280]">Updates</div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default BlogTeaser;
