"use client";
import React, { useState, useRef } from "react";
import ProjectCard from "./ProjectCard";
import ProjectTag from "./ProjectTag";
import { motion, useInView } from "framer-motion";

const projectsData = [
  {
    id: 1,
    title: "Gurukul",
    description: "Gurukul Adaptive Learning Platform using Large Language Models. [Python, Pytorch, Transformers, Huggingface, Gradio]",
    image: "/images/projectsAR/1AR.jpg",
    tag: ["All", "Web"],
    gitUrl: "/",
    previewUrl: "/",
  },
  {
    id: 2,
    title: "React Portfolio Website",
    description: "React and FastAPI based LLM powered website",
    image: "/images/projectsAR/6AR.png",
    tag: ["All", "Web"],
    gitUrl: "/",
    previewUrl: "/",
  },
  {
    id: 3,
    title: "Hemingway",
    description: "A one stop NLP web application to summarize, analyze and paraphrase text written using Python, Transformers, Streamlit.",
    image: "/images/projectsAR/2AR.jpg",
    tag: ["All", "Web"],
    gitUrl: "/",
    previewUrl: "/",
  },
  {
    id: 4,
    title: "Code Mentor",
    description: "Designed and implemented a Code Mentor system at Code Mentor, leveraging CodeBERT and CodeT5 models to provide detailed explanations for LeetCode solutions and recommend similar coding challenges based on vector embedding similarity.",
    image: "/images/projectsAR/3AR.jpg",
    tag: ["All", "Web"],
    gitUrl: "/",
    previewUrl: "/",
  },
  {
    id: 5,
    title: "Video2MP3 Distributed System",
    description: " Built an authenticated service for uploading, downloading and converting media files using microservices architecture facilitated by Pika and RabbitMQ. The application relies on Flask, PyMongo and GridFS to handle interactions with MongoDB.",
    image: "/images/projectsAR/4AR.jpg",
    tag: ["All", "Web"],
    gitUrl: "/",
    previewUrl: "/",
  },
  {
    id: 6,
    title: "VT Search",
    description: "Developed a web search and summarization system at Virginia Tech utilizing an inverted index for efficient web page querying and Transformers-based summarization for content extraction.",
    image: "/images/projectsAR/5AR.jpg",
    tag: ["All", "Web"],
    gitUrl: "/",
    previewUrl: "/",
  },
];

const ProjectsSection = () => {
  const [tag, setTag] = useState("All");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const handleTagChange = (newTag) => {
    setTag(newTag);
  };

  const filteredProjects = projectsData.filter((project) =>
    project.tag.includes(tag)
  );

  const cardVariants = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };

  return (
    <section id="projects">
      <h2 className="text-center text-4xl font-bold text-white mt-4 mb-8 md:mb-12">
        My Projects
      </h2>
      <div className="text-white flex flex-row justify-center items-center gap-2 py-6">
        <ProjectTag
          onClick={handleTagChange}
          name="All"
          isSelected={tag === "All"}
        />
        <ProjectTag
          onClick={handleTagChange}
          name="Web"
          isSelected={tag === "Web"}
        />
      </div>
      <ul ref={ref} className="grid md:grid-cols-3 gap-8 md:gap-12">
        {filteredProjects.map((project, index) => (
          <motion.li
            key={index}
            variants={cardVariants}
            initial="initial"
            animate={isInView ? "animate" : "initial"}
            transition={{ duration: 0.3, delay: index * 0.4 }}
          >
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              imgUrl={project.image}
              gitUrl={project.gitUrl}
              previewUrl={project.previewUrl}
            />
          </motion.li>
        ))}
      </ul>
    </section>
  );
};

export default ProjectsSection;
