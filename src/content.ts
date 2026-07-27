import resumeRaw from '../RESUME.md?raw'
import { parseSkillsFromMarkdown } from './lib/parseSkills'
import { parseProjectsFromMarkdown, type ResumeProject } from './lib/parseProjects'
import { parseExperienceFromMarkdown, type ExperienceRole } from './lib/parseExperience'

export const hero = {
  name: 'Narenkumar V R',
  title: 'Senior Software Engineer — ML / MLOps / GenAI / AI Systems & Infrastructure',
  roles: ['Generative AI', 'Agentic Systems', 'Machine Learning Operations', 'AI Systems & Infrastructure', 'Cloud Architect'],
  eyebrow: 'Shipping AI Systems at Ford Motor Co.',
  tagline: 'Shipping and scaling AI/ML systems end-to-end — from prototype to production.',
  about:
    "I don't just build platforms — I architect and productionize them. From designing APIs, backend services, and stateful workflows to fine-tuning and evaluating models, I engineer the systems around them: evaluation gates, cost-aware routing across open and closed-source LLMs, automated ML workflows through CI/CD, and scalable deployments across cloud and Kubernetes environments designed to handle concurrent, high-throughput workloads.",
  location: 'Chennai, India',
  hometown: 'Chennai, India (open to relocate)',
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

export type { ExperienceProject, ExperienceRole } from './lib/parseExperience'

// Sourced live from RESUME.md's "## Experience" section, same pattern as
// projects/skills below — update RESUME.md and the site follows.
export const experience: ExperienceRole[] = parseExperienceFromMarkdown(resumeRaw)

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
