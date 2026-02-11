---
name: extend-framework
description: Erweitere das Framework mit neuen Capabilities (Agents, Skills, Quality Gates, Patterns)
---

Erweitere das AI Agent Orchestration Framework mit neuen Capabilities.

**Extension-Typ:**
${input:extensionType:New Agent Category, New Skill Category, New Quality Gate, New Orchestration Pattern}

**Details:**

## Extension Types

### Type 1: New Agent Category

When adding a completely new domain that doesn't fit existing agents.

**Steps:**
1. Identify the domain expertise needed
2. Check if existing agents can be extended vs. creating new
3. Create agent using `.github/prompts/create-agent.prompt.md`
4. Create supporting skill using `.github/prompts/create-skill.prompt.md`
5. Update web-orchestrator delegation logic
6. Update copilot-instructions.md documentation

**Example:** Adding a "mobile-developer" agent for React Native

### Type 2: New Skill Category

When adding a new type of procedural knowledge.

**Steps:**
1. Identify the skill category (e.g., deployment patterns, caching strategies)
2. Create foundational skill in new category
3. Reference from relevant existing agents
4. Add to copilot-instructions.md skills section

**Example:** Adding "caching-strategies" skill for Redis/Memcached patterns

### Type 3: New Quality Gate

When adding a new mandatory check to the orchestrator.

**Steps:**
1. Create specialized audit agent (e.g., privacy-auditor, compliance-auditor)
2. Update web-orchestrator quality gate checklist
3. Document when the gate applies (always, conditionally)
4. Create audit skill with checklist format

**Example:** Adding GDPR compliance checks

### Type 4: New Orchestration Pattern

When adding a new way agents collaborate.

**Steps:**
1. Document the pattern in `framework.instructions.md`
2. Update relevant agent collaboration sections
3. Add examples to web-orchestrator
4. Test the pattern with multiple agents

**Example:** Adding parallel agent execution for independent tasks

## Extension Workflow

### Phase 1: Planning

Before making changes:

1. **Identify gap**: What capability is missing?
2. **Check existing**: Can existing agents/skills be extended?
3. **Scope impact**: Which files need updates?
4. **Design integration**: How does it fit the framework?

### Phase 2: Implementation

Create new components:

1. **Create agent(s)**: Use create-agent.prompt.md
   - Follow naming conventions
   - Add to `.github/agents/`
   - Include collaboration section

2. **Create skill(s)**: Use create-skill.prompt.md
   - Follow folder structure
   - Add to `.github/skills/`
   - Make agent-agnostic

3. **Update orchestrator**: Modify web-orchestrator.agent.md
   - Add to specialist list
   - Update delegation logic
   - Add quality gates if needed

4. **Update instructions**: Modify framework.instructions.md
   - Document new patterns
   - Add conventions
   - Update examples

### Phase 3: Documentation

Update all relevant documentation:

1. **copilot-instructions.md**:
   - Add agents to table
   - Add skills to list
   - Update architecture overview

2. **Agent collaboration**:
   - Update "Zusammenarbeit" sections
   - Document delegation patterns
   - Add workflow examples

3. **Create prompts** (if needed):
   - Add workflow prompts for new patterns
   - Document common use cases

### Phase 4: Validation

Test the extension:

1. **Verify delegation**: Test web-orchestrator can invoke new agents
2. **Check quality gates**: Ensure gates run appropriately
3. **Test integration**: Multiple agents working together
4. **Review documentation**: All references updated

## Example: Adding GraphQL Support

### Step 1: Create GraphQL Agent

File: `.github/agents/graphql-specialist.agent.md`

```markdown
---
name: graphql-specialist
description: GraphQL-Experte für Schema-Design, Queries und Resolvers
tools: ["read", "edit", "search"]
---

Du bist ein GraphQL-Spezialist...
[Agent content]
```

### Step 2: Create GraphQL Skills

Files:
- `.github/skills/graphql-schema-design/SKILL.md`
- `.github/skills/graphql-resolver-patterns/SKILL.md`

### Step 3: Update Web Orchestrator

Add to specialist list in `web-orchestrator.agent.md`:
```markdown
- **graphql-specialist** - GraphQL Schema, Queries, Mutations, Subscriptions
```

### Step 4: Update Copilot Instructions

Add to agent table in `copilot-instructions.md`:
```markdown
| graphql-specialist | GraphQL APIs, schema design | GraphQL development |
```

### Step 5: Update API Developer

Add collaboration to `api-developer.agent.md`:
```markdown
## Zusammenarbeit
- **Delegiere an**: graphql-specialist für GraphQL-spezifische Tasks
```

## Extension Checklist

Before considering the extension complete:

- [ ] **Agents created**: All new agents follow conventions
- [ ] **Skills created**: All procedural knowledge documented
- [ ] **Orchestrator updated**: Delegation logic includes new agents
- [ ] **Instructions updated**: framework.instructions.md reflects changes
- [ ] **Documentation updated**: copilot-instructions.md is current
- [ ] **Collaboration documented**: Agent "Zusammenarbeit" sections updated
- [ ] **Quality gates applied**: Security, accessibility, testing checks work
- [ ] **Naming consistent**: All files follow kebab-case conventions
- [ ] **Language correct**: German instructions, English code
- [ ] **Examples provided**: Code examples are concrete and runnable
- [ ] **Testing completed**: Framework works with new components

## Common Extension Patterns

### Pattern 1: Adding Tech Stack Support

Example: Adding Vue.js support alongside React

1. Create `vue-specialist.agent.md`
2. Create skills: `vue-component-creation`, `vue-state-management`
3. Update web-orchestrator to choose React vs Vue specialist
4. Keep existing React assets unchanged (parallel, not replacement)

### Pattern 2: Adding Vertical Domain

Example: Adding e-commerce specific features

1. Create `ecommerce-specialist.agent.md` (domain expert)
2. Create skills: `payment-integration`, `cart-management`, `order-processing`
3. Agent collaborates with existing specialists (api-developer, security-auditor)
4. Add quality gate for PCI compliance (payment data)

### Pattern 3: Adding Cross-Cutting Concern

Example: Adding monitoring/observability

1. Create `monitoring-specialist.agent.md`
2. Create skills: `logging-setup`, `metrics-collection`, `alerting-config`
3. Update ALL agents to mention monitoring in relevant sections
4. Add to quality gates (all code should have logging)

### Pattern 4: Adding Alternative Approach

Example: Adding TDD workflow alongside existing testing

1. Create skill: `test-driven-development`
2. Update `testing-expert.agent.md` to include TDD guidance
3. Update web-orchestrator to optionally use TDD flow
4. Document when to use TDD vs test-after approach

## Rollback Plan

If an extension causes issues:

1. **Remove agent file**: Delete `.github/agents/<agent>.agent.md`
2. **Remove skills**: Delete `.github/skills/<skill>/` folders
3. **Revert orchestrator**: Remove from web-orchestrator specialist list
4. **Revert documentation**: Remove from copilot-instructions.md
5. **Revert instructions**: Remove patterns from framework.instructions.md

Keep git history clean with descriptive commits for easy rollback.

## Maintenance Notes

After extending the framework:

- **Monitor usage**: Track which agents are called frequently
- **Gather feedback**: Note pain points or unclear instructions
- **Iterate**: Improve based on actual usage patterns
- **Deprecate carefully**: Mark old agents/skills before removing
- **Version**: Consider versioning for major framework changes
