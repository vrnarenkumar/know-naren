# Narenkumar V R

Senior Software Engineer — ML / MLOps / GenAI / AI Systems & Infrastructure

- Email: vrnarenkumar@gmail.com
- LinkedIn: https://linkedin.com/in/vrnarenkumar
- GitHub: https://github.com/vrnarenkumar
- Location: Chennai, India (open to relocate)

## Summary

Senior Software Engineer (AI/ML) with 5+ years of experience shipping and scaling AI solutions end-to-end, from prototype to production.

## Experience

### Senior Software Engineer — Ford Motor Company (via STG Infotech), Chennai — March 2026 – Present

**Multi-Agent Developer Automation Platform**
- Led and mentored a team building a LangGraph based MLOps platform that bridges Software Engineering, ML, and DevOps workflow which auto-generates Terraform (IaC) and CI/CD pipelines, standardizing deployment from experimentation to production — later packaged as an MCP with FastMCP.
- Cut deploy time by 70% and enabled 2K+ deployments in under 25 minutes each.
- Built an OpenTelemetry-based observability + agent-eval layer (Arize Phoenix, Pydantic, Guardrails, LLM-as-a-judge) that traces every reasoning step, tool call, and response, and gates deployments on a 91% task-success threshold.

**Smart Design Failure Mode and Effects Analysis Platform**
- Partnered with DFMEA engineers to re-architect the old failure-mode-analysis platform with a Google ADK based agent — modeling vehicle system's boundary diagrams as node/edge/legend to automate multi-stage analysis, surfacing risks earlier and reducing warranty/recall exposure and manual effort by roughly 40%.
- Built automated ETL / data-ingestion pipelines loading 30+ DFMEA Excel sheets per week (Cloud Scheduler & Pub/Sub) into PostgreSQL — feeding a knowledge graph that powers the SmartFMA agent (Google ADK).
- Designed a complexity-aware routing layer that predicts request difficulty and selects the optimal model across self-hosted SLMs (vLLM on HPC) and Gemini on Vertex AI — cutting compute spend $50K+/year with no loss in reasoning quality.

**Skills Marketplace**
- Built an agent-based Skills Marketplace platform with Copilot and Claude enabling Ford developers to publish and reuse agent skills for everyday automations (e.g., Jira task creation) — scaling to 1K+ reusable skills (300+ daily) across the organization, compatible with GitHub Copilot, Claude Code, and OpenAI Codex.
- Built a duplicate-API detection pipeline for the API Catalog using lexical filtering plus ANN cosine-similarity over schema embeddings — improving API duplicate-discovery precision by 80%.

### Software Engineer — Ford Motor Company (via STG Infotech), Chennai — September 2022 – March 2026

**AI Notebook**
- Architected an enterprise multimodal RAG assistant — 10K+ users (300+ daily) — for Q&A and podcast generation across PDF, PPT, XLSX, Word, and TXT, with parsing and chunking tuned per file type.
- Applied advanced prompting (CoT, ToT, LATS) and hybrid retrieval (BM25 + semantic/vector) to improve accuracy and reduce hallucinations — enforcing quality with RAGAS evaluation and Guardrails output validation.
- Engineered FastAPI and WebSocket APIs (session persistence and retrieval across Elasticsearch, ChromaDB, and MongoDB Atlas Vector Search), secured with Azure-based RBAC — plus safe, backward-compatible Alembic migrations for SQL schema changes.

**MetaPix — A Data Platform**
- Engineered a data platform that transforms 3TB+ of unstructured fleet image/video into structured, searchable datasets (CLIP) — adopted by 300+ users and integrated with Voxel51, W&B, Dataloop, CVAT, and Vertex AI for data curation and training.
- Developed FFmpeg codec pipelines transcoding developer fleet recordings to optimized MP4 (H.264/HEVC) for large-scale training-data processing across Ford's autonomous/ADAS programs.

### Software Developer — Eunimart, Hyderabad — June 2021 – July 2022

- Trained deep-learning models (PyTorch) on Amazon SageMaker — BLIP captioning and Faster R-CNN object detection — auto-generating product descriptions and keywords across 500+ SKUs and cutting manual content-creation effort by 50%.
- Packaged models to Amazon ECR and served them via SageMaker endpoints, exposed through API Gateway + AWS Lambda — automating content for 50K+ Excel sheets across domestic SKUs.
- Owned Azure VM infrastructure — provisioning microservices, monitoring, and disaster recovery — for a cross-functional team.

### Software Developer, Intern — Eunimart, Hyderabad — May 2020 – June 2021

- Built asynchronous ETL / data-engineering pipelines ingesting 4.1M+ records (RabbitMQ migrated to Kafka, PostgreSQL) for the supply-chain platform serving domestic e-commerce sellers.
- Orchestrated concurrent crawler sessions across Azure VMs (BeautifulSoup, Selenium, tmux) to extract product descriptions, images, and metadata for model training.

## Personal Projects

- **describe-ai** — Give it a public GitHub repo URL and it clones the repo, analyses the codebase with an LLM (Llama 3.1 via Groq), and generates a full README.md — live, via a LangGraph pipeline. https://github.com/vrnarenkumar/describe-ai
- **notebook-agent** — Upload a PDF and ask it questions — chunked, embedded (sentence-transformers), and indexed (FAISS) on the fly, with answers grounded in the document via retrieval-augmented generation and Llama 3.1 via Groq. https://github.com/vrnarenkumar/notebook-agent
- **talk-to-your-data** — A full-stack, locally hosted "talk to your data" analytics chatbot (CrewAI, Ollama, FastAPI, React) that turns natural-language questions into read-only SQL and charts, with a pluggable multi-data-source connector layer.

## Education

**B.E., Computer Science and Engineering** — Sri Shakthi Institute of Engineering and Technology, Coimbatore — May 2017 – May 2021

## Skills

### Languages
Python, Node.js, React, SQL

### GenAI & Agents
LangGraph, LangChain, RAG, MCP, CrewAI, n8n, Google ADK, Prompt Engineering

### LLMOps & Evals
RAGAS, LangSmith, Arize Phoenix, MLflow, W&B, Vertex AI Pipelines, Airflow

### Backend
FastAPI, WebSockets, Django, Microservices, Event-Driven Architecture

### Data & Vector
PostgreSQL, BigQuery, Firestore, Spark, MongoDB, Redis, Kafka, Pub/Sub, Elasticsearch, ChromaDB, FAISS, MongoDB Atlas Vector Search, Pydantic, scikit-learn, SQLite, matplotlib

### Cloud & DevOps
AWS, Azure, GCP, Kubernetes, Helm, Terraform, Docker, GitHub Actions, OpenShift, HPC, CI/CD

### ML/DL
Hugging Face, PyTorch, TensorFlow, vLLM, TensorRT, Databricks, SageMaker, Vertex AI
