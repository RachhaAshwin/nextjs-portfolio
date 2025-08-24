"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import ExperienceCard from "./experience/ExperienceCard";
import experienceData from "./experience/experienceData";
import "./experience/TimelineStyles.css";

const ExperienceSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  return (
    <section id="experience" className="py-16">
      <motion.div
        ref={ref}
        variants={sectionVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="container mx-auto px-4"
      >
        {/* Section Header */}
        <motion.div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Professional Experience
          </h2>
          <p className="text-[#ADB7BE] text-lg max-w-2xl mx-auto">
            My journey through various roles in ML, AI, and software engineering,
            building scalable systems and leading innovative projects.
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Timeline Line - hidden on mobile */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-primary-500 to-secondary-500 h-full opacity-30"></div>
          
          {/* Experience Cards */}
          <div className="space-y-12 md:space-y-20">
            {experienceData.map((experience, index) => (
              <div key={experience.id} className="relative">
                {/* Mobile Timeline Dot */}
                <div className="md:hidden absolute left-4 top-6">
                  <div className="w-4 h-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full border-4 border-[#121212]"></div>
                  {index < experienceData.length - 1 && (
                    <div className="w-1 h-24 bg-gradient-to-b from-primary-500 to-secondary-500 ml-1.5 mt-2"></div>
                  )}
                </div>
                
                {/* Desktop Timeline Layout */}
                <div className="md:hidden">
                  {/* Mobile Layout */}
                  <div className="ml-12">
                    <ExperienceCard experience={experience} index={0} />
                  </div>
                </div>
                
                <div className="hidden md:block">
                  {/* Desktop Layout */}
                  <ExperienceCard experience={experience} index={index} />
                </div>
              </div>
            ))}
          </div>
        </div>


      </motion.div>
    </section>
  );
};

export default ExperienceSection;
