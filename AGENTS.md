# Vellum help center — project instructions

This is the end-user help center for Vellum (vellum.com.au), an impact
measurement and valuation platform for advisory firms and their client
organisations. Built on [Mintlify](https://mintlify.com): pages are MDX with
YAML frontmatter, navigation and branding live in `docs.json`.

## Readers

Impact-firm staff (advisors, analysts) and their clients' members. Not
developers: no code, SQL, internal route names, plan numbers or repo paths.

## Terminology

- "organisation" = a client the firm measures impact for (never "client company").
- "project" = one measurement engagement; its calculation lives on the Workbench.
- "factor" = a sourced, versioned reference value; "formula" = an engine-governed calculation.
- The golden rule, stated wherever relevant: report numbers are computed by the
  deterministic engine, never typed by a person and never produced by the AI agent.
- British/Australian spelling (organisation, catalogue). Exact UI labels in bold.

## Style

Follow STYLE-GUIDE.md in this repo. Highlights: second person, plain English,
sentence-case headings, no em-dashes anywhere, `<Steps>` for tasks, tables for
fields and statuses, `<Note>` for permissions, `<Warning>` for irreversible
actions, Related cards at page end.

## Screenshots

Real screenshots of the real app with fully synthetic demo data (the hero
organisation is "Harbourlight Youth Foundation"; files are SAMPLE-prefixed; the
user is "Demo Advisor"). Tooling to retake them lives in `tools/shoot.mjs`
(see its header) against a locally seeded demo stack. Run `node tools/check.mjs`
before publishing: it verifies nav/files/images/links/frontmatter and style rules.
