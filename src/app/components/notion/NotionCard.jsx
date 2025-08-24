"use client";
import React from "react";
import { motion } from "framer-motion";
import { getNotionPageTitle, getNotionPageDate, getNotionPageDescription } from "../../../lib/notion";

const NotionCard = ({ page, onClick, index = 0 }) => {
  const title = getNotionPageTitle(page);
  const createdDate = getNotionPageDate(page);
  const description = getNotionPageDescription(page);

  // Extract tags if available
  const tags = page.properties?.Tags?.multi_select || [];

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      onClick={() => onClick && onClick(page)}
      className="bg-gradient-to-br from-card to-card/80 rounded-xl p-6 border border-border hover:border-primary transition-all duration-300 cursor-pointer group hover:shadow-xl hover:shadow-primary/10"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-tight">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-3 font-medium">
            {createdDate}
          </p>
        </div>
        
        {/* Notion icon indicator */}
        <div className="flex-shrink-0 ml-4">
          <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.887l-.701.14v10.264c-.608.327-1.168.327-1.635.047l-6.131-4.853-.093-.606l6.45 4.993V9.772l-.14-.047-1.447-.886c-.42-.233-.42-.653.047-.793l2.24-.42.28-.047.373-.047.653-.14z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed font-normal">
          {description.length > 150 ? `${description.substring(0, 150)}...` : description}
        </p>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-1 text-xs bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-primary-300 rounded-full border border-primary-500/30"
            >
              {tag.name}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="px-2 py-1 text-xs text-[#ADB7BE] bg-[#1a1a1a] rounded-full border border-[#33353F]">
              +{tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Read more indicator */}
      <div className="flex items-center text-primary-400 text-sm group-hover:text-primary-300 transition-colors">
        <span>Read more</span>
        <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </motion.div>
  );
};

export default NotionCard;
