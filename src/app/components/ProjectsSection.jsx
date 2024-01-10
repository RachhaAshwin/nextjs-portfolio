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
    gitUrl: "https://github.com/ashwinrachha786/Gurukul_v2",
    previewUrl: "/",
  },
  {
    id: 2,
    title: "React Portfolio Website",
    description: "React and FastAPI based LLM powered website",
    image: "/images/projectsAR/6AR.png",
    tag: ["All", "Web"],
    gitUrl: "https://github.com/RachhaAshwin/nextjs-portfolio",
    previewUrl: "/",
  },
  {
    id: 3,
    title: "Hemingway",
    description: "A one stop NLP web application to summarize, analyze and paraphrase text written using Python, Transformers, Streamlit.",
    image: "/images/projectsAR/2AR.jpg",
    tag: ["All", "Web"],
    gitUrl: "https://github.com/RachhaAshwin/one_stop_NLP",
    previewUrl: "/",
  },
  {
    id: 4,
    title: "Code Mentor",
    description: "Designed and implemented a Code Mentor system at Code Mentor, leveraging CodeBERT and CodeT5 models to provide detailed explanations for LeetCode solutions and recommend similar coding challenges based on vector embedding similarity.",
    image: "/images/projectsAR/3AR.jpg",
    tag: ["All", "Web"],
    gitUrl: "https://github.com/AshwinRachha/CodeMentor",
    previewUrl: "/",
  },
  {
    id: 5,
    title: "Video2MP3 Distributed System",
    description: " Built an authenticated service for uploading, downloading and converting media files using microservices architecture facilitated by Pika and RabbitMQ. The application relies on Flask, PyMongo and GridFS to handle interactions with MongoDB.",
    image: "/images/projectsAR/4AR.jpg",
    tag: ["All", "Web"],
    gitUrl: "https://github.com/AshwinRachha/PythonMicroservices",
    previewUrl: "/",
  },
  {
    id: 6,
    title: "VT Search",
    description: "Developed a web search and summarization system at Virginia Tech utilizing an inverted index for efficient web page querying and Transformers-based summarization for content extraction.",
    image: "/images/projectsAR/5AR.jpg",
    tag: ["All", "Web"],
    gitUrl: "https://github.com/AshwinRachha/VT-Search",
    previewUrl: "/",
  },
  {
    id: 7,
    title: "Topic Modeling with Quantized Large Language Models (LLMs): A Comprehensive Guide",
    description: "Topic modeling is a widely used technique for identifying, revealing and displaying thematic structures within textual data. In this blog we will explore Clustering over Arxiv ML papers using Quantized LLMs for Semantic Clustering.",
    image: "/images/11.png",
    tag: ["Blogs"],
    gitUrl: "https://medium.com/@ashwin_rachha/topic-modeling-with-quantized-large-language-models-llms-a-comprehensive-guide-9331c6936073",
    previewUrl: "/",
  },
  {
    id: 8,
    title: "Next-Gen Chatbots: Building a Simple Chatbot with NextJS and Huggingface for FREE.",
    description: "In this Blog post you can read about building a NextJS based chatbot with HuggingFace Inference API with a streaming response with 0 costs for FREE!",
    image: "images/184681355-dd84af8a-1a0a-453a-b677-5b33842898f1.png",
    tag: ["Blogs"],
    gitUrl: "https://medium.com/@ashwin_rachha/next-gen-chatbots-building-a-simple-chatbot-with-nextjs-and-huggingface-for-free-58e40b2171db",
    previewUrl: "/",
  },
  {
    id: 9,
    title: "Langchain : A comprehensive guide to augmenting Large Language Models",
    description: "In this blog post we will delve into the world of langchain and how to augment llm applications with enhanced contexts and supercharged tools to build agents!",
    image: "/images/9.png",
    tag: ["Blogs"],
    gitUrl: "https://medium.com/@ashwin_rachha/langchain-a-comprehensive-guide-to-augmenting-large-language-models-507b1ad28561",
    previewUrl: "/",
  },
  {
    id: 10,
    title: "Deploying a Slack bot with HuggingFace Transformers 🤗",
    description: "In this Blog post we will create an AI buddy who will take care of our Slack Requests for us while we are off for a tea break :D",
    image: "/images/10.png",
    tag: ["Blogs"],
    gitUrl: "https://medium.com/@ashwin_rachha/deploying-a-slack-bot-with-huggingface-transformers-6962ec0fba44",
    previewUrl: "/",
  },
  {
    id: 11,
    title: "Querying a Code Database to find Similar Coding Problems using Langchain.",
    description: "In this blog post we will understand the usage of CodeBert for generating code related semnatic embeddings and store it in a faiss vectorstore and use langchain to fetch similar leetcode questions. ",
    image: "/images/11.png",
    tag: ["Blogs"],
    gitUrl: "https://medium.com/@ashwin_rachha/querying-a-code-database-to-find-similar-coding-problems-using-langchain-814730da6e6d",
    previewUrl: "/",
  },
  {
    id: 12,
    title: "Text Summarization with a gRPC based Python Server and Go based Client.",
    description: "In this blog post we will build a Text Summarization server in Python and serve requests to a golang based client communicating with grpc. ",
    image: "/images/12.png",
    tag: ["Blogs"],
    gitUrl: "https://medium.com/@ashwin_rachha/text-summarization-with-a-grpc-based-python-server-and-go-based-client-3bbe9badd936",
    previewUrl: "/",
  },
  {
    id: 13,
    title: "Patent Phrase-to-Phrase Matching with Pytorch Lightning",
    description: "",
    image: "/images/13.png",
    tag: ["Blogs"],
    gitUrl: "https://medium.com/@ashwin_rachha/patent-phrase-to-phrase-matching-with-pytroch-lightning-79a5f37332fa",
    previewUrl: "/",
  },
  {
    id: 14,
    title: "Music Genre Prediction using ML and Optuna",
    description: "In this blog post we will use traditional ML algorithms with Optuna for hyperparamter tuning.",
    image: "/images/14.png",
    tag: ["Blogs"],
    gitUrl: "https://medium.com/@ashwin_rachha/music-genre-prediction-using-ml-and-optuna-f08b4a25bbe",
    previewUrl: "/",
  },
  {
    id: 15,
    title: "Addition and Subtraction using Recurrent Neural Networks.",
    description: "In this Blog post we will read about how RNNs are used for character modeling.",
    image: "images/15.png",
    tag: ["Blogs"],
    gitUrl: "https://medium.com/@ashwin_rachha/addition-and-subtraction-using-recurrent-neural-networks-3bb0d0b2cb86",
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
        My Projects & Blogs
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
        <ProjectTag
          onClick={handleTagChange}
          name="Blogs"
          isSelected={tag === "Blogs"}
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
