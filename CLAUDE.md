# MeinIngenieur

Personal engineering toolkit for mechanical design calculations. Built bottom-up:
every module works on its own, integration comes last.

## Language

| Layer | Language |
|---|---|
| Code, identifiers, file and folder names | English |
| Issue titles, branch names, commit subjects | English |
| This file, code comments | English |
| Issue bodies, PR descriptions, `docs/` | German |
| UI text, knowledge content, `label` fields | German |
| `CalcStep.title` and anything printed into a PDF proof | German |

Domain terms carry both, an English identifier and a German label:

```ts
sectionModulus: q('W_y', 2.1e-5, 'm^3', 'Widerstandsmoment')
```

Never translate a German engineering term inside a formula. Widerstandsmoment and
Flaechentraegheitsmoment get swapped in translation regularly, and that becomes a
wrong result, not a wording issue.

## Units

SI throughout. No bare numbers cross a module boundary, always `Quantity`.

Datasets may keep engineering units (GPa, MPa, kg/m3) where the source states them
that way. Carry the unit as metadata in the dataset and convert at the boundary
into `Quantity`.

## Architecture

- `src/core/` contains no React import and no UI. Pure functions, fully testable.
- `src/features/` contains the UI. Thin. No formula lives in a component.
- `src/app/` contains the shell and the entry point.
- Every calculation module is a function `(inputs) => CalculationResult`.
- No central router. Each module registers itself through its own manifest.

This is enforced, not merely requested. ESLint blocks `react`, `react-dom` and any
import from `features/` or `app/` inside `src/core/**`, relative paths included.
If you need to cross that line, that is a separate issue in `core` or `app`.

## Every calculation module needs

1. A pure function in `src/core/<area>/<name>.ts`
2. A Zod schema for all inputs, including valid ranges
3. A calculation trace as `CalcStep[]`, see `src/core/types/calculation.ts`
4. At least two verified reference cases as Vitest tests, source named in a comment
5. Norm references with standard, section and formula
6. UI in `src/features/<area>/<name>/`

## Data

Four shared datasets: materials, threads and fasteners, fluid properties, fits and
tolerances.

The dependency on them is soft. Start with a few hardcoded values inside the module
and swap the import once the shared dataset exists. No module waits for a table.

Every value carries its source and revision. Do not copy DIN, ISO or VDI full text
into the repository. Reference it.

## Git

- Never commit to `main`
- One issue, one branch, one pull request
- Branch names: `feature/<area>-<short>`, `fix/...`, `chore/...`
- A pull request touches no file outside its module folder. If it must, that is a
  separate issue.
- Commit format: `type(area): what`
- Merging is done by a human, never automatically

## Working with Claude Code

- One session, one issue. The number is given in the task.
- Show the plan first, wait for approval.
- Do not touch files outside the issue scope.
- No new dependency without asking.
- Run `npm run typecheck`, `npm run lint` and `npm run test` before reporting done.
- Finish with commit, push and `gh pr create` including `Closes #<n>`. Never merge.
