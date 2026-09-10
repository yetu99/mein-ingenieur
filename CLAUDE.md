# MeinIngenieur

Persoenliches Engineering-Toolkit. Bottom-up gebaut: jedes Modul rechnet fuer sich,
die Verschaltung kommt zum Schluss.

## Sprache und Einheiten

- Oberflaeche auf Deutsch
- Code, Bezeichner und Dateinamen auf Englisch
- SI-Einheiten durchgehend. Keine nackten Zahlen ueber Modulgrenzen, immer `Quantity`

## Architektur

- `src/core/` enthaelt keinen React-Import. Reine Funktionen, voll testbar
- `src/features/` enthaelt die Oberflaeche. Duenn. Keine Formel in einer Komponente
- Jedes Rechenmodul ist eine Funktion `(inputs) => CalculationResult`
- Kein zentraler Router. Jedes Modul meldet sich ueber sein eigenes Manifest an

## Jedes Rechenmodul braucht

1. Reine Funktion in `src/core/<bereich>/<name>.ts`
2. Zod-Schema fuer alle Eingaben inklusive Gueltigkeitsbereichen
3. Rechenweg als `CalcStep[]`, siehe `src/core/types/calculation.ts`
4. Mindestens zwei geprüfte Referenzfaelle als Vitest-Test
5. Normbezug mit Norm, Abschnitt und Formel
6. UI in `src/features/<bereich>/<name>/`

## Daten

- Vier zentrale Datensaetze: Werkstoffe, Gewinde, Fluid-Stoffwerte, Passungen
- Die Abhaengigkeit ist weich. Starte mit fest verdrahteten Werten im Modul und
  tausche den Import, sobald der zentrale Datensatz steht
- Jeder Kennwert traegt Quelle und Stand
- DIN-, ISO- und VDI-Volltexte werden nicht ins Repo kopiert, nur referenziert

## Git

- Nie direkt auf `main` committen
- Ein Issue, ein Branch, ein Pull Request
- Branch-Namen: `feature/<bereich>-<kurzname>`, `fix/...`, `chore/...`
- Ein Pull Request fasst keine Datei ausserhalb seines Modulordners an. Muss er doch,
  wird daraus ein eigenes Issue in `core` oder `app`
- Commit-Format: `typ(bereich): was`

## Fuer Claude Code

- Eine Session, ein Issue. Die Nummer steht im Auftrag
- Erst den Plan zeigen, dann umsetzen
- Keine neue Abhaengigkeit ohne Rueckfrage
- Keine Datei ausserhalb des Issue-Scopes anfassen
- Tests laufen lassen, bevor du fertig meldest
