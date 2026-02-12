# Sub-Tasks für Issue #4: TRUMPF Landing Page

## Übersicht
Dieses Dokument listet alle Sub-Tasks für die Erstellung einer einfachen, sauberen Landing Page für TRUMPF auf.

**Übergeordnetes Issue:** #4 - Create Website  
**Ziel:** Eine moderne, professionelle Landing Page für TRUMPF erstellen

## Status: 📋 Planung

---

## Sub-Tasks

### Phase 1: Projekt-Setup ⚙️
**Priorität:** HOCH | **Status:** ⏳ Ausstehend

#### 1.1 Projekt-Initialisierung
- [ ] Vite + React + TypeScript Projekt aufsetzen
  - `npm create vite@latest trumpf-landing -- --template react-ts`
- [ ] TailwindCSS installieren und konfigurieren
- [ ] Projektstruktur nach Framework-Standards erstellen
  - `src/components/`, `src/pages/`, `src/assets/`, etc.
- [ ] ESLint + Prettier konfigurieren
- [ ] Git-Workflow einrichten (`.gitignore`, Branches)

**Geschätzter Aufwand:** 1-2 Stunden  
**Abhängigkeiten:** Keine  
**Verantwortlich:** DevOps-Spezialist / React-Spezialist

---

### Phase 2: Design & Komponenten 🎨
**Priorität:** HOCH | **Status:** ⏳ Ausstehend

#### 2.1 Komponenten-Architektur planen
- [ ] Wireframe/Layout für Landing Page erstellen
- [ ] Komponenten-Struktur definieren:
  - Header/Navigation
  - Hero-Section
  - Features-Section
  - About-Section
  - Contact-Section (optional)
  - Footer
- [ ] Design-System festlegen (Farben, Typography, Spacing)

**Geschätzter Aufwand:** 2-3 Stunden  
**Abhängigkeiten:** 1.1 abgeschlossen  
**Verantwortlich:** CSS-Design-System Spezialist

#### 2.2 Header-Komponente erstellen
- [ ] Header.tsx mit Navigation implementieren
- [ ] Header.module.css mit responsivem Design
- [ ] TRUMPF Logo einbinden
- [ ] Navigation (Desktop & Mobile)
- [ ] Header.test.tsx schreiben

**Geschätzter Aufwand:** 2-3 Stunden  
**Abhängigkeiten:** 2.1 abgeschlossen  
**Verantwortlich:** React-Spezialist + CSS-Spezialist

#### 2.3 Hero-Section erstellen
- [ ] HeroSection.tsx mit Hauptbotschaft implementieren
- [ ] HeroSection.module.css mit Animationen
- [ ] Call-to-Action Button(s)
- [ ] Responsive Layout
- [ ] HeroSection.test.tsx schreiben

**Geschätzter Aufwand:** 2-3 Stunden  
**Abhängigkeiten:** 2.1 abgeschlossen  
**Verantwortlich:** React-Spezialist + CSS-Spezialist

#### 2.4 Features-Section erstellen
- [ ] FeaturesSection.tsx mit Grid/Cards Layout
- [ ] FeaturesSection.module.css
- [ ] Icons/Illustrationen einbinden
- [ ] Hover-Effekte implementieren
- [ ] FeaturesSection.test.tsx schreiben

**Geschätzter Aufwand:** 2-3 Stunden  
**Abhängigkeiten:** 2.1 abgeschlossen  
**Verantwortlich:** React-Spezialist + CSS-Spezialist

#### 2.5 About-Section erstellen
- [ ] AboutSection.tsx mit TRUMPF-Informationen
- [ ] AboutSection.module.css
- [ ] Bilder/Medien einbinden
- [ ] AboutSection.test.tsx schreiben

**Geschätzter Aufwand:** 1-2 Stunden  
**Abhängigkeiten:** 2.1 abgeschlossen  
**Verantwortlich:** React-Spezialist + CSS-Spezialist

#### 2.6 Footer erstellen
- [ ] Footer.tsx mit Links und Informationen
- [ ] Footer.module.css
- [ ] Social Media Links (optional)
- [ ] Copyright-Information
- [ ] Footer.test.tsx schreiben

**Geschätzter Aufwand:** 1-2 Stunden  
**Abhängigkeiten:** 2.1 abgeschlossen  
**Verantwortlich:** React-Spezialist + CSS-Spezialist

---

### Phase 3: Integration & Hauptseite 🔧
**Priorität:** HOCH | **Status:** ⏳ Ausstehend

#### 3.1 Landing Page zusammenbauen
- [ ] App.tsx alle Komponenten integrieren
- [ ] Layout und Spacing optimieren
- [ ] Scroll-Verhalten implementieren (smooth scroll)
- [ ] Loading States hinzufügen (falls nötig)

**Geschätzter Aufwand:** 1-2 Stunden  
**Abhängigkeiten:** 2.2-2.6 abgeschlossen  
**Verantwortlich:** React-Spezialist

---

### Phase 4: Quality Gates 🛡️
**Priorität:** KRITISCH | **Status:** ⏳ Ausstehend

#### 4.1 Security Audit
- [ ] XSS-Prävention prüfen
- [ ] Input Validation (falls Formulare vorhanden)
- [ ] Content Security Policy konfigurieren
- [ ] HTTPS-Anforderungen prüfen
- [ ] Keine Secrets im Code
- [ ] Security-Auditor Review durchführen

**Geschätzter Aufwand:** 1-2 Stunden  
**Abhängigkeiten:** 3.1 abgeschlossen  
**Verantwortlich:** Security-Auditor

#### 4.2 Accessibility Audit (WCAG 2.1 AA)
- [ ] Semantic HTML überprüfen
- [ ] Alt-Texte für alle Bilder
- [ ] ARIA-Labels wo nötig
- [ ] Keyboard-Navigation testen
- [ ] Farb-Kontraste prüfen (min. 4.5:1)
- [ ] Screen Reader Testing (VoiceOver/NVDA)
- [ ] Accessibility-Expert Review durchführen

**Geschätzter Aufwand:** 2-3 Stunden  
**Abhängigkeiten:** 3.1 abgeschlossen  
**Verantwortlich:** Accessibility-Expert

#### 4.3 Testing
- [ ] Unit Tests für alle Komponenten (80%+ Coverage)
- [ ] Integration Tests für Hauptseite
- [ ] E2E Tests mit Playwright
  - Navigation funktioniert
  - Call-to-Action Buttons funktionieren
  - Responsive Verhalten
- [ ] Testing-Expert Review durchführen

**Geschätzter Aufwand:** 3-4 Stunden  
**Abhängigkeiten:** 3.1 abgeschlossen  
**Verantwortlich:** Testing-Expert

---

### Phase 5: Performance & SEO ⚡
**Priorität:** MITTEL | **Status:** ⏳ Ausstehend

#### 5.1 Performance-Optimierung
- [ ] Core Web Vitals prüfen (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- [ ] Code Splitting implementieren (React.lazy)
- [ ] Bilder optimieren (WebP, responsive, lazy loading)
- [ ] Bundle Size analysieren und optimieren
- [ ] Performance-Optimizer Review durchführen

**Geschätzter Aufwand:** 2-3 Stunden  
**Abhängigkeiten:** 4.1-4.3 abgeschlossen  
**Verantwortlich:** Performance-Optimizer

#### 5.2 SEO-Optimierung
- [ ] Meta Tags hinzufügen (Title, Description, Keywords)
- [ ] Open Graph Tags für Social Media
- [ ] Sitemap erstellen
- [ ] robots.txt konfigurieren
- [ ] Strukturierte Daten (JSON-LD)
- [ ] SEO-Specialist Review durchführen

**Geschätzter Aufwand:** 1-2 Stunden  
**Abhängigkeiten:** 4.1-4.3 abgeschlossen  
**Verantwortlich:** SEO-Specialist

---

### Phase 6: Deployment 🚀
**Priorität:** MITTEL | **Status:** ⏳ Ausstehend

#### 6.1 CI/CD Pipeline aufsetzen
- [ ] GitHub Actions Workflow erstellen
- [ ] Build-Prozess automatisieren
- [ ] Tests in Pipeline integrieren
- [ ] Deployment zu Hosting-Service (z.B. Vercel, Netlify)
- [ ] Environment Variables konfigurieren

**Geschätzter Aufwand:** 2-3 Stunden  
**Abhängigkeiten:** 5.1-5.2 abgeschlossen  
**Verantwortlich:** DevOps-Deployment Spezialist

#### 6.2 Production Deployment
- [ ] Domain konfigurieren (falls vorhanden)
- [ ] SSL-Zertifikat einrichten
- [ ] CDN konfigurieren (optional)
- [ ] Monitoring einrichten (optional)
- [ ] Production-Testing durchführen

**Geschätzter Aufwand:** 1-2 Stunden  
**Abhängigkeiten:** 6.1 abgeschlossen  
**Verantwortlich:** DevOps-Deployment Spezialist

---

## Nächste Schritte (Priorität)

### 🎯 Sofort starten:
1. **Sub-Task #1.1:** Projekt-Initialisierung (Vite + React + TypeScript Setup)
2. **Sub-Task #2.1:** Komponenten-Architektur planen

### 📋 Danach:
3. **Sub-Task #2.2-2.6:** Komponenten erstellen (Header → Hero → Features → About → Footer)
4. **Sub-Task #3.1:** Landing Page integrieren

### 🛡️ Pflicht vor Abschluss:
5. **Sub-Task #4.1-4.3:** Quality Gates durchführen (Security, Accessibility, Testing)

### ⚡ Optional aber empfohlen:
6. **Sub-Task #5.1-5.2:** Performance & SEO optimieren
7. **Sub-Task #6.1-6.2:** CI/CD & Deployment

---

## Gesamtschätzung

- **Minimaler Aufwand (nur Kern-Features):** 15-20 Stunden
- **Vollständig (mit Quality Gates):** 25-30 Stunden
- **Vollständig (mit Performance, SEO, Deployment):** 35-40 Stunden

---

## Framework-Konventionen

Alle Implementierungen müssen folgende Framework-Regeln einhalten:

✅ **PFLICHT:**
- CSS in separaten `.css` oder `.module.css` Dateien
- JavaScript/TypeScript in separaten `.ts`/`.tsx` Dateien
- KEINE inline `<style>` Tags (außer Critical CSS < 1KB)
- KEINE inline `<script>` Tags
- TypeScript strict mode
- Named exports (keine default exports)
- Komponenten-Tests mit mindestens 80% Coverage

✅ **Quality Gates:**
- Security-Auditor muss Review durchführen
- Accessibility-Expert muss Review durchführen
- Testing-Expert muss Review durchführen

✅ **Tech Stack:**
- React 18+ mit TypeScript
- TailwindCSS oder CSS Modules
- Vitest + React Testing Library
- Vite als Build-Tool

---

## Notizen

- Alle Komponenten sollten nach dem Skill "react-component-creation" erstellt werden
- CSS sollte nach dem Skill "css-responsive-design" implementiert werden
- Tests sollten nach dem Skill "react-component-testing" geschrieben werden
- Orchestrierung über `web-orchestrator` Agent empfohlen

---

**Erstellt am:** 2026-02-12  
**Bezieht sich auf:** Issue #4  
**Status:** Dokumentation erstellt, bereit zur Umsetzung
