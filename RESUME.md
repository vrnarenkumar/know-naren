# Narenkumar V R

Senior Software Engineer — ML / MLOps / GenAI / AI Systems & Infrastructure

- Email: vrnarenkumar@gmail.com
- LinkedIn: https://linkedin.com/in/vrnarenkumar
- GitHub: https://github.com/vrnarenkumar
- Location: Chennai, India

## Summary

Senior Software Engineer (AI/ML) with 5+ years of experience shipping and scaling AI solutions end-to-end, from prototype to production.

## Experience

### Senior Software Engineer — Ford Motor Company (via STG Infotech), Chennai — March 2026 – Present

**Multi-Agent Developer Automation Platform**
- Led and mentored a team building a LangGraph-based MLOps platform bridging Software Engineering, ML, and DevOps workflows.
- Built the platform's core pipeline to auto-generate Terraform (IaC) from natural-language input, standardizing infrastructure provisioning.
- Built the platform's CI/CD pipeline auto-generation, standardizing deployment from experimentation to production.
- Packaged the platform as an MCP server with FastMCP for reuse across other agent tooling.
- Cut deploy time by 70% through this automation.
- Enabled 2K+ deployments in under 25 minutes each.
- Built an OpenTelemetry-based observability layer (Arize Phoenix) that traces every reasoning step, tool call, and response the agents make.
- Built an agent-eval layer (Pydantic, Guardrails, LLM-as-a-judge) that gates deployments on a 91% task-success threshold.
- Managed container images and versioning on the Red Hat Quay platform.

**Smart Design Failure Mode and Effects Analysis Platform**
- Partnered with DFMEA engineers to re-architect the legacy failure-mode-analysis platform around a Google ADK-based agent.
- Modeled each vehicle system's boundary diagram as a node/edge/legend graph to automate multi-stage failure-mode analysis.
- Reduced warranty/recall exposure and manual analysis effort by roughly 40% through this automation.
- Built automated ETL / data-ingestion pipelines (Cloud Scheduler & Pub/Sub) loading 30+ DFMEA Excel sheets per week into PostgreSQL.
- Fed that ingested data into a knowledge graph that powers the SmartFMA agent (Google ADK).
- Designed a complexity-aware routing layer that predicts request difficulty and picks the optimal model per request.
- Routed requests across self-hosted SLMs (vLLM on HPC) and Gemini (Vertex AI) based on that difficulty prediction.
- Cut compute spend by $50K+/year through this routing, with no loss in reasoning quality.

**Smart Skills **
- Built an agent-based Skills platform (with Copilot and Claude) for developers to publish and reuse agent skills for everyday automations (e.g., Jira task creation).
- Scaled the marketplace to 1K+ reusable skills, with 300+ used daily across the organization.
- Made the marketplace compatible with GitHub Copilot, Claude Code, and OpenAI Codex.
- Built a duplicate-API detection pipeline for the API Catalog using lexical filtering plus ANN cosine-similarity over schema embeddings.
- Improved API duplicate-discovery precision by 80% with that pipeline.

### Software Engineer — Ford Motor Company (via STG Infotech), Chennai — September 2022 – March 2026

**AI Notebook**
- Architected an enterprise multimodal RAG assistant for Q&A and podcast generation across PDF, PPT, XLSX, Word, and TXT documents.
- Tuned parsing and chunking per file type, scaling the assistant to 10K+ users (300+ daily).
- Applied advanced prompting techniques (Chain-of-Thought, Tree-of-Thought, LATS) to improve answer accuracy and reduce hallucinations.
- Built a hybrid retrieval layer (BM25 + semantic/vector search) to surface more relevant context per query.
- Enforced answer quality with RAGAS evaluation and Guardrails output validation.
- Engineered FastAPI and WebSocket APIs for session persistence and retrieval across Elasticsearch, ChromaDB, and MongoDB Atlas Vector Search.
- Secured those APIs with Azure-based RBAC.
- Wrote safe, backward-compatible Alembic migrations for the underlying SQL schema.

**MetaPix — A Data Platform**
- Engineered a data platform that transforms unstructured fleet image/video into structured, searchable datasets using CLIP embeddings.
- Processed 3TB+ of fleet data through the platform, adopted by 300+ users.
- Integrated the platform with Voxel51, W&B, Dataloop, CVAT, and Vertex AI for data curation and training workflows.
- Developed FFmpeg codec pipelines transcoding developer fleet recordings to optimized MP4 (H.264/HEVC).
- Enabled large-scale training-data processing across Ford's autonomous/ADAS programs with these pipelines.
- Deployed services such as CVAT, Voxel51 and Weights & Biases on HPC infrastructure, configuring Kubernetes deployments with virtual services, volumes, and storage via Helm and manual deployment.
- Managed CI/CD pipelines and triggers with Tekton, deployed on OpenShift.

### Software Developer — Eunimart, Hyderabad — June 2021 – July 2022

**SKU Listing Automation**
- Deployed NLP services — Description Generation, Keyword Generation, Similar Product Finder, and Image Recognition — as microservices with nginx, managing them on Azure VMs.
- Trained deep-learning models (PyTorch) on Amazon SageMaker for BLIP image captioning and Faster R-CNN object detection.
- Used those models to auto-generate product descriptions and keywords across 500+ SKUs, cutting manual content-creation effort by 50%.
- Packaged the trained models to Amazon ECR and served them via SageMaker endpoints.
- Exposed those endpoints through API Gateway + AWS Lambda, automating content generation for 50K+ Excel sheets across domestic SKUs.
- Owned Azure VM infrastructure for a cross-functional team, including provisioning microservices.
- Owned monitoring and disaster recovery for that same Azure VM infrastructure.

### Software Developer, Intern — Eunimart, Hyderabad — May 2020 – June 2021

**Supply-Chain Data Pipelines**
- Built asynchronous ETL / data-engineering pipelines ingesting 4.1M+ records for the supply-chain platform serving domestic e-commerce sellers.
- Migrated the pipeline's messaging layer from RabbitMQ to Kafka, with PostgreSQL as the data store.
- Orchestrated concurrent crawler sessions across Azure VMs (BeautifulSoup, Selenium, tmux) to extract product descriptions, images, and metadata for model training.

## Personal Projects

<!-- PORTFOLIO PROJECTS
Add a project by copying this block. It automatically appears on the site.

### Project name
One concise sentence describing the project and its outcome.
- Tags: Tool one, Tool two, Tool three
- Link: https://github.com/your-account/project
- Demo: describe-ai                  # optional; only for an existing live demo
- Color: #38bdf8, #7dd3fc           # optional; base and highlight colours
- Images: shot-one.png, shot-two.png # optional; files in /public/projects/<Project name>/
-->

### describe-ai
Give it a public GitHub repo URL and it clones the repo, analyses the codebase with an LLM (Llama 3.1 via Groq), and generates a full README.md — live, via a LangGraph pipeline.
- Tags: LangGraph, Groq (Llama 3.1), PyGithub, FastAPI
- Link: https://github.com/vrnarenkumar/describe-ai
- Demo: describe-ai
- Color: #38bdf8, #7dd3fc

### notebook-agent
Upload a PDF and ask it questions — chunked, embedded (sentence-transformers), and indexed (FAISS) on the fly, with answers grounded in the document via retrieval-augmented generation and Llama 3.1 via Groq.
- Tags: sentence-transformers, FAISS, Groq (Llama 3.1), FastAPI
- Link: https://github.com/vrnarenkumar/notebook-agent
- Demo: notebook-agent
- Color: #a78bfa, #c4b5fd

### talk-to-your-data
Ask questions about a database in plain English and get back SQL, a chart, and a summary — a staged NLU/NER/text-to-SQL/NLG pipeline (spaCy schema linking, sqlglot-validated read-only queries, Llama 3.1 via Groq) instead of a multi-agent framework.
- Tags: NLU, NER, NLG, spaCy, sqlglot, Groq (Llama 3.1), FastAPI, React
- Link: https://github.com/vrnarenkumar/talk-to-your-data
- Demo: talk-to-data
- Color: #34d399, #6ee7b7

### weather-vision-lora
Fine-tuned a Vision Transformer with LoRA (PEFT) to classify road/weather conditions from images — 90% accuracy training only 0.35% of parameters, tracked end-to-end with MLflow. Framed as a proof-of-concept perception module for automotive systems, e.g. feeding a TPMS to auto-adjust tire pressure for detected road conditions.
- Tags: PyTorch, Hugging Face Transformers, PEFT/LoRA, MLflow
- Link: https://github.com/vrnarenkumar/weather-vision-lora
- Images: class-samples.jpg, loss-accuracy.png, confusion-matrix.png, sample-predictions.jpg
- Color: #fbbf24, #fde68a

## Education

**B.E., Computer Science and Engineering** — Sri Shakthi Institute of Engineering and Technology, Coimbatore — May 2017 – May 2021

## Skills

<!-- PORTFOLIO SKILLS
This section powers the skills slide on the website.
To add a skill, append it to the comma-separated list under the right category.
To add a category, copy the two lines below. No UI code is required.

### Category name
Skill one, Skill two, Skill three
-->

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
Deep Learning, Computer Vision, NLP, NLU, NLG, NER, Hugging Face, PyTorch, TensorFlow, vLLM, TensorRT, Databricks, SageMaker, Vertex AI
