# GitHub Copilot Workshop - Folieninhalte

---

## Folie 0: Inhaltsverzeichnis

### 📋 Agenda - 60 Minuten Praxis-Workshop

#### 1. Ziel & Motivation
*Trumpf-Beispiel: Der Unterschied zwischen generischem Code und professionellem Output durch richtige Copilot-Nutzung*

#### 2. Voraussetzungen & Setup-Check
*Technische Voraussetzungen prüfen und sicherstellen, dass alle startklar sind*

#### 3. Grundlagen Showcase
*Überblick über alle Copilot-Features: Autocomplete, Chat, Plan, Agent, Settings & Tools*

#### 4. Grenzen & Best Practices
*Token-Limits verstehen, gute Prompts schreiben und instructions richtig nutzen*

#### 5. Plan Mode
*Strukturiertes Vorgehen für neue Features mit Akzeptanzkriterien und Tests als Sparring Partner*

#### 6. Agent Mode
*Autonome Entwicklung mit automatischer Test-Ausführung und Fehlerkorrektur*

#### 7. Live Demo - Webseite erstellen
*Hands-on: Trumpf-Webseite mit Plan & Agent Mode live entwickeln (15 Minuten Kern-Demo)*

#### 8. Erweiterung - Instructions & Templates
*Professionelles Setup: Instructions, Skills, Custom Agents und Delegation für Teams*

#### 9. Fragen & Wrap-up
*Q&A, nächste Schritte und Materialien für euren Start*

---

## Folie 1: Ziel & Motivation

### 🎯 Warum richtige Nutzung von Copilot wichtig ist

#### ❌ OHNE Copilot Instructions

Aufgabe: "Erstelle eine Webseite für Trumpf"

Copilot erstellt:
- Generische HTML-Seite
- Standard CSS
- Keine spezifischen Standards
- Inkonsistenter Code-Style
- Keine Best Practices

**Ergebnis: ⭐⭐ (2/5 Sterne)**
**Nacharbeit: Hoch**

#### ✅ MIT Copilot Instructions + guten Prompts

Aufgabe mit Kontext:
- Tech Stack definiert
- Design-System vorgegeben
- Code-Standards klar
- Accessibility-Anforderungen
- Performance-Kriterien

**Ergebnis: ⭐⭐⭐⭐⭐ (5/5 Sterne)**
**Nacharbeit: Minimal**

### 💡 Der Unterschied liegt nicht in Copilot, sondern WIE wir es nutzen! Heute lernt ihr: Den richtigen Weg!

---

## Folie 2: Voraussetzungen & Setup-Check

### ✅ Haben alle alles vorbereitet?

#### Hardware & Software:
- ✅ VS Code installiert (neueste Version)
- ✅ GitHub Copilot Extension aktiv
- ✅ Internet-Verbindung stabil
- ✅ GitHub Account eingeloggt

#### Copilot Status prüfen:
- ✅ Copilot Icon unten rechts sichtbar
- ✅ Status zeigt "Ready" oder Checkmark
- ✅ Chat öffnet sich: `Strg+Alt+I` (Win) / `⌘+⌥+I` (Mac)
- ✅ Test: "Hello!" im Chat funktioniert

#### Materialien bereit:
- ✅ Workshop-Repository geklont/geöffnet
- ✅ Demo-Files vorhanden
- ✅ Zweiter Monitor optional (hilfreich)

### 🧪 Schnelltest (30 Sekunden):
1. Chat öffnen (`Strg+Alt+I`)
2. Eingeben: "Hello! Bist du bereit?"
3. Copilot sollte antworten
- ✅ Funktioniert? → Super, weiter!
- ❌ Problem? → Im Chat melden!

#### Wichtigste Shortcuts:

| Funktion | Windows/Linux | Mac |
|----------|---------------|-----|
| **Chat öffnen** | `Strg+Alt+I` | `⌘+⌥+I` |
| **Inline Chat** | `Strg+I` | `⌘+I` |

### 🆘 Probleme?
- Extension neu laden
- VS Code neu starten
- Trainer ansprechen

---

## Folie 3: Grundlagen Showcase

### 🚀 Was können wir mit Copilot machen?

#### 1. 🔄 Autocomplete
Automatische Code-Vervollständigung
Beim Tippen → Tab zum Akzeptieren

#### 2. ⌨️ Inline Chat (`Strg+I`)
Schnelle Edits
Code markieren → Prompt → Diff prüfen

#### 3. 💬 Chat Panel (`Strg+Alt+I`)
Hauptarbeitsbereich
Ask, Edit, Plan, Agent

#### 4. 📋 Plan Mode
Strukturierte Multi-File Features
Aufgaben in Schritte zerlegen

#### 5. 🤖 Agent Mode
Autonome Entwicklung
Tests ausführen, iterieren

#### 6. ⚙️ Settings & Tools
Einstellungen & Erweiterungen
Copilot Instructions, Skills

### 💡 MCP (Model Context Protocol):
Noch nicht freigeschaltet → Heute nicht Teil des Workshops
Kommt bald für erweiterte Funktionen!

---

## Folie 4: Grenzen & Best Practices

### ⚠️ Grenzen kennen & Best Practices anwenden

#### 🔢 Das Problem: Token & Kontext-Limits

Copilot kann NICHT unbegrenzt Code verarbeiten!

**Limits:**
- ~8.000 - 32.000 Tokens je nach Modell
- 1 Token ≈ 4 Zeichen
- Große Dateien = weniger Kontext

**✅ Die Lösung:**
- Aufgaben in kleine Teile zerlegen (max 5-7 Dateien)
- Nur relevante Dateien öffnen
- Spezifische Pfade angeben
- Scope klein halten

#### Gute Prompts schreiben:

**❌ Schlechte Prompts:**
- "Erstelle eine Webseite"
- "Add error handling"
- "Mach es besser"

→ Zu vage, kein Kontext!

**✅ Gute Prompts:**
```
Erstelle eine Webseite:
- Tech Stack: React + TypeScript
- Responsive Design mit TailwindCSS
- Accessibility: WCAG 2.1 AA
- Components: Header, Hero, Footer
```

→ Spezifisch, Kontext, messbar!

#### 📄 Copilot Instructions (.github/copilot-instructions.md)

**Was gehört rein?**
- ✅ Tech Stack & Frameworks
- ✅ Code-Style & Naming Conventions
- ✅ Testing Standards
- ✅ Security Rules
- ✅ Projektstruktur
- ✅ Best Practices für euer Team

→ Copilot berücksichtigt das automatisch!

**Beispiel:**
```markdown
## Tech Stack
- React 18 + TypeScript (strict mode)
- TailwindCSS für Styling
- Vitest für Unit Tests

## Naming Conventions
- Components: PascalCase (UserCard.tsx)
- Hooks: camelCase mit "use" prefix
- Tests: *.test.tsx

## Code Style
- Functional Components only
- Arrow Functions bevorzugt
- 2 Spaces Indentation
```

---

## Folie 5: Plan Mode

### 📋 Plan Mode - Sparring Partner für neue Projekte

#### Was ist Plan Mode?

- 🎯 Zerlegt große Aufgaben in kleine Schritte
- 📝 Erstellt übersichtliche Checkliste
- 👁️ Zeigt Preview BEVOR Code entsteht
- ✏️ Plan ist editierbar - IHR habt die Kontrolle
- ✅ Schritt-für-Schritt Umsetzung
- 🔄 Iterativ anpassbar

#### Wann Plan Mode nutzen?

**✅ Perfekt für:**
- Projekt-Start (neue Features)
- Multi-File Features
- Component + Tests + Styles
- API Integration mit Tests
- Refactoring über mehrere Dateien
- Wenn du Struktur brauchst

**❌ Nicht geeignet für:**
- Kleine Single-File Änderungen
- Quick Edits
- Einfache Bug Fixes
- Copy-Paste Tasks

#### Vorgehen, Akzeptanzkriterien, Tests

**1️⃣ VORGEHEN definieren**
Was soll entstehen? In welchen Schritten?

**2️⃣ AKZEPTANZKRITERIEN festlegen**
Woran erkenne ich, dass es funktioniert?
- [ ] Feature X funktioniert
- [ ] Tests laufen durch
- [ ] Performance-Ziel erreicht

**3️⃣ TESTS einfordern**
Tests sind TEIL des Plans, nicht optional!
- [ ] Unit Tests für Komponenten
- [ ] Integration Tests für API
- [ ] E2E Tests für User-Flows

→ Plan reviewen BEVOR Execute!

### 💡 Empfehlung: Plan Mode als Sparring Partner nutzen!

"Ich will Feature X bauen. Wie würdest du das strukturieren? Welche Schritte sind nötig? Was könnte ich übersehen?"

→ Copilot hilft beim Denken!

---

## Folie 6: Agent Mode

### 🤖 Agent Mode - Iterative Entwicklung mit Tests

#### Was ist Agent Mode?

- 🚀 Arbeitet selbstständig an Aufgaben
- 🔄 Führt mehrere Schritte nacheinander aus
- 🧪 Führt Tests aus und zeigt Ergebnisse
- ♻️ Iteriert automatisch bei Fehlern
- 📊 Transparent: Zeigt jeden Schritt
- ✅ Prüft eigene Arbeit

#### Workflow: Iterieren, Prüfen, Tests

```
1. Code schreiben
      ↓
2. Tests erstellen
      ↓
3. Tests ausführen
      ↓
   ✅ Grün?  → Fertig! ✨
   ❌ Rot?   → Zurück zu 1. (Fehler analysieren & fixen)
      ↓
4. IHR reviewt den Code
      ↓
   ✅ OK?    → Akzeptieren
   ❌ Nicht OK? → Feedback geben & Agent iterieren lassen
```

#### Wann Agent Mode nutzen?

**✅ Perfekt für:**
- Service + Tests + Execution
- Refactoring mit Validierung
- Bug Fix + Regression Tests
- Code der sich selbst testen soll
- Iterative Verbesserungen

**⚠️ NICHT für:**
- Kritische Production Code ohne Review
- Security-relevanter Code alleine
- Zu große Scope (>7 Dateien)

### 🔒 WICHTIG - Eure Verantwortung:

**1. ALLE Änderungen reviewen**
→ Diffs durchgehen
→ Code verstehen
→ Tests prüfen

**2. Security besonders prüfen**
→ Auth/Authorization
→ Input Validation
→ Secrets Management

**3. Scope klein halten**
→ Max 5-7 Dateien pro Task
→ Bei mehr: Aufteilen!

**4. Tests sind Pflicht**
→ Agent soll Tests schreiben
→ Agent soll Tests ausführen
→ Ihr prüft Test-Qualität

### 💎 Agent ist mächtig, aber IHR seid verantwortlich!

---

## Folie 7: Live Demo - Webseite erstellen

### 🎬 Live Demo: Trumpf Webseite erstellen
### Hands-on mit Plan Mode & Agent Mode

**Aufgabe:** Moderne Webseite für Trumpf erstellen
**Tech Stack:** React + TypeScript + TailwindCSS
**Komponenten:** Header, Hero, Features, Footer

---

### PHASE 1: Plan Mode 📋

**1️⃣ Prompt vorbereiten (mit Instructions)**
```markdown
#plan Trumpf Webseite erstellen

Ziel: Moderne, responsive Webseite

Anforderungen:
- React 18 + TypeScript
- TailwindCSS für Styling
- Komponenten: Header, Hero, Features, Footer
- Responsive Design (Mobile-First)
- Accessibility: WCAG 2.1 AA

Akzeptanzkriterien:
- [ ] Alle Komponenten funktionieren
- [ ] Responsive auf allen Breakpoints
- [ ] Tests vorhanden
- [ ] Performance: Lighthouse Score > 90
```

**2️⃣ Plan reviewen**
- ✅ Struktur macht Sinn?
- ✅ Alle Komponenten dabei?
- ✅ Tests eingeplant?

**3️⃣ Plan anpassen** (falls nötig)
Eigene Anpassungen vornehmen

**4️⃣ Plan starten**
Execute → Beobachten

---

### PHASE 2: Agent Mode 🤖

**5️⃣ Agent Aufgabe geben**
```
@workspace Implementiere den Plan

Zusätzlich:
- Erstelle Tests für jede Komponente
- Run tests mit npm test
- Fix failures if any
- Optimiere für Performance
```

**6️⃣ Agent arbeiten lassen**
- 👁️ Code wird erstellt
- 👁️ Tests werden geschrieben
- 👁️ Tests werden ausgeführt

**7️⃣ Fehlerbehandlung beobachten**
- ❌ Test schlägt fehl
- 🔄 Agent analysiert
- ✅ Agent korrigiert
- ✅ Test läuft durch

**8️⃣ Review durchführen**
- 📝 Diffs checken
- 🧠 Code verstehen
- 🔒 Security prüfen
- ✅ Akzeptieren

---

### ERGEBNIS anschauen 🎉

**9️⃣ Webseite starten**
`npm run dev`

**🔟 Browser öffnen**
- → Sieht gut aus!
- → Responsive checken
- → Performance testen

---

**Split-Screen:**

```
Links: Code & Tests              Rechts: Browser Preview
├── Header.tsx                   ┌─────────────────────┐
├── Hero.tsx                     │  [Webseite läuft]   │
├── Features.tsx                 │                     │
├── Footer.tsx                   │  ✅ Responsive      │
└── *.test.tsx                   │  ✅ Accessible      │
                                 │  ✅ Performant      │
                                 └─────────────────────┘
```

### 💡 Was wir gesehen haben:

- ✅ Plan Mode strukturiert die Arbeit
- ✅ Agent Mode setzt autonom um
- ✅ Tests werden automatisch erstellt & ausgeführt
- ✅ Fehler werden selbst korrigiert
- ✅ WIR reviewen und entscheiden

**⏱️ Zeit gespart: ~70%**
**📈 Qualität: Höher durch Tests**
**🎯 Fokus: Auf Logik, nicht Boilerplate**

---

## Folie 8: Erweiterung - Instructions & Templates

### 🔧 Erweiterte Features: Instructions, Skills & Agents

#### 📄 Copilot Instructions Beispiel (.github/copilot-instructions.md)

```markdown
# Copilot Instructions für [Projekt-Name]

## Tech Stack
- Frontend: React 18 + TypeScript (strict mode)
- Styling: TailwindCSS v3
- State: Zustand
- Testing: Vitest + React Testing Library
- Build: Vite

## Code Standards
### Naming Conventions
- Components: PascalCase (UserCard.tsx)
- Hooks: camelCase mit "use" (useAuth.ts)
- Utils: camelCase (formatDate.ts)
- Constants: UPPER_SNAKE_CASE

### File Structure
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── hooks/          # Custom hooks
├── services/       # API calls
├── utils/          # Helper functions
└── types/          # TypeScript types

## Best Practices
- Functional Components only (no class components)
- Arrow Functions preferred
- Async/Await instead of Promises
- Error boundaries for graceful errors
- Accessibility: WCAG 2.1 AA minimum

## Testing Requirements
- Unit Tests: All utilities & hooks
- Component Tests: User interactions
- Coverage: Minimum 80% for critical paths
- Test naming: describe('ComponentName', () => {...})

## Security Rules
- No API keys in code (use .env)
- Input validation for all user inputs
- XSS prevention with output encoding
- HTTPS only for API calls
```

---

#### 🎓 Skills - Was ist das?

**Skills = Wiederverwendbares Wissen**

**Struktur:**
```
.github/skills/
├── react-component/
│   └── SKILL.md
├── api-integration/
│   └── SKILL.md
└── testing-patterns/
    └── SKILL.md
```

**Was gehört in ein Skill?**
- Spezifisches Domain-Wissen
- Best Practices für Task-Typ
- Code-Patterns & Beispiele
- Checklisten
- Häufige Fehler & Lösungen

**Beispiel: react-component/SKILL.md**
```markdown
# Skill: React Component Creation

## Checklist
- [ ] TypeScript Interface für Props
- [ ] PropTypes validation
- [ ] Error Boundary
- [ ] Accessibility attributes
- [ ] Responsive Design
- [ ] Tests vorhanden

## Pattern
export const ComponentName: React.FC<Props> = ({...}) => {
  // Component logic
}
```

---

#### 🤖 Custom Agents - Spezialisierte Assistenten

**Wofür?**
- Code Reviews durchführen
- Security Audits
- Performance Optimierung
- Documentation Generation
- Bestimmte Frameworks (Next.js, etc.)

**Wie erstellen?**
```
.github/agents/
├── code-reviewer/
│   └── agent.json
└── security-auditor/
    └── agent.json
```

**Beispiel: code-reviewer/agent.json**
```json
{
  "name": "Code Reviewer",
  "description": "Reviews code for quality",
  "instructions": "...",
  "skills": ["testing-patterns", "best-practices"]
}
```

---

#### 🎯 Delegate Agents - Aufgaben verteilen

**Konzept:**
```
┌─────────────────────────────────────┐
│      Master Agent (Coordinator)      │
└──────────────┬──────────────────────┘
               │
      ┌────────┼────────┐
      ↓        ↓        ↓
┌─────────┐ ┌─────┐ ┌─────────┐
│Frontend │ │ API │ │ Testing │
│ Agent   │ │Agent│ │  Agent  │
└─────────┘ └─────┘ └─────────┘
```

**Vorteile:**
- ✅ Spezialisierung
- ✅ Parallele Arbeit
- ✅ Fokussierter Kontext
- ✅ Bessere Qualität

**Beispiel-Aufgabe:**
```
@coordinator Erstelle eine User-Management Seite

Delegiere an:
- Frontend Agent: UI Components
- API Agent: REST Endpoints
- Testing Agent: E2E Tests
```

---

### 💡 Leistungsstark kombiniert:

```
Instructions     →  Team-Standards
    +
Skills          →  Task-spezifisches Wissen
    +
Custom Agents   →  Spezialisierte Assistenten
    +
Delegation      →  Aufgaben optimal verteilen
    ═══════════════════════════════════
    = Professionelles Development Setup
```

---

## Folie 9: Fragen & Wrap-up

### ❓ Fragen?

#### Was gelernt:
- ✅ Setup & Grundlagen
- ✅ Grenzen & Best Practices
- ✅ Plan Mode als Sparring Partner
- ✅ Agent Mode für Automation
- ✅ Webseite Live-Demo
- ✅ Instructions & Skills Setup
- ✅ Delegation für große Projekte

#### Häufige Fragen:

**💬 "Funktioniert offline?"**
→ Nein, braucht Internet

**💬 "Welche Daten werden gesendet?"**
→ Code-Kontext für Vorschläge

**💬 "Kann ich es für Private Code nutzen?"**
→ Ja, mit Business/Enterprise Plan

**💬 "Was wenn Copilot falsch liegt?"**
→ Deshalb reviewen wir ALLES!

**💬 "Kostet es extra?"**
→ Ja, ~10€/Monat (Individual)
→ ~19€/Monat (Business)

#### Nächste Schritte:

**Heute noch:**
- ✅ Übungen durcharbeiten
- ✅ Eigenes Projekt starten

**Diese Woche:**
- ✅ Instructions für Team erstellen
- ✅ Skills definieren
- ✅ 3x Plan/Agent ausprobieren

**Im Team:**
- ✅ Copilot Instructions repo-weit
- ✅ Best Practices dokumentieren
- ✅ Erfolge teilen!

---

### 📚 Eure Materialien:

**📂 Repository:**
```
├── /docs/BEST_PRACTICES.md
├── /templates/PROMPTS.md
├── /exercises/
├── /.github/copilot-instructions.md (Beispiel)
└── /.github/skills/ (Beispiele)
```

**📖 Links:**
- GitHub Copilot Docs: docs.github.com/en/copilot
- Workshop Materials: [Repository-Link]
- OWASP Top 10: owasp.org/Top10

**📧 Kontakt:**
- Trainer: [Email]
- Feedback: [Survey-Link/QR-Code]
- Follow-up Fragen: [Slack/Teams Channel]

---

### 🚀 Jetzt loslegen!

👉 Startet heute noch ein Projekt mit Copilot
👉 Nutzt die gelernten Templates & Best Practices
👉 Teilt eure Erfolge im Team
👉 Gebt uns Feedback!

### Vielen Dank & viel Erfolg! 🎉
