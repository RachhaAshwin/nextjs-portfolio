"use client";
import React, { useState } from "react";
import { motion, useAnimation } from "framer-motion";

const NavLink = ({ href, title, onClick }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const controls = useAnimation();

  const handleClick = async (e) => {
    e.preventDefault();
    setIsAnimating(true);
    
    // Animate the nav link click
    await controls.start({
      scale: [1, 0.95, 1],
      transition: { duration: 0.2, ease: "easeInOut" }
    });
    
    // Handle the smooth scroll
    if (onClick) {
      onClick(href);
    }
    
    setTimeout(() => setIsAnimating(false), 800);
  };

  return (
    <motion.button
      animate={controls}
      onClick={handleClick}
      className={`block py-2 pl-3 pr-4 text-muted-foreground sm:text-xl rounded md:p-0 hover:text-foreground transition-all duration-300 relative overflow-hidden ${
        isAnimating ? 'text-primary' : ''
      }`}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Background animation on click */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded"
        initial={{ x: "-100%" }}
        animate={isAnimating ? { x: "100%" } : { x: "-100%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
      <span className="relative z-10">{title}</span>
    </motion.button>
  );
};

export default NavLink;
