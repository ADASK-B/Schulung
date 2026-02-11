# Copilot Instructions: AI Agent Orchestration Framework

This repository is an **AI agent orchestration framework** for web development, not a code project. It contains specialized agents and reusable skills that coordinate to handle complex development tasks.

## Architecture Overview

```
.github/
├── agents/              # Specialized AI agents (12 agents)
│   ├── web-orchestrator.agent.md      # Coordinates all agents
│   ├── react-specialist.agent.md      # React components & hooks
│   ├── security-auditor.agent.md      # Security reviews
│   └── ...
├── skills/              # Reusable knowledge modules (14 skills)
│   ├── react-component-creation/      # Component patterns
│   ├── form-validation/               # Form handling guide
│   └── ...
├── instructions/        # Framework and coding rules
│   ├── framework.instructions.md      # Core framework conventions
│   └── web-development.instructions.md # Generated code standards
├── prompts/             # Workflow templates
│   ├── create-agent.prompt.md         # New agent template
│   ├── create-skill.prompt.md         # New skill template
│   ├── extend-framework.prompt.md     # Extension workflow
│   └── debug-orchestration.prompt.md  # Troubleshooting guide
└── copilot-instructions.md (this file)
```

## Critical Patterns

### 1. Agent File Structure

All agent files follow this pattern (.github/agents/*.agent.md):

```markdown
---
name: agent-name
description: Brief description of the agent's purpose
tools: ["read", "edit", "search"]  # Optional
---

Agent instructions in markdown...
```

**Naming convention**: kebab-case filename matching frontmatter name

### 2. Skill File Structure

Skills live in `.github/skills/<skill-name>/SKILL.md`:

```markdown
---
name: skill-name
description: When to use this skill
---

# Skill Title

Step-by-step instructions...
```

**Key difference**: Skills are passive knowledge modules; agents are active specialists that use skills.

### 3. Orchestrator Pattern

The `web-orchestrator` agent is the entry point for complex tasks:
- **Delegates** to specialized agents via `runSubagent` tool (NEVER @-mentions)
- **Enforces quality gates**: security-auditor, accessibility-expert, testing-expert
- **Mandates code separation**: CSS/JS in separate files, no inline code

Example orchestration flow:
1. User requests feature → web-orchestrator
2. Delegate to react-specialist → creates component
3. Delegate to css-design-system → styles component
4. Delegate to security-auditor → reviews for vulnerabilities
5. Delegate to testing-expert → writes tests

### 4. Quality Gates (Always Applied)

From [.github/agents/web-orchestrator.agent.md](.github/agents/web-orchestrator.agent.md):

```
✅ Mandatory Checks:
[ ] CSS in separate file (styles.css, main.css)
[ ] JavaScript in separate file (script.js, main.js)
[ ] NO <style> tags (except critical CSS < 1KB)
[ ] NO inline <script> code
[ ] Security-auditor runs after code changes
[ ] Accessibility-expert runs for UI components
[ ] Testing-expert runs for new functionality
```

## Available Agents

| Agent | Purpose | When to Use |
|-------|---------|-------------|
| web-orchestrator | Coordinates all agents | Complex multi-agent tasks |
| react-specialist | React components, hooks, state | React development |
| css-design-system | Styling, responsive design | UI/layout work |
| api-developer | REST/GraphQL APIs | Backend endpoints |
| testing-expert | Unit/integration/E2E tests | Writing tests |
| security-auditor | Security reviews | Security checks |
| accessibility-expert | WCAG compliance | Accessibility audits |
| performance-optimizer | Performance optimization | Speed/bundle size |
| database-specialist | Schema design, queries | Database work |
| seo-specialist | SEO, meta tags, Core Web Vitals | SEO optimization |
| devops-deployment | CI/CD, Docker, deployment | DevOps tasks |

## Available Skills

Skills provide domain-specific guidance:
- `react-component-creation` - Component structure patterns
- `form-validation` - React Hook Form + Zod
- `authentication-implementation` - JWT/session auth
- `api-endpoint-creation` - RESTful API patterns
- `database-schema-design` - Prisma ORM schemas
- `accessibility-audit` - WCAG 2.1 AA checklist
- `security-audit` - OWASP Top 10 checklist
- `performance-optimization` - Core Web Vitals guide
- Additional skills in [.github/skills/](.github/skills/)

## Modifying This Framework

### Adding a New Agent

1. Create `.github/agents/<name>.agent.md`
2. Add YAML frontmatter with `name` and `description`
3. Write agent-specific instructions
4. Update web-orchestrator's agent list if needed

### Adding a New Skill

1. Create `.github/skills/<name>/SKILL.md`
2. Add YAML frontmatter with `name` and `description`
3. Write step-by-step procedural guidance
4. Skills should be agent-agnostic (reusable)

### Conventions

- **Agents**: Active specialists that perform tasks
- **Skills**: Passive knowledge that agents reference
- **Instructions**: Framework rules and coding standards
- **Prompts**: Reusable workflow templates and guides
- **Language**: German for instructions, English for code
- **Tool Usage**: Agents specify allowed tools in frontmatter

### Key Files

- [framework.instructions.md](.github/instructions/framework.instructions.md) - Core framework rules, naming conventions, file structure
- [web-development.instructions.md](.github/instructions/web-development.instructions.md) - Coding standards for generated code
- [create-agent.prompt.md](.github/prompts/create-agent.prompt.md) - Template for creating new agents
- [create-skill.prompt.md](.github/prompts/create-skill.prompt.md) - Template for creating new skills
- [extend-framework.prompt.md](.github/prompts/extend-framework.prompt.md) - Workflow for major extensions
- [debug-orchestration.prompt.md](.github/prompts/debug-orchestration.prompt.md) - Troubleshooting guide

## Web Development Standards (For Generated Code)

When agents generate actual code, they follow these standards:
- **Stack**: React 18 + TypeScript, TailwindCSS, Vite
- **Testing**: Vitest + React Testing Library
- **Naming**: PascalCase components, camelCase functions/hooks
- **Style**: 2 spaces, single quotes, semicolons, max 100 chars
- **Security**: Input validation, XSS prevention, no secrets in code
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation

See individual agents/skills for detailed standards.
