---
description: Core framework rules for the AI Agent Orchestration System. These instructions must be followed when working with agents, skills, and the orchestration framework.
applyTo: ".github/**/*.{agent,skill,prompt,instructions}.md"
---

# Framework Instructions

## Agent File Conventions

### File Structure
- **Location**: `.github/agents/<agent-name>.agent.md`
- **Naming**: kebab-case matching the frontmatter name
- **Extension**: `.agent.md`

### Required Frontmatter
```yaml
---
name: agent-name          # kebab-case, must match filename
description: Brief agent purpose (one sentence)
tools: ["read", "edit", "search"]  # Optional: restrict available tools
---
```

### Agent Content Rules
- Write instructions in **German** (user-facing language)
- Write code examples in **English** (technical standard)
- Focus on **what** the agent does, not generic advice
- Reference relevant skills from `.github/skills/`
- Keep instructions actionable and specific

### Agent Naming Patterns
- Specialists: `<domain>-specialist` (react-specialist, testing-specialist)
- Experts: `<domain>-expert` (accessibility-expert, security-expert)
- System: `<domain>-<purpose>` (css-design-system, web-orchestrator)

## Skill File Conventions

### File Structure
- **Location**: `.github/skills/<skill-name>/SKILL.md`
- **Naming**: kebab-case folder, `SKILL.md` file
- **Extension**: `.md`

### Required Frontmatter
```yaml
---
name: skill-name          # kebab-case, must match folder name
description: When to use this skill (guidance for agents)
---
```

### Skill Content Rules
- Write **procedural step-by-step guidance**
- Be **agent-agnostic** (any agent can use it)
- Include **concrete code examples**
- Structure with numbered steps and clear sections
- Focus on **how** to accomplish specific tasks

### Skill Categories
- Component patterns: react-component-*, css-*
- Implementation guides: authentication-*, api-*
- Quality checklists: security-audit, accessibility-audit
- Optimization guides: performance-*, database-*

## Orchestrator Rules (Critical)

### Delegation Pattern
The `web-orchestrator` agent **MUST**:
- Use `runSubagent` tool (NEVER @-mentions)
- Enforce quality gates: security-auditor, accessibility-expert, testing-expert
- Verify code separation: CSS/JS in separate files (no inline code)

### Quality Gate Checklist
Before completing any task, verify:
- [ ] CSS in separate file (styles.css, not `<style>`)
- [ ] JavaScript in separate file (script.js, not inline `<script>`)
- [ ] Security review completed (security-auditor)
- [ ] Accessibility review completed (accessibility-expert, for UI)
- [ ] Tests written (testing-expert, for new functionality)

### Delegation Workflow
1. Analyze task → identify required specialists
2. Execute core work → delegate to domain agents
3. Run quality gates → security, accessibility, testing
4. Verify standards → code separation, conventions

## File Organization

### Directory Structure
```
.github/
├── agents/                    # Specialized AI agents
│   ├── web-orchestrator.agent.md
│   ├── react-specialist.agent.md
│   └── ...
├── skills/                    # Reusable knowledge modules
│   ├── react-component-creation/
│   │   └── SKILL.md
│   └── ...
├── instructions/              # Framework rules (this file)
│   └── framework.instructions.md
├── prompts/                   # Workflow templates
│   ├── create-agent.prompt.md
│   └── create-skill.prompt.md
└── copilot-instructions.md   # Main overview document
```

### File Naming Conventions
- **Agents**: `<name>.agent.md` (kebab-case)
- **Skills**: `<folder-name>/SKILL.md` (folder is kebab-case)
- **Instructions**: `<topic>.instructions.md` (kebab-case)
- **Prompts**: `<workflow>.prompt.md` (kebab-case)

## Code Standards (For Generated Code)

When agents generate actual web development code:

### Stack Requirements
- **Frontend**: React 18+ with TypeScript
- **Styling**: TailwindCSS or CSS Modules (separate files)
- **Testing**: Vitest + React Testing Library
- **Build**: Vite

### Code Quality
- **TypeScript**: Strict mode, no `any` types
- **Components**: Functional only, named exports
- **Naming**: PascalCase components, camelCase functions
- **Style**: 2 spaces, single quotes, semicolons, max 100 chars

### Security Requirements
- Input validation on all user data
- XSS prevention (sanitize output)
- No secrets in code (environment variables)
- HTTPS for all API calls

### Accessibility Requirements
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- WCAG 2.1 AA compliance

## Modifying the Framework

### Adding a New Agent
1. Create `.github/agents/<agent-name>.agent.md`
2. Add required frontmatter (name, description, optional tools)
3. Write agent instructions in German
4. Update `web-orchestrator.agent.md` if it needs to delegate to this agent
5. Update `copilot-instructions.md` agent list

### Adding a New Skill
1. Create folder `.github/skills/<skill-name>/`
2. Create `SKILL.md` with required frontmatter
3. Write procedural step-by-step guidance
4. Ensure agent-agnostic (reusable by multiple agents)
5. Update `copilot-instructions.md` skill list

### Creating Instructions
- Use for **framework-level rules** that apply globally
- Focus on **conventions and patterns**
- Reference frequently from agents/skills
- Keep concise and actionable

### Creating Prompts
- Use for **repeatable workflows** (create agent, debug issue)
- Include placeholders for customization
- Structure as fill-in templates
- Focus on specific use cases

## Language Conventions

- **Instructions/Agents**: German (Projektsprache)
- **Code/Comments**: English (Standardsprache)
- **Filenames**: English kebab-case
- **Documentation**: German for user-facing, English for technical

## Don'ts

- ❌ Don't create agents without specialist focus (stay domain-specific)
- ❌ Don't write agent-specific logic in skills (keep reusable)
- ❌ Don't use @-mentions for orchestration (use runSubagent tool)
- ❌ Don't skip quality gates (security, accessibility, testing)
- ❌ Don't allow inline CSS/JS in HTML (code separation required)
- ❌ Don't mix languages (German instructions, English code)
- ❌ Don't create default exports (named exports only)
