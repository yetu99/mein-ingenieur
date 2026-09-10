# MeinIngenieur - Issue-Landkarte

112 Issues. 57 davon `scope:module` (die Landkarte), 55 `scope:infra` (Fundament und Verschaltung).

Board-Filter fuer die reine Modulsicht: `is:issue is:open label:scope:module`

## Konvention

- Titel: `[bereich] English descriptive title`
- Branch: `feature/<bereich>-<kurzname>`, 1 Issue = 1 Branch = 1 PR
- Sub-Issues entstehen erst, wenn jemand das Modul zieht. Die Vorlage steht im Issue-Body.
- Jeder zieht, worauf er Lust hat. Wer zieht, weist sich selbst zu.


## Modules / Data  (11)

| Titel | Typ | Groesse |
|---|---|---|
| `[db]` Build material database with 90+ materials and property filters | data | L |
| `[db]` Build material comparison view with 13 properties side by side | feature | M |
| `[db]` Build symbol and notation database (Formelzeichen) with definitions | data | M |
| `[db]` Build 3D printing thread insert dimension database | data | S |
| `[db]` Build O-ring size and groove dimension database | data | M |
| `[db]` Build rolling bearing catalogue data (dimensions and load ratings) | data | M |
| `[db]` Build standards register (DIN, ISO, VDI) with scope descriptions | data | S |
| `[db]` Build surface finish and GD&T reference tables | data | M |
| `[db]` Build calculation template library (Excel-based templates) | feature | M |
| `[db]` Build method template library for iPeM and SPALTEN | feature | S |
| `[db]` Implement Excel (.xlsx) import pipeline for datasets and calculations | feature | L |

## Modules / Mechanics  (9)

| Titel | Typ | Groesse |
|---|---|---|
| `[calc]` Build cross-section property calculator (area, I, W, geometry library) | module | L |
| `[calc]` Build tension and compression member sizing module | module | S |
| `[calc]` Build beam bending calculator with standard load cases | module | L |
| `[calc]` Build torsion calculator for shafts and thin-walled sections | module | M |
| `[calc]` Build transverse shear stress calculator | module | M |
| `[calc]` Build combined stress and equivalent stress module (von Mises, Tresca) | module | M |
| `[calc]` Build buckling calculator (Euler cases and omega method) | module | M |
| `[calc]` Build notch factor and fatigue verification module | module | L |
| `[calc]` Build Ashby material selection module with performance indices | module | L |

## Modules / Fluids & Thermal  (9)

| Titel | Typ | Groesse |
|---|---|---|
| `[calc]` Build Bernoulli and energy equation solver for pipe systems | module | M |
| `[calc]` Build pipe pressure loss calculator (Reynolds, Colebrook, zeta values) | module | L |
| `[calc]` Build pump sizing module (head, system curve, operating point, NPSH) | module | L |
| `[calc]` Build hydraulic cylinder force and sizing module | module | M |
| `[calc]` Build open channel and orifice flow calculator | module | M |
| `[calc]` Build reference module for Navier-Stokes analytical solutions | module | M |
| `[calc]` Build heat conduction and thermal resistance network calculator | module | L |
| `[calc]` Build heat exchanger sizing module (LMTD and NTU methods) | module | L |
| `[calc]` Build mass transfer and diffusion basics module | module | M |

## Modules / Machine Elements  (11)

| Titel | Typ | Groesse |
|---|---|---|
| `[calc]` Build bolted joint design module per VDI 2230 | module | L |
| `[calc]` Build O-ring and seal selection module with compression and gap check | module | M |
| `[calc]` Build rolling bearing life calculation module per DIN ISO 281 | module | M |
| `[calc]` Build shaft-hub connection sizing module (press fit, key, spline) | module | L |
| `[calc]` Build welded joint verification module per DIN EN 1993 | module | L |
| `[calc]` Build spring design module per DIN EN 13906 | module | M |
| `[calc]` Build gear sizing basics module | module | L |
| `[calc]` Build thin film and coating layer calculation module | module | M |
| `[calc]` Build tolerance chain analysis module (worst case and statistical) | module | L |
| `[calc]` Build fit selection assistant per DIN ISO 286 | module | M |
| `[calc]` Build 3D printing thread engagement calculation module | module | M |

## Modules / Methods  (9)

| Titel | Typ | Groesse |
|---|---|---|
| `[method]` Build SPALTEN method workflow | module | L |
| `[method]` Build C&C2 approach modeling tool | module | L |
| `[method]` Build iPeM activity model tool | module | L |
| `[method]` Build Eisenhower matrix tool | module | S |
| `[method]` Build FMEA worksheet with RPN calculation | module | L |
| `[method]` Build QFD house of quality tool | module | L |
| `[method]` Build requirements list (Anforderungsliste) editor per VDI 2221 | module | M |
| `[method]` Build morphological box tool | module | M |
| `[method]` Build weighted decision matrix (Nutzwertanalyse) tool | module | M |

## Modules / Knowledge  (8)

| Titel | Typ | Groesse |
|---|---|---|
| `[know]` Author materials science knowledge base from course content | data | L |
| `[know]` Author bolt and screw knowledge tiles | data | M |
| `[know]` Author symbol and notation knowledge tiles for materials science | data | M |
| `[know]` Build interactive diagram viewer (stress-strain, Woehler, Ashby charts) | feature | L |
| `[know]` Author damage analysis (Schadenskunde) knowledge module | data | M |
| `[know]` Author manufacturing processes knowledge module | data | M |
| `[know]` Author corrosion and surface protection knowledge module | data | M |
| `[know]` Build formula collection (Formelsammlung) with searchable index | feature | M |

## Infra / Foundation  (22)

| Titel | Typ | Groesse |
|---|---|---|
| `[core]` Define CalculationResult and NormReference type contracts | contract | S |
| `[core]` Define unit system and SI conversion utilities | contract | M |
| `[core]` Define CalculationModule manifest and module registry | contract | M |
| `[core]` Define StorageAdapter interface for local and cloud persistence | contract | M |
| `[core]` Define input validation and warning model per module | contract | S |
| `[core]` Define calculation trace model (Rechenweg with formula steps) | contract | M |
| `[core]` Define knowledge reference ID scheme for deep links | contract | S |
| `[core]` Define project and workspace data model | contract | M |
| `[db]` Build filterable data table component for all databases | feature | M |
| `[db]` Build metric screw and thread dimension database | data | M |
| `[db]` Build fits and tolerance tables per DIN ISO 286 | data | M |
| `[db]` Implement data source provenance and versioning for all datasets | chore | M |
| `[db]` Build fluid property dataset (water, air, oils) with temperature dependence | data | M |
| `[infra]` Bootstrap repository with Vite, TypeScript, Tailwind and shadcn/ui | chore | S |
| `[infra]` Set up strict TypeScript config, ESLint and Prettier | chore | S |
| `[infra]` Set up Vitest and reference-case test conventions | chore | S |
| `[infra]` Set up GitHub Actions CI for typecheck, lint, test and build | chore | S |
| `[infra]` Define branching, PR review and CODEOWNERS workflow | docs | S |
| `[infra]` Add issue templates, PR template and label taxonomy | chore | S |
| `[infra]` Set up Vercel deployment with preview builds per pull request | chore | S |
| `[know]` Define MDX authoring format and content validation for knowledge tiles | chore | M |
| `[method]` Build method engine for interactive, savable and exportable sessions | feature | L |

## Infra / Shell & Integration  (16)

| Titel | Typ | Groesse |
|---|---|---|
| `[app]` Build application shell with four-pillar navigation | feature | M |
| `[app]` Implement global cross-pillar search | feature | L |
| `[app]` Implement wiki slide-over panel with return navigation | feature | M |
| `[app]` Implement multi-workspace tabs for parallel calculations | feature | L |
| `[app]` Implement design tokens, dark mode and print stylesheet | feature | S |
| `[app]` Implement responsive layout and keyboard shortcuts | feature | M |
| `[app]` Implement error boundary and calculation failure UX | feature | S |
| `[know]` Build knowledge tile system and topic taxonomy | feature | M |
| `[know]` Build cross-link registry between knowledge, data and calculations | feature | L |
| `[proj]` Build project container with results, notes and attachments | feature | M |
| `[proj]` Implement save and restore of in-progress calculation state | feature | M |
| `[proj]` Implement calculation history and result versioning | feature | M |
| `[proj]` Build PDF export engine with calculation trace and norm references | feature | L |
| `[proj]` Build PDF report templates with header, footer and revision block | feature | M |
| `[proj]` Implement JSON project export and import | feature | S |
| `[proj]` Build combined project report combining multiple calculations | feature | M |

## Infra / Cloud  (9)

| Titel | Typ | Groesse |
|---|---|---|
| `[cloud]` Set up Supabase project with schema and versioned migrations | chore | M |
| `[cloud]` Implement authentication and user profile model | feature | M |
| `[cloud]` Implement row level security policies for per-user data isolation | feature | M |
| `[cloud]` Implement cloud StorageAdapter behind the existing local interface | feature | L |
| `[cloud]` Implement sync engine with offline queue and conflict resolution | feature | L |
| `[cloud]` Set up Supabase Storage buckets for large files and attachments | feature | M |
| `[cloud]` Implement shared workspace with per-project access roles | feature | L |
| `[cloud]` Implement read-only share links for exported projects | feature | M |
| `[cloud]` Implement full user data export and account deletion | feature | M |

## Infra / Quality & Docs  (8)

| Titel | Typ | Groesse |
|---|---|---|
| `[docs]` Write contributor guide and module authoring guide | docs | M |
| `[docs]` Write norm source register and licensing note | docs | S |
| `[docs]` Write user-facing help and onboarding tour | docs | M |
| `[qa]` Build reference calculation test suite validated against textbooks and Excel | chore | L |
| `[qa]` Run norm compliance audit per calculation module | chore | M |
| `[qa]` Add end-to-end tests for critical flows with Playwright | chore | M |
| `[qa]` Run accessibility and keyboard navigation pass | chore | M |
| `[qa]` Add performance budget for large datasets and charts | chore | S |

