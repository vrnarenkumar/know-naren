import { experience, projects, skills, type ExperienceProject, type ExperienceRole, type Project } from '../content'

export type MatchedExperience = {
  role: ExperienceRole
  projects: ExperienceProject[]
}

// The curated Skills list (e.g. "PyTorch", "Spark", "Google ADK") is the keyword
// vocabulary for matching — not arbitrary words tokenized from free text. Free-text
// word matching against bullet prose is too fragile: bullets share common resume
// vocabulary ("training", "images", "systems"), and naive tokenization produces
// junk fragments (e.g. "I've" -> "ve", which is a substring of "developed",
// "achieved", "Vertex", ...). The skills list has neither problem — it's a short,
// curated set of actual tech/skill terms.
const _SKILL_TERMS = Array.from(new Set(skills.flatMap((g) => g.items))).map((s) => s.toLowerCase())

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Whole-term match, not substring: plain .includes() would let "SQL" false-match
// inside "PostgreSQL", or "AI" inside almost anything. Lookaround (rather than \b)
// handles terms like "Node.js" or "CI/CD" that start/end with non-word characters,
// where \b's word/non-word boundary rule doesn't behave as expected.
function containsTerm(haystack: string, term: string): boolean {
  return new RegExp(`(?<![a-z0-9])${escapeRegExp(term)}(?![a-z0-9])`, 'i').test(haystack)
}

function matchedSkillTerms(text: string): string[] {
  return _SKILL_TERMS.filter((term) => containsTerm(text, term))
}

/**
 * Finds resume roles relevant to a chunk of chat text — because a specific project
 * is named (e.g. "Smart Design Failure Mode and Effects Analysis Platform"), because
 * both the company and title are mentioned (e.g. "Senior Software Engineer at Ford"),
 * or because a skill from the Skills list (e.g. "PyTorch") appears in both the text
 * and one of a project's bullets — which is what makes a bare skill question like
 * "pytorch?" surface the right project instead of only working when the model
 * happens to name the project verbatim in its answer.
 * Project-name/keyword matches only surface that project; role-only matches surface all of it.
 */
export function detectExperienceRoles(text: string): MatchedExperience[] {
  if (!text) return []
  const lower = text.toLowerCase()
  const skillTerms = matchedSkillTerms(text)
  const matches: MatchedExperience[] = []

  for (const role of experience) {
    const nameMatches = role.projects.filter((p) => lower.includes(p.name.toLowerCase()))
    const keywordMatches = role.projects.filter(
      (p) =>
        !nameMatches.includes(p) &&
        skillTerms.some((term) => p.bullets.some((b) => containsTerm(b, term))),
    )
    const matchedProjects = [...nameMatches, ...keywordMatches]

    const company = role.company.split(' ')[0].toLowerCase()
    const roleHit = lower.includes(company) && lower.includes(role.title.toLowerCase())

    if (matchedProjects.length > 0) {
      matches.push({ role, projects: matchedProjects })
    } else if (roleHit) {
      matches.push({ role, projects: role.projects })
    }
  }

  return matches
}

/**
 * Finds Personal Projects (the portfolio's project cards — describe-ai,
 * talk-to-your-data, etc., not work experience) relevant to a chunk of chat text:
 * because the project is named, or because one of its own tags (e.g. "MLflow" on
 * weather-vision-lora) appears in the text. Each project's own tags are the
 * vocabulary here (not the global Skills list) since project tags may include
 * things the Skills list doesn't (e.g. "sqlglot", "spaCy").
 */
export function detectPersonalProjects(text: string): Project[] {
  if (!text) return []
  const lower = text.toLowerCase()

  return projects.filter(
    (proj) =>
      lower.includes(proj.name.toLowerCase()) ||
      proj.tags.some((tag) => containsTerm(text, tag.toLowerCase())),
  )
}
