# Gemeinsam programmieren: Leitfaden für MeinIngenieur

Für zwei Entwickler, GitHub, Claude Code. Geschrieben ohne Vorwissen vorauszusetzen.

---

## 1. Die Landkarte: was läuft wo

Vier Orte, die oft verwechselt werden.

| Ort | Was es ist | Wann es lebt |
|---|---|---|
| **GitHub** (github.com/owner/repo) | Der Server. Die verbindliche Wahrheit, an der ihr beide hängt. | Immer |
| **Lokaler Klon** (ein Ordner auf deinem Mac) | Deine Arbeitskopie. Eine vollständige Kopie inklusive Historie. | Immer, offline nutzbar |
| **Claude Code** (im Terminal, im Klon-Ordner) | Schreibt Code in deinem lokalen Klon. Kann git bedienen. | Nur wenn dein Mac an ist |
| **Cowork** (dieser Chat) | Läuft in Anthropics Cloud, verbunden mit deinem Mac. | Läuft weiter, wenn der Mac zu ist, sieht dann aber deine Dateien nicht |

Merksatz: GitHub ist der Treffpunkt. Dein Klon ist deine Werkbank. Der Klon deines Kollegen ist seine Werkbank. Beide Werkbänke gleichen sich über GitHub ab, niemals direkt miteinander.

### Wer macht was

- **Claude Code** macht die eigentliche Programmierarbeit. Er sieht das ganze Repo, ändert Dateien, startet Tests, macht Commits.
- **Cowork** macht Konzept, Architektur, Normprüfung, Issue-Planung, Review von Ideen. Cowork kann deine Dateien lesen, wenn dein Mac an ist, und läuft an langen Aufgaben weiter, wenn du den Laptop zuklappst.

Für "programmiere Modul X" nimm Claude Code. Für "ist meine VDI 2230 Formel richtig" oder "wie schneide ich das Modul" nimm Cowork.

---

## 2. Einmalige Einrichtung

### 2.1 Werkzeug installieren

```bash
brew install gh        # GitHub CLI, macht Login und Issues von der Kommandozeile
gh auth login          # dann: GitHub.com, HTTPS, Login with a web browser
```

`gh auth login` richtet gleichzeitig ein, dass `git` sich bei GitHub ausweisen kann. Ohne diesen Schritt fragt jeder `git clone` eines privaten Repos nach einem Passwort, das es so nicht mehr gibt.

Namen setzen, damit deine Commits dir zugeordnet werden:

```bash
git config --global user.name "Seti Frotscher"
git config --global user.email "deine@mail.de"
```

### 2.2 Repo anlegen (falls es noch nicht existiert)

```bash
gh repo create mein-ingenieur --private --description "Engineering-Toolkit" --clone
```

Das legt das Repo auf GitHub an **und** klont es sofort in den aktuellen Ordner. Führe es dort aus, wo der Klon landen soll.

Falls das Repo schon existiert, nur klonen:

```bash
cd ~/Desktop/MeinIngenieur
gh repo clone owner/mein-ingenieur
```

**Der "Pfad zum Repo" ist genau dieser neu entstandene Ordner.** Also zum Beispiel `~/Desktop/MeinIngenieur/mein-ingenieur`. Mehr steckt nicht dahinter. Ein Repo lokal zu haben heißt, einen Ordner zu haben, in dem ein verstecktes `.git` liegt.

Prüfen, ob es geklappt hat:

```bash
cd ~/Desktop/MeinIngenieur/mein-ingenieur
git remote -v          # muss die GitHub-URL zeigen
git status             # muss "On branch main" zeigen
```

### 2.3 Kollegen einladen

```bash
gh api repos/owner/mein-ingenieur/collaborators/SEIN_GITHUB_NAME -X PUT
```

Oder auf github.com: Settings, Collaborators, Add people.

### 2.4 main schützen (wichtig)

Auf github.com: Settings, Branches, Add branch protection rule für `main`, Haken bei "Require a pull request before merging".

Damit kann niemand mehr versehentlich direkt auf main schieben. Die Regel, die ihr euch vorgenommen habt, wird dadurch technisch erzwungen statt nur gut gemeint.

---

## 3. Der tägliche Ablauf

Sechs Schritte. Jeden Tag dieselben.

```bash
# 1. Aktuellen Stand holen (IMMER zuerst, bevor du irgendetwas anfasst)
git checkout main
git pull

# 2. Branch für dein Issue anlegen
git checkout -b feature/calc-beam-bending

# 3. Arbeiten (hier kommt Claude Code ins Spiel)
claude

# 4. Zwischenstände sichern, gerne mehrmals
git add .
git commit -m "feat(calc): Biegemodul, reine Rechenfunktion"

# 5. Hochladen und Pull Request öffnen
git push -u origin feature/calc-beam-bending
gh pr create --fill

# 6. Nach dem Merge aufräumen
git checkout main
git pull
git branch -d feature/calc-beam-bending
```

Das sind fünf git-Befehle, die du wirklich brauchst: `pull`, `checkout -b`, `add`, `commit`, `push`. Alles andere ist Sonderfall.

### Branch-Namen

Aus dem Issue-Titel ableiten. Issue `[calc] Build beam bending calculator` wird zu `feature/calc-beam-bending`. Präfixe: `feature/` für Neues, `fix/` für Reparaturen, `chore/` für Aufräumen.

### Commit-Nachrichten

`typ(bereich): was` in einer Zeile. Beispiele:

- `feat(calc): Biegemodul, Schnittgrößen und Biegelinie`
- `fix(db): falsche Streckgrenze bei 1.4301 korrigiert`
- `chore(ci): Vitest in die Pipeline`

---

## 4. Arbeiten mit Claude Code im Repo

### Starten

```bash
cd ~/Desktop/MeinIngenieur/mein-ingenieur
claude
```

Claude Code arbeitet immer im Ordner, in dem du ihn startest. Startest du ihn woanders, sieht er das Repo nicht.

### Das gemeinsame Gedächtnis: CLAUDE.md

Lege im Repo-Wurzelverzeichnis eine `CLAUDE.md` an. Die wird mitversioniert, also lesen **beide** Claude-Instanzen dieselben Regeln. Das ist der wichtigste Hebel gegen "jeder baut anders".

Inhalt zum Beispiel:

```markdown
# MeinIngenieur

## Konventionen
- UI auf Deutsch, Code und Bezeichner auf Englisch
- SI-Einheiten durchgehend
- src/core/ enthält keinen React-Import. Reine Funktionen, voll testbar
- src/features/ enthält die Oberfläche, dünn, keine Formeln

## Git
- Nie direkt auf main committen
- Ein Issue, ein Branch, ein Pull Request
- Ein Pull Request fasst keine Datei außerhalb seines Modulordners an

## Jedes Rechenmodul
- Rückgabe nach dem Rechenweg-Contract in src/core/types/
- Mindestens zwei geprüfte Referenzfälle als Test
- Normbezug mit Norm, Abschnitt, Formel
```

### Eine Session, ein Issue

Gute Aufgabenstellung an Claude Code:

> Arbeite Issue #34 ab. Leg vorher einen Branch feature/calc-beam-bending an. Nur die reine Rechenfunktion plus Tests, keine UI.

Schlechte Aufgabenstellung:

> Bau die App.

Der Unterschied ist der Grund, warum du dich überfordert fühlst. Eine Session mit klarer Kante endet in einem Pull Request, den dein Kollege in zehn Minuten lesen kann. Eine Session ohne Kante endet in 40 geänderten Dateien, die niemand mehr reviewen will.

### Der Trick gegen Überforderung

Bevor du Claude Code loslässt, lass ihn erst einen Plan schreiben und lies ihn. Erst dann sagst du "los". Wenn der Plan schon falsch ist, hast du zwei Minuten verloren statt zwei Stunden.

---

## 5. Was tun, wenn

### "Ich habe aus Versehen auf main committet"

```bash
git branch feature/rettung      # Stand als Branch sichern
git reset --hard origin/main    # main zurücksetzen
git checkout feature/rettung    # auf dem Branch weiterarbeiten
```

### "Mein Branch ist veraltet, main hat sich weiterbewegt"

```bash
git checkout main && git pull
git checkout feature/mein-branch
git rebase main
```

### "Merge-Konflikt"

Das ist normal und kein Fehler. Git markiert die Stellen in der Datei mit `<<<<<<<` und `>>>>>>>`. Du entscheidest, welche Version bleibt, löschst die Markierungen, dann:

```bash
git add die-datei.ts
git rebase --continue
```

Wenn du unsicher bist, `git rebase --abort` bringt dich zurück zum Ausgangspunkt. Nichts geht verloren.

### "Wir haben beide dieselbe Datei angefasst"

Passiert, wenn ein Pull Request seinen Modulordner verlässt. Genau deshalb die Registry statt eines zentralen Routers. Wenn es doch passiert: kurz absprechen, wer zuerst merged, der andere rebased danach.

### "Ich weiß nicht mehr, wo ich bin"

```bash
git status        # welcher Branch, was ist geändert
git log --oneline -10   # die letzten zehn Commits
git branch -a     # alle Branches
```

---

## 6. Spickzettel

```bash
git status                       # wo bin ich, was ist offen
git checkout main && git pull    # aktuellen Stand holen
git checkout -b feature/xyz      # neuer Branch
git add . && git commit -m "..." # sichern
git push -u origin feature/xyz   # hochladen
gh pr create --fill              # Pull Request öffnen
gh issue list --label scope:module --state open   # freie Module ansehen
gh issue develop 34 --checkout   # Branch aus Issue 34 erzeugen und wechseln
```

Der letzte Befehl ist der bequemste Einstieg. Er nimmt die Issue-Nummer, baut daraus einen Branch, verknüpft beide und wechselt hin. Ein Befehl statt drei.
