"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import NavLink from "./NavLink";

const MenuOverlay = ({ links, onNavClick }) => {
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.ul 
      className="flex flex-col py-4 items-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      {links.map((link, index) => (
        <motion.li 
          key={index}
          variants={itemVariants}
          className="mb-2"
        >
          {link.type === "route" ? (
            <Link 
              href={link.path}
              className="block py-2 pl-3 pr-4 text-[#ADB7BE] text-xl rounded md:p-0 hover:text-white transition-colors duration-200"
              onClick={() => onNavClick && onNavClick(link.path, link.type)}
            >
              {link.title}
            </Link>
          ) : (
            <NavLink 
              href={link.path} 
              title={link.title}
              onClick={(path) => onNavClick && onNavClick(path, link.type)}
            />
          )}
        </motion.li>
      ))}
    </motion.ul>
  );
};

export default MenuOverlay;
