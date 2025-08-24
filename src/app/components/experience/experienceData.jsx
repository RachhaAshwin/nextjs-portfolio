// Ashwin's actual experience data from resume
const experienceData = [
  {
    id: 1,
    position: "Tech Lead & AI Product Engineer",
    company: "Finally",
    location: "Boca Raton, FL",
    duration: "Feb 2024 – Present",
    type: "Full-time",
    description: [
      "Classify AI - AI Bookkeeper: As founding engineer, built flagship AI bookkeeper from ground up using few-shot classification with Elasticsearch retrieval and Pinecone RAG. Led team of 3 engineers with LangChain workflows, Redis caching, W&B observability",
      "Bank Connections Infrastructure: Architected core banking infrastructure using Plaid and Teller APIs powering Corporate Cards, Bookkeeping, and Bill Pay. Built OAuth flows, secure token management, automated statement processing with OCR",
      "Enhanced Classification Pipeline: Integrated Plaid enriched transactions with merchant grouping optimizations and Celery task processing. Implemented ML-driven pattern recognition improving classification accuracy",
      "Cash-Based Underwriting System: Developed risk management system for Corporate Cards with dynamic credit limits based on real-time cash balances. Underwrote over $3M in credit for 50+ companies in 3 months",
      "Real-time Reconciliation Engine: Built automated reconciliation matching Plaid transactions with accounting entries, reducing month-end close times by 50%"
    ],
    technologies: ["Python", "Django", "React", "PostgreSQL", "Kubernetes", "ArgoCD", "Elasticsearch", "Pinecone", "LangChain", "Redis", "Datadog", "Sentry"],
    logo: "/images/finally-logo.png"
  },
  {
    id: 2,
    position: "Machine Learning Engineer",
    company: "UNAR Labs",
    location: "Portland, ME",
    duration: "Jun 2023 – Aug 2023",
    type: "Full-time",
    description: [
      "Developed backend system enhancing multisensory information access for visually impaired individuals using computer vision and NLP technologies",
      "Architected and optimized data pipelines for preprocessing, model training, and inference using OpenCV, PyTorch, Transformers, and FastAPI",
      "Deployed scalable ML solutions on GCP with Docker containerization and HuggingFace model integration for accessibility applications"
    ],
    technologies: ["Python", "PyTorch", "OpenCV", "Transformers", "FastAPI", "GCP", "Docker", "HuggingFace"],
    logo: "/images/unar-logo.png"
  },
  {
    id: 3,
    position: "Machine Learning Engineering Intern",
    company: "Outreach",
    location: "Seattle, WA",
    duration: "May 2022 – Aug 2022",
    type: "Internship",
    description: [
      "Built scalable NLP inference system reducing BERT deployment time by 95% (3-4 days to 30 minutes) for topic detection and sentiment analysis on GKE",
      "Developed PySpark + MLflow pipeline for text processing and deployed ONNX models on NVIDIA Triton",
      "Built Golang/Python microservices with Docker, unit tests, and CI/CD on CircleCI"
    ],
    technologies: ["Python", "Go", "BERT", "GKE", "PySpark", "MLflow", "ONNX", "NVIDIA Triton", "Docker", "CircleCI"],
    logo: "/images/outreach-logo.png"
  },
  {
    id: 4,
    position: "Software Engineer, ML",
    company: "Mindbowser Inc",
    location: "Pune, India",
    duration: "Dec 2019 – Feb 2021",
    type: "Full-time",
    description: [
      "Developed facial expression recognition system for CRM meeting analysis using VGG-19 CNN transfer learning achieving 73% accuracy",
      "Implemented MongoDB GridFS storage for efficient handling of large-scale image and video data",
      "Built end-to-end ML pipeline from data collection to model deployment for production systems"
    ],
    technologies: ["Python", "TensorFlow", "VGG-19", "CNN", "MongoDB", "GridFS", "Computer Vision"],
    logo: "/images/mindbowser-logo.png"
  }
];

export default experienceData;
