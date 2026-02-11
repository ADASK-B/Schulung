---
description: Workflow for debugging issues with agent orchestration and delegation. Use when agents aren't collaborating correctly or quality gates fail.
---

# Debug Orchestration Prompt

Use this workflow when troubleshooting agent orchestration issues.

## Common Issues

### Issue 1: Agent Not Being Invoked

**Symptoms:**
- Web-orchestrator doesn't delegate to expected agent
- Task completed by wrong agent
- Agent invoked but doesn't execute

**Debug Steps:**

1. **Check agent list**: Verify agent exists in web-orchestrator's specialist list
```markdown
## Verfügbare Spezialisten-Agents:
- **your-agent** - Description
```

2. **Verify agent file**: Ensure proper structure
```bash
# File exists
ls .github/agents/your-agent.agent.md

# Has valid frontmatter
cat .github/agents/your-agent.agent.md | head -5
```

3. **Check namespace**: Agent name matches across all files
- Filename: `your-agent.agent.md`
- Frontmatter: `name: your-agent`
- References: `your-agent` (exact match, kebab-case)

4. **Test delegation**: Try explicit invocation
```
@web-orchestrator delegate to your-agent: [test task]
```

**Solution:**
- Add agent to web-orchestrator specialist list
- Fix filename/frontmatter mismatch
- Ensure agent has clear domain description

### Issue 2: Quality Gate Not Running

**Symptoms:**
- Security audit skipped
- Accessibility check missing
- No tests generated

**Debug Steps:**

1. **Check orchestrator checklist**: Verify gate is in quality checklist
```markdown
### ✅ Code-Quality Checkliste (IMMER befolgen):
- [ ] **Security-Auditor ausführen** nach jeder Code-Änderung
```

2. **Verify gate agent exists**: Check agent file present
```bash
ls .github/agents/security-auditor.agent.md
ls .github/agents/accessibility-expert.agent.md
ls .github/agents/testing-expert.agent.md
```

3. **Check orchestrator logic**: Ensure gate is mandatory
```markdown
## WICHTIG: Quality Gates sind PFLICHT
- Security-Auditor **IMMER** nach Code-Änderungen
- Accessibility-Expert **IMMER** bei UI-Komponenten
- Testing-Expert **IMMER** bei neuer Funktionalität
```

4. **Test gate directly**: Invoke gate agent manually
```
@security-auditor review this code for vulnerabilities
```

**Solution:**
- Add gate to orchestrator checklist
- Mark gate as mandatory (IMMER/ALWAYS)
- Document conditions (when gate applies)

### Issue 3: Agent Collaboration Failed

**Symptoms:**
- Agent doesn't delegate to related agent
- Circular delegation (A → B → A)
- Wrong agent called for subtask

**Debug Steps:**

1. **Check collaboration section**: Verify "Zusammenarbeit" documented
```markdown
## Zusammenarbeit
- **Arbeite mit**: related-agent für collaborative tasks
- **Delegiere an**: specialist-agent für specific tasks
- **Werde delegiert von**: orchestrator für incoming tasks
```

2. **Verify delegation pattern**: Ensure using runSubagent tool
```markdown
**Deine Aufgabe ist es, Aufgaben an spezialisierte Agents zu delegieren.**
**Verwende dafür IMMER das `runSubagent`-Tool.**
```

3. **Check for @-mentions**: Should NOT use @-mentions for delegation
```markdown
❌ FALSCH: @agent-name do this task
✅ RICHTIG: Use runSubagent tool
```

4. **Trace delegation chain**: Document expected flow
```
User → web-orchestrator → react-specialist → css-design-system
                        → security-auditor
                        → testing-expert
```

**Solution:**
- Add/update "Zusammenarbeit" sections
- Document clear delegation boundaries
- Use runSubagent instead of @-mentions
- Prevent circular delegation patterns

### Issue 4: Code Separation Violated

**Symptoms:**
- Inline `<style>` tags in HTML
- Inline `<script>` code in HTML
- Style/script not in separate files

**Debug Steps:**

1. **Check orchestrator rules**: Verify code separation mandated
```markdown
### ✅ Code-Quality Checkliste (IMMER befolgen):
- [ ] **CSS MUSS in separater Datei** sein (styles.css, main.css)
- [ ] **JavaScript MUSS in separater Datei** sein (script.js, main.js)
- [ ] **KEIN `<style>` Tag** in HTML (außer für Critical CSS < 1KB)
- [ ] **KEIN `<script>` Inline-Code** in HTML
```

2. **Review VERBOTEN section**: Check if violations listed
```markdown
### ❌ VERBOTEN (NIEMALS machen):
- ❌ Inline-CSS in `<style>` Tags (> 1KB)
- ❌ Inline-JavaScript in `<script>` Tags
- ❌ Inline-Event-Handler (`onclick="..."`)
```

3. **Check specialist agents**: Ensure they enforce separation
```markdown
# In css-design-system.agent.md
- CSS **IMMER** in separater .css Datei
- Keine Inline-Styles (außer Dynamic Styles)
```

4. **Test with bad example**: See if violation is caught
```html
<!-- This should be rejected -->
<style>
  .button { color: red; }
</style>
```

**Solution:**
- Strengthen orchestrator rules (make CRITICAL)
- Add to VERBOTEN (forbidden) section
- Update specialist agents to enforce
- Add verification step before task completion

### Issue 5: Skill Not Being Used

**Symptoms:**
- Agent doesn't follow skill guidance
- Inconsistent patterns across agents
- Skill guidance ignored

**Debug Steps:**

1. **Check skill reference**: Verify agent references skill
```markdown
## Richtlinien
- Siehe `.github/skills/react-component-creation/SKILL.md` für Component-Patterns
```

2. **Verify skill exists**: Check file structure
```bash
ls .github/skills/react-component-creation/SKILL.md
```

3. **Check skill frontmatter**: Ensure proper metadata
```yaml
---
name: react-component-creation
description: Guide for creating React components...
---
```

4. **Review skill content**: Verify actionable and clear
- Step-by-step instructions
- Concrete code examples
- Clear verification checklist

**Solution:**
- Add skill reference to agent
- Improve skill clarity (more examples)
- Make skill agent-agnostic (reusable)
- Add skill to copilot-instructions.md list

## Debugging Workflow

### Step 1: Identify Failure Point

Determine where orchestration broke:
- [ ] Agent not invoked at all
- [ ] Agent invoked but wrong one
- [ ] Agent executed but incomplete
- [ ] Quality gate skipped
- [ ] Code standards violated

### Step 2: Trace Delegation Path

Document what *should* happen:
```
Expected: User → orchestrator → specialist → quality gates
Actual:   User → orchestrator → [FAILED HERE]
```

### Step 3: Check Framework Files

Verify all components exist and are correct:
```bash
# Check agent files
ls .github/agents/*.agent.md

# Check skill files
ls .github/skills/*/SKILL.md

# Check instructions
cat .github/instructions/framework.instructions.md

# Check main instructions
cat .github/copilot-instructions.md
```

### Step 4: Validate Structure

Each agent should have:
- [ ] Valid YAML frontmatter (name, description)
- [ ] Kebab-case filename matching name
- [ ] German instructions, English code
- [ ] "Zusammenarbeit" section (if collaborative)
- [ ] References to relevant skills
- [ ] Quality criteria or checklist

Each skill should have:
- [ ] Folder: `.github/skills/<name>/`
- [ ] File: `SKILL.md` with frontmatter
- [ ] Step-by-step structure
- [ ] Concrete code examples
- [ ] Verification checklist
- [ ] Agent-agnostic content

### Step 5: Test Individually

Test components in isolation:

```bash
# Test agent directly (manual invocation)
@agent-name [simple test task]

# Test skill reference (check if agent uses it)
@agent-name create component following the skill

# Test orchestrator delegation
@web-orchestrator [task requiring the agent]

# Test quality gate
@security-auditor review this code
```

### Step 6: Fix and Verify

Make corrections and validate:

1. Update problematic files
2. Test with same scenario that failed
3. Verify delegation works end-to-end
4. Check quality gates run correctly
5. Confirm code standards enforced

## Diagnostic Commands

```powershell
# List all agents
Get-ChildItem .github/agents/*.agent.md | Select-Object Name

# List all skills
Get-ChildItem .github/skills/*/SKILL.md | Select-Object FullName

# Check for frontmatter issues
Get-ChildItem .github/agents/*.agent.md | ForEach-Object {
  $content = Get-Content $_.FullName -Raw
  if ($content -notmatch '(?s)^---\s+name:') {
    Write-Host "Missing frontmatter: $($_.Name)"
  }
}

# Find agents not in orchestrator
$orchestrator = Get-Content .github/agents/web-orchestrator.agent.md -Raw
Get-ChildItem .github/agents/*.agent.md | ForEach-Object {
  $name = $_.BaseName -replace '\.agent$', ''
  if ($orchestrator -notmatch $name -and $name -ne 'web-orchestrator') {
    Write-Host "Not in orchestrator: $name"
  }
}

# Check skill references
Get-ChildItem .github/agents/*.agent.md | ForEach-Object {
  $content = Get-Content $_.FullName -Raw
  $skillRefs = [regex]::Matches($content, '\.github/skills/([^/]+)/SKILL\.md')
  if ($skillRefs.Count -eq 0) {
    Write-Host "No skill refs: $($_.Name)"
  }
}
```

## Prevention Checklist

To avoid orchestration issues:

- [ ] **Always use create-agent.prompt.md** when adding agents
- [ ] **Always use create-skill.prompt.md** when adding skills
- [ ] **Update orchestrator** when adding new domain agents
- [ ] **Document collaboration** in agent files
- [ ] **Reference skills** from agents (don't duplicate)
- [ ] **Test delegation** before committing changes
- [ ] **Run quality gates** for all code changes
- [ ] **Follow naming conventions** (kebab-case, *.agent.md, SKILL.md)
- [ ] **Update copilot-instructions.md** after framework changes
- [ ] **Version control** framework files separately from generated code

## Getting Help

If still stuck:

1. **Review copilot-instructions.md**: Architecture overview
2. **Check framework.instructions.md**: Conventions and patterns
3. **Read web-orchestrator.agent.md**: See orchestration rules
4. **Examine working agent**: Compare with similar functional agent
5. **Test minimal example**: Create simple test case
6. **Check language**: German instructions, English code?
7. **Verify tooling**: runSubagent available and working?
