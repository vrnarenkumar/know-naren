export const hero = {
  name: 'Narenkumar V R',
  title: 'Senior Software Engineer — ML / MLOps / GenAI / AI Systems & Infrastructure',
  roles: ['ML Engineer', 'MLOps Engineer', 'GenAI Builder', 'AI Systems Engineer'],
  eyebrow: 'Shipping AI Systems at Ford Motor Co.',
  summary:
    'Senior Software Engineer (AI/ML) with 5+ years of experience shipping and scaling AI solutions end-to-end, from prototype to production.',
  location: 'Chennai, India (open to relocate)',
  email: 'vrnarenkumar@gmail.com',
  linkedin: 'https://linkedin.com/in/vrnarenkumar',
  github: 'https://github.com/vrnarenkumar',
}

export const stats: { label: string; value: string }[] = [
  { label: 'Years Experience', value: '5+' },
  { label: 'Users Impacted', value: '10K+' },
  { label: 'Faster Deployments', value: '70%' },
  { label: 'Saved / Year', value: '$50K+' },
]

export type ExperienceProject = {
  name: string
  summary: string
}

export type ExperienceRole = {
  company: string
  title: string
  location: string
  dates: string
  projects: ExperienceProject[]
}

export const experience: ExperienceRole[] = [
  {
    company: 'Eunimart',
    title: 'Software Developer, Intern',
    location: 'Hyderabad',
    dates: 'May 2020 – June 2021',
    projects: [
      {
        name: 'Supply-Chain Data Pipelines',
        summary:
          'Built async ETL pipelines ingesting 4.1M+ records and orchestrated concurrent crawlers across Azure VMs for model training data.',
      },
    ],
  },
  {
    company: 'Eunimart',
    title: 'Software Developer',
    location: 'Hyderabad',
    dates: 'June 2021 – July 2022',
    projects: [
      {
        name: 'SKU Content Automation',
        summary:
          'Trained and deployed deep-learning models (PyTorch, SageMaker) to auto-generate product descriptions and automate content for 50K+ Excel sheets.',
      },
    ],
  },
  {
    company: 'Ford Motor Company (via STG Infotech)',
    title: 'Software Engineer',
    location: 'Chennai',
    dates: 'September 2022 – March 2026',
    projects: [
      {
        name: 'AI Notebook',
        summary: 'Architected an enterprise multimodal RAG assistant used by 10K+ users for Q&A and podcast generation.',
      },
      {
        name: 'MetaPix — A Data Platform',
        summary: 'Built a data platform transforming 3TB+ of fleet imagery into structured, searchable training datasets.',
      },
    ],
  },
  {
    company: 'Ford Motor Company (via STG Infotech)',
    title: 'Senior Software Engineer',
    location: 'Chennai',
    dates: 'March 2026 – Present',
    projects: [
      {
        name: 'Multi-Agent Developer Automation Platform',
        summary: 'Led a LangGraph-based MLOps platform that auto-generates IaC/CI-CD, cutting deploy time 70% across 2K+ deployments.',
      },
      {
        name: 'Smart Design Failure Mode and Effects Analysis Platform',
        summary: 'Re-architected DFMEA analysis with a Google ADK agent, cutting manual effort ~40% and compute spend $50K+/year.',
      },
      {
        name: 'Skills Marketplace',
        summary: 'Built an agent skills marketplace scaling to 1K+ reusable skills across the organization.',
      },
    ],
  },
]

export type Project = {
  name: string
  description: string
  tags: string[]
  link?: string
}

export const projects: Project[] = [
  {
    name: 'talk-to-your-data',
    description:
      'A full-stack, locally hosted "talk to your data" analytics chatbot that turns natural-language questions into read-only SQL and charts, with basic Q&A for users to interact with their data and a pluggable multi-data source connector layer for any type of DB.',
    tags: ['CrewAI', 'Ollama', 'FastAPI', 'React'],
    link: 'https://github.com/vrnarenkumar',
  },
]

export const skills: { category: string; items: string[] }[] = [
  { category: 'Languages', items: ['Python', 'Node.js', 'React', 'SQL'] },
  {
    category: 'GenAI & Agents',
    items: ['LangGraph', 'LangChain', 'RAG', 'MCP', 'CrewAI', 'n8n', 'Google ADK', 'Prompt Engineering'],
  },
  {
    category: 'LLMOps & Evals',
    items: ['RAGAS', 'LangSmith', 'Arize Phoenix', 'MLflow', 'W&B', 'Vertex AI Pipelines', 'Airflow'],
  },
  {
    category: 'Backend',
    items: ['FastAPI', 'WebSockets', 'Django', 'Microservices', 'Event-Driven Architecture'],
  },
  {
    category: 'Data & Vector',
    items: [
      'PostgreSQL',
      'BigQuery',
      'Firestore',
      'Spark',
      'MongoDB',
      'Redis',
      'Kafka',
      'Pub/Sub',
      'Elasticsearch',
      'ChromaDB',
      'FAISS',
      'MongoDB Atlas Vector Search',
      'Pydantic',
      'scikit-learn',
      'SQLite',
      'matplotlib',
    ],
  },
  {
    category: 'Cloud & DevOps',
    items: ['AWS', 'Azure', 'GCP', 'Kubernetes', 'Helm', 'Terraform', 'Docker', 'GitHub Actions', 'OpenShift', 'HPC', 'CI/CD'],
  },
  {
    category: 'ML/DL',
    items: ['Hugging Face', 'PyTorch', 'TensorFlow', 'vLLM', 'TensorRT', 'Databricks', 'SageMaker', 'Vertex AI'],
  },
]

export const education = {
  degree: 'B.E., Computer Science and Engineering',
  institution: 'Sri Shakthi Institute of Engineering and Technology',
  location: 'Coimbatore',
  dates: 'May 2017 – May 2021',
}
