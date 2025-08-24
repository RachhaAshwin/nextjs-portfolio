"use client";
import React from "react";
import { motion } from "framer-motion";

const ExperienceCard = ({ experience, index }) => {
  const cardVariants = {
    hidden: { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.2,
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
      className={`flex items-start w-full ${
        index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
      } flex-col md:items-center`}
    >
      {/* Timeline dot - only show on desktop, mobile handled in parent */}
      <div className="hidden md:flex flex-col items-center flex-shrink-0">
        <div className="w-6 h-6 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full border-4 border-background z-10 shadow-lg timeline-dot-pulse"></div>
      </div>

      {/* Experience Card */}
      <div className={`flex-1 w-full ${index % 2 === 0 ? "md:ml-8" : "md:mr-8"}`}>
        <div className="timeline-card bg-gradient-to-br from-card to-card/80 p-6 rounded-xl shadow-xl border border-border hover:border-primary transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-1">
                {experience.position}
              </h3>
              <h4 className="text-lg text-primary font-semibold mb-1">
                {experience.company}
              </h4>
              <p className="text-muted-foreground text-sm mb-2">
                {experience.location} • {experience.type}
              </p>
            </div>
            <span className="text-xs text-secondary bg-card px-3 py-1 rounded-full border border-border">
              {experience.duration}
            </span>
          </div>

          {/* Description */}
          <ul className="text-muted-foreground mb-4 space-y-2">
            {experience.description.map((item, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-primary mr-2 mt-1">▸</span>
                <span className="text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2">
            {experience.technologies.map((tech, idx) => (
              <span
                key={idx}
                className="tech-tag px-3 py-1 text-xs bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full font-medium cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ExperienceCard;
