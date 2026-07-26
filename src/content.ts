import resumeRaw from '../RESUME.md?raw'
import { parseSkillsFromMarkdown } from './lib/parseSkills'
import { parseProjectsFromMarkdown, type ResumeProject } from './lib/parseProjects'

export const hero = {
  name: 'Narenkumar V R',
  title: 'Senior Software Engineer — ML / MLOps / GenAI / AI Systems & Infrastructure',
  roles: ['Generative AI', 'Agentic Systems', 'Machine Learning Operations', 'AI Systems & Infrastructure', 'Cloud Architect'],
  eyebrow: 'Shipping AI Systems at Ford Motor Co.',
  tagline: 'Shipping and scaling AI/ML systems end-to-end — from prototype to production.',
  about:
    "I don't just build platforms — I architect and productionize them. From designing APIs, backend services, and stateful workflows to fine-tuning and evaluating models, I engineer the systems around them: evaluation gates, cost-aware routing across open and closed-source LLMs, automated ML workflows through CI/CD, and scalable deployments across cloud and Kubernetes environments designed to handle concurrent, high-throughput workloads.",
  location: 'Chennai, India (open to relocate)',
  hometown: 'Ooty, India',
  email: 'vrnarenkumar@gmail.com',
  linkedin: 'https://linkedin.com/in/vrnarenkumar',
  github: 'https://github.com/vrnarenkumar',
}

export const stats: { label: string; value: string; source: string }[] = [
  { label: 'Years Experience', value: '5+', source: 'Since 2021' },
  { label: 'Users Impacted', value: '10K+', source: 'AI Notebook (RAG assistant)' },
  { label: 'Faster Deployments', value: '70%', source: 'Multi-Agent MLOps Platform' },
  { label: 'Saved / Year', value: '$50K+', source: 'LLM cost-aware routing (SmartFMA)' },
  { label: 'Data Processed', value: '3TB+', source: 'MetaPix Data Platform' },
]

export type ExperienceProject = {
  name: string
  bullets: string[]
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
        bullets: [
          'Built asynchronous ETL / data-engineering pipelines ingesting 4.1M+ records (RabbitMQ migrated to Kafka, PostgreSQL) for the supply-chain platform serving domestic e-commerce sellers.',
          'Orchestrated concurrent crawler sessions across Azure VMs (BeautifulSoup, Selenium, tmux) to extract product descriptions, images, and metadata for model training.',
        ],
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
        bullets: [
          'Trained deep-learning models (PyTorch) on Amazon SageMaker — BLIP captioning and Faster R-CNN object detection — auto-generating product descriptions and keywords across 500+ SKUs and cutting manual content-creation effort by 50%.',
          'Packaged models to Amazon ECR and served them via SageMaker endpoints, exposed through API Gateway + AWS Lambda — automating content for 50K+ Excel sheets across domestic SKUs.',
          'Owned Azure VM infrastructure — provisioning microservices, monitoring, and disaster recovery — for a cross-functional team.',
        ],
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
        bullets: [
          'Architected an enterprise multimodal RAG assistant — 10K+ users (300+ daily) — for Q&A and podcast generation across PDF, PPT, XLSX, Word, and TXT, with parsing and chunking tuned per file type.',
          'Applied advanced prompting (CoT, ToT, LATS) and hybrid retrieval (BM25 + semantic/vector) to improve accuracy and reduce hallucinations — enforcing quality with RAGAS evaluation and Guardrails output validation.',
          'Engineered FastAPI and WebSocket APIs (session persistence and retrieval across Elasticsearch, ChromaDB, and MongoDB Atlas Vector Search), secured with Azure-based RBAC — plus safe, backward-compatible Alembic migrations for SQL schema changes.',
        ],
      },
      {
        name: 'MetaPix — A Data Platform',
        bullets: [
          'Engineered a data platform that transforms 3TB+ of unstructured fleet image/video into structured, searchable datasets (CLIP) — adopted by 300+ users and integrated with Voxel51, W&B, Dataloop, CVAT, and Vertex AI for data curation and training.',
          "Developed FFmpeg codec pipelines transcoding developer fleet recordings to optimized MP4 (H.264/HEVC) for large-scale training-data processing across Ford's autonomous/ADAS programs.",
        ],
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
        bullets: [
          'Led and mentored a team building a LangGraph based MLOps platform that bridges Software Engineering, ML, and DevOps workflow which auto-generates Terraform (IaC) and CI/CD pipelines, standardizing deployment from experimentation to production — later packaged as an MCP with FastMCP.',
          'Cut deploy time by 70% and enabled 2K+ deployments in under 25 minutes each.',
          'Built an OpenTelemetry-based observability + agent-eval layer (Arize Phoenix, Pydantic, Guardrails, LLM-as-a-judge) that traces every reasoning step, tool call, and response, and gates deployments on a 91% task-success threshold.',
        ],
      },
      {
        name: 'Smart Design Failure Mode and Effects Analysis Platform',
        bullets: [
          "Partnered with DFMEA engineers to re-architect the old failure-mode-analysis platform with a Google ADK based agent — modeling vehicle system's boundary diagrams as node/edge/legend to automate multi-stage analysis, surfacing risks earlier and reducing warranty/recall exposure and manual effort by roughly 40%.",
          'Built automated ETL / data-ingestion pipelines loading 30+ DFMEA Excel sheets per week (Cloud Scheduler & Pub/Sub) into PostgreSQL — feeding a knowledge graph that powers the SmartFMA agent (Google ADK).',
          'Designed a complexity-aware routing layer that predicts request difficulty and selects the optimal model across self-hosted SLMs (vLLM on HPC) and Gemini on Vertex AI — cutting compute spend $50K+/year with no loss in reasoning quality.',
        ],
      },
      {
        name: 'Skills Marketplace',
        bullets: [
          'Built an agent-based Skills Marketplace platform with Copilot and Claude enabling Ford developers to publish and reuse agent skills for everyday automations (e.g., Jira task creation) — scaling to 1K+ reusable skills (300+ daily) across the organization, compatible with GitHub Copilot, Claude Code, and OpenAI Codex.',
          'Built a duplicate-API detection pipeline for the API Catalog using lexical filtering plus ANN cosine-similarity over schema embeddings — improving API duplicate-discovery precision by 80%.',
        ],
      },
    ],
  },
]

export type Project = ResumeProject

// Projects and skills live in RESUME.md, so a new entry needs no UI code.
export const projects: Project[] = parseProjectsFromMarkdown(resumeRaw)

// Sourced live from RESUME.md's "## Skills" section — update a comma-separated
// list or add a new "### Category" heading to update the site.
export const skills: { category: string; items: string[] }[] = parseSkillsFromMarkdown(resumeRaw)

export const education = {
  degree: 'B.E., Computer Science and Engineering',
  institution: 'Sri Shakthi Institute of Engineering and Technology',
  location: 'Coimbatore',
  dates: 'May 2017 – May 2021',
}
