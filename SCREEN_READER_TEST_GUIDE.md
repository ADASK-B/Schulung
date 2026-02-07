# Screen Reader Test Guide

## 🎤 Anleitung zum Testen mit Screen Readern

### Windows - NVDA (Kostenlos)

#### Installation:
1. Download: https://www.nvaccess.org/download/
2. Installieren und starten
3. Browser öffnen (Firefox oder Chrome empfohlen)

#### Wichtige Tastenkombinationen:

| Aktion | Tastenkombination |
|--------|-------------------|
| NVDA Ein/Aus | `Strg + Alt + N` |
| Lesen starten | `Einfg + Pfeil runter` |
| Lesen stoppen | `Strg` |
| Nächste Überschrift | `H` |
| Nächster Link | `K` |
| Nächste Landmark | `D` |
| Nächstes List Item | `I` |
| Element-Liste öffnen | `Einfg + F7` |
| Formularmodus | `Einfg + Leertaste` |

#### Test-Szenarios für diese Website:

**1. Skip-Link Test:**
```
1. Seite laden
2. Tab drücken
3. Erwartete Ansage: "Direkt zum Hauptinhalt, Link"
4. Enter drücken → Sollte zu Main Content springen
```

**2. Navigation Test:**
```
1. D drücken (nächste Landmark)
2. Erwartete Ansage: "Hauptnavigation, Navigation-Landmark"
3. K drücken (nächster Link)
4. Erwartete Ansagen:
   - "Features, Link, Springe zu Features"
   - "Über uns, Link, Springe zu Über uns"
   - "Kontakt, Link, Springe zu Kontakt"
```

**3. Heading-Hierarchie Test:**
```
1. H drücken (nächste Überschrift)
2. Erwartete Reihenfolge:
   - "Willkommen zur modernen Web-Entwicklung, Überschrift Ebene 1"
   - "Unsere Features, Überschrift Ebene 2"
   - "React & TypeScript, Überschrift Ebene 3"
   - "Responsive Design, Überschrift Ebene 3"
   - etc.
```

**4. Landmark Navigation:**
```
1. D drücken für nächste Landmark
2. Erwartete Landmarks:
   - "Hauptnavigation, Navigation-Landmark"
   - "Hauptinhalt, Main-Landmark"
   - "Fußbereich der Seite, Contentinfo-Landmark"
```

**5. List Navigation:**
```
1. I drücken für nächstes List Item
2. Überprüfen:
   - Navigation: 3 Items
   - Feature Grid: 4 Items
   - Tech Stack: 5 Items
   - Footer Links: 3 Items
   - Footer Resources: 3 Items
```

---

### Windows - JAWS (Kommerziell)

#### Demo Version:
40-Minuten Trial bei jedem Start verfügbar

#### Wichtige Tastenkombinationen:

| Aktion | Tastenkombination |
|--------|-------------------|
| Lesen starten | `Einfg + Pfeil runter` |
| Nächste Überschrift | `H` |
| Überschriften-Liste | `Einfg + F6` |
| Nächster Link | `Tab` |
| Link-Liste | `Einfg + F7` |
| Nächste Landmark | `R` |
| Forms-Modus | `Enter` (automatisch) |

---

### macOS - VoiceOver (Built-in)

#### Aktivierung:
- `Cmd + F5` oder
- Systemeinstellungen > Bedienungshilfen > VoiceOver

#### Wichtige Tastenkombinationen:

| Aktion | Tastenkombination |
|--------|-------------------|
| VoiceOver Ein/Aus | `Cmd + F5` |
| VO-Cursor starten | `Ctrl + Alt + Shift + Pfeil runter` |
| Nächstes Element | `Ctrl + Alt + Pfeil rechts` |
| Vorheriges Element | `Ctrl + Alt + Pfeil links` |
| Interagieren | `Ctrl + Alt + Shift + Pfeil runter` |
| Rotor öffnen | `Ctrl + Alt + U` |
| Nächste Überschrift | `Ctrl + Alt + Cmd + H` |
| Nächster Link | `Ctrl + Alt + Cmd + L` |

#### Rotor Navigation:
```
1. Ctrl + Alt + U drücken
2. Pfeil links/rechts für Kategorie auswählen:
   - Headings
   - Links
   - Landmarks
   - Form Controls
3. Pfeil auf/ab zur Navigation
4. Enter zum Aktivieren
```

---

### Chrome - ChromeVox (Erweiterung)

#### Installation:
1. Chrome Web Store: "ChromeVox"
2. Extension installieren
3. `Ctrl + Alt + Z` zum Aktivieren

#### Grundlegende Bedienung:
- **Nächstes Element:** `Strg + Alt + Pfeil rechts`
- **Vorheriges Element:** `Strg + Alt + Pfeil links`
- **Nächste Überschrift:** `Strg + Alt + H`
- **Nächster Link:** `Strg + Alt + L`

---

## 📝 Test Checklist

### ✅ Grundlegende Navigation:
- [ ] Skip-Link ist fokussierbar und funktioniert
- [ ] Alle Links sind mit Tab erreichbar
- [ ] Focus Indicator ist sichtbar (3px blauer Outline)
- [ ] Keine Keyboard Traps

### ✅ Screen Reader Ansagen:
- [ ] Skip-Link wird korrekt angekündigt
- [ ] Navigation hat Label "Hauptnavigation"
- [ ] Main hat Label "Hauptinhalt"
- [ ] H1 ist die erste Überschrift im Main
- [ ] Feature Icons werden als "Bild" mit Label angekündigt
- [ ] Externe Links erwähnen "öffnet in neuem Tab"

### ✅ Semantische Struktur:
- [ ] Header → Nav → Main → Footer Reihenfolge
- [ ] H1 im Main (nur eine)
- [ ] H2 für Haupt-Sections
- [ ] H3 für Sub-Sections
- [ ] Keine übersprungenen Heading-Ebenen

### ✅ ARIA Attribute:
- [ ] aria-label auf Nav
- [ ] aria-labelledby auf Sections mit IDs
- [ ] aria-hidden="true" nur auf dekorativen Icons
- [ ] role="img" auf Icon-Containern mit aria-label
- [ ] role="list" und role="listitem" wo nötig

### ✅ Listen:
- [ ] Navigation als Liste angekündigt (3 Items)
- [ ] Feature Grid als Liste (4 Items)
- [ ] Tech Stack als Liste (5 Items)
- [ ] Footer Links als Listen

---

## 🧪 Erwartete Ansagen

### Hero Section (H1):
```
Screen Reader sagt:
"Hauptinhalt, Main-Landmark"
"Willkommen zur modernen Web-Entwicklung, Überschrift Ebene 1"
"Lernen Sie professionelle Web-Entwicklung mit React, TypeScript..."
"Jetzt starten, Link"
```

### Feature Card:
```
Screen Reader sagt:
"Liste mit 4 Einträgen"
"List Item"
"React Icon, Bild"
"React & TypeScript, Überschrift Ebene 3"
"Moderne Komponenten-Entwicklung mit React 18+..."
```

### Navigation:
```
Screen Reader sagt:
"Hauptnavigation, Navigation-Landmark"
"Liste mit 3 Einträgen"
"Features, Link, Springe zu Features"
"Über uns, Link, Springe zu Über uns"
"Kontakt, Link, Springe zu Kontakt"
```

### Footer:
```
Screen Reader sagt:
"Fußbereich der Seite, Contentinfo-Landmark"
"Footer Navigation, Navigation-Landmark"
"Links, Stark"
"Features, Link"
"Über uns, Link"
"Kontakt, Link"
```

---

## 🔍 Häufige Probleme & Lösungen

### Problem: Skip-Link wird nicht angezeigt
**Lösung:** Tab-Taste drücken, nicht Maus verwenden. Link ist visuell versteckt bis Focus.

### Problem: Screen Reader überspringt Elemente
**Lösung:** Überprüfen Sie, ob aria-hidden gesetzt ist (sollte nur bei dekorativen Elementen sein).

### Problem: Focus Indicator nicht sichtbar
**Lösung:**
- Prüfen Sie Browser-Extensions (können Styles überschreiben)
- Prüfen Sie `:focus-visible` Unterstützung im Browser

### Problem: Heading-Hierarchie wird nicht erkannt
**Lösung:**
- Verwenden Sie H1-H6, nicht styled DIVs
- Keine Ebenen überspringen (H1 → H3 ohne H2 ist falsch)

---

## 📊 Test-Protokoll Vorlage

```markdown
# Screen Reader Test - [Datum]

**Tester:** [Name]
**Screen Reader:** [NVDA/JAWS/VoiceOver]
**Browser:** [Chrome/Firefox/Safari]
**Version:** [X.Y.Z]

## Durchgeführte Tests:

### Skip-Link Navigation:
- [ ] Link ist fokussierbar
- [ ] Link funktioniert (springt zu Main)
- [ ] Korrekte Ansage
- Notizen: _________________

### Keyboard Navigation:
- [ ] Alle Links erreichbar
- [ ] Logische Tab-Reihenfolge
- [ ] Focus Indicator sichtbar
- Notizen: _________________

### Heading Structure:
- [ ] H1 im Main Content
- [ ] Keine übersprungenen Ebenen
- [ ] Logische Hierarchie
- Notizen: _________________

### ARIA Labels:
- [ ] Navigation korrekt gelabelt
- [ ] Sections haben Labels
- [ ] Icons haben Alt-Texte
- Notizen: _________________

### Landmarks:
- [ ] Header erkannt
- [ ] Main erkannt
- [ ] Footer erkannt
- Notizen: _________________

## Gefundene Probleme:
1. _________________
2. _________________

## Bewertung:
- Gesamt-Eindruck: ⭐⭐⭐⭐⭐
- Empfehlung: [ ] Bestanden [ ] Nachbesserung nötig
```

---

## 🎯 Erfolgs-Kriterien

Die Website gilt als Screen Reader-kompatibel wenn:

1. ✅ Skip-Link funktioniert und wird angekündigt
2. ✅ Alle Inhalte sind ohne Maus erreichbar
3. ✅ Heading-Hierarchie ist logisch (H1→H2→H3)
4. ✅ Landmarks werden erkannt (Header, Main, Footer)
5. ✅ Navigation ist verständlich
6. ✅ Links haben beschreibende Texte
7. ✅ Icons haben Alt-Texte oder aria-labels
8. ✅ Listen werden als Listen erkannt
9. ✅ Externe Links informieren über neues Tab
10. ✅ Keine verwirrenden oder redundanten Ansagen

---

**Tipp:** Testen Sie regelmäßig mit echten Screen Reader Nutzern für die beste Validierung!
