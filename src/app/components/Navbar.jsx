"use client";
import Link from "next/link";
import React, { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import NavLink from "./NavLink";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import MenuOverlay from "./MenuOverlay";

const navLinks = [
  {
    title: "About",
    path: "#about",
    type: "scroll"
  },
  {
    title: "Experience", 
    path: "#experience",
    type: "scroll"
  },
  {
    title: "Blog",
    path: "/blog",
    type: "route"
  },
  {
    title: "Projects",
    path: "#projects",
    type: "scroll"
  },
  {
    title: "Contact",
    path: "#contact",
    type: "scroll"
  },
];

const Navbar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [scrollProgress, setScrollProgress] = useState(0);
  const { scrollY } = useScroll();

  // Smooth scroll function with easing animation
  const smoothScrollTo = (targetId) => {
    const element = document.getElementById(targetId.replace('#', ''));
    if (element) {
      const navbar = document.querySelector('nav');
      const navbarHeight = navbar ? navbar.offsetHeight : 0;
      const targetPosition = element.offsetTop - navbarHeight - 20; // 20px extra padding
      
      // Custom smooth scroll with easing
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 1200; // 1.2 seconds
      let start = null;
      
      const ease = (t) => {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      };
      
      const animation = (currentTime) => {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);
        const easedProgress = ease(progress);
        
        window.scrollTo(0, startPosition + distance * easedProgress);
        
        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      };
      
      requestAnimationFrame(animation);
    }
  };

  // Track active section and scroll progress
  useMotionValueEvent(scrollY, "change", (latest) => {
    // Update scroll progress
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? latest / totalHeight : 0;
    setScrollProgress(Math.min(progress, 1));
    
    // Track active section
    const sections = ["about", "experience", "projects", "contact"];
    const navbar = document.querySelector('nav');
    const navbarHeight = navbar ? navbar.offsetHeight : 0;
    
    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + window.pageYOffset;
        const elementBottom = elementTop + element.offsetHeight;
        
        if (latest >= elementTop - navbarHeight - 100 && latest < elementBottom - navbarHeight - 100) {
          setActiveSection(section);
          break;
        }
      }
    }
  });

  const handleNavClick = (path, type) => {
    if (type === "route") {
      // For external routes, use Next.js navigation
      window.location.href = path;
    } else {
      // For scroll sections, use smooth scroll
      smoothScrollTo(path);
    }
    setNavbarOpen(false); // Close mobile menu if open
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 z-50 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: scrollProgress }}
        transition={{ duration: 0.1, ease: "easeOut" }}
      />
      
      <nav className="fixed mx-auto border border-border top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md"
        style={{ marginTop: '4px' }}
      >
      <div className="flex container lg:py-4 flex-wrap items-center justify-between mx-auto px-4 py-2">
        <Link
          href={"/"}
          className="text-2xl md:text-5xl text-white font-semibold"
          style={{ color: 'white' }}
        >
          AR
        </Link>
        <div className="mobile-menu block md:hidden">
          {!navbarOpen ? (
            <button
              onClick={() => setNavbarOpen(true)}
              className="flex items-center px-3 py-2 border rounded border-muted-foreground text-muted-foreground hover:text-foreground hover:border-foreground"
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={() => setNavbarOpen(false)}
              className="flex items-center px-3 py-2 border rounded border-muted-foreground text-muted-foreground hover:text-foreground hover:border-foreground"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="menu hidden md:block md:w-auto" id="navbar">
          <ul className="flex p-4 md:p-0 md:flex-row md:space-x-8 mt-0">
            {navLinks.map((link, index) => {
              const sectionName = link.path.replace('#', '');
              const isActive = activeSection === sectionName;
              const isBlogRoute = link.type === "route" && typeof window !== 'undefined' && window.location.pathname === link.path;
              const showIndicator = isActive || isBlogRoute;
              
              return (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <div className="relative">
                    {link.type === "route" ? (
                      <Link 
                        href={link.path}
                        className="block py-2 pl-3 pr-4 text-[#ADB7BE] sm:text-xl rounded md:p-0 hover:text-white transition-colors duration-200"
                      >
                        {link.title}
                      </Link>
                    ) : (
                      <NavLink 
                        href={link.path} 
                        title={link.title} 
                        onClick={(path) => handleNavClick(path, link.type)}
                      />
                    )}
                    {/* Active section indicator */}
                    {showIndicator && (
                      <motion.div
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      />
                    )}
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
        {navbarOpen ? <MenuOverlay links={navLinks} onNavClick={handleNavClick} /> : null}
      </nav>
    </>
  );
};

export default Navbar;
