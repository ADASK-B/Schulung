---
name: create-agent
description: Erstelle einen neuen spezialisierten AI Agent für das Framework
---

Erstelle einen neuen spezialisierten Agent für das AI Agent Orchestration Framework.

**Agent-Details:**
- Agent-Name (kebab-case): ${input:agentName:agent-name}
- Domäne/Expertise: ${input:domain:React, API, Testing, etc.}
- Kurze Beschreibung: ${input:description}

**Aufgabe:**

1. Erstelle die Datei `.github/agents/${input:agentName}.agent.md` mit:
   - YAML Frontmatter (name, description, tools)
   - Instructions auf Deutsch
   - Code-Beispiele auf Englisch
   - Zusammenarbeit mit anderen Agents dokumentieren
   - Relevante Skills aus `.github/skills/` referenzieren

2. Füge den Agent zu `.github/agents/web-orchestrator.agent.md` hinzu in der Liste der verfügbaren Spezialisten

3. Aktualisiere `.github/copilot-instructions.md`:
   - Füge Agent zur "Available Agents" Tabelle hinzu
   - Mit Purpose und "When to Use"

4. Nach Erstellung zeige mir die Checklist für nächste Schritte.

Beginne jetzt mit der Erstellung!
